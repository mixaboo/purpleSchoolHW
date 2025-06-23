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
  Query,
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
import { MonthlyReportDto } from '@app/schedule/presentation/dto/monthlyReport.dto';
import { TelegramService } from '@app/telegram/application/services/telegram.service';
import { User } from '@app/user/presentation/decorators/user-email.decorator';
import { format } from 'date-fns';

@Controller('schedule')
@UsePipes(new ValidationPipe())
@UseGuards(JwtAuthGuard, RolesGuard)
export class ScheduleController {
  constructor(
    private readonly scheduleService: ScheduleService,
    private readonly telegramService: TelegramService,
  ) {}

  @Post('create')
  async create(
    @Body() dto: CreateScheduleDto,
    @User() user: { email: string },
  ) {
    if (dto.roomId === undefined) {
      throw new HttpException('Room id is required', HttpStatus.BAD_REQUEST);
    }
    const reservation = await this.scheduleService.create(dto, user.email);

    const message =
      `✅ You got a new reservation \n` +
      `Client: ${reservation.userInfo!.name} \n` +
      `Phone: ${reservation.userInfo!.phone} \n` +
      `Date: ${format(reservation.reservationDate, 'dd.MM.yyyy')} \n` +
      `Room number: n. ${reservation.roomInfo!.roomNumber} \n`;

    await this.telegramService.sendMessage(message);
    return reservation;
  }

  @Roles(Role.Admin)
  @Get('monthly-report')
  async getMonthlyReport(@Query() query: MonthlyReportDto) {
    return this.scheduleService.getMonthlyReport(query.month, query.year);
  }

  @Get('byRoom/:roomId')
  async getByRoomId(@Param('roomId') roomId: string) {
    return this.scheduleService.getByRoomId(roomId);
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

  @Patch(':id')
  async patch(@Param('id') id: string, @Body() dto: UpdateScheduleDto) {
    return this.scheduleService.patch(id, dto);
  }

  @Roles(Role.Admin)
  @Delete(':id')
  async delete(
    @Param('id') scheduleId: string,
    @User() user: { email: string },
  ) {
    const deletedSchedule = await this.scheduleService.delete(
      scheduleId,
      user.email,
    );
    if (!deletedSchedule) {
      throw new HttpException(SCHEDULE_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const message =
      `❌ Reservation was cancelled \n` +
      `Client: ${deletedSchedule.userInfo!.name} \n` +
      `Phone: ${deletedSchedule.userInfo!.phone} \n` +
      `Date: ${format(deletedSchedule.reservationDate, 'dd.MM.yyyy')} \n`;

    await this.telegramService.sendMessage(message);
    return deletedSchedule;
  }
}
