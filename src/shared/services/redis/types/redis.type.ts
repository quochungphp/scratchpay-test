import { promisify } from 'util';
import redis from 'redis';

const SECONDS = 5;
export const REDIS_CACHE_10_SECONDS = 10;
export const REDIS_CACHE_15_SECONDS = 15;
export const REDIS_CACHE_1_MINS = 60;
export const REDIS_CACHE_5_MINS = 5 * REDIS_CACHE_1_MINS;
export const REDIS_CACHE_15_MINS = 30 * SECONDS;
export const REDIS_CACHE_30_MINS = 60 * SECONDS;
export const REDIS_CACHE_1_HOURS = 120 * SECONDS;
export const REDIS_CACHE_1_DAY = 120 * SECONDS * 24;
export const REDIS_CACHE_7_DAYS = 7 * REDIS_CACHE_1_DAY;
export const REDIS_CACHE_15_DAYS = 15 * REDIS_CACHE_1_DAY;
export const REDIS_CACHE_1_MONTH = 30 * REDIS_CACHE_1_DAY;
export const REDIS_CACHE_NEVER_EXPIRED = 0;

export type PromisifyRedis = {
  hmset: (arguments_: [string, ...(string | number)[]]) => Promise<'OK'>;
  hgetall: (key: string) => Promise<Record<string, string> | null>;
  get: (key: string) => Promise<string | null>;
  hget: (key: string, field: string) => Promise<string | null>;
  hmget: (key: string, fields: string[]) => Promise<string[]>;
  set: (key: string, value: string) => Promise<unknown>;
  hset: (argument1: [string, ...string[]]) => Promise<unknown>;
  delete: (key: string | string[]) => Promise<unknown>;
  expire: (key: string, seconds: number) => Promise<unknown>;
  keys: (pattern: string) => Promise<string[] | null>;
  eval: <T>(...arguments_: [string, ...(string | number)[]]) => Promise<T>;
  flushall: () => Promise<void>;
  quit: () => Promise<void>;
};
/*
- Approach promisify allows you fix callback hell issue of nodejs
https://dev.to/gabrielrufino/converting-callbacks-to-promise-approach-on-node-js-2bn4
*/
export function promisifyRedis(redisClient: redis.RedisClient): PromisifyRedis {
  return {
    hmset: promisify(redisClient.hmset).bind(redisClient),
    hgetall: promisify(redisClient.hgetall).bind(redisClient),
    get: promisify(redisClient.get).bind(redisClient),
    hget: promisify(redisClient.hget).bind(redisClient),
    hmget: promisify(redisClient.hmget).bind(redisClient),
    set: promisify(redisClient.set).bind(redisClient),
    hset: promisify(redisClient.hset).bind(redisClient),
    delete: promisify(redisClient.del).bind(redisClient),
    expire: promisify(redisClient.expire).bind(redisClient),
    keys: promisify(redisClient.keys).bind(redisClient),
    eval: promisify(redisClient.eval).bind(redisClient),
    flushall: promisify(redisClient.flushall).bind(redisClient),
    quit: promisify(redisClient.quit).bind(redisClient),
  };
}
export type PromisifyHmset = <T>(
  ...arguments_: [string, ...(string | number)[]]
) => Promise<T>;

export type SoftExpiredItem<T> = {
  data: T;
  isUpdating: boolean;
  startTimeLive: number;
  secondToSoftLive: number;
  secondToLive: number;
};

export type CallbackFunction<T> = (...args: any[]) => Promise<T>;
