import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateScheduleDto } from '../dto/create-schedule.dto';
import { ScheduleService } from '../../application/services/schedule.service';
import { UpdateScheduleDto } from '../dto/update-schedule.dto';
import { RESERVATION_NOT_FOUND } from '../../infrastructure/constants/schedule.constants';

@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Post('create')
  async create(@Body() dto: CreateScheduleDto) {
    if (dto.roomId === undefined) {
      throw new HttpException('Room id is required', HttpStatus.BAD_REQUEST);
    }
    return this.scheduleService.create(dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.scheduleService.delete(id);
  }

  @Delete('byRoom/:roomId')
  async deleteByRoomId(@Param('roomId') roomId: string) {
    const deletedSchedule = await this.scheduleService.deleteByRoomId(roomId);
    if (!deletedSchedule) {
      throw new HttpException(RESERVATION_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    return this.scheduleService.deleteByRoomId(roomId);
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return this.scheduleService.get(id);
  }

  @Get('byRoom/:roomId')
  async getByRoomId(@Param('roomId') roomId: string) {
    return this.scheduleService.getByRoomId(roomId);
  }

  @Patch(':id')
  async patch(@Param('id') id: string, @Body() dto: UpdateScheduleDto) {
    return this.scheduleService.patch(id, dto);
  }
}
