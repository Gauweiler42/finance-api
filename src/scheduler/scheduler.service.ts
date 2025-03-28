import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { YahooFinanceService } from 'src/yahoo-finance/yahoo-finance.service';

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);

  constructor(private readonly yahooFinanceService: YahooFinanceService) {}

  @Cron(CronExpression.EVERY_SECOND)
  handleCron() {
    const start = Date.now();
    this.logger.log('Cron job started');
    
    this.logger.log('Cron job executed every minute');
    
    const duration = Date.now() - start;
    this.logger.log(`Cron job completed in ${duration}ms`);
  }
}
