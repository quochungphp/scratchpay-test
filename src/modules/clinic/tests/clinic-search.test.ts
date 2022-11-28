import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { EnvConfig } from '../../../shared/configs/env.config';
import {
  setupContinuousIntegrationTest,
  SetupContinuousIntegrationTest,
} from '../../../utils/setup-ci-integration';
describe('ClinicController', () => {
  let app: INestApplication;
  let appContext: SetupContinuousIntegrationTest;
  let envConfig: EnvConfig;
  const yesterday = new Date();
  const tomorrow = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  tomorrow.setDate(tomorrow.getDate() + 1);

  beforeAll(async () => {
    appContext = await setupContinuousIntegrationTest();
    app = appContext.app;
    envConfig = appContext.envConfig;
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    jest.clearAllMocks();
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  describe('GET /clinics', () => {
    it('should return clinics when user search by time', async () => {
      const response = await request(app.getHttpServer())
        .get(`/clinics`)
        .set('x-api-key', envConfig.xApiKey)
        .query({
          from: '15:00',
          to: '22:00',
        })
        .send();

      expect(response.body).toMatchObject({
        status: 'success',
        data: [
          {
            name: 'Good Health Home',
            stateName: 'Alaska',
            availability: { from: '10:00', to: '19:30' },
          },
          {
            name: 'Mayo Clinic',
            stateName: 'Florida',
            availability: { from: '09:00', to: '20:00' },
          },
          {
            name: 'Cleveland Clinic',
            stateName: 'New York',
            availability: { from: '11:00', to: '22:00' },
          },
          {
            name: 'Hopkins Hospital Baltimore',
            stateName: 'Florida',
            availability: { from: '07:00', to: '22:00' },
          },
          {
            name: 'Mount Sinai Hospital',
            stateName: 'California',
            availability: { from: '12:00', to: '22:00' },
          },
          {
            name: 'UAB Hospital',
            stateName: 'Alaska',
            availability: { from: '11:00', to: '22:00' },
          },
          {
            name: 'Swedish Medical Center',
            stateName: 'Arizona',
            availability: { from: '07:00', to: '20:00' },
          },
          {
            name: 'Good Health Home',
            stateName: 'FL',
            availability: { from: '15:00', to: '20:00' },
          },
          {
            name: 'National Veterinary Clinic',
            stateName: 'CA',
            availability: { from: '15:00', to: '22:30' },
          },
          {
            name: 'German Pets Clinics',
            stateName: 'KS',
            availability: { from: '08:00', to: '20:00' },
          },
          {
            name: 'City Vet Clinic',
            stateName: 'NV',
            availability: { from: '10:00', to: '22:00' },
          },
        ],
      });
    });

    it('should return unauthorized exception when user search without header key', async () => {
      const response = await request(app.getHttpServer())
        .get(`/clinics`)
        .query({
          from: '15:00',
          to: '22:00',
        })
        .send();
      expect(response.body).toMatchObject({
        status: 'error',
        errors: [
          {
            code: 401,
            title: 'Unauthorized',
            detail: 'The x-api-key not found',
            correlationId: expect.any(String),
            timestamp: expect.any(String),
            path: '/clinics?from=15%3A00&to=22%3A00',
          },
        ],
      });
    });
  });
});
