import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { ErrorFilter } from 'src/common/error.filter';
import { Logger } from 'winston';
import { TestService } from './test.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { TestModule } from './test.module';

describe('ContactController', () => {
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

  describe("POST /api/contacts", () => {
    beforeEach(async () => {
      await testService.deleteContact();
      await testService.deleteUser();

      await testService.createUser();
    });

    it("should be rejected if request is invalid", async () => {
      const response = await request(app.getHttpServer())
        .post('/api/contacts')
        .set('authorization', 'test')
        .send({
          first_name: '',
          last_name: '',
          email: 'wrong',
          phone: ''
        });

      logger.info(response.body);


      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it("should be able to input contact", async () => {
      const response = await request(app.getHttpServer())
        .post('/api/contacts')
        .set('authorization', 'test')
        .send({
          first_name: 'Sulatan',
          last_name: 'Romunao',
          email: 'rumono@gmail.com',
          phone: '6235511224512'
        })


      expect(response.status).toBe(200);
      expect(response.body.data.first_name).toBe('Sulatan');
      expect(response.body.data.last_name).toBe('Romunao');
      expect(response.body.data.email).toBe('rumono@gmail.com');
      expect(response.body.data.phone).toBe('6235511224512');
      expect(response.body.data.id).toBeDefined();
    });
  });

  describe("GET /api/contacts/:contactId", () => {
    beforeEach(async () => {
      await testService.deleteContact();
      await testService.deleteUser();

      await testService.createUser();
      await testService.createContact();
    });

    it("should be rejected if contact is not found", async () => {
      const contact = await testService.getContact();
      const response = await request(app.getHttpServer())
        .get(`/api/contacts/${contact.id + 1}`)
        .set('authorization', 'test');

      logger.info(response.body);


      expect(response.status).toBe(404);
      expect(response.body.errors).toBeDefined();
    });

    it("should be able to get contact where id is right", async () => {
      const contact = await testService.getContact();

      const response = await request(app.getHttpServer())
        .get(`/api/contacts/${contact.id}`)
        .set('authorization', 'test');
      console.log(contact, response);
      expect(response.status).toBe(200);
      expect(response.body.data.first_name).toBe('Agus');
      expect(response.body.data.last_name).toBe('Sutarom');
      expect(response.body.data.email).toBe('taroom@gmail.com');
      expect(response.body.data.phone).toBe('08123456789');
      expect(response.body.data.id).toBeDefined();
    });

    afterAll(async () => {
      await testService.deleteContact();
      await testService.deleteUser();
    });
  });
});
