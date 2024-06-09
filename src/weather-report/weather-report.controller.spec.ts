import { Test, TestingModule } from '@nestjs/testing';
import { WeatherReportController } from './weather-report.controller';
import { WeatherReportService } from './weather-report.service';

describe('WeatherReportController', () => {
  let controller: WeatherReportController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WeatherReportController],
      providers: [WeatherReportService],
    }).compile();

    controller = module.get<WeatherReportController>(WeatherReportController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
