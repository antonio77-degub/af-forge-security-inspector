import { z } from 'zod';

export const findingSchema = z.object({
  id: z.string().min(1),
  module: z.string().min(1),
  status: z.enum(['pass', 'warning', 'fail', 'unknown', 'not_applicable']),
  severity: z.enum(['critical', 'high', 'medium', 'low', 'info']),
  confidence: z.enum(['high', 'medium', 'low']),
  titleSimple: z.string().min(1),
  explanationSimple: z.string().min(1),
  technicalTitle: z.string().min(1),
  checkedAt: z.string().datetime(),
  affectedAsset: z.string().min(1),
  provider: z.string().min(1),
  evidence: z.record(z.string(), z.unknown()).default({}),
});

export type Finding = z.infer<typeof findingSchema>;
