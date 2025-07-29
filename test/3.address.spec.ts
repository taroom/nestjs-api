import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { ErrorFilter } from 'src/common/error.filter';
import { Logger } from 'winston';
import { TestService } from './test.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { TestModule } from './test.module';

describe('AddressController', () => {
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

  describe("POST /api/contacts/:contactId/addresses", () => {
    beforeEach(async () => {
      await testService.deleteAddress();
      await testService.deleteContact();
      await testService.deleteUser();

      await testService.createUser();
      await testService.createContact();
    });

    it("should be rejected if request is invalid", async () => {
      const contact = await testService.getContact();
      const response = await request(app.getHttpServer())
        .post(`/api/contacts/${contact.id}/addresses`)
        .set('authorization', 'test')
        .send({
          street: '',
          city: '',
          province: '',
          country: '',
          postal_code: ''
        });

      logger.info(response.body);


      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it("should be able to input address", async () => {
      const contact = await testService.getContact();
      const response = await request(app.getHttpServer())
        .post(`/api/contacts/${contact.id}/addresses`)
        .set('authorization', 'test')
        .send({
          street: 'Raya Merdeka',
          city: 'Tuban',
          province: 'Jawa Timur',
          country: 'Indonesia',
          postal_code: '62355'
        });

      logger.info('RESPONSE BODY');
      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.street).toBe('Raya Merdeka');
      expect(response.body.data.city).toBe('Tuban');
      expect(response.body.data.province).toBe('Jawa Timur');
      expect(response.body.data.country).toBe('Indonesia');
      expect(response.body.data.postal_code).toBe('62355');
      expect(response.body.data.id).toBeDefined();
    });

    afterAll(async () => {
      await testService.deleteAddress();
      await testService.deleteContact();
      await testService.deleteUser();
    });
  });

  describe("GET /api/contacts/:contactId/addresses/:addressId", () => {
    beforeEach(async () => {
      await testService.deleteAddress();
      await testService.deleteContact();
      await testService.deleteUser();

      await testService.createUser();
      await testService.createContact();
      await testService.createAddress();
    });

    it("should be rejected if contact is not found", async () => {
      const contact = await testService.getContact();
      const address = await testService.getAddress();

      const response = await request(app.getHttpServer())
        .get(`/api/contacts/${contact.id + 1}/addresses/${address.id}`)
        .set('authorization', 'test');

      logger.info(response.body);


      expect(response.status).toBe(404);
      expect(response.body.errors).toBeDefined();
    });

    it("should be rejected if address is not found", async () => {
      const contact = await testService.getContact();
      const address = await testService.getAddress();

      const response = await request(app.getHttpServer())
        .get(`/api/contacts/${contact.id}/addresses/${address.id + 1}`)
        .set('authorization', 'test');

      logger.info(response.body);


      expect(response.status).toBe(404);
      expect(response.body.errors).toBeDefined();
    });

    it("should be able to get address", async () => {
      const contact = await testService.getContact();
      const address = await testService.getAddress();
      const response = await request(app.getHttpServer())
        .get(`/api/contacts/${contact.id}/addresses/${address.id}`)
        .set('authorization', 'test');

      expect(response.status).toBe(200);
      expect(response.body.data.street).toBe('Raya Merdeka');
      expect(response.body.data.city).toBe('Tuban');
      expect(response.body.data.province).toBe('Jawa Timur');
      expect(response.body.data.country).toBe('Indonesia');
      expect(response.body.data.postal_code).toBe('62355');
      expect(response.body.data.id).toBeDefined();
    });

    afterAll(async () => {
      await testService.deleteAddress();
      await testService.deleteContact();
      await testService.deleteUser();
    });
  });

  describe("PUT /api/contacts/:contactId/addresses/:addressId", () => {
    beforeEach(async () => {
      await testService.deleteAddress();
      await testService.deleteContact();
      await testService.deleteUser();

      await testService.createUser();
      await testService.createContact();
      await testService.createAddress();
    });

    it("should be rejected if request is invalid", async () => {
      const contact = await testService.getContact();
      const address = await testService.getAddress();
      const response = await request(app.getHttpServer())
        .put(`/api/contacts/${contact.id}/addresses/${address.id}`)
        .set('authorization', 'test')
        .send({
          street: '',
          city: '',
          province: '',
          country: '',
          postal_code: ''
        });

      logger.info(response.body);


      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it("should be able to update address", async () => {
      const contact = await testService.getContact();
      const address = await testService.getAddress();
      const response = await request(app.getHttpServer())
        .put(`/api/contacts/${contact.id}/addresses/${address.id}`)
        .set('authorization', 'test')
        .send({
          street: 'Raya Merdeka',
          city: 'Tuban',
          province: 'Jawa Timur',
          country: 'Indonesia',
          postal_code: '62355'
        });

      logger.info('RESPONSE BODY');
      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.street).toBe('Raya Merdeka');
      expect(response.body.data.city).toBe('Tuban');
      expect(response.body.data.province).toBe('Jawa Timur');
      expect(response.body.data.country).toBe('Indonesia');
      expect(response.body.data.postal_code).toBe('62355');
      expect(response.body.data.id).toBeDefined();
    });

    it("should be rejected if contact is not found", async () => {
      const contact = await testService.getContact();
      const address = await testService.getAddress();
      const response = await request(app.getHttpServer())
        .put(`/api/contacts/${contact.id + 1}/addresses/${address.id}`)
        .set('authorization', 'test')
        .send({
          street: 'Raya Merdeka',
          city: 'Tuban',
          province: 'Jawa Timur',
          country: 'Indonesia',
          postal_code: '62355'
        }); // body di send harus valid karena di validasi dulu daripada pencarian contact

      logger.info(response.body);


      expect(response.status).toBe(404);
      expect(response.body.errors).toBeDefined();
    });

    it("should be rejected if address is not found", async () => {
      const contact = await testService.getContact();
      const address = await testService.getAddress();
      const response = await request(app.getHttpServer())
        .put(`/api/contacts/${contact.id}/addresses/${address.id + 1}`)
        .set('authorization', 'test')
        .send({
          street: 'Raya Merdeka',
          city: 'Tuban',
          province: 'Jawa Timur',
          country: 'Indonesia',
          postal_code: '62355'
        }); // body di send harus valid karena di validasi dulu daripada pencarian contact

      logger.info(response.body);


      expect(response.status).toBe(404);
      expect(response.body.errors).toBeDefined();
    });

    afterAll(async () => {
      await testService.deleteAddress();
      await testService.deleteContact();
      await testService.deleteUser();
    });
  });
});
