import { Module } from '@nestjs/common';
import { ScheduleController } from './presentation/controllers/schedule.controller';

@Module({
  controllers: [ScheduleController],
})
export class ScheduleModule {}
