import { INestApplication } from '@nestjs/common';
import { redisCacheKey } from '../../../../utils/generate-key';
import {
  SetupContinuousIntegrationTest,
  setupContinuousIntegrationTest,
} from '../../../../utils/setup-ci-integration';
describe('RedisCacheService', () => {
  let app: INestApplication;
  let appContext: SetupContinuousIntegrationTest;

  beforeAll(async () => {
    appContext = await setupContinuousIntegrationTest();
    app = appContext.app;
  });

  afterAll(async () => {
    await appContext.redisCacheService.flushAll();
    await appContext.redisCacheService.quit();
    await app.close();
  });

  beforeEach(async () => {
    jest.clearAllMocks();
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  describe('TEST redis cache mechanism', () => {
    it('should be return successful set cache and get cache success', async () => {
      const redis = appContext.redisCacheService;
      const cacheKey = redisCacheKey('test');
      redis.setItem(
        cacheKey,
        {
          contractAddress: '0x6d04f380d868bca04701283059155597c4c0ffd1',
          starkKey:
            '0x7c65c1e82e2e662f728b4fa42485e3a0a5d2f346baa9455e3e70682c2094ad1',
        },
        2000,
      );
      const cacheData = await redis.getItem(cacheKey);
      expect(cacheData).toMatchObject({
        contractAddress: '0x6d04f380d868bca04701283059155597c4c0ffd1',
        starkKey:
          '0x7c65c1e82e2e662f728b4fa42485e3a0a5d2f346baa9455e3e70682c2094ad1',
      });
    });
  });
});
