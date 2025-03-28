import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { YahooFinanceModule } from './yahoo-finance/yahoo-finance.module';

@Module({
  imports: [YahooFinanceModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
