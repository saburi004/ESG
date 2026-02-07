import Redis from 'ioredis';

declare global {
    var redis: any | undefined;
}

const getRedisClient = (): any => {
    if (global.redis) {
        return global.redis;
    }

    let redisClient;

    if (process.env.REDIS_URL) {
        console.log("Redis Factory: Connecting to Local Redis (ENV)...");
        redisClient = new Redis(process.env.REDIS_URL);
    } else {
        // FallbackDefault to localhost:6380
        console.log("Redis Factory: Connecting to Local Redis (Default)...");
        const connectionString = 'redis://localhost:6380';
        redisClient = new Redis(connectionString);
    }

    if (process.env.NODE_ENV !== 'production') {
        global.redis = redisClient;
    }

    return redisClient;
}

export default getRedisClient;
