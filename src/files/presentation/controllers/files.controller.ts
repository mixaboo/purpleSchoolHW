import {
  Body,
  Controller,
  HttpCode,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileElementResponse } from '../dto/file-element.response';
import { FilesService } from '../../application/services/files.service';
import { JwtAuthGuard } from '@app/auth/infrastructure/guards/jwt.guard';
import { MFile } from '@app/files/application/types/mfile.class';
import { UploadRoomImageDto } from '@app/files/presentation/dto/upload-room-image.dto';
import { RoomService } from '@app/room/application/services/room.service';

@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly roomService: RoomService,
  ) {}

  @Post('upload')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() uploadFileDto: UploadRoomImageDto,
  ): Promise<FileElementResponse[]> {
    const saveArray: MFile[] = [new MFile(file)];
    if (file.mimetype.includes('image')) {
      const buffer = await this.filesService.convertToWebP(file.buffer);
      saveArray.push(
        new MFile({
          originalname: `${file.originalname.split('.')[0]}.webp`,
          buffer,
        }),
      );
    }
    const savedFiles = await this.filesService.saveFiles(saveArray);
    const fileUrls = savedFiles.map((file) => file.url);

    await this.roomService.updatePictures(uploadFileDto.roomId, fileUrls);
    return savedFiles;
  }
}
