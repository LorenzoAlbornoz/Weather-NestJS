// async-task.entity.ts
import { WeatherReport } from 'src/weather-report/entities/weather-report.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class AsyncTask {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  city: string;

  @Column({ default: 'in_progress' })
  status: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @Column({ default: 0 })
  attempts: number;

  @Column({ default: false })
  failed: boolean;

  @OneToOne(() => WeatherReport, (weatherReport) => weatherReport.asyncTask)
  @JoinColumn()
  weatherReport: WeatherReport;
}
