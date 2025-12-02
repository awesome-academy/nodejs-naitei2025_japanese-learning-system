// src/modules/progress/progress.controller.ts
import {
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ProgressService } from './progress.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { TestAttemptResponseDto } from './dto/test-attempt-response.dto';

interface JwtPayload {
  userId: number;
  email: string;
}

@Controller('progress')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @UseGuards(JwtAuthGuard)
  @Get('test-attempts')
  async getTestAttempts(
    @Request() req,
  ): Promise<{ testAttempts: TestAttemptResponseDto[] }> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const userId = req.user.userId;
    const attempts = await this.progressService.getTestAttempts(
      userId as number,
    );
    const test_attempts = attempts.map((a) =>
      this.progressService.buildTestAttemptResponse(a),
    );
    return { testAttempts: test_attempts };
  }

  @UseGuards(JwtAuthGuard)
  @Get('test-attempt/:id')
  async getTestAttempt(
    @Param('id') id: number,
    @Request() req,
  ): Promise<{ testAttempt: TestAttemptResponseDto }> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const userId = req.user.userId;
    const attempt = await this.progressService.getTestAttemptById(
      userId as number,
      id,
    );
    const test_attempt = this.progressService.buildTestAttemptResponse(attempt);
    return { testAttempt: test_attempt };
  }

  @UseGuards(JwtAuthGuard)
  @Post('test-attempt/start/:testId')
  async startTestAttempt(
    @Param('testId') testId: number,
    @Request() req,
  ): Promise<{ testAttempt: TestAttemptResponseDto }> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const userId = (req.user as JwtPayload).userId;
    const attempt = await this.progressService.startTestAttempt({
      userId,
      testId,
    });
    const test_attempt = this.progressService.buildTestAttemptResponse(attempt);
    return { testAttempt: test_attempt };
  }
}
