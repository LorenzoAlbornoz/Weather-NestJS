import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WeatherReportService } from './weather-report.service';
import { CreateWeatherReportDto } from './dto/create-weather-report.dto';
import { UpdateWeatherReportDto } from './dto/update-weather-report.dto';

@Controller('weather-report')
export class WeatherReportController {
  constructor(private readonly weatherReportService: WeatherReportService) {}

  @Post()
  create(@Body() createWeatherReportDto: CreateWeatherReportDto) {
    return this.weatherReportService.create(createWeatherReportDto);
  }

  @Get()
  findAll() {
    return this.weatherReportService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.weatherReportService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWeatherReportDto: UpdateWeatherReportDto) {
    return this.weatherReportService.update(+id, updateWeatherReportDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.weatherReportService.remove(+id);
  }
}
