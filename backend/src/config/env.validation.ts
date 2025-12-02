import { z } from 'zod';

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-redundant-type-constituents */

// Schema kiểm tra env variables
// Lưu ý: DATABASE_PASSWORD và JWT_SECRET nhạy cảm, chỉ validate, không expose ra response
const envSchema = z.object({
  // Database configuration
  DATABASE_HOST: z.string().min(1, 'DATABASE_HOST is required'),
  // eslint-disable-next-line prettier/prettier
  DATABASE_PORT: z.string().regex(/^\d+$/, 'DATABASE_PORT must be a number').transform(Number),
  DATABASE_USER: z.string().min(1, 'DATABASE_USER is required'),
  DATABASE_NAME: z.string().min(1, 'DATABASE_NAME is required'),
  DATABASE_PASSWORD: z.string().min(1, 'DATABASE_PASSWORD is required'),
  // JWT configuration
  JWT_SECRET: z.string().min(10, 'JWT_SECRET must be at least 10 characters'),

  // Server configuration
  // eslint-disable-next-line prettier/prettier
  PORT: z.string()
    .regex(/^\d+$/, 'PORT must be a number')
    .optional()
    // eslint-disable-next-line prettier/prettier
    .transform((val) => val ? Number(val) : 3000),
});

// Cache kết quả validate để reuse
let cachedEnv: z.infer<typeof envSchema> | null = null;

// Function validateEnv với explicit return type
export function validateEnv(): z.infer<typeof envSchema> {
  if (cachedEnv !== null) {
    return cachedEnv;
  }

  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    console.error('Invalid environment variables:');
    console.error(result.error.format());
    process.exit(1); // Fail fast
  }

  cachedEnv = result.data;
  return cachedEnv;
}

// Type export
export type EnvConfig = z.infer<typeof envSchema>;
