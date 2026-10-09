const { Router } = require("express");
const {
  BedrockRuntimeClient,
  ConverseCommand,
} = require("@aws-sdk/client-bedrock-runtime");
const { requireAdmin } = require("../middleware/auth");
const StandFormSchema = require("../models/StandFormSchema");
const SuperAllianceConfig = require("../models/SuperAllianceConfig");

const aiRouter = Router();

// Primary model for complex MQL generation
const mqlModelId = process.env.BEDROCK_MQL_MODEL_ID || "us.amazon.nova-pro-v1:0";

// Cheaper model for text summarization
const summaryModelId = process.env.BEDROCK_SUMMARY_MODEL_ID || "deepseek.v3-v1:0";

const bedrock = new BedrockRuntimeClient({
  region: process.env.AWS_REGION || "us-east-2",
});

function getSchemaDescription() {
  const fields = Object.entries(StandFormSchema.schema.paths)
    .filter(([name]) => name !== "_id" && name !== "__v")
    .map(([name, schemaType]) => `  - ${name}:${schemaType.instance}`);
  return `STAND_FORMS Collection Fields:\n${fields.join("\n")}`;
}

async function invokeBedrock({
  systemText,
  userText,
  maxTokens,
  targetModel = mqlModelId,
}) {

  // Check if model supports Bedrock Prompt Caching
  const supportsCaching =
    targetModel.includes("nova-") || targetModel.includes("claude-3-5");

  const systemBlock = [{ text: systemText }];
  if (supportsCaching) {
    systemBlock.push({ cachePoint: { type: "default" } });
  }

  const command = new ConverseCommand({
    modelId: targetModel,
    system: systemBlock,
    messages: [
      {
        role: "user",
        content: [{ text: userText }],
      },
    ],
    inferenceConfig: {
      maxTokens: maxTokens,
      temperature: 0.1,
    },
  });

  const response = await bedrock.send(command);
  return response.output?.message?.content?.map((c) => c.text || "").join("\n");
}

function parseMqlPipelines(rawMql) {
  if (typeof rawMql !== "string" || !rawMql.trim()) {
    throw new Error("Model response was empty");
  }

  let cleanMql = rawMql.trim();
  const codeFenceMatch = cleanMql.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  if (codeFenceMatch) {
    cleanMql = codeFenceMatch[1].trim();
  }

  const parsedMql = JSON.parse(cleanMql);
  if (!Array.isArray(parsedMql) || parsedMql.length === 0) {
    throw new Error("Generated MQL is not a non-empty array");
  }

  const pipelines = Array.isArray(parsedMql[0]) ? parsedMql : [parsedMql];
  if (
    pipelines.some(
      (pipeline) =>
        !Array.isArray(pipeline) ||
        pipeline.length === 0 ||
        pipeline.some(
          (stage) =>
            stage === null ||
            typeof stage !== "object" ||
            Array.isArray(stage) ||
            Object.keys(stage).length !== 1 ||
            !Object.keys(stage)[0].startsWith("$"),
        ),
    )
  ) {
    throw new Error(
      "Generated MQL must contain non-empty pipelines of single-operator stages",
    );
  }

  return pipelines;
}

function addEventFilter(pipelines, queryEvent) {
  if (queryEvent === "all") {
    return pipelines;
  }

  const eventFilter = { event: queryEvent.trim() };
  return pipelines.map((pipeline) => [{ $match: eventFilter }, ...pipeline]);
}

async function executePipelines(pipelines) {
  const results = await Promise.allSettled(
    pipelines.map(async (pipeline, idx) => {
      const data = await StandFormSchema.aggregate(pipeline)
        .option({ maxTimeMS: 10000, allowDiskUse: false })
        .exec();
      return {
        pipelineIndex: idx + 1,
        pipelineQuery: pipeline,
        returnedRecords: data,
      };
    }),
  );

  const failure = results.find((result) => result.status === "rejected");
  if (failure) {
    throw failure.reason;
  }

  return results.map((result) => result.value);
}

function buildMqlRepairPrompt(systemPrompt, previousOutput, failure) {
  return `${systemPrompt}

Your previous response could not be parsed or executed as a MongoDB aggregation pipeline.
Failure: ${failure.message}
Previous response (JSON-encoded text): ${JSON.stringify(previousOutput)}

Correct the response to address the original question. Return only the complete, valid JSON array of pipelines. Do not include markdown fences or commentary.`;
}

