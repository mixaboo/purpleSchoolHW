import { Module } from '@nestjs/common';
import { FilesController } from './presentation/controllers/files.controller';
import { FilesService } from './application/services/files.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { path } from 'app-root-path';
import { RoomService } from '@app/room/application/services/room.service';
import { MongooseModule } from '@nestjs/mongoose';
import { RoomSchema } from '@app/room/domain/models/room.model';

@Module({
  controllers: [FilesController],
  providers: [FilesService, RoomService],
  imports: [
    ServeStaticModule.forRoot({
      rootPath: `${path}/uploads`,
      serveRoot: '/static',
    }),
    MongooseModule.forFeature([
      { name: 'Room', schema: RoomSchema, collection: 'Room' },
    ]),
  ],
})
export class FilesModule {}
