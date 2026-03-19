import { z } from 'zod';

export const uploadSchema = z.object({
  jobDescription: z.string().max(5000, 'Job description too long (max 5000 chars)').optional()
});

