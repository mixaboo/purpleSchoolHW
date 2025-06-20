import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '@app/app.module';
import { disconnect, Types } from 'mongoose';
import { CreateRoomDto } from '@app/room/presentation/dto/create-room.dto';
import { UpdateRoomDto } from '@app/room/presentation/dto/update-room.dto';
import { RoomCharacteristicsDto } from '@app/room/presentation/dto/room-characteristics.dto';
import { CreateScheduleDto } from '@app/schedule/presentation/dto/create-schedule.dto';
import { UpdateScheduleDto } from '@app/schedule/presentation/dto/update-schedule.dto';
import { RoomTypes, RoomViews } from '@app/room/domain/enums/room.enum';
import { AuthDto } from '@app/auth/presentation/dto/auth.dto';
import { SCHEDULE_NOT_FOUND } from '@app/schedule/infrastructure/constants/schedule.constants';
import { ROOM_NOT_FOUND } from '@app/room/infrastracture/constants/room.constants';

async function getAuthToken(app: INestApplication, credentials: AuthDto) {
  const { body } = await request(app.getHttpServer())
    .post('/auth/login')
    .send(credentials);
  return body.access_token;
}

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;
  let createdRoomId: string;
  let createdScheduleId: string;
  let userToken: string;
  let adminToken: string;

  //data for tests
  const roomId = new Types.ObjectId().toHexString();
  const scheduleId = new Types.ObjectId().toHexString();
  const exampleDate = new Date('2025-06-20');
  const exampleDateForUpdate = new Date('2025-07-17');

  const userLoginDto: AuthDto = {
    login: 'user12@gmail.com',
    password: '123',
  };
  const adminLoginDto: AuthDto = {
    login: 'root12@gmail.com',
    password: '123123',
  };

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
    number: Math.floor(Math.random() * (999 - 100 + 1)) + 100,
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

    [userToken, adminToken] = await Promise.all([
      getAuthToken(app, userLoginDto),
      getAuthToken(app, adminLoginDto),
    ]);
  });

  it('/room/create (POST) - ADMIN success', async () => {
    return request(app.getHttpServer())
      .post('/room/create')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(testCreateRoomDto)
      .expect(201)
      .then(async ({ body }: request.Response) => {
        createdRoomId = body._id;
        expect(roomId).toBeDefined();

        const response = await request(app.getHttpServer())
          .get(`/room/${createdRoomId}`)
          .set('Authorization', `Bearer ${adminToken}`)
          .expect(200);

        expect(response.body.number).toBe(testCreateRoomDto.number);
        expect(response.body._id).toBe(createdRoomId);
      });
  });

  it('/room/create (POST) - USER fail', async () => {
    return request(app.getHttpServer())
      .post('/room/create')
      .set('Authorization', `Bearer ${userToken}`)
      .send(testCreateRoomDto)
      .expect(403);
  });

  it('/schedule/create (POST) - success', async () => {
    const scheduleDtoWithRoomId = {
      ...testCreateScheduleDto,
      roomId: createdRoomId,
    };

    return request(app.getHttpServer())
      .post('/schedule/create')
      .set('Authorization', `Bearer ${userToken}`)
      .send(scheduleDtoWithRoomId)
      .expect(201)
      .then(({ body }: request.Response) => {
        //console.log(body);
        createdScheduleId = body._id;
        expect(scheduleId).toBeDefined();
      });
  });

  it('/room/:id (PATCH) - success', async () => {
    console.log(createdRoomId);
    return request(app.getHttpServer())
      .patch(`/room/${createdRoomId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send(testUpdateRoomDto)
      .expect(200)
      .then(({ body }: request.Response) => {
        expect(body).toBeDefined();
      });
  });

  it('/room/:id (PATCH) - invalid data', async () => {
    console.log(createdRoomId);
    return request(app.getHttpServer())
      .patch(`/room/${createdRoomId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        ...testUpdateRoomDto,
        characteristics: {
          ...testUpdateRoomDto.characteristics,
          bedsCount: 0,
        },
      })
      .expect(400)
      .then(({ body }: request.Response) => {
        console.log(body);
      });
  });

  it('/schedule/:id (PATCH) - success', async () => {
    return request(app.getHttpServer())
      .patch(`/schedule/${createdScheduleId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send(testUpdateScheduleDto)
      .expect(200)
      .then(({ body }: request.Response) => {
        expect(body).toBeDefined();
      });
  });

  it('/schedule/:id (PATCH) - invalid data', async () => {
    return request(app.getHttpServer())
      .patch(`/schedule/${createdScheduleId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ ...testUpdateScheduleDto, reservationDate: '20 января 2025' })
      .expect(400);
  });

  it('/room/:id (GET) - success', async () => {
    return request(app.getHttpServer())
      .get(`/room/${createdRoomId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200)
      .then(({ body }: request.Response) => {
        expect(body).toBeDefined();
        expect(body._id).toBe(createdRoomId);
      });
  });

  it('/room/:id (GET) - invalid id', async () => {
    return request(app.getHttpServer())
      .get('/room/12345')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(400);
  });

  it('/room/:id (GET) - bad id, fail', async () => {
    return request(app.getHttpServer())
      .get('/room/' + new Types.ObjectId().toHexString())
      .set('Authorization', `Bearer ${userToken}`)
      .expect(404, {
        statusCode: 404,
        message: ROOM_NOT_FOUND,
      });
  });

  it('/room/:id (GET) - changes are successful', async () => {
    return request(app.getHttpServer())
      .get(`/room/${createdRoomId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200)
      .then(({ body }: request.Response) => {
        expect(Number(body.roomType)).toBe(Number(RoomTypes.Suite));
      });
  });

  it('/room/:id (DELETE) - success', async () => {
    return request(app.getHttpServer())
      .delete('/room/' + createdRoomId)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);
  });

  it('/schedule/:id (DELETE) - success', async () => {
    return request(app.getHttpServer())
      .delete('/schedule/' + createdScheduleId)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);
  });

  it('/room/:id (DELETE) - fail', async () => {
    return request(app.getHttpServer())
      .delete('/room/' + new Types.ObjectId().toHexString())
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(404, {
        statusCode: 404,
        message: ROOM_NOT_FOUND,
      });
  });

  it('/schedule/:id (DELETE) - fail', async () => {
    return request(app.getHttpServer())
      .delete('/schedule/' + new Types.ObjectId().toHexString())
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(404, {
        statusCode: 404,
        message: SCHEDULE_NOT_FOUND,
      });
  });

  afterAll(async () => {
    await disconnect();
  });
});
