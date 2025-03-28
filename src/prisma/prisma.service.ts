import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super();
    if (!process.env.DATABASE_URL) {
      const errorMessage =
        'DATABASE_URL is not set in the environment variables.';
      this.logger.error(errorMessage);
      throw new Error(errorMessage);
    }
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('Successfully connected to the database.');
    } catch (error) {
      this.logger.error('Failed to connect to the database.', error);
      process.exit(1);
    }
  }
}
