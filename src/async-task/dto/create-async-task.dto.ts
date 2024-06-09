// create-async-task.dto.ts
import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class CreateAsyncTaskDto {
  @IsNotEmpty()
  @IsString()
  @IsIn(['London', 'Paris', 'New York'])
  city: string;
}
