import { z } from 'zod';

export const scanTargetSchema = z
  .string()
  .trim()
  .min(1, 'Informe um domínio ou URL.')
  .transform((value) => /^https?:\/\//i.test(value) ? value : `https://${value}`)
  .pipe(z.url('Informe uma URL válida.'));

export const scanRequestSchema = z.object({
  target: scanTargetSchema,
  mode: z.enum(['quick', 'deep', 'custom']),
});
