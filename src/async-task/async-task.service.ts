import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AsyncTask } from './entities/async-task.entity';
import { WeatherReport } from '../weather-report/entities/weather-report.entity';
import axios from 'axios';

@Injectable()
export class AsyncTaskService {
  constructor(
    @InjectRepository(AsyncTask)
    private readonly asyncTaskRepository: Repository<AsyncTask>,
    @InjectRepository(WeatherReport)
    private readonly weatherReportRepository: Repository<WeatherReport>,
  ) {}

  async createAsyncTask(city: string): Promise<AsyncTask> {
    const asyncTask = this.asyncTaskRepository.create({ city });
    await this.asyncTaskRepository.save(asyncTask);

    this.startAsyncTask(asyncTask.id, city);

    return asyncTask;
  }

  async getExistingTask(city: string): Promise<AsyncTask | null> {
    return this.asyncTaskRepository.findOne({
      where: { city, status: 'in_progress' },
    });
  }

  calculateExpirationDate(createdAt: Date): string {
    const expirationDate = new Date(createdAt);
    expirationDate.setMinutes(expirationDate.getMinutes() + 10);
    return expirationDate.toUTCString();
  }

  async startAsyncTask(taskId: number, city: string): Promise<void> {
    const apiKey = 'e5c3ed1a5d379783c2c9c33a242b8793';
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

    try {
      const initialResponse = await axios.get(apiUrl);
      const initialWeather = initialResponse.data;

      await this.weatherReportRepository.save({
        asyncTask: { id: taskId },
        city,
        initialWeather,
        requestTime: new Date(),
      });

      setTimeout(async () => {
        const finalResponse = await axios.get(apiUrl);
        const finalWeather = finalResponse.data;

        const weatherReport = await this.weatherReportRepository.findOne({
          where: { asyncTask: { id: taskId } },
        });

        if (weatherReport) {
          weatherReport.finalWeather = finalWeather;
          weatherReport.responseTime = new Date();
          weatherReport.weatherDifference = this.calculateWeatherDifference(
            weatherReport.initialWeather,
            finalWeather,
          );
          await this.weatherReportRepository.save(weatherReport);

          const asyncTask = await this.asyncTaskRepository.findOne({
            where: { id: taskId },
          });
          asyncTask.status = 'completed';
          await this.asyncTaskRepository.save(asyncTask);
        }
      }, 600000); // 10 minutes
    } catch (error) {
      const asyncTask = await this.asyncTaskRepository.findOne({
        where: { id: taskId },
      });
      asyncTask.attempts += 1;
      asyncTask.failed = true;
      await this.asyncTaskRepository.save(asyncTask);
    }
  }

  calculateWeatherDifference(initialWeather: any, finalWeather: any): any {
    return {
      temperatureDifference: finalWeather.main.temp - initialWeather.main.temp,
    };
  }

  async getAsyncTask(id: number): Promise<any> {
    const task = await this.asyncTaskRepository.findOne({
      where: { id },
      relations: ['weatherReport'],
    });

    if (!task) {
      throw new NotFoundException(`AsyncTask with id ${id} not found`);
    }

    if (task.status === 'completed') {
      return {
        id: task.id,
        city: task.city,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
        attempts: task.attempts,
        failed: task.failed,
        progress: 100,
        weatherReport: task.weatherReport,
      };
    }

    const progress = Math.min(
      100,
      Math.floor(((Date.now() - task.createdAt.getTime()) / 600000) * 100),
    );

    return {
      id: task.id,
      city: task.city,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
      attempts: task.attempts,
      failed: task.failed,
      progress,
      weatherReport: null,
    };
  }

  async getWeatherReport(id: number): Promise<any> {
    const report = await this.weatherReportRepository.findOne({
      where: { asyncTask: { id } },
      relations: ['asyncTask'],
    });

    if (!report) {
      throw new NotFoundException(`WeatherReport with id ${id} not found`);
    }

    return {
      createdAt: report.requestTime,
      city: report.city,
      initialWeather: report.initialWeather,
      requestTime: report.requestTime,
      finalWeather: report.finalWeather,
      responseTime: report.responseTime,
      weatherDifference: report.weatherDifference,
      metadata: {
        jobId: report.asyncTask.id,
      },
    };
  }
}
