import { Controller } from '@nestjs/common';
import { YahooFinanceService } from './yahoo-finance.service';
import { Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';

@ApiTags('Yahoo Finance')
@Controller('yahoo-finance')
export class YahooFinanceController {
  constructor(private readonly yahooFinanceService: YahooFinanceService) {}

  @Get('/search/:ticker')
  @ApiOperation({ summary: 'Search for ticker data' })
  @ApiParam({
    name: 'ticker',
    description: 'The stock ticker symbol',
    example: 'AAPL',
  })
  async getTickerData(@Param('ticker') ticker: string) {
    return await this.yahooFinanceService.searchTicker(ticker);
  }

  @Get('/historic/:ticker')
  @ApiOperation({ summary: 'Get historic data for a ticker' })
  @ApiParam({
    name: 'ticker',
    description: 'The stock ticker symbol',
    example: 'AAPL',
  })
  @ApiQuery({
    name: 'startDate',
    description: 'Start date for historic data (YYYY-MM-DD)',
    example: '2023-01-01',
  })
  @ApiQuery({
    name: 'endDate',
    description: 'End date for historic data (YYYY-MM-DD)',
    example: '2023-01-31',
  })
  @ApiQuery({
    name: 'interval',
    description: 'Interval for historic data (e.g., 1d, 1wk, 1mo)',
    example: '1d',
  })
  async getHistoricData(
    @Param('ticker') ticker: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('interval')
    interval:
      | '1m'
      | '2m'
      | '5m'
      | '15m'
      | '30m'
      | '60m'
      | '90m'
      | '1h'
      | '1d'
      | '5d'
      | '1wk'
      | '1mo'
      | '3mo',
  ) {
    return await this.yahooFinanceService.getHistoricData(ticker, {
      period1: new Date(startDate).getTime() / 1000,
      period2: new Date(endDate).getTime() / 1000,
      interval,
      return: 'object',
    });
  }
}
