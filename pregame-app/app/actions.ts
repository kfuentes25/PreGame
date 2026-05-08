"use server";

import { generateObject, generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { pipelineResultSchema, type PipelineResult } from "@/lib/types";

const riskSchema = z.object({
  flaggedPhrases: z.array(z.string()),
  riskFactors: z.array(z.string()),
  severityLevel: z.enum(["low", "medium", "high"]),
  potentialHeadlines: z.array(z.string()),
});

export async function runPressConferencePipeline(
  rawInput: string
): Promise<PipelineResult> {
  const { object: risk } = await generateObject({
    model: openai("gpt-4o"),
    schema: riskSchema,
    prompt: `Analyze this raw athlete/coach statement for reputational and media risk. Identify specific flagged phrases, explain each risk factor, assign an overall severity, and generate example negative headlines the media could run with this.\n\nStatement: "${rawInput}"`,
  });

  const { text: refinedStatement } = await generateText({
    model: openai("gpt-4o"),
    prompt: `You are a professional sports PR consultant. Rewrite this statement to be press-conference-ready. You must retain the core message and topic, but eliminate every risk factor and flagged phrase identified in the risk assessment. Output only the refined statement.\n\nOriginal statement: "${rawInput}"\n\nRisk assessment:\n- Flagged phrases: ${risk.flaggedPhrases.join(", ")}\n- Risk factors: ${risk.riskFactors.join("; ")}\n- Severity: ${risk.severityLevel}`,
  });

  const { text: reporterRaw } = await generateText({
    model: openai("gpt-4o"),
    prompt: `You are an adversarial investigative sports journalist. Your goal is to destabilize the speaker, expose inconsistencies, and bait an emotional reaction. Generate exactly 2-3 aggressive follow-up questions targeting the refined statement. Output each question on its own line, numbered (1. 2. 3.).\n\nRefined statement: "${refinedStatement}"`,
  });

  const reporterQuestions = reporterRaw
    .split("\n")
    .map((l) => l.replace(/^\d+\.\s*/, "").trim())
    .filter(Boolean);

  const lowerRefined = refinedStatement.toLowerCase();
  const mitigationSuccess = risk.flaggedPhrases.every(
    (phrase) => !lowerRefined.includes(phrase.toLowerCase())
  );

  return pipelineResultSchema.parse({
    risk,
    refinedStatement,
    reporterQuestions,
    mitigationSuccess,
  });
}
