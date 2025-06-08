import {
  IsBoolean,
  IsDate,
  IsMongoId,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class CreateScheduleDto {
  @IsNotEmpty({ message: 'Reservation date is required' })
  @IsDate({ message: 'Date of reservation must be a valid date' })
  reservationDate: Date;

  @IsNotEmpty({ message: 'Status of payment is required' })
  @IsBoolean()
  paid: boolean;

  @IsNotEmpty({ message: 'Room is not valid' })
  @IsString()
  @IsMongoId()
  roomId: string;
}
