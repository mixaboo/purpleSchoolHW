import { IsBoolean, IsDate, IsMongoId, IsNotEmpty } from 'class-validator';

export class CreateScheduleDto {
  @IsNotEmpty()
  @IsDate()
  reservationDate: Date;

  @IsNotEmpty()
  @IsBoolean()
  paid: boolean;

  @IsNotEmpty()
  @IsMongoId()
  roomId: string;
}
