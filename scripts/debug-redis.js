const Redis = require('ioredis');
require('dotenv').config({ path: '../.env' }); // Ensure path is correct or just stick to defaults if on root logic

async function checkData() {
    const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6380');

    console.log("Checking Redis Data...");

    try {
        const keys = await redis.keys('*');
        console.log("Keys found:", keys);

        const globalMetrics = await redis.hgetall('global:metrics');
        console.log("Global Metrics:", globalMetrics);

        const projectKeys = keys.filter(k => k.startsWith('project:'));
        for (const pk of projectKeys) {
            if (pk.endsWith(':metrics')) {
                const data = await redis.hgetall(pk);
                console.log(pk, data);
            }
        }

        // Check history
        const historyKeys = keys.filter(k => k.startsWith('history:'));
        for (const hk of historyKeys) {
            const list = await redis.lrange(hk, 0, 5);
            console.log(hk, "First 5 items:", list);
        }

    } catch (e) {
        console.error("Redis Error:", e);
    }

    redis.disconnect();
}

checkData();
