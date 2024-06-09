// weather-report.entity.ts
import { AsyncTask } from 'src/async-task/entities/async-task.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from 'typeorm';

@Entity()
export class WeatherReport {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'json', nullable: true })
  initialWeather: any;

  @Column({ type: 'timestamp', nullable: true })
  requestTime: Date;

  @Column({ type: 'json', nullable: true })
  finalWeather: any;

  @Column({ type: 'timestamp', nullable: true })
  responseTime: Date;

  @Column({ type: 'json', nullable: true })
  weatherDifference: any;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @Column()
  city: string;

  @OneToOne(() => AsyncTask, (asyncTask) => asyncTask.weatherReport)
  asyncTask: AsyncTask;
}
