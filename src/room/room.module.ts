import { Module } from '@nestjs/common';
import { RoomController } from './presentation/controllers/room.controller';

@Module({
  controllers: [RoomController],
})
export class RoomModule {}
