import { AuthDto } from '@app/auth/presentation/dto/auth.dto';
import { disconnect } from 'mongoose';
import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';

import { INestApplication } from '@nestjs/common';
import { App } from 'supertest/types';
import { AppModule } from '@app/app.module';
import {
  USER_NOT_FOUND_ERROR,
  WRONG_PASSWORD_ERROR,
} from '@app/auth/infrastructure/constants/auth.constants';

const userLoginDto: AuthDto = {
  login: 'bar@gmail.com',
  password: '123!!ZzY111',
};
const adminLoginDto: AuthDto = {
  login: 'admin@gmail.com',
  password: '123!!ZzY111zz113241423',
};

describe('AuthController (e2e)', () => {
  let app: INestApplication<App>;
  let token: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/auth/login (POST) USER - success', async () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send(userLoginDto)
      .expect(200)
      .then(({ body }: request.Response) => {
        const token = body.access_token;
        expect(token).toBeDefined();
      });
  });

  it('/auth/login (POST) ADMIN - success', async () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send(adminLoginDto)
      .expect(200)
      .then(({ body }: request.Response) => {
        const token = body.access_token;
        expect(token).toBeDefined();
      });
  });

  it('/auth/login (POST) - fail password', async () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ ...userLoginDto, password: 'idontknowthepassword' })
      .expect(401, {
        statusCode: 401,
        error: 'Unauthorized',
        message: WRONG_PASSWORD_ERROR,
      });
  });

  it('/auth/login (POST) - fail login', async () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ ...userLoginDto, login: 'lol@gmail.com' })
      .expect(401, {
        statusCode: 401,
        error: 'Unauthorized',
        message: USER_NOT_FOUND_ERROR,
      });
  });

  afterAll(async () => {
    await disconnect();
  });
});
