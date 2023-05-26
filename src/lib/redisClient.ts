import { Redis } from "ioredis";
import { env } from "process";

const globalForRedis = global as unknown as { redisClient: Redis };

export const redisClient =
  globalForRedis.redisClient ??
  new Redis(env.REDIS_PATH ?? "", {
    username: env.REDIS_USERNAME,
    password: env.REDIS_PASSWORD,
  });

if (process.env.NODE_ENV !== "production") {
  globalForRedis.redisClient = redisClient;
}
