import { v4 as uuidv4 } from 'uuid';
export const redisCacheKey = (cacheKey = uuidv4()): string => {
  return `redis:cache:${cacheKey}`;
};
