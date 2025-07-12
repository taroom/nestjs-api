import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { ErrorFilter } from 'src/common/error.filter';
import { Logger } from 'winston';
import { TestService } from './test.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { TestModule } from './test.module';

describe('UserController', () => {
  let app: INestApplication;
  let logger: Logger;
  let testService: TestService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TestModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalFilters(app.get(ErrorFilter));
    await app.init();

    logger = app.get(WINSTON_MODULE_PROVIDER);
    testService = app.get(TestService);
  });

  describe("POST /api/users", () => {
    beforeEach(async () => {
      await testService.deleteUser();
    });

    it("should be rejected if request is invalid", async () => {
      const response = await request(app.getHttpServer())
        .post('/api/users')
        .send({
          "username": "",
          "password": "",
          "name": ""
        })


      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });



    it("should be able to register", async () => {
      const response = await request(app.getHttpServer())
        .post('/api/users')
        .send({
          "username": "taroom",
          "password": "tarooom",
          "name": "Agus Sutarom"
        })


      expect(response.status).toBe(200);
      expect(response.body.data.username).toBe('taroom');
      expect(response.body.data.name).toBe('Agus Sutarom');
    });


    it("should be reject cause already exist", async () => {
      await testService.createUser();
      const response = await request(app.getHttpServer())
        .post('/api/users')
        .send({
          "username": "taroom",
          "password": "tarooom",
          "name": "Agus Sutarom"
        })


      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });
  });
});
