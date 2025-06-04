import { Module } from '@nestjs/common';
import { ScheduleController } from './presentation/controllers/schedule.controller';
import { TypegooseModule } from '@m8a/nestjs-typegoose';
import { ScheduleModel } from '../room/presentation/dto/domain/models/schedule.model';
import { ScheduleService } from './application/services/schedule.service';

@Module({
  controllers: [ScheduleController],
  providers: [ScheduleService],
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: ScheduleModel,
        schemaOptions: {
          collection: 'Schedule',
        },
      },
    ]),
  ],
})
export class ScheduleModule {}
