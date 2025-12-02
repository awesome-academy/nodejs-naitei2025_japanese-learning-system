// src/modules/progress/progress.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TestAttempt } from '../../entities/test_attempts.entity';
import { SectionAttempt } from '../../entities/section_attempts.entity';
import { Test } from '../../entities/tests.entity';
import { User } from '../../entities/users.entity';
import { CreateTestAttemptDto } from './dto/create-test-attempt.dto';

@Injectable()
export class ProgressService {
  constructor(
    @InjectRepository(TestAttempt)
    private readonly testAttemptRepo: Repository<TestAttempt>,
    @InjectRepository(SectionAttempt)
    private readonly sectionAttemptRepo: Repository<SectionAttempt>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Test)
    private readonly testRepo: Repository<Test>,
  ) {}

  buildTestAttemptResponse(attempt: TestAttempt) {
    return {
      id: attempt.id,
      testId: attempt.test.id,
      is_completed: attempt.is_completed,
      total_score: attempt.total_score,
      is_passed: attempt.is_passed,
      started_at: attempt.started_at,
      completed_at: attempt.completed_at,
      section_attempts: attempt.section_attempts?.map((s) => ({
        id: s.id,
        sectionId: s.section.id,
        status: s.status,
        score: s.score,
        correct_count: s.correct_count,
        time_remaining: s.time_remaining,
      })),
    };
  }

  private async checkAndCompleteTestAttempt(attempt: TestAttempt) {
    const allCompleted = attempt.section_attempts.every(
      (s) => s.status === 'COMPLETED',
    );

    if (allCompleted && !attempt.is_completed) {
      attempt.is_completed = true;
      await this.testAttemptRepo.save(attempt);
    }

    return attempt;
  }

  async startTestAttempt(dto: CreateTestAttemptDto): Promise<TestAttempt> {
    const user = await this.userRepo.findOne({ where: { id: dto.userId } });
    if (!user) throw new NotFoundException('User not found');

    const test = await this.testRepo.findOne({
      where: { id: dto.testId },
      relations: ['sections'],
    });
    if (!test) throw new NotFoundException('Test not found');

    const testAttempt = this.testAttemptRepo.create({
      user,
      test,
      is_completed: false,
      started_at: new Date(),
    });
    await this.testAttemptRepo.save(testAttempt);

    const sectionAttempts = test.sections.map((section) =>
      this.sectionAttemptRepo.create({
        test_attempt: testAttempt,
        section,
        time_remaining: section.time_limit * 60,
      }),
    );

    await this.sectionAttemptRepo.save(sectionAttempts);

    testAttempt.section_attempts = sectionAttempts;

    return testAttempt;
  }

  async getTestAttempts(userId: number): Promise<TestAttempt[]> {
    const attempts = await this.testAttemptRepo.find({
      where: { user: { id: userId } },
      relations: ['section_attempts', 'section_attempts.section', 'test'],
    });

    if (!attempts || attempts.length === 0) {
      throw new NotFoundException('No Test attempts found!');
    }

    await Promise.all(
      attempts.map((attempt) => this.checkAndCompleteTestAttempt(attempt)),
    );

    return attempts;
  }

  async getTestAttemptById(
    userId: number,
    attemptId: number,
  ): Promise<TestAttempt> {
    const attempt = await this.testAttemptRepo.findOne({
      where: { id: attemptId, user: { id: userId } },
      relations: ['section_attempts', 'section_attempts.section', 'test'],
    });

    if (!attempt) {
      throw new NotFoundException('Test attempt not found');
    }

    return this.checkAndCompleteTestAttempt(attempt);
  }
}
