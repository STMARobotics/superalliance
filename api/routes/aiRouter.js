const { Router } = require("express");
const { BedrockRuntimeClient, InvokeModelCommand } = require("@aws-sdk/client-bedrock-runtime");
const { requireAdmin } = require("../middleware/auth");
const PitFormSchema = require("../models/PitFormSchema");
const StandFormSchema = require("../models/StandFormSchema");
const SuperAllianceConfig = require("../models/SuperAllianceConfig");

const aiRouter = Router();
const modelId = process.env.BEDROCK_MODEL_ID || "us.amazon.nova-micro-v1:0";
const bedrock = new BedrockRuntimeClient({ region: process.env.AWS_REGION || "us-east-2" });
const allowedStages = new Set([
  "$addFields", "$bucket", "$bucketAuto", "$count", "$facet", "$group", "$limit",
  "$lookup", "$match", "$project", "$replaceRoot", "$replaceWith", "$set", "$skip",
  "$sort", "$sortByCount", "$unwind", "$unset",
]);
const forbiddenOperators = new Set(["$accumulator", "$function", "$where", "$out", "$merge"]);

function describeSchema(collection, model) {
  const fields = Object.entries(model.schema.paths)
    .filter(([name]) => name !== "_id" && name !== "__v")
    .map(([name, schemaType]) => `${name}:${schemaType.instance.toLowerCase()}`);
  return `${collection}: ${fields.join(", ")}`;
}

function getSchemaDescription() {
  return [
    "MongoDB schema (generated from the application's Mongoose models):",
    describeSchema("STAND_FORMS (source marker _aiFormSource=stand)", StandFormSchema),
    describeSchema("PIT_FORMS (source marker _aiFormSource=pit)", PitFormSchema),
  ].join("\n");
}

function constrainLookupsToEvent(pipeline, activeEvent) {
  for (const stage of pipeline) {
    if (stage.$lookup) {
      const lookupPipeline = stage.$lookup.pipeline || [];
      lookupPipeline.unshift({ $match: { event: activeEvent } });
      constrainLookupsToEvent(lookupPipeline, activeEvent);
      stage.$lookup.pipeline = lookupPipeline;
    }

    if (stage.$facet) {
      for (const subPipeline of Object.values(stage.$facet)) {
        constrainLookupsToEvent(subPipeline, activeEvent);
      }
    }
  }
}

