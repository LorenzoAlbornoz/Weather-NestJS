import { Test, TestingModule } from '@nestjs/testing';
import { AsyncTaskController } from './async-task.controller';
import { AsyncTaskService } from './async-task.service';

describe('AsyncTaskController', () => {
  let controller: AsyncTaskController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AsyncTaskController],
      providers: [AsyncTaskService],
    }).compile();

    controller = module.get<AsyncTaskController>(AsyncTaskController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
