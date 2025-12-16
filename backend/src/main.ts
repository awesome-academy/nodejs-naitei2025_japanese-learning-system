import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  BadRequestException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { validateEnv } from './config/env.validation';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

// Validate environment variables on application startup
validateEnv();

async function startApp() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // ✅ Allow frontend to call backend (handles OPTIONS preflight)
  app.enableCors({
    origin: ['http://localhost:5173'],
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 204,
  });

  app.setGlobalPrefix('api');

  // Serve static files from uploads directory
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/api/uploads/',
  });

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

  const env = validateEnv();
  await app.listen(env.PORT);
}
void startApp();
