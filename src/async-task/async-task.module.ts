import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AsyncTask } from './entities/async-task.entity';
import { WeatherReport } from '../weather-report/entities/weather-report.entity';
import { AsyncTaskService } from './async-task.service';
import { AsyncTaskController } from './async-task.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([AsyncTask, WeatherReport]), AuthModule],
  providers: [AsyncTaskService],
  controllers: [AsyncTaskController],
  exports: [AsyncTaskService],
})
export class AsyncTaskModule {}
