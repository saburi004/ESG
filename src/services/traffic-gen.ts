import { PROJECTS } from '@/utils/constants';
import redis from '@/lib/redis';
import { CarbonService } from './carbon';
import Groq from 'groq-sdk';

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY || 'gsk_dummy',
});

// Redis Keys:
// project:{id}:metrics -> HASH { tokens, requests, co2, energy }
// global:metrics -> HASH { tokens, requests, co2, energy }
// history:{project_id} -> LIST of timestamps (for charts - maybe TimeSeries better but staying simple)

export class TrafficSimulator {

    static async simulateTraffic() {
        const results = [];

        for (const project of PROJECTS) {
            // Determine if we should send a request based on usage profile probability
            const shouldRequest = this.shouldFireRequest(project.usage);

            if (shouldRequest) {
                // Mock token count (randomized)
                const inputTokens = Math.floor(Math.random() * 500) + 50;
                const outputTokens = Math.floor(Math.random() * 1000) + 100;
                const totalTokens = inputTokens + outputTokens;

                // Calculate impact (Assume Default Region for now)
                const { energykWh, co2Grams } = CarbonService.calculateImpact(project.model, totalTokens);

                // Store in Redis
                const pipeline = redis.pipeline();

                // Increment Project Metrics
                pipeline.hincrby(`project:${project.id}:metrics`, 'tokens', totalTokens);
                pipeline.hincrby(`project:${project.id}:metrics`, 'requests', 1);
                pipeline.hincrbyfloat(`project:${project.id}:metrics`, 'co2', co2Grams);
                pipeline.hincrbyfloat(`project:${project.id}:metrics`, 'energy', energykWh);

                // Increment Global Metrics
                pipeline.hincrby('global:metrics', 'tokens', totalTokens);
                pipeline.hincrby('global:metrics', 'requests', 1);
                pipeline.hincrbyfloat('global:metrics', 'co2', co2Grams);
                pipeline.hincrbyfloat('global:metrics', 'energy', energykWh);

                // Add history point (JSON string)
                const historyPoint = JSON.stringify({
                    ts: Date.now(),
                    tokens: totalTokens,
                    co2: co2Grams
                });
                pipeline.lpush(`history:${project.id}`, historyPoint);
                pipeline.ltrim(`history:${project.id}`, 0, 99);

                // Also push to Global History
                pipeline.lpush(`history:global`, historyPoint);
                pipeline.ltrim(`history:global`, 0, 99);

                const pipelineRes = await pipeline.exec();
                // console.log(`Traffic Gen: Pushed metrics for ${project.id}`, pipelineRes?.length);

                // Optional: Real Groq Call (if key exists and valid)
                // Ideally we don't *spam* the real API for dummy data to save limits, 
                // but prompt says "Randomly sends requests to Groq LLM".
                // We will make a LIGHT request if it's the specific "heavy" project to demonstrate.
                if (process.env.GROQ_API_KEY && project.id === 'project-a' && Math.random() > 0.8) {
                    try {
                        await groq.chat.completions.create({
                            messages: [{ role: "user", content: "Say hello" }],
                            model: "llama-3.3-70b-versatile", // Fast model
                        });
                    } catch (e) {
                        console.error("Groq Call Failed (Non-fatal):", e);
                    }
                }

                results.push({ project: project.name, tokens: totalTokens, co2: co2Grams.toFixed(2) });
            }
        }
        return results;
    }

    private static shouldFireRequest(usage: string): boolean {
        const rand = Math.random();
        switch (usage) {
            case 'heavy': return rand > 0.1; // 90% chance
            case 'medium': return rand > 0.5; // 50% chance
            case 'low': return rand > 0.8; // 20% chance
            case 'very-low': return rand > 0.95; // 5% chance
            default: return false;
        }
    }
}
