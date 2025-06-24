import { Module } from '@nestjs/common';
import { ScheduleController } from './presentation/controllers/schedule.controller';
import { ScheduleService } from './application/services/schedule.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleSchema } from './domain/models/schedule.model';
import { TelegramModule } from '@app/telegram/telegram.module';
import { UserModule } from '@app/user/user.module';
import { RoomModule } from '@app/room/room.module';

@Module({
  controllers: [ScheduleController],
  providers: [ScheduleService],
  imports: [
    MongooseModule.forFeature([
      { name: 'Schedule', schema: ScheduleSchema, collection: 'Schedule' },
    ]),
    TelegramModule,
    UserModule,
    RoomModule,
  ],
})
export class ScheduleModule {}
