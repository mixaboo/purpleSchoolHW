import { RoomCharacteristicsDto } from './room-characteristics.dto';
import { RoomTypes } from '../../domain/models/room.model';

export class UpdateRoomDto {
  characteristics: RoomCharacteristicsDto;
  roomType: RoomTypes;
}
