import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  BadRequestException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { validateEnv } from './config/env.validation';

// Validate environment variables on application startup
validateEnv();

async function startApp() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        return new BadRequestException(
          validationErrors.map((error) => ({
            [error.property]: Object.values(error.constraints ?? {})[0],
          })),
        );
      },
    }),
  );
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const env = validateEnv();
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
  await app.listen(env.PORT);
}
void startApp();
