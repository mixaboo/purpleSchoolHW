import { AuthDto } from '../src/auth/presentation/dto/auth.dto';
import { disconnect } from 'mongoose';
import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { App } from 'supertest/types';
import {
  USER_NOT_FOUND_ERROR,
  WRONG_PASSWORD_ERROR,
} from '../src/auth/infrastructure/constants/auth.constants';

const userLoginDto: AuthDto = {
  login: 'bar@gmail.com',
  password: '123!!ZzY111',
};
const adminLoginDto: AuthDto = {
  login: 'admin@gmail.com',
  password: '123!!ZzY111zz113241423',
};

// user token
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6eyJlbWFpbCI6ImJhckBnbWFpbC5jb20ifSwiaWF0IjoxNzQ5OTA2MjE4fQ.iZdiAOVM2gLzDz8s_LPTohRdFLz1ysYvCWBVVblWU4k

//admin token
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6eyJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSJ9LCJpYXQiOjE3NDk5MDYzNjB9.SJGp9bBgMu3PFc6KLbETOFNG5czJjj0XHPNnYljiJks

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
