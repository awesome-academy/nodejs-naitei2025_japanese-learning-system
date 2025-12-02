import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { validateEnv } from './env.validation';

dotenv.config();

// Validate environment variables on module load
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const env = validateEnv();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      host: env.DATABASE_HOST,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      port: env.DATABASE_PORT,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      username: env.DATABASE_USER,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      password: env.DATABASE_PASSWORD,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      database: env.DATABASE_NAME,
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: true,
      autoLoadEntities: true,
    }),
  ],
})
export class DatabaseModule {}
