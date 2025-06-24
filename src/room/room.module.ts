import { Module } from '@nestjs/common';
import { RoomController } from './presentation/controllers/room.controller';
import { RoomSchema } from './domain/models/room.model';
import { RoomService } from './application/services/room.service';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  controllers: [RoomController],
  providers: [RoomService],
  imports: [
    MongooseModule.forFeature([
      { name: 'Room', schema: RoomSchema, collection: 'Room' },
    ]),
  ],
  exports: [RoomService],
})
export class RoomModule {}
