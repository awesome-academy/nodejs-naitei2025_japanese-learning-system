import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProgressService } from './progress.service';
import { ProgressController } from './progress.controller';
import { TestAttempt } from '../../entities/test_attempts.entity';
import { SectionAttempt } from '../../entities/section_attempts.entity';
import { User } from '../../entities/users.entity';
import { Test } from '../../entities/tests.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([TestAttempt, SectionAttempt, User, Test]),
  ],
  controllers: [ProgressController],
  providers: [ProgressService],
  exports: [ProgressService],
})
export class ProgressModule {}
