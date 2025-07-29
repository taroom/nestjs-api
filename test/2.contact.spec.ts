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

  describe('POST /api/contacts', () => {
    beforeEach(async () => {
      await testService.deleteContact();
      await testService.deleteUser();

      await testService.createUser();
    });

    it('should be rejected if request is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/contacts')
        .set('authorization', 'test')
        .send({
          first_name: '',
          last_name: '',
          email: 'wrong',
          phone: '',
        });

      logger.info(response.body);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('should be able to input contact', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/contacts')
        .set('authorization', 'test')
        .send({
          first_name: 'Sulatan',
          last_name: 'Romunao',
          email: 'rumono@gmail.com',
          phone: '6235511224512',
        });

      expect(response.status).toBe(200);
      expect(response.body.data.first_name).toBe('Sulatan');
      expect(response.body.data.last_name).toBe('Romunao');
      expect(response.body.data.email).toBe('rumono@gmail.com');
      expect(response.body.data.phone).toBe('6235511224512');
      expect(response.body.data.id).toBeDefined();
    });
  });

  describe('GET /api/contacts/:contactId', () => {
    beforeEach(async () => {
      await testService.deleteContact();
      await testService.deleteUser();

      await testService.createUser();
      await testService.createContact();
    });

    it('should be rejected if contact is not found', async () => {
      const contact = await testService.getContact();
      const response = await request(app.getHttpServer())
        .get(`/api/contacts/${contact.id + 1}`)
        .set('authorization', 'test');

      logger.info(response.body);

      expect(response.status).toBe(404);
      expect(response.body.errors).toBeDefined();
    });

    it('should be able to get contact where id is right', async () => {
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

  describe('PUT /api/contacts/:contactId', () => {
    beforeEach(async () => {
      await testService.deleteContact();
      await testService.deleteUser();

      await testService.createUser();
      await testService.createContact();
    });

    it('should be rejected if request is invalid', async () => {
      const contact = await testService.getContact();
      const response = await request(app.getHttpServer())
        .put(`/api/contacts/${contact.id}`)
        .set('authorization', 'test')
        .send({
          first_name: '',
          last_name: '',
          email: 'wrong',
          phone: '',
        });

      logger.info(response.body);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('should be rejected if contact not found', async () => {
      const contact = await testService.getContact();
      const response = await request(app.getHttpServer())
        .put(`/api/contacts/${contact.id + 1}`)
        .set('authorization', 'test')
        .send({
          first_name: 'd',
          last_name: 'd',
          email: 'wrong@gmail.com',
          phone: '6225555',
        });

      logger.info(response.body);

      expect(response.status).toBe(404);
      expect(response.body.errors).toBeDefined();
    });

    it('should be able to update contact', async () => {
      const contact = await testService.getContact();
      const response = await request(app.getHttpServer())
        .put(`/api/contacts/${contact.id}`)
        .set('authorization', 'test')
        .send({
          first_name: 'Sultan',
          last_name: 'Ramones',
          email: 'ramonezz@gmail.com',
          phone: '6288888888888',
        });

      expect(response.status).toBe(200);
      expect(response.body.data.first_name).toBe('Sultan');
      expect(response.body.data.last_name).toBe('Ramones');
      expect(response.body.data.email).toBe('ramonezz@gmail.com');
      expect(response.body.data.phone).toBe('6288888888888');
      expect(response.body.data.id).toBeDefined();
    });
  });

  describe('DELETE /api/contacts/:contactId', () => {
    beforeEach(async () => {
      await testService.deleteContact();
      await testService.deleteUser();

      await testService.createUser();
      await testService.createContact();
    });

    it('should be rejected if contact is not found', async () => {
      const contact = await testService.getContact();
      const response = await request(app.getHttpServer())
        .delete(`/api/contacts/${contact.id + 1}`)
        .set('authorization', 'test');

      logger.info(response.body);

      expect(response.status).toBe(404);
      expect(response.body.errors).toBeDefined();
    });

    it('should be able to get contact where id is right', async () => {
      const contact = await testService.getContact();

      const response = await request(app.getHttpServer())
        .delete(`/api/contacts/${contact.id}`)
        .set('authorization', 'test');

      expect(response.status).toBe(200);
      expect(response.body.data).toBe(true);
    });

    afterAll(async () => {
      await testService.deleteContact();
      await testService.deleteUser();
    });
  });

  describe('GET /api/contacts search activities', () => {
    beforeEach(async () => {
      await testService.deleteContact();
      await testService.deleteUser();

      await testService.createUser();
      await testService.createContact();
    });

    it('should be able to search contact even no query params', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/contacts`)
        .set('authorization', 'test');

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(1);
    });

    it('should be able to search contact with query params name no exist', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/contacts`)
        .set('authorization', 'test')
        .query({
          name: '$',
        });

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(0);
    });

    it('should be able to search contact with query params name exist', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/contacts`)
        .set('authorization', 'test')
        .query({
          name: 'gus',
        });

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(1);
    });

    it('should be able to search contact with query params email', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/contacts`)
        .set('authorization', 'test')
        .query({
          email: '@gmail.com',
        });

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(1);
    });

    it('should be able to search contact with query params email no exist', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/contacts`)
        .set('authorization', 'test')
        .query({
          email: '@gmailx.com',
        });

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(0);
    });

    it('should be able to search contact with query params phone', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/contacts`)
        .set('authorization', 'test')
        .query({
          phone: '789',
        });

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(1);
    });

    it('should be able to search contact with query params phone no exist', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/contacts`)
        .set('authorization', 'test')
        .query({
          phone: '788',
        });

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(0);
    });

    it('should be able to search contact with query params size over quota', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/contacts`)
        .set('authorization', 'test')
        .query({
          size: 1,
          page: 2,
        });

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(0);
      expect(response.body.paging.size).toBe(1);
      expect(response.body.paging.current_page).toBe(2);
      expect(response.body.paging.total_page).toBe(1);
    });

    afterAll(async () => {
      await testService.deleteContact();
      await testService.deleteUser();
    });
  });
});
