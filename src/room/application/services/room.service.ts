import { Injectable } from '@nestjs/common';
import { RoomModel } from '../../domain/models/room.model';
import { ReturnModelType } from '@typegoose/typegoose/lib/types';
import { CreateRoomDto } from '../../presentation/dto/create-room.dto';
import { Types } from 'mongoose';
import { InjectModel } from '@m8a/nestjs-typegoose';
import { DocumentType } from '@typegoose/typegoose';
import { UpdateRoomDto } from '../../presentation/dto/update-room.dto';

@Injectable()
export class RoomService {
  constructor(
    @InjectModel(RoomModel)
    private readonly roomModel: ReturnModelType<typeof RoomModel>,
  ) {}

  async get(roomId: string): Promise<DocumentType<RoomModel> | null> {
    return this.roomModel.findOne({ _id: new Types.ObjectId(roomId) }).exec();
  }

  async delete(roomId: string): Promise<DocumentType<RoomModel> | null> {
    return await this.roomModel
      .findByIdAndUpdate(
        new Types.ObjectId(roomId),
        { deletedAt: new Date() },
        { new: true },
      )
      .exec();
  }

  async create(dto: CreateRoomDto): Promise<DocumentType<RoomModel>> {
    return this.roomModel.create(dto);
  }

  async patch(
    roomId: string,
    dto: UpdateRoomDto,
  ): Promise<DocumentType<RoomModel> | null> {
    return await this.roomModel
      .findByIdAndUpdate(new Types.ObjectId(roomId), dto, { new: true })
      .exec();
  }
}
