import { Test, TestingModule } from '@nestjs/testing';
import { WeatherReportService } from './weather-report.service';

describe('WeatherReportService', () => {
  let service: WeatherReportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WeatherReportService],
    }).compile();

    service = module.get<WeatherReportService>(WeatherReportService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
