import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateScheduleDto } from '../../presentation/dto/create-schedule.dto';
import { UpdateScheduleDto } from '../../presentation/dto/update-schedule.dto';
import { Model, Types } from 'mongoose';
import { RESERVATION_ALREADY_EXISTS } from '../../infrastructure/constants/schedule.constants';
import { InjectModel } from '@nestjs/mongoose';
import { ScheduleModel } from '../../domain/models/schedule.model';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectModel('Schedule')
    private readonly scheduleModel: Model<ScheduleModel>,
  ) {}

  async create(dto: CreateScheduleDto): Promise<ScheduleModel> {
    const sameReservation = await this.scheduleModel
      .find({
        roomId: new Types.ObjectId(dto.roomId),
        reservationDate: dto.reservationDate,
      })
      .exec();
    if (sameReservation.length > 0) {
      throw new HttpException(RESERVATION_ALREADY_EXISTS, HttpStatus.CONFLICT);
    }
    return this.scheduleModel.create(dto);
  }

  async delete(scheduleId: string): Promise<ScheduleModel | null> {
    return await this.scheduleModel
      .findByIdAndUpdate(
        new Types.ObjectId(scheduleId),
        { deletedAt: new Date() },
        { new: true },
      )
      .exec();
  }

  async deleteByRoomId(roomId: string): Promise<{ modifiedCount: number }> {
    const result = await this.scheduleModel
      .updateMany(
        { roomId: new Types.ObjectId(roomId) }, // условие поиска
        { deletedAt: new Date() }, // обновление
      )
      .exec();
    return {
      modifiedCount: result.modifiedCount,
    };
  }

  async get(scheduleId: string): Promise<ScheduleModel | null> {
    return this.scheduleModel
      .findOne({ _id: new Types.ObjectId(scheduleId) })
      .exec();
  }

  async getByRoomId(roomId: string): Promise<ScheduleModel[] | null> {
    return this.scheduleModel
      .find({ roomId: new Types.ObjectId(roomId) })
      .exec();
  }

  async patch(
    scheduleId: string,
    dto: UpdateScheduleDto,
  ): Promise<ScheduleModel | null> {
    return await this.scheduleModel
      .findByIdAndUpdate(new Types.ObjectId(scheduleId), dto, { new: true })
      .exec();
  }
}
