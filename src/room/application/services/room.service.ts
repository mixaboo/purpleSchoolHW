import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RoomModel } from '../../domain/models/room.model';
import { CreateRoomDto } from '../../presentation/dto/create-room.dto';
import { Model, Types } from 'mongoose';
import { UpdateRoomDto } from '../../presentation/dto/update-room.dto';
import { ROOM_NOT_FOUND } from '../../infrastracture/constants/room.constants';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class RoomService {
  constructor(
    @InjectModel('Room')
    private readonly roomModel: Model<RoomModel>,
  ) {}

  async get(roomId: string): Promise<RoomModel> {
    let foundRoom;

    try {
      const foundRoom = await this.roomModel
        .findOne({ _id: new Types.ObjectId(roomId) })
        .exec();
    } catch (error) {
      if (error instanceof Error && error.name === 'BSONError') {
        throw new HttpException(ROOM_NOT_FOUND, HttpStatus.NOT_FOUND);
      }
      throw error;
    }

    if (!foundRoom) {
      throw new HttpException(ROOM_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    return foundRoom;
  }

  async delete(roomId: string): Promise<RoomModel | null> {
    return await this.roomModel
      .findByIdAndUpdate(
        new Types.ObjectId(roomId),
        { deletedAt: new Date() },
        { new: true },
      )
      .exec();
  }

  async create(dto: CreateRoomDto): Promise<RoomModel> {
    return this.roomModel.create(dto);
  }

  async patch(roomId: string, dto: UpdateRoomDto): Promise<RoomModel | null> {
    return await this.roomModel
      .findByIdAndUpdate(new Types.ObjectId(roomId), dto, { new: true })
      .exec();
  }
}
