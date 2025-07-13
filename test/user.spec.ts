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

  describe("POST /api/users/login", () => {
    beforeEach(async () => {
      await testService.deleteUser();
      await testService.createUser();
    });

    it("should be rejected if request on login mode is invalid", async () => {
      const response = await request(app.getHttpServer())
        .post('/api/users/login')
        .send({
          "username": "",
          "password": "",
        })

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it("should be able to login", async () => {
      const response = await request(app.getHttpServer())
        .post('/api/users/login')
        .send({
          "username": "taroom",
          "password": "taroom"
        })

      expect(response.status).toBe(200);
      expect(response.body.data.username).toBe('taroom');
      expect(response.body.data.name).toBe('Agus Sutarom');
      expect(response.body.data.token).toBeDefined();
      // toBeDefined itu artinya yang penting ada data yang dikembalikan. apapun kembaliannya
    });
  });

  describe("GET /api/users/current", () => {
    beforeEach(async () => {
      await testService.deleteUser();
      await testService.createUser();
    });

    it("should be rejected if use wrong authorization token", async () => {
      const response = await request(app.getHttpServer())
        .get('/api/users/current')
        .set('authorization', 'salah');

      logger.info(response.body);

      expect(response.status).toBe(401);
      expect(response.body.errors).toBeDefined();
    });



    it("should be able to get user current with right authorization token", async () => {
      const response = await request(app.getHttpServer())
        .get('/api/users/current')
        .set('authorization', 'test');

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.username).toBe('taroom');
      expect(response.body.data.name).toBe('Agus Sutarom');
      // toBeDefined itu artinya yang penting ada data yang dikembalikan. apapun kembaliannya
    });
  });

  describe("PATCH /api/users/current", () => {
    beforeEach(async () => {
      await testService.deleteUser();
      await testService.createUser();
    });

    it("should be rejected if request update is invalid", async () => {
      const response = await request(app.getHttpServer())
        .patch('/api/users/current')
        .set("authorization", "test")
        .send({
          "password": "",
          "name": ""
        })

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it("should be able to update name", async () => {
      const response = await request(app.getHttpServer())
        .patch('/api/users/current')
        .set("authorization", "test")
        .send({
          "name": "Agus Sutarom Tested"
        });

      logger.info(response.body);


      expect(response.status).toBe(200);
      expect(response.body.data.name).toBe('Agus Sutarom Tested');
    });

    it("should be able to update password", async () => {
      let response = await request(app.getHttpServer())
        .patch('/api/users/current')
        .set("authorization", "test")
        .send({
          "password": "tester update"
        });
      logger.info(response.body);

      expect(response.status).toBe(200);

      response = await request(app.getHttpServer())
        .post('/api/users/login')
        .send({
          "username": "taroom",
          "password": "tester update"
        });

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.token).toBeDefined();
    });
  });

  describe("DELETE /api/users/current", () => {
    beforeEach(async () => {
      await testService.deleteUser();
      await testService.createUser();
    });

    it("should be rejected if use wrong authorization token", async () => {
      const response = await request(app.getHttpServer())
        .delete('/api/users/current')
        .set('authorization', 'salah');

      logger.info(response.body);

      expect(response.status).toBe(401);
      expect(response.body.errors).toBeDefined();
    });



    it("should be able to logout with right authorization token", async () => {
      const response = await request(app.getHttpServer())
        .delete('/api/users/current')
        .set('authorization', 'test');

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data).toBe(true);

      // check langsung di database apakah sudah benar token null
      const user = await testService.getUser();
      expect(user.token).toBeNull();
    });
  });
});
