import { Injectable, Inject, Logger } from '@nestjs/common';
import {
  CallbackFunction,
  PromisifyRedis,
  promisifyRedis,
  REDIS_CACHE_5_MINS,
  SoftExpiredItem,
} from './types/redis.type';
import { RedisInstanceService } from './redis-instance.service';

@Injectable()
export class RedisCacheService {
  private readonly redis: PromisifyRedis;

  private readonly logger = new Logger(RedisCacheService.name);

  constructor(
    @Inject(RedisInstanceService)
    private readonly redisInstanceService: RedisInstanceService,
  ) {
    this.redis = promisifyRedis(redisInstanceService.getRedisInstance());
  }

  async hasItem(key: string): Promise<boolean> {
    const value = await this.redis.get(key);
    return value !== null;
  }

  async getItem<T>(key: string): Promise<T | null> {
    const value = await this.redis.get(key);
    if (!value) {
      return null;
    }
    return JSON.parse(value);
  }

  async setItem<T>(key: string, value: T, secondToLive: number): Promise<void> {
    await this.redis.set(key, JSON.stringify(value));
    await this.redis.expire(key, secondToLive);
  }

  async setHardCacheItem<T>(
    key: string,
    func: CallbackFunction<T>,
    secondToLive: number,
  ): Promise<T> {
    const cacheData = await this.getItem(key);
    if (cacheData) {
      const data = <T>cacheData;
      data['useCached'] = true;
      return data;
    }
    const data = await func();
    await this.redis.set(key, JSON.stringify(data));
    await this.redis.expire(key, secondToLive);
    return data;
  }

  async deleteItems(key: string | string[]): Promise<void> {
    try {
      await this.redis.delete(key);
    } catch (error) {
      this.logger.error(
        {
          err: error,
          errorStack: error.stack,
        },
        'RedisCacheService.deleteItems failed',
      );
    }
  }

  async deleteItemsByPrefixKey(itemPrefix = ''): Promise<string[] | undefined> {
    const pattern = `${itemPrefix}*`;
    const keys = await this.redis.keys(pattern);

    if (!keys || !keys.length) {
      return;
    }

    try {
      await this.redis.delete(keys);
      return keys;
    } catch (error) {
      this.logger.error(
        {
          err: error,
          errorStack: error.stack,
        },
        'RedisCacheService.deleteItemsByPrefixKey fail',
      );
    }
  }
  async softGetOrSet<T>(
    key: string,
    func: CallbackFunction<T>,
    hardExpirationInSeconds: number,
    softExpirationInSeconds: number,
    afterReturnFunc?: () => void,
  ): Promise<T> {
    const existValue = await this.getItem<SoftExpiredItem<T>>(key);
    if (!existValue) {
      const newValue: T = await func();
      // no cache if data is empty
      const isSkip = this.skipCachedEmptyData(newValue);
      if (isSkip) {
        if (afterReturnFunc) {
          afterReturnFunc();
        }

        return newValue;
      }
      // async cache and return new value
      this.setItemWithSoftExpire<T>(
        key,
        newValue,
        hardExpirationInSeconds,
        softExpirationInSeconds,
      );
      this.logger.log(`Caching ${key}`);

      if (afterReturnFunc) {
        afterReturnFunc();
      }

      return newValue;
    }

    const msToSoftLive = existValue.secondToSoftLive * 100;
    const effectiveSoftTime =
      existValue.startTimeLive + msToSoftLive - Date.now() > 0;
    if (effectiveSoftTime) {
      this.logger.log(
        `RedisCacheService.softGetOrSet get ${key} from cache in effective soft expiration`,
      );
      if (existValue.data) {
        existValue.data['useCached'] = true;
      }

      if (afterReturnFunc) {
        afterReturnFunc();
      }
      return existValue.data;
    }

    // async update
    this.updateValueOfSoftExpiredItem(
      key,
      func,
      hardExpirationInSeconds,
      softExpirationInSeconds,
    );

    this.logger.log(`RedisCacheService.softGetOrSet get ${key} from cache`);

    if (afterReturnFunc) {
      afterReturnFunc();
    }
    return existValue.data;
  }

  async updateValueOfSoftExpiredItem<T>(
    key: string,
    func: CallbackFunction<T>,
    hardExpirationInSeconds: number,
    softExpirationInSeconds: number,
  ): Promise<void> {
    const existValue = await this.getItem<SoftExpiredItem<T>>(key);
    if (!existValue || existValue.isUpdating) {
      return;
    }

    // turn isUpdating to true
    const updatingValue = {
      ...existValue,
      isUpdating: true,
    };
    await this.setItem<SoftExpiredItem<T>>(
      key,
      updatingValue,
      hardExpirationInSeconds,
    );

    // resolve value then turn isUpdating to false
    setTimeout(() => {
      func(existValue.data).then((newData: T) =>
        this.setItemWithSoftExpire<T>(
          key,
          newData,
          hardExpirationInSeconds,
          softExpirationInSeconds,
        ),
      );
    }, 0);
  }

  async expiredSoftCacheWithKey<T>(key: string): Promise<void> {
    const existValue = await this.getItem<SoftExpiredItem<T>>(key);
    if (!existValue) {
      return;
    }

    await this.setItem(
      key,
      { ...existValue, startTimeLive: 0 },
      existValue.secondToLive,
    );
  }

  private async setItemWithSoftExpire<T>(
    key: string,
    value: T,
    secondToLive: number,
    secondToSoftLive: number = REDIS_CACHE_5_MINS,
  ): Promise<void> {
    const cacheDataWithSoftExpire: SoftExpiredItem<T> = {
      data: value,
      isUpdating: false,
      startTimeLive: Date.now(), // timestamp in milliseconds
      secondToSoftLive,
      secondToLive,
    };

    await this.setItem<SoftExpiredItem<T>>(
      key,
      cacheDataWithSoftExpire,
      secondToLive,
    );
  }

  async setItemByKeyAndField<T>(
    key: string,
    field: string,
    value: T,
  ): Promise<void> {
    await this.redis.hmset([key, field, JSON.stringify(value)]);
  }

  async hasItemByKeyAndField(key: string, field: string): Promise<boolean> {
    const value = await this.redis.hget(key, field);
    return value !== null;
  }

  async getItemByKeyAndField<T>(
    key: string,
    fields: string | string[],
  ): Promise<(T | null)[] | null> {
    if (typeof fields === 'string') {
      const value = await this.redis.hget(key, fields);
      if (!value) {
        return null;
      }

      return JSON.parse(value);
    }

    const values = await this.redis.hmget(key, fields);
    const results = values.map((value) => JSON.parse(value));

    return results;
  }
  // Clear all cache
  async flushAll(): Promise<void> {
    await this.redis.flushall();
  }

  async quit(): Promise<void> {
    await this.redis.quit();
  }

  private skipCachedEmptyData(data: any): boolean {
    try {
      // undefined or null
      if (!data) {
        return true;
      }

      // for string or array
      if (data.length === 0) {
        return true;
      }

      // for pagination
      if (data.items && data.items.length === 0) {
        return true;
      }
      // for object
      if (Object.keys(data).length === 0) {
        return true;
      }
    } catch (error) {
      this.logger.error(
        error,
        'RedisCacheService.validateEmptyData data is empty',
      );
      return true;
    }
    return false;
  }
}
