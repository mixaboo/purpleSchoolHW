import { RoomCharacteristicsDto } from './room-characteristics.dto';
import { RoomTypes } from '../../domain/enums/room.enum';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateRoomDto {
  @IsNotEmpty({ message: 'Room characteristics are required' })
  @ValidateNested()
  @Type(() => RoomCharacteristicsDto)
  characteristics?: RoomCharacteristicsDto;

  @IsOptional()
  @IsEnum(RoomTypes, {
    message: ($value) =>
      `${$value} is not a valid room type. Room type must be one of: ${Object.values(RoomTypes).join(', ')}`,
  })
  roomType?: RoomTypes;
}
