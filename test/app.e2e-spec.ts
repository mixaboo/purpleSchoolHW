import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { disconnect, Types } from 'mongoose';
import { CreateRoomDto } from '../src/room/presentation/dto/create-room.dto';
import { UpdateRoomDto } from '../src/room/presentation/dto/update-room.dto';
import { RoomCharacteristicsDto } from '../src/room/presentation/dto/room-characteristics.dto';
import { CreateScheduleDto } from '../src/schedule/presentation/dto/create-schedule.dto';
import { UpdateScheduleDto } from '../src/schedule/presentation/dto/update-schedule.dto';
import { ROOM_NOT_FOUND } from '../src/room/infrastracture/constants/room.constants';
import { SCHEDULE_NOT_FOUND } from '../src/schedule/infrastructure/constants/schedule.constants';
import { RoomTypes, RoomViews } from '../src/room/domain/enums/room.enum';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;
  let createdRoomId: string;
  let createdScheduleId: string;

  //data for tests
  const roomId = new Types.ObjectId().toHexString();
  const scheduleId = new Types.ObjectId().toHexString();
  const exampleDate = new Date('2025-06-17');
  const exampleDateForUpdate = new Date('2025-07-17');

  const testRoomCharacteristicsDto: RoomCharacteristicsDto = {
    size: 34,
    bedsCount: 2,
    babyBedAvailable: false,
    view: RoomViews.Pool,
  };

  const testRoomUpdateCharacteristicsDto: RoomCharacteristicsDto = {
    size: 34,
    bedsCount: 1,
    babyBedAvailable: false,
    view: RoomViews.Pool,
  };

  const testCreateRoomDto: CreateRoomDto = {
    number: 101,
    roomType: RoomTypes.Deluxe,
    characteristics: testRoomCharacteristicsDto,
  };

  const testUpdateRoomDto: UpdateRoomDto = {
    roomType: RoomTypes.Suite,
    characteristics: testRoomUpdateCharacteristicsDto,
  };

  //schedule test data
  //Partial<> for a situation when we need to edit Dto later
  const testCreateScheduleDto: Partial<CreateScheduleDto> = {
    reservationDate: exampleDate,
    paid: false,
  };

  const testUpdateScheduleDto: UpdateScheduleDto = {
    reservationDate: exampleDateForUpdate,
    paid: true,
  };
  //schedule test data

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/room/create (POST) - success', async () => {
    return request(app.getHttpServer())
      .post('/room/create')
      .send(testCreateRoomDto)
      .expect(201)
      .then(({ body }: request.Response) => {
        createdRoomId = body._id;
        expect(roomId).toBeDefined();
      });
  });

  it('/schedule/create (POST) - success', async () => {
    const scheduleDtoWithRoomId = {
      ...testCreateScheduleDto,
      roomId: createdRoomId,
    };

    return request(app.getHttpServer())
      .post('/schedule/create')
      .send(scheduleDtoWithRoomId)
      .expect(201)
      .then(({ body }: request.Response) => {
        createdScheduleId = body._id;
        expect(scheduleId).toBeDefined();
      });
  });

  it('/room/:id (PATCH) - success', async () => {
    return request(app.getHttpServer())
      .patch(`/room/${createdRoomId}`)
      .send(testUpdateRoomDto)
      .expect(200)
      .then(({ body }: request.Response) => {
        expect(body).toBeDefined();
      });
  });

  it('/schedule/:id (PATCH) - success', async () => {
    return request(app.getHttpServer())
      .patch(`/schedule/${createdScheduleId}`)
      .send(testUpdateScheduleDto)
      .expect(200)
      .then(({ body }: request.Response) => {
        expect(body).toBeDefined();
      });
  });

  it('/room/:id (GET) - success', async () => {
    return request(app.getHttpServer())
      .get(`/room/${createdRoomId}`)
      .expect(200)
      .then(({ body }: request.Response) => {
        expect(body).toBeDefined();
        expect(body._id).toBe(createdRoomId);
      });
  });

  it('/room/:id (GET) - fail', async () => {
    return request(app.getHttpServer()).get('/room/12345').expect(404, {
      statusCode: 404,
      message: ROOM_NOT_FOUND,
    });
  });

  it('/room/:id (GET) - changes are successful', async () => {
    return request(app.getHttpServer())
      .get(`/room/${createdRoomId}`)
      .expect(200)
      .then(({ body }: request.Response) => {
        expect(Number(body.roomType)).toBe(Number(RoomTypes.Suite));
      });
  });

  it('/room/:id (DELETE) - success', async () => {
    return request(app.getHttpServer())
      .delete('/room/' + createdRoomId)
      .expect(200);
  });

  it('/schedule/:id (DELETE) - success', async () => {
    return request(app.getHttpServer())
      .delete('/schedule/' + createdScheduleId)
      .expect(200);
  });

  it('/room/:id (DELETE) - fail', async () => {
    return request(app.getHttpServer())
      .delete('/room/' + new Types.ObjectId().toHexString())
      .expect(404, {
        statusCode: 404,
        message: ROOM_NOT_FOUND,
      });
  });

  it('/schedule/:id (DELETE) - fail', async () => {
    return request(app.getHttpServer())
      .delete('/schedule/' + new Types.ObjectId().toHexString())
      .expect(404, {
        statusCode: 404,
        message: SCHEDULE_NOT_FOUND,
      });
  });

  afterAll(async () => {
    await disconnect();
    //await app.close();
  });
});
