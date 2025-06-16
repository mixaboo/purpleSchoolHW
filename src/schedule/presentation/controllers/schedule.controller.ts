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
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateScheduleDto } from '../dto/create-schedule.dto';
import { ScheduleService } from '../../application/services/schedule.service';
import { UpdateScheduleDto } from '../dto/update-schedule.dto';
import { SCHEDULE_NOT_FOUND } from '../../infrastructure/constants/schedule.constants';
import { Roles } from '@app/user/presentation/decorators/roles.decorator';
import { Role } from '@app/user/domain/enums/role.enum';
import { JwtAuthGuard } from '@app/auth/infrastructure/guards/jwt.guard';
import { RolesGuard } from '@app/user/infrastracture/guards/roles.guard';

@Controller('schedule')
@UsePipes(new ValidationPipe())
@UseGuards(JwtAuthGuard, RolesGuard)
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Post('create')
  async create(@Body() dto: CreateScheduleDto) {
    if (dto.roomId === undefined) {
      throw new HttpException('Room id is required', HttpStatus.BAD_REQUEST);
    }
    return this.scheduleService.create(dto);
  }

  @Roles(Role.Admin)
  @Delete(':id')
  async delete(@Param('id') scheduleId: string) {
    const deletedSchedule = await this.scheduleService.delete(scheduleId);
    if (!deletedSchedule) {
      throw new HttpException(SCHEDULE_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    return this.scheduleService.delete(scheduleId);
  }

  @Roles(Role.Admin)
  @Delete('byRoom/:roomId')
  async deleteByRoomId(@Param('roomId') roomId: string) {
    const deletedSchedule = await this.scheduleService.deleteByRoomId(roomId);
    if (!deletedSchedule) {
      throw new HttpException(SCHEDULE_NOT_FOUND, HttpStatus.NOT_FOUND);
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
