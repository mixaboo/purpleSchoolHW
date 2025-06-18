import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RoomModel } from '../../domain/models/room.model';
import { CreateRoomDto } from '../../presentation/dto/create-room.dto';
import { Model, Types } from 'mongoose';
import { UpdateRoomDto } from '../../presentation/dto/update-room.dto';
import { ROOM_NOT_FOUND } from '../../infrastracture/constants/room.constants';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId } from 'mongoose';

@Injectable()
export class RoomService {
  constructor(
    @InjectModel('Room')
    private readonly roomModel: Model<RoomModel>,
  ) {}

  async get(roomId: string): Promise<RoomModel> {
    if (!isValidObjectId(roomId)) {
      throw new HttpException('Invalid room ID format', HttpStatus.BAD_REQUEST);
    }

    const foundRoom = await this.roomModel.findById(roomId).exec();
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
