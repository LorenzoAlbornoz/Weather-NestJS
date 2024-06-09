import { Injectable } from '@nestjs/common';
import { CreateWeatherReportDto } from './dto/create-weather-report.dto';
import { UpdateWeatherReportDto } from './dto/update-weather-report.dto';

@Injectable()
export class WeatherReportService {
  create(createWeatherReportDto: CreateWeatherReportDto) {
    return 'This action adds a new weatherReport';
  }

  findAll() {
    return `This action returns all weatherReport`;
  }

  findOne(id: number) {
    return `This action returns a #${id} weatherReport`;
  }

  update(id: number, updateWeatherReportDto: UpdateWeatherReportDto) {
    return `This action updates a #${id} weatherReport`;
  }

  remove(id: number) {
    return `This action removes a #${id} weatherReport`;
  }
}
