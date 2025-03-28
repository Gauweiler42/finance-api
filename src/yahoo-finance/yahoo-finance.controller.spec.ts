import { Test, TestingModule } from '@nestjs/testing';
import { YahooFinanceController } from './yahoo-finance.controller';
import { YahooFinanceService } from './yahoo-finance.service';

describe('YahooFinanceController', () => {
  let controller: YahooFinanceController;
  let service: YahooFinanceService;

  beforeEach(async () => {
    const mockYahooFinanceService = {
      searchTicker: jest.fn(),
      getHistoricData: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [YahooFinanceController],
      providers: [
        {
          provide: YahooFinanceService,
          useValue: mockYahooFinanceService,
        },
      ],
    }).compile();

    controller = module.get<YahooFinanceController>(YahooFinanceController);
    service = module.get<YahooFinanceService>(YahooFinanceService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
