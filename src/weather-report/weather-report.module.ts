import { Module } from '@nestjs/common';
import { WeatherReportService } from './weather-report.service';
import { WeatherReportController } from './weather-report.controller';

@Module({
  controllers: [WeatherReportController],
  providers: [WeatherReportService],
})
export class WeatherReportModule {}
