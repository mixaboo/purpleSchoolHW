import { IsMongoId, IsString } from 'class-validator';

export class UploadRoomImageDto {
  @IsString()
  @IsMongoId()
  roomId: string;
}
