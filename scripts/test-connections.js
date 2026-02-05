const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const Groq = require('groq-sdk');
const Redis = require('ioredis');

async function testGroq() {
    console.log("Testing Groq...");
    try {
        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
        const completion = await groq.chat.completions.create({
            messages: [{ role: "user", content: "Ping" }],
            model: "llama-3.3-70b-versatile",
        });
        console.log("✅ Groq Success:", completion.choices[0].message.content);
    } catch (error) {
        console.error("❌ Groq Failed:", error.message);
    }
}

async function testRedisLocal() {
    console.log("Testing Local Redis...");
    try {
        const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6380');
        await redis.set('test_local', 'ok');
        const val = await redis.get('test_local');
        console.log("✅ Local Redis Success:", val);
        redis.disconnect();
    } catch (error) {
        console.error("❌ Local Redis Failed:", error.message);
    }
}

async function testUpstash() {
    console.log("Testing Upstash...");
    if (!process.env.UPSTASH_REDIS_REST_URL) {
        console.log("⚠️ Upstash not configured");
        return;
    }
    const { Redis: UpstashRedis } = require('@upstash/redis');
    try {
        const redis = new UpstashRedis({
            url: process.env.UPSTASH_REDIS_REST_URL,
            token: process.env.UPSTASH_REDIS_REST_TOKEN,
        });
        await redis.set('test_upstash', 'ok');
        const val = await redis.get('test_upstash');
        console.log("✅ Upstash Success:", val);
    } catch (error) {
        console.error("❌ Upstash Failed:", error.message);
    }
}

async function run() {
    await testGroq();
    await testRedisLocal();
    await testUpstash();
}

run();
