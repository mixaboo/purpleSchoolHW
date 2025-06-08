import {
  IsBoolean,
  IsDate,
  IsMongoId,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateScheduleDto {
  @IsOptional()
  @IsDate({ message: 'Date of reservation must be a valid date' })
  reservationDate?: Date;

  @IsOptional()
  @IsBoolean()
  paid?: boolean;

  @IsOptional()
  @IsString()
  @IsMongoId()
  roomId?: string;
}
