import Redis from "ioredis";
import dotenv from "dotenv";
dotenv.config();
export const redisClient = new Redis.default(process.env.REDIS_URL);
