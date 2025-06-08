import {
  IsBoolean,
  IsDate,
  IsMongoId,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateScheduleDto {
  @IsOptional()
  @IsDate({ message: 'Date of reservation must be a valid date' })
  @Type(() => Date)
  reservationDate?: Date;

  @IsOptional()
  @IsBoolean()
  paid?: boolean;

  @IsOptional()
  @IsString()
  @IsMongoId()
  roomId?: string;
}
