import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { YahooFinanceModule } from './yahoo-finance/yahoo-finance.module';
import { PrismaModule } from './prisma/prisma.module';
import { SchedulerModule } from './scheduler/scheduler.module';

@Module({
  imports: [YahooFinanceModule, PrismaModule, SchedulerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
