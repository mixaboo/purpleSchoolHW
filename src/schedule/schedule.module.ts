import { Module } from '@nestjs/common';
import { ScheduleController } from './presentation/controllers/schedule.controller';
import { ScheduleService } from './application/services/schedule.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleSchema } from './domain/models/schedule.model';

@Module({
  controllers: [ScheduleController],
  providers: [ScheduleService],
  imports: [
    MongooseModule.forFeature([
      { name: 'Schedule', schema: ScheduleSchema, collection: 'Schedule' },
    ]),
  ],
})
export class ScheduleModule {}