aiRouter.post("/api/ai/query", requireAdmin, async (req, res) => {
  const { userPrompt, event: requestedEvent } = req.body || {};
  if (typeof userPrompt !== "string" || !userPrompt.trim()) {
    return res.status(400).json({ error: "Invalid userPrompt" });
  }
  if (userPrompt.trim().length > 2000) {
    return res
      .status(400)
      .json({ error: "userPrompt exceeds the 2000 character limit" });
  }

  try {
    const appSettings = await SuperAllianceConfig.findOne({}).lean();
    const queryEvent = requestedEvent?.trim() || appSettings?.event;
    if (!queryEvent || queryEvent === "none") {
      return res.status(409).json({ error: "No active event configured" });
    }

    // 1. MQL Generation System Prompt (Runs on Nova Pro)
    const staticMqlSystemPrompt = `You are an expert MongoDB Query Generator for FRC Scouting Data.
Your task is to produce MongoDB Aggregation Pipelines that directly answer the user's question.

${getSchemaDescription()}

CRITICAL FORMAT RULES:
1. Return strictly an ARRAY OF PIPELINES (an array of arrays of pipeline stages).
   Example for a single query: [ [ {"$group": ...}, {"$sort": ...} ] ]
   Example for a multi-part query: [ [ {"$group": ...} ], [ {"$match": ...} ] ]
2. Output ONLY one complete, valid JSON array. Do NOT include markdown fences, comments, trailing commas, or conversational text. Check that every string, object, and array is correctly closed and that the JSON parses before responding.
3. Do NOT include $match on event code; express backend will inject event matching safely.
4. Use $sum for a requested total and $avg for a requested average.

QUERY DESIGN RULES:
1. Multi-Team Comparisons (e.g. "Compare 254 and 7028"): You MUST return dedicated, separate pipeline arrays for EACH team mentioned so data is isolated. Never combine multiple compared teams into a single $in match pipeline.
2. Consistency & Standard Deviation: When users ask about "consistency", "spread", "variance", or "standard deviation", use {"$stdDevSamp": "$metricField"} inside the $group stage alongside $avg. Name the output field "stdDev" or "stdDevPoints".
3. Qualitative Issues & Criticals: For EACH team queried, return two distinct sub-pipelines:
   - Pipeline A: Filter {"teamNumber": X, "criticals": {"$type": "array", "$ne": []}} to get matchNumber, teamNumber, criticals, comments.
   - Pipeline B: Filter {"teamNumber": X} with {"$count": "totalMatches"} to get exact total matches played by team X.
4. Field "criticals" is an Array of strings/objects. In a $match query, check for non-empty values with {"$type": "array", "$ne": []}; do not use $size in query predicates. In an aggregation expression, guard $size with $isArray, for example {"$cond": [{"$isArray": "$criticals"}, {"$size": "$criticals"}, 0]}.
5. Leaderboards/Rankings: Group by "teamNumber" and default to per-match averages ($avg) unless total sum is explicitly requested. Always preserve "teamNumber" in $group/_id output.`;

    let rawMql = await invokeBedrock({
      systemText: staticMqlSystemPrompt,
      userText: `User Question: ${userPrompt.trim()}`,
      maxTokens: 2500,
      targetModel: mqlModelId,
    });

    let combinedResults;

    try {
      const pipelines = parseMqlPipelines(rawMql);
      combinedResults = await executePipelines(
        addEventFilter(pipelines, queryEvent),
      );
    } catch (error) {
      const repairPrompt = buildMqlRepairPrompt(staticMqlSystemPrompt, rawMql, error);
      rawMql = await invokeBedrock({
        systemText: repairPrompt,
        userText: `User Question: ${userPrompt.trim()}`,
        maxTokens: 2500,
        targetModel: mqlModelId,
      });
      const repairedPipelines = parseMqlPipelines(rawMql);
      combinedResults = await executePipelines(
        addEventFilter(repairedPipelines, queryEvent),
      );
    }

    // 2. Summarization System Prompt
    const staticSummarySystemPrompt = `Summarize these FRC scouting query results for an alliance selection strategist.
Answer directly, factually, and concisely based ONLY on the provided query results. Address all parts of the user's question clearly.

STRICT DATA ATTRIBUTION & FORMATTING RULES:
1. OUTPUT FORMAT: Respond strictly in clean, well-formatted Markdown. Do NOT wrap the entire response in markdown code blocks (\`\`\`markdown or \`\`\`).
2. DATA ATTRIBUTION: Look at 'pipelineQuery' AND 'teamNumber' inside returnedRecords for each pipeline. NEVER cross-attribute Match numbers or critical details from team A's pipeline to team B!
3. FOR QUALITATIVE ISSUES (criticals, breakdowns, notes): Match documents directly to the team identified in that specific pipeline. Report the exact incident count and total matches played, then list specific match numbers (e.g. "Team 254 had 1 critical issue across 11 matches: 'Mechanism Broke' in Match 82.").
4. NEVER calculate, fabricate, or report a "critical incident rate" percentage for qualitative issues.
5. FOR CONSISTENCY & STANDARD DEVIATION: Lower standard deviation values indicate higher consistency. Report standard deviation values rounded to 1 decimal place (e.g., "Std Dev: 12.4").
6. FOR PRE-AGGREGATED METRICS: Only convert rates to percentages if the pipeline explicitly calculates a boolean average (e.g., winRate: 0.7 -> 70%).
7. Round average numerical scoring metrics (like fuel or points) to 1 decimal place.
8. NUMERIC COMPARISON ACCURACY: Double-check all mathematical comparisons (<, >, equal) in narrative text before generating.
   - Example: 3 is GREATER than 2. If Team A has 3 incidents and Team B has 2 incidents, Team B has fewer critical issues, NOT Team A.
   
CHAIN-OF-THOUGHT COUNTING INSTRUCTION:
Before formatting your output, internally evaluate the data in two steps:
1. First, identify and count the total individual items requested (e.g., sum up every distinct critical incident across all matches).
2. Second, count the unique matches containing those items.

Only AFTER completing both counts should you write your intro sentence:
"Team [Number] had [Total Items] critical issues across [Unique Matches] matches."`;

    const answer = await invokeBedrock({
      systemText: staticSummarySystemPrompt,
      userText: `Question: ${userPrompt.trim()}\nResults: ${JSON.stringify(combinedResults)}`,
      maxTokens: 1500,
      targetModel: summaryModelId,
    });

    return res.json({ answer: answer || "No insight generated." });
  } catch (error) {
    console.error("MQL Scouting execution failed:", error.message);
    return res.status(502).json({
      error: "Failed to evaluate scouting query",
      details: error.message,
    });
  }
});

module.exports = aiRouter;