const { Router } = require("express");
const {
  BedrockRuntimeClient,
  InvokeModelCommand,
} = require("@aws-sdk/client-bedrock-runtime");
const { requireAdmin } = require("../middleware/auth");
const StandFormSchema = require("../models/StandFormSchema");
const SuperAllianceConfig = require("../models/SuperAllianceConfig");

const aiRouter = Router();

// Primary model for complex MQL generation (Nova Pro)
const modelId = process.env.BEDROCK_MODEL_ID || "us.amazon.nova-pro-v1:0";

// Cheaper model for text summarization (Nova Lite)
const summaryModelId =
  process.env.BEDROCK_SUMMARY_MODEL_ID || "us.amazon.nova-lite-v1:0";

const bedrock = new BedrockRuntimeClient({
  region: process.env.AWS_REGION || "us-east-2",
});

function getSchemaDescription() {
  const fields = Object.entries(StandFormSchema.schema.paths)
    .filter(([name]) => name !== "_id" && name !== "__v")
    .map(([name, schemaType]) => `  - ${name}:${schemaType.instance}`);
  return `STAND_FORMS Collection Fields:\n${fields.join("\n")}`;
}

function buildModelRequest(targetModel, prompt, maxTokens) {
  if (targetModel.startsWith("anthropic.")) {
    return {
      anthropic_version: "bedrock-2023-05-31",
      max_tokens: maxTokens,
      messages: [{ role: "user", content: [{ type: "text", text: prompt }] }],
    };
  }

  return {
    schemaVersion: "messages-v1",
    messages: [{ role: "user", content: [{ text: prompt }] }],
    inferenceConfig: { max_new_tokens: maxTokens, temperature: 0.1 },
  };
}

async function invokeBedrock(prompt, maxTokens, targetModel = modelId) {
  const response = await bedrock.send(
    new InvokeModelCommand({
      modelId: targetModel,
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify(buildModelRequest(targetModel, prompt, maxTokens)),
    }),
  );
  const payload = JSON.parse(new TextDecoder().decode(response.body));

  if (targetModel.startsWith("anthropic.")) {
    return payload.content
      ?.filter((p) => p.type === "text")
      .map((p) => p.text)
      .join("\n");
  }

  return payload.output?.message?.content?.map((p) => p.text || "").join("\n");
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
    const mqlSystemPrompt = `You are an expert MongoDB Query Generator for FRC Scouting Data.
Your task is to produce MongoDB Aggregation Pipelines that directly answer the user's question.

${getSchemaDescription()}

CRITICAL FORMAT RULES:
1. Return strictly an ARRAY OF PIPELINES (an array of arrays of pipeline stages).
   Example for a single query: [ [ {"$group": ...}, {"$sort": ...} ] ]
   Example for a multi-part query: [ [ {"$group": ...} ], [ {"$match": ...} ] ]
2. Output ONLY the raw JSON array. Do NOT include conversational greetings or extra commentary.
3. Do NOT include $match on event code; express backend will inject event matching safely.
4. Use $sum for a requested total and $avg for a requested average.

QUERY DESIGN RULES:
1. Multi-Team Comparisons (e.g. "Compare 254 and 7028"): You MUST return dedicated, separate pipeline arrays for EACH team mentioned so data is isolated. Never combine multiple compared teams into a single $in match pipeline.
2. Consistency & Standard Deviation: When users ask about "consistency", "spread", "variance", or "standard deviation", use {"$stdDevSamp": "$metricField"} inside the $group stage alongside $avg. Name the output field "stdDev" or "stdDevPoints".
3. Qualitative Issues & Criticals: For EACH team queried, return two distinct sub-pipelines:
   - Pipeline A: Filter {"teamNumber": X, "criticals": {"$not": {"$size": 0}}} to get matchNumber, teamNumber, criticals, comments.
   - Pipeline B: Filter {"teamNumber": X} with {"$count": "totalMatches"} to get exact total matches played by team X.
4. Field "criticals" is an Array of strings/objects. Check non-empty with {"$not": {"$size": 0}} or {"$exists": true, "$ne": []}.
5. Leaderboards/Rankings: Group by "teamNumber" and default to per-match averages ($avg) unless total sum is explicitly requested. Always preserve "teamNumber" in $group/_id output.

User Question: ${userPrompt.trim()}`;

    const rawMql = await invokeBedrock(mqlSystemPrompt, 1200, modelId);

    let cleanMql = rawMql.trim();
    if (cleanMql.startsWith("```")) {
      cleanMql = cleanMql
        .replace(/^```(json)?/, "")
        .replace(/```$/, "")
        .trim();
    }

    // Extract JSON Array using regex to drop any leading/trailing prose
    const jsonMatch = cleanMql.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error("Model response did not contain a JSON array");
    }

    let parsedMql = JSON.parse(jsonMatch[0]);

    // Normalize: Handle both single pipeline [...] and array of pipelines [[...], [...]]
    let pipelines = [];
    if (Array.isArray(parsedMql) && parsedMql.length > 0) {
      pipelines = Array.isArray(parsedMql[0]) ? parsedMql : [parsedMql];
    } else {
      throw new Error("Generated MQL is not a valid array of pipelines");
    }

    // Inject event match stage safely into every pipeline
    if (queryEvent !== "all") {
      const eventFilter = { event: queryEvent.trim() };
      pipelines = pipelines.map((pipeline) => [
        { $match: eventFilter },
        ...pipeline,
      ]);
    }

    console.log(`Executing ${pipelines.length} MQL Pipelines in parallel...`);

    // Execute all generated pipelines concurrently with query metadata
    const combinedResults = await Promise.all(
      pipelines.map(async (pipeline, idx) => {
        console.log(`Pipeline ${idx + 1}:`, JSON.stringify(pipeline, null, 2));
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

    // 2. Summarization System Prompt
    const answer = await invokeBedrock(
      `Summarize these FRC scouting query results for an alliance selection strategist.
Answer directly, factually, and concisely based ONLY on the provided query results. Address all parts of the user's question clearly.

STRICT DATA ATTRIBUTION & FORMATTING RULES:
1. DATA ATTRIBUTION: Look at 'pipelineQuery' AND 'teamNumber' inside returnedRecords for each pipeline. NEVER cross-attribute Match numbers or critical details from team A's pipeline to team B!
2. FOR QUALITATIVE ISSUES (criticals, breakdowns, notes): Match documents directly to the team identified in that specific pipeline. Report the exact incident count and total matches played, then list specific match numbers (e.g. "Team 254 had 1 critical issue across 11 matches: 'Mechanism Broke' in Match 82.").
3. NEVER calculate, fabricate, or report a "critical incident rate" percentage for qualitative issues.
4. FOR CONSISTENCY & STANDARD DEVIATION: Lower standard deviation values indicate higher consistency. Report standard deviation values rounded to 1 decimal place (e.g., "Std Dev: 12.4").
5. FOR PRE-AGGREGATED METRICS: Only convert rates to percentages if the pipeline explicitly calculates a boolean average (e.g., winRate: 0.7 -> 70%).
6. Round average numerical scoring metrics (like fuel or points) to 1 decimal place.

Question: ${userPrompt.trim()}
Results: ${JSON.stringify(combinedResults)}`,
      800,
      summaryModelId,
    );

    return res.json({ answer: answer || "No insight generated." });
  } catch (error) {
    console.error("MQL Scouting execution failed:", error.message);
    return res
      .status(502)
      .json({
        error: "Failed to evaluate scouting query",
        details: error.message,
      });
  }
});

module.exports = aiRouter;
