import { z } from "zod";

export const pipelineResultSchema = z.object({
  risk: z.object({
    flaggedPhrases: z.array(z.string()),
    riskFactors: z.array(z.string()),
    severityLevel: z.enum(["low", "medium", "high"]),
    potentialHeadlines: z.array(z.string()),
  }),
  refinedStatement: z.string(),
  reporterQuestions: z.array(z.string()),
  mitigationSuccess: z.boolean(),
});

export type PipelineResult = z.infer<typeof pipelineResultSchema>;
