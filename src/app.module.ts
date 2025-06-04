import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScheduleModule } from './schedule/schedule.module';
import { RoomModule } from './room/room.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { NpmModule } from './install/npm/npm.module';

@Module({
  imports: [
    ScheduleModule,
    RoomModule,
    ConfigModule.forRoot(),
    MongooseModule.forRoot('mongodb://localhost/test'),
    NpmModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
