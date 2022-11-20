/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import * as redis from 'redis';
import { promisify } from 'util';
import { EnvConfig } from '../../configs/env.config';
import { PromisifyHmset } from './types/redis.type';

@Injectable()
export class RedisInstanceService {
  private redisInstance: redis.RedisClient;

  constructor(envConfig: EnvConfig) {
    const { redisHost, redisPort, redisPassword } = envConfig;
    this.redisInstance = redis.createClient({
      host: redisHost,
      port: redisPort,
      password: redisPassword,
    });
  }

  async promisifyEval<T>(
    ...arguments_: [string, ...(string | number)[]]
  ): Promise<any> {
    const promisifyEvalInstance: PromisifyHmset = promisify(
      this.redisInstance.eval,
    ).bind(this.redisInstance);
    return promisifyEvalInstance(...arguments_);
  }

  async flushAll(): Promise<void> {
    this.redisInstance.flushall();
  }
  getRedisInstance() {
    return this.redisInstance;
  }
}
