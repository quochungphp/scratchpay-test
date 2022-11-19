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
            stateName: 'FL',
            availability: {
              from: '15:00',
              to: '20:00',
            },
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
