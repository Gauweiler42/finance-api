import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { SchedulerService } from './scheduler.service';
import { YahooFinanceService } from 'src/yahoo-finance/yahoo-finance.service';

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [SchedulerService, YahooFinanceService],
})
export class SchedulerModule {}
