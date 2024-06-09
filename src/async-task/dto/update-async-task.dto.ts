import { PartialType } from '@nestjs/swagger';
import { CreateAsyncTaskDto } from './create-async-task.dto';

export class UpdateAsyncTaskDto extends PartialType(CreateAsyncTaskDto) {}
