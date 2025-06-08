import { RoomCharacteristicsDto } from './room-characteristics.dto';
import { RoomTypes } from '../../domain/enums/room.enum';
import { IsEnum, IsNotEmpty, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateRoomDto {
  @IsNotEmpty({ message: 'Room number is required' })
  @IsNumber({}, { message: 'The room number must be a number' })
  number: number;

  @IsNotEmpty({ message: 'Room type is required' })
  @IsEnum(RoomTypes, {
    message: ($value) =>
      `${$value} is not a valid room type. Room type must be one of: ${Object.values(RoomTypes).join(', ')}`,
  })
  roomType: RoomTypes;

  @IsNotEmpty({ message: 'Room characteristics are required' })
  @ValidateNested()
  @Type(() => RoomCharacteristicsDto)
  characteristics: RoomCharacteristicsDto;
}
