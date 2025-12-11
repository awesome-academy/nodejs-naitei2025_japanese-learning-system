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
  app.setGlobalPrefix('api');

  // Serve static files from uploads directory
  // Images: http://localhost:3000/api/uploads/images/filename.png
  // Audio: http://localhost:3000/api/uploads/audio/filename.mp3
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
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const env = validateEnv();
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
  await app.listen(env.PORT);
}
void startApp();
