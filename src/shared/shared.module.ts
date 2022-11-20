import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EnvConfig } from './configs/env.config';
import { ScratchpayApiService } from './services/apis/scratchpay-api.service';
import { RedisCacheService } from './services/redis/redis-cache.service';
import { RedisInstanceService } from './services/redis/redis-instance.service';

const sharedServices = [
  HttpModule,
  ScratchpayApiService,
  RedisCacheService,
  RedisInstanceService,
  EnvConfig,
];
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
    }),
    HttpModule.register({}),
  ],
  exports: [...sharedServices],
  providers: [...sharedServices],
})
export class SharedModule {}
