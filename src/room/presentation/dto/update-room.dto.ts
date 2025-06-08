import { RoomCharacteristicsDto } from './room-characteristics.dto';
import { RoomTypes } from '../../domain/enums/room.enum';

export class UpdateRoomDto {
  characteristics: RoomCharacteristicsDto;
  roomType: RoomTypes;
}
