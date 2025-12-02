import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './config/database.config';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { TestModule } from './modules/test/test.module';
import { ProgressModule } from './modules/progress/progress.module';

@Module({
  imports: [DatabaseModule, UserModule, AuthModule, TestModule, ProgressModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
