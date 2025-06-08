import { RoomCharacteristicsDto } from './room-characteristics.dto';
import { RoomTypes } from '../../domain/enums/room.enum';

export class CreateRoomDto {
  number: number;
  roomType: RoomTypes;
  characteristics: RoomCharacteristicsDto;
}