function buildModelRequest(prompt, maxTokens) {
  if (modelId.startsWith("anthropic.")) {
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

async function invokeBedrock(prompt, maxTokens) {
  const response = await bedrock.send(new InvokeModelCommand({
    modelId,
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify(buildModelRequest(prompt, maxTokens)),
  }));
  const payload = JSON.parse(new TextDecoder().decode(response.body));

  if (modelId.startsWith("anthropic.")) {
    return payload.content?.filter((part) => part.type === "text").map((part) => part.text).join("\n");
  }

  return payload.output?.message?.content?.map((part) => part.text || "").join("\n");
}

function validatePipeline(pipeline) {
  if (!Array.isArray(pipeline) || pipeline.length === 0 || pipeline.length > 20) {
    throw new Error("Pipeline must contain between 1 and 20 stages");
  }

  for (const stage of pipeline) {
    if (!stage || typeof stage !== "object" || Array.isArray(stage)) {
      throw new Error("Every pipeline stage must be an object");
    }

    const keys = Object.keys(stage);
    if (keys.length !== 1 || !allowedStages.has(keys[0])) {
      throw new Error("Pipeline contains an unsupported stage");
    }

    if (keys[0] === "$limit" && (!Number.isInteger(stage.$limit) || stage.$limit < 1 || stage.$limit > 100)) {
      throw new Error("Pipeline limit must be an integer from 1 to 100");
    }

    if (keys[0] === "$lookup") {
      if (!stage.$lookup || !["PIT_FORMS", "STAND_FORMS"].includes(stage.$lookup.from)) {
        throw new Error("Lookup is restricted to scouting collections");
      }
      if (stage.$lookup.pipeline) validatePipeline(stage.$lookup.pipeline);
    }

    if (keys[0] === "$facet") {
      for (const subPipeline of Object.values(stage.$facet || {})) {
        validatePipeline(subPipeline);
      }
    }

    inspectForForbiddenOperators(stage[keys[0]]);
  }

  if (!pipeline.some((stage) => Object.hasOwn(stage, "$limit"))) {
    pipeline.push({ $limit: 100 });
  }
}

function inspectForForbiddenOperators(value) {
  if (!value || typeof value !== "object") return;

  for (const [key, nestedValue] of Object.entries(value)) {
    if (forbiddenOperators.has(key)) throw new Error("Pipeline contains a forbidden operator");
    inspectForForbiddenOperators(nestedValue);
  }
}

aiRouter.post("/api/ai/query", requireAdmin, async (req, res) => {
  const userPrompt = req.body?.userPrompt;
  if (typeof userPrompt !== "string" || userPrompt.trim().length === 0 || userPrompt.length > 2000) {
    return res.status(400).json({ error: "userPrompt must be a non-empty string of at most 2000 characters" });
  }

  try {
    const appSettings = await SuperAllianceConfig.findOne({}).lean();
    const activeEvent = appSettings?.event;
    if (typeof activeEvent !== "string" || !activeEvent || activeEvent === "none") {
      return res.status(409).json({ error: "No active event is configured" });
    }

    const pipelineText = await invokeBedrock(
      `You generate safe MongoDB aggregation pipelines for FIRST Robotics Competition scouting.\n${getSchemaDescription()}\n` +
      `The input stream contains documents from both collections for active event ${JSON.stringify(activeEvent)}. ` +
      `Use _aiFormSource=stand for stand-form questions, _aiFormSource=pit for pit-form questions, ` +
      `and both sources only when the question needs both. For questions requiring facts from both forms, ` +
      `group by teamNumber and use conditional accumulators to test each condition against its own _aiFormSource; ` +
      `then return only teams satisfying both conditions. PitForm has no structured drivetrain field, so search ` +
      `its relevant string fields case-insensitively for terms such as "swerve" and do not infer unrecorded facts. ` +
      `Because unioned form documents have different fields, wrap potentially missing values in $ifNull before ` +
      `string operators such as $regexMatch. ` +
      `For cross-form comparisons, $lookup may use only PIT_FORMS or STAND_FORMS. ` +
      `Never use write stages, JavaScript operators, or any collection not listed. Return ONLY a valid JSON array ` +
      `of aggregation stages, with no markdown or explanation. Keep results concise and include a $limit of at most 100.\n` +
      `User question: ${userPrompt.trim()}`,
      900,
    );
    const pipeline = JSON.parse(pipelineText);
    validatePipeline(pipeline);
    constrainLookupsToEvent(pipeline, activeEvent);
    pipeline.unshift(
      { $match: { event: activeEvent } },
      { $addFields: { _aiFormSource: "stand" } },
      {
        $unionWith: {
          coll: "PIT_FORMS",
          pipeline: [
            { $match: { event: activeEvent } },
            { $addFields: { _aiFormSource: "pit" } },
          ],
        },
      },
    );

    const results = await StandFormSchema.aggregate(pipeline)
      .option({ maxTimeMS: 10000, allowDiskUse: false })
      .exec();
    const answer = await invokeBedrock(
      `Summarize these FIRST Robotics Competition scouting results for a drive team or alliance strategist. ` +
      `Be factual, distinguish missing data from negative performance, and do not invent conclusions. ` +
      `Return a concise plain-language answer.\nQuestion: ${userPrompt.trim()}\nResults: ${JSON.stringify(results)}`,
      700,
    );

    return res.json({ answer: answer || "No scouting insight could be generated from these results." });
  } catch (error) {
    console.error("AI scouting query failed:", error.message);
    return res.status(502).json({ error: "Unable to complete the scouting query" });
  }
});

module.exports = aiRouter;