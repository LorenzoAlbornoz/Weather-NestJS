import { PartialType } from '@nestjs/swagger';
import { CreateWeatherReportDto } from './create-weather-report.dto';

export class UpdateWeatherReportDto extends PartialType(CreateWeatherReportDto) {}
