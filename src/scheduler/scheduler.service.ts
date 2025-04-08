import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Price } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { YahooFinanceService } from 'src/yahoo-finance/yahoo-finance.service';

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);

  constructor(
    private readonly yahooFinanceService: YahooFinanceService,
    private readonly prismaService: PrismaService,
  ) {}

  @Cron(CronExpression.EVERY_30_SECONDS)
  async fetchNewPrices() {
    const start = Date.now();

    const schedule = await this.prismaService.fetchPlan.findFirst({
      where: {
        status: false,
        scheduleTime: {
          lt: new Date(),
        },
      },
      orderBy: {
        scheduleTime: 'asc',
      },
    });

    if (!schedule) {
      this.logger.debug('No schedules found');
      return;
    }

    await this.prismaService.fetchPlan.update({
      where: {
        id: schedule.id,
      },
      data: {
        status: true,
      },
    });
    this.logger.debug(`Schedule found: ${JSON.stringify(schedule)}`);

    const { stockId } = schedule;
    this.logger.debug(`Fetching new prices for ticker: ${stockId}`);

    const stockPrice = await this.prismaService.price.findFirst({
      where: {
        stockId,
      },
      orderBy: {
        timestamp: 'desc',
      },
    });

    const lastTimestamp = stockPrice
      ? new Date(stockPrice.timestamp).getTime()
      : new Date('2000-01-01').getTime();

    const startDate = new Date(lastTimestamp + 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];
    this.logger.debug(
      `Last fetched timestamp plus 1 day in YYYY-MM-DD format: ${startDate}`,
    );

    const currentTime = Date.now();
    const endDate = new Date(currentTime).toISOString().split('T')[0];
    this.logger.debug(`Current time in YYYY-MM-DD format: ${endDate}`);
    const adjustedEndDate = new Date(currentTime - 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];
    this.logger.debug(
      `Adjusted end date (1 day subtracted) in YYYY-MM-DD format: ${adjustedEndDate}`,
    );

    this.logger.debug(
      `Fetching chart data from ${startDate} to ${adjustedEndDate}`,
    );

    const startDateObj = new Date(startDate);
    const adjustedEndDateObj = new Date(adjustedEndDate);

    const dateDifference =
      (adjustedEndDateObj.getTime() - startDateObj.getTime()) /
      (24 * 60 * 60 * 1000);

    if (dateDifference <= 1) {
      this.logger.error(
        `Start date and adjusted end date need to be more than 1 day apart: ${dateDifference} days`,
      );
      return;
    }

    const chartData = await this.yahooFinanceService.getChartData(stockId, {
      period1: new Date(startDate).getTime() / 1000,
      period2: new Date(adjustedEndDateObj).getTime() / 1000,
      interval: '1d',
      return: 'object',
    });

    if (!chartData.timestamp || chartData.timestamp.length <= 0) {
      this.logger.error(`No chart data found for ticker: ${stockId}`);
      return;
    }

    const prices: {
      stockId: string;
      open: number;
      high: number;
      low: number;
      close: number;
      volume: number;
      timestamp: Date;
      adjclose: number;
    }[] = [];

    let index = 0;
    while (index < chartData.timestamp.length) {
      const open = chartData.indicators.quote[0].open[index];
      const high = chartData.indicators.quote[0].high[index];
      const low = chartData.indicators.quote[0].low[index];
      const close = chartData.indicators.quote[0].close[index];
      const volume = chartData.indicators.quote[0].volume[index];
      const adjclose = chartData.indicators.adjclose?.[0]?.adjclose?.[index];
      // Konvertiere Unix-Timestamp in JavaScript Date und dann in einen ISO-String
      const timestampDate = new Date(chartData.timestamp[index] * 1000);

      prices.push({
        stockId,
        open: open ?? -1,
        high: high ?? -1,
        low: low ?? -1,
        close: close ?? -1,
        volume: volume ?? -1,
        timestamp: timestampDate, // Use Date object directly
        adjclose: adjclose ?? -1,
      });

      index++;
    }

    await this.prismaService.price.createMany({
      data: prices,
    });
    this.logger.debug(`Inserted ${prices.length} new prices into the database`);

    const duration = Date.now() - start;
    this.logger.log(
      `Fetching prices for ${stockId} completed in ${duration}ms`,
    );
  }
}
