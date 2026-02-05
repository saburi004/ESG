import { Redis as UpstashRedis } from '@upstash/redis';
import Redis from 'ioredis';

// Type definition to unify basic commands if needed, 
// or we just export a variable that can be one or the other 
// and cast as 'any' in simple usage since we only use standard commands like hincrby, hgetall etc.

let redis: any;

// Prioritize Upstash (Cloud) for reliability if keys exist
if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_URL.includes("upstash")) {
    console.log("Redis Factory: Connecting to Upstash Redis...");
    redis = new UpstashRedis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
    });
} else if (process.env.REDIS_URL) {
    console.log("Redis Factory: Connecting to Local Redis (ENV)...");
    redis = new Redis(process.env.REDIS_URL);
} else {
    // FallbackDefault to localhost:6380
    console.log("Redis Factory: Connecting to Local Redis (Default)...");
    const connectionString = 'redis://localhost:6380';
    redis = new Redis(connectionString);
}

export default redis;
