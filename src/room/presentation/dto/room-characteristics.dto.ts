import { RoomViews } from '../../domain/enums/room.enum';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Max,
  Min,
} from 'class-validator';

export class RoomCharacteristicsDto {
  @IsNotEmpty({ message: 'Size is required' })
  @IsNumber({}, { message: 'Size must be a number' })
  size: number;

  @IsNotEmpty({ message: 'Beds count is required' })
  @IsNumber({}, { message: 'Beds count must be a number' })
  @Min(1, { message: 'Beds count must be greater than 0' })
  @Max(10, { message: 'Beds count must be less than 10' })
  bedsCount: number;

  @IsNotEmpty({ message: 'Baby bed availability is required' })
  @IsBoolean({ message: 'Baby bed availability must be a boolean' })
  babyBedAvailable: boolean;

  @IsOptional()
  @IsEnum(RoomViews, {
    message: ($value) =>
      `${$value} is not a valid room view. View must be one of: ${Object.values(RoomViews).join(', ')}`,
  })
  view?: RoomViews;
}

export class UpdateRoomCharacteristicsDto
  implements Partial<RoomCharacteristicsDto>
{
  @IsOptional()
  @IsNumber({}, { message: 'Size must be a number' })
  size?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Beds count must be a number' })
  @Min(1, { message: 'Beds count must be greater than 0' })
  @Max(10, { message: 'Beds count must be less than 10' })
  bedsCount?: number;

  @IsOptional()
  @IsBoolean({ message: 'Baby bed availability must be a boolean' })
  babyBedAvailable?: boolean;

  @IsOptional()
  @IsEnum(RoomViews, {
    message: ($value) =>
      `${$value} is not a valid room view. View must be one of: ${Object.values(RoomViews).join(', ')}`,
  })
  view?: RoomViews;
}
