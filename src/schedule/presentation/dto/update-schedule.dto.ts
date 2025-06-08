import { IsMongoId, IsOptional, IsString } from 'class-validator';

export class UpdateScheduleDto {
  reservationDate?: Date;
  paid?: boolean;

  @IsOptional()
  @IsString()
  @IsMongoId()
  roomId?: string;
}
