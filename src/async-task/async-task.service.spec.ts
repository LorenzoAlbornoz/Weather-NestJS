import { Test, TestingModule } from '@nestjs/testing';
import { AsyncTaskService } from './async-task.service';

describe('AsyncTaskService', () => {
  let service: AsyncTaskService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AsyncTaskService],
    }).compile();

    service = module.get<AsyncTaskService>(AsyncTaskService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
