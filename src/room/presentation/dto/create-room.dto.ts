import { RoomTypes } from '../../domain/models/room.model';
import { RoomCharacteristicsDto } from './room-characteristics.dto';

export class CreateRoomDto {
  number: number;
  roomType: RoomTypes;
  characteristics: RoomCharacteristicsDto;
}
