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
    prompt: `Analyze this raw athlete/coach statement for reputational and media risk. Identify the exact verbatim problematic phrases (flaggedPhrases), explain each risk factor, assign an overall severity, and generate example negative headlines the media could run with this. Only flag phrases that are genuinely harmful — do not over-flag neutral topic words like "game", "team", "coach", or "defense".\n\nStatement: "${rawInput}"`,
  });

  const { text: refinedStatement } = await generateText({
    model: openai("gpt-4o"),
    prompt: `You are a professional sports PR consultant. Rewrite this statement to be press-conference-ready. Follow these rules strictly:\n1. Do NOT include any of the flagged phrases — not even partial matches or synonyms that carry the same meaning.\n2. You MUST reference the same subject matter (e.g. if the original is about defense, mention defense; if about coaching, mention coaching; if about contracts, mention contracts).\n3. Keep the tone professional and constructive.\n4. Output only the refined statement — no preamble, no explanation.\n\nOriginal statement: "${rawInput}"\n\nFlagged phrases to remove entirely: ${risk.flaggedPhrases.join(", ")}\nRisk factors: ${risk.riskFactors.join("; ")}\nSeverity: ${risk.severityLevel}`,
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
