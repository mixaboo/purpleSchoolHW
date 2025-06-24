import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateScheduleDto } from '../../presentation/dto/create-schedule.dto';
import { UpdateScheduleDto } from '../../presentation/dto/update-schedule.dto';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  ScheduleModel,
  ScheduleWithInfo,
} from '../../domain/models/schedule.model';
import {
  SCHEDULE_ALREADY_EXISTS,
  SCHEDULE_NOT_FOUND,
} from '../../infrastructure/constants/schedule.constants';
import { UserService } from '@app/user/application/services/user.service';
import { RoomService } from '@app/room/application/services/room.service';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectModel('Schedule')
    private readonly scheduleModel: Model<ScheduleModel>,
    private readonly userService: UserService,
    private readonly roomService: RoomService,
  ) {}

  async create(
    dto: CreateScheduleDto,
    userEmail: string,
  ): Promise<ScheduleWithInfo> {
    const sameReservation = await this.scheduleModel
      .find({
        roomId: new Types.ObjectId(dto.roomId),
        reservationDate: dto.reservationDate,
      })
      .exec();
    if (sameReservation.length > 0) {
      throw new HttpException(SCHEDULE_ALREADY_EXISTS, HttpStatus.CONFLICT);
    }
    const reservation = await this.scheduleModel.create(dto);

    const userProfile = await this.userService.findByEmail(userEmail);
    const room = await this.roomService.get(dto.roomId);
    return {
      ...reservation.toObject(),
      userInfo: {
        name: userProfile!.name,
        phone: userProfile!.phone,
      },
      roomInfo: {
        roomNumber: room.number,
      },
    };
  }

  async delete(
    scheduleId: string,
    userEmail: string,
  ): Promise<ScheduleWithInfo | null> {
    const reservation = await this.scheduleModel
      .findByIdAndUpdate(
        new Types.ObjectId(scheduleId),
        { deletedAt: new Date() },
        { new: true },
      )
      .exec();

    if (!reservation) {
      throw new HttpException(SCHEDULE_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const userProfile = await this.userService.findByEmail(userEmail);

    return {
      ...reservation.toObject(),
      userInfo: {
        name: userProfile!.name,
        phone: userProfile!.phone,
      },
    };
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
      .findByIdAndUpdate(
        new Types.ObjectId(scheduleId),
        { $set: dto },
        { new: true },
      )
      .exec();
  }

  async getMonthlyReport(month: number, year: number) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    /*
    const schedules = await this.scheduleModel.find({}).lean();
    console.log(
      'Schedules roomIds:',
      schedules.map((s) => ({
        roomId: s.roomId,
        roomIdType: typeof s.roomId,
        isObjectId: s.roomId instanceof Types.ObjectId,
      })),
    );
    */
    return await this.scheduleModel
      .aggregate([
        {
          $match: {
            reservationDate: {
              $gte: startDate,
              $lte: endDate,
            },
            deletedAt: null,
          },
        },
        {
          $addFields: {
            roomIdObj: { $toObjectId: '$roomId' },
          },
        },
        {
          $lookup: {
            from: 'rooms',
            localField: 'roomIdObj',
            foreignField: '_id',
            as: 'room',
          },
        },
        {
          $unwind: {
            path: '$room',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $group: {
            _id: '$roomId',
            roomNumber: { $first: '$room.number' },
            reservedDays: { $count: {} },
          },
        },
        {
          $project: {
            _id: 0,
            roomNumber: 1,
            reservedDays: 1,
          },
        },
      ])
      .exec();
  }
}
