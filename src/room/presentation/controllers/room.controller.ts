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
import { CreateRoomDto } from '../dto/create-room.dto';
import { UpdateRoomDto } from '../dto/update-room.dto';
import { ROOM_NOT_FOUND } from '../../infrastracture/constants/room.constants';
import { JwtAuthGuard } from '@app/auth/infrastructure/guards/jwt.guard';
import { Roles } from '@app/user/presentation/decorators/roles.decorator';
import { Role } from '@app/user/domain/enums/role.enum';
import { RolesGuard } from '@app/user/infrastracture/guards/roles.guard';
import { RoomService } from '@app/room/application/services/room.service';

@Controller('room')
@UsePipes(new ValidationPipe())
@UseGuards(JwtAuthGuard, RolesGuard)
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post('create')
  @Roles(Role.Admin)
  async create(@Body() dto: CreateRoomDto) {
    return this.roomService.create(dto);
  }

  @Get(':id')
  async get(@Param('id') roomId: string) {
    return this.roomService.get(roomId);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  async delete(@Param('id') roomId: string) {
    const deletedRoom = await this.roomService.delete(roomId);
    if (!deletedRoom) {
      throw new HttpException(ROOM_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    return this.roomService.delete(roomId);
  }

  @Patch(':id')
  @Roles(Role.Admin)
  async patch(@Param('id') roomId: string, @Body() dto: UpdateRoomDto) {
    return this.roomService.patch(roomId, dto);
  }
}
