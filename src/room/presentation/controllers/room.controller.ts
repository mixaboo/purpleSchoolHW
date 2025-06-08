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
import { RoomService } from '../../application/services/room.service';
import { CreateRoomDto } from '../dto/create-room.dto';
import { UpdateRoomDto } from '../dto/update-room.dto';
import { ROOM_NOT_FOUND } from '../../infrastracture/constants/room.constants';

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post('create')
  async create(@Body() dto: CreateRoomDto) {
    return this.roomService.create(dto);
  }

  @Get(':id')
  async get(@Param('id') roomId: string) {
    return this.roomService.get(roomId);
  }

  @Delete(':id')
  async delete(@Param('id') roomId: string) {
    const deletedRoom = await this.roomService.delete(roomId);
    if (!deletedRoom) {
      throw new HttpException(ROOM_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    return this.roomService.delete(roomId);
  }

  @Patch(':id')
  async patch(@Param('id') roomId: string, @Body() dto: UpdateRoomDto) {
    return this.roomService.patch(roomId, dto);
  }
}
