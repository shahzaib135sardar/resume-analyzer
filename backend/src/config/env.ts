import { z } from 'zod';

const envSchema = z.object({
  PORT: z.string().default('5000').transform(val => parseInt(val, 10)),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  GEMINI_API_KEY: z.string().optional().default('dummy'),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters').default('default-secret-64-chars-long-enough-for-jwt'),
  JWT_REFRESH_SECRET: z.string().min(32, 'JWT_REFRESH_SECRET must be at least 32 characters').default('default-refresh-secret-64-chars-long-enough-for-jwt'),
  FRONTEND_URL: z.string().url('FRONTEND_URL must be a valid URL').default('http://localhost:5173'),

  MAX_FILE_SIZE_MB: z.string().default('10').transform(val => parseInt(val, 10)),
  UPLOAD_DIR: z.string().default('./uploads'),
  DATABASE_URL: z.string().optional(),
  REDIS_URL: z.string().optional()
});

const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  console.error('Environment validation failed:');
  console.error(parsed.error.format());
  process.exit(1);
}
const env = parsed.data;


export type Env = z.infer<typeof envSchema>;
export default env;

