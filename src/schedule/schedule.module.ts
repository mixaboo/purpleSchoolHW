import { Module } from '@nestjs/common';
import { ScheduleController } from './presentation/controllers/schedule.controller';
import { TypegooseModule } from '@m8a/nestjs-typegoose';
import { ScheduleModel } from './domain/models/schedule.model';

@Module({
  controllers: [ScheduleController],
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
