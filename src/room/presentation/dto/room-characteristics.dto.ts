import { RoomViews } from '../../domain/models/room.model';

export class RoomCharacteristicsDto {
  size: number;
  bedsCount: number;
  babyBedAvailable: boolean;
  view: RoomViews;
}
