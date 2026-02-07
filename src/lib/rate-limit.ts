import getRedisClient from './redis';

export async function rateLimit(identifier: string) {
    const key = `ratelimit:${identifier}`;
    const limitWindow = 3; // 3 seconds window
    const limit = 1; // 1 request per window

    try {
        const current = await getRedisClient().incr(key);
        if (current === 1) {
            await getRedisClient().expire(key, limitWindow);
        }

        return {
            success: current <= limit,
            limit,
            remaining: Math.max(0, limit - current),
        };
    } catch (error) {
        console.error('Rate limit error:', error);
        // Fail open if Redis is down
        return { success: true, limit, remaining: limit };
    }
}
