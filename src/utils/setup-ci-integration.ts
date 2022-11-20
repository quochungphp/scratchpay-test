import { HttpService } from '@nestjs/axios';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { AppModule } from '../app.module';
import { ErrorResponseTransformInterceptor } from './interceptors/error-response-transform.interceptor';
import { SuccessResponseTransformInterceptor } from './interceptors/success-response-transform.interceptor';
import { useContainer } from 'class-validator';
import { EnvConfig } from '../shared/configs/env.config';
import { ScratchpayApiService } from '../shared/services/apis/scratchpay-api.service';
import { RedisCacheService } from '../shared/services/redis/redis-cache.service';
export type SetupContinuousIntegrationTest = {
  envConfig: EnvConfig;
  httpService: HttpService;
  app: INestApplication;
  moduleFixture: TestingModule;
  redisCacheService: RedisCacheService;
  scratchpayApiService: ScratchpayApiService;
};

export async function setupContinuousIntegrationTest(): Promise<SetupContinuousIntegrationTest> {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();
  const httpService = moduleFixture.get<HttpService>(HttpService);
  const envConfig = moduleFixture.get<EnvConfig>(EnvConfig);

  const scratchpayApiService =
    moduleFixture.get<ScratchpayApiService>(ScratchpayApiService);

  const redisCacheService =
    moduleFixture.get<RedisCacheService>(RedisCacheService);
  const app = moduleFixture.createNestApplication();
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  app.use(new LoggerMiddleware().use);
  app.useGlobalInterceptors(
    new SuccessResponseTransformInterceptor(),
    new ErrorResponseTransformInterceptor(),
  );
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  await app.init();

  return {
    httpService,
    envConfig,
    app,
    moduleFixture,
    redisCacheService,
    scratchpayApiService,
  };
}
