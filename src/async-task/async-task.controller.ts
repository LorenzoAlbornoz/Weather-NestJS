// async-task.controller.ts
import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Res,
  HttpStatus,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { AsyncTaskService } from './async-task.service';
import { CreateAsyncTaskDto } from './dto/create-async-task.dto';
import { AuthGuard } from 'src/auth/guards/access-token.guard';

@Controller('reportes-de-clima')
export class AsyncTaskController {
  constructor(private readonly asyncTaskService: AsyncTaskService) {}

  @Post()
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.ACCEPTED)
  async createAsyncTask(
    @Body() createAsyncTaskDto: CreateAsyncTaskDto,
    @Res() res: Response,
  ) {
    const { city } = createAsyncTaskDto;

    // Verificar si ya existe un job en progreso para la misma ciudad
    const existingTask = await this.asyncTaskService.getExistingTask(city);

    if (existingTask) {
      // Si existe un job en progreso para la misma ciudad, devolver la respuesta correspondiente
      const asyncTask = await this.asyncTaskService.getAsyncTask(
        existingTask.id,
      );
      const expirationDate = this.asyncTaskService.calculateExpirationDate(
        asyncTask.createdAt,
      );
      res.setHeader(
        'Content-Location',
        `/reportes-de-clima/jobs/${asyncTask.id}`,
      );
      res.setHeader('Expires', expirationDate);
      return res.status(HttpStatus.NOT_MODIFIED).send();
    }

    // Si no existe, crear un nuevo job
    const asyncTask = await this.asyncTaskService.createAsyncTask(city);
    res.setHeader(
      'Content-Location',
      `/reportes-de-clima/jobs/${asyncTask.id}`,
    );
    res.setHeader('Retry-After', '600');
    return res.status(HttpStatus.ACCEPTED).json({
      job_id: asyncTask.id,
      status: 'Petición en progreso. Una tarea fue programada.',
    });
  }
  @Get('jobs/:id')
  async getAsyncTask(@Param('id') id: number, @Res() res: Response) {
    const asyncTask = await this.asyncTaskService.getAsyncTask(id);

    if (asyncTask.status === 'completed') {
      // Redirigir a la ruta del reporte del clima generado por este job
      res.setHeader('Location', `/reportes-de-clima/${id}`);
      return res.status(HttpStatus.SEE_OTHER).send();
    } else {
      // Devolver el estado actual del job
      return res.status(HttpStatus.OK).json(asyncTask);
    }
  }

  @Get(':id')
  async getWeatherReport(@Param('id') id: number, @Res() res: Response) {
    try {
      const weatherReport = await this.asyncTaskService.getWeatherReport(id);
      return res.status(HttpStatus.OK).json(weatherReport);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  }
}
