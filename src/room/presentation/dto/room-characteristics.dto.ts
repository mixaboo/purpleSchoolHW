import { RoomViews } from '../../domain/enums/room.enum';

export class RoomCharacteristicsDto {
  size: number;
  bedsCount: number;
  babyBedAvailable: boolean;
  view: RoomViews;
}
