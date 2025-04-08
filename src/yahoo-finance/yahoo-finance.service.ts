import { Injectable, Logger } from '@nestjs/common';
import yahooFinance from 'yahoo-finance2';
import { ChartOptionsWithReturnObject } from 'yahoo-finance2/dist/esm/src/modules/chart';

@Injectable()
export class YahooFinanceService {
  private readonly logger = new Logger(YahooFinanceService.name);

  constructor() {
    yahooFinance.setGlobalConfig({});
  }

  public async searchTicker(ticker: string) {
    this.logger.log(`Searching for ticker: ${ticker}`);
    return yahooFinance.search(ticker);
  }

  public async getChartData(
    ticker: string,
    queryOptions: ChartOptionsWithReturnObject,
  ) {
    this.logger.log(`Fetching historical data for ticker: ${ticker}`);
    return yahooFinance.chart(ticker, queryOptions);
  }
}
