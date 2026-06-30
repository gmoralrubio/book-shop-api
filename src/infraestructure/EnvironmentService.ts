import z, { ZodError } from 'zod';
import dotenv from 'dotenv';
import { ConfigurationError } from '@domain/errors/ConfigurationError';

// Validation schema
const environmentVariablesValidator = z.object({
  DB_URL: z.string(),
  JWT_SECRET: z.string(),
  NODE_ENV: z.enum(['local', 'staging', 'production', 'test']),
  PORT: z.coerce.number(),
});

type EnvironmentVariables = z.infer<typeof environmentVariablesValidator>;

class EnvironmentService {
  private environmentVariables: EnvironmentVariables | null = null;

  load() {
    if (this.environmentVariables) return;

    dotenv.config();

    try {
      this.environmentVariables = environmentVariablesValidator.parse(
        process.env
      );
    } catch (error) {
      if (error instanceof ZodError) {
        throw new Error(
          'Error loading environment variables: ' + JSON.stringify(error)
        );
      }
    }
  }

  get(): EnvironmentVariables {
    if (!this.environmentVariables) {
      throw new ConfigurationError(
        'Environment variables not loaded. Call .load() first'
      );
    }
    return this.environmentVariables;
  }
}

export const environmentService = new EnvironmentService();
