import { Module } from '@nestjs/common';
import { RoomController } from './presentation/controllers/room.controller';
import { TypegooseModule } from '@m8a/nestjs-typegoose';
import { RoomModel } from './domain/models/room.model';

@Module({
  controllers: [RoomController],
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: RoomModel,
        schemaOptions: {
          collection: 'Room',
        },
      },
    ]),
  ],
})
export class RoomModule {}
