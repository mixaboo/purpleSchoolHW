import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { RoomModel } from '../../domain/models/room.model';

@Controller('room')
export class RoomController {
  @Post('create')
  async create(@Body() dto: Omit<RoomModel, '_id'>) {}

  @Delete(':id')
  async delete(@Param('id') id: string) {}

  @Get('byRoom/:roomId')
  async get(@Param('roomId') id: string) {}
}
