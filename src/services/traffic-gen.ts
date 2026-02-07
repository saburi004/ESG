import { PROJECTS } from '@/utils/constants';
import redis from '@/lib/redis';
import { CarbonService } from './carbon';
import Groq from 'groq-sdk';
import dbConnect from '@/lib/db';
import DashboardData from '@/models/DashboardData';
import crypto from 'crypto';

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY || 'gsk_dummy',
});

// Redis Keys:
// project:{id}:metrics -> HASH { tokens, requests, co2, energy }
// global:metrics -> HASH { tokens, requests, co2, energy }
// history:{project_id} -> LIST of timestamps (for charts - maybe TimeSeries better but staying simple)

export class TrafficSimulator {

    static async simulateTraffic(userEmail?: string) { // Accepts optional userEmail
        const results = [];
        await dbConnect(); // Ensure DB connection

        const projectMetrics: Record<string, any> = {};
        let globalCo2 = 0;
        let globalEnergy = 0;
        let globalTokens = 0;
        let globalRequests = 0;

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

                // Store in Redis (System-wide metrics)
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

                // Add history point (Legacy Redis History - kept for fallback or global monitoring)
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

                await pipeline.exec();

                // Accumulate for MongoDB
                projectMetrics[project.name] = {
                    co2: co2Grams,
                    energy: energykWh,
                    tokens: totalTokens
                };
                globalCo2 += co2Grams;
                globalEnergy += energykWh;
                globalTokens += totalTokens;
                globalRequests += 1;

                results.push({ project: project.name, tokens: totalTokens, co2: co2Grams.toFixed(2) });
            }
        }

        // Save to MongoDB if userEmail is present and we generated something
        if (userEmail && results.length > 0) {
            try {
                // Consolidate this simulation run into one document
                // NOTE: In a real high-traffic app, we might buffer this. 
                // For this demo/hackathon, one document per simulation tick is fine given 12h TTL.
                await DashboardData.create({
                    userEmail,
                    timestamp: new Date(),
                    projects: projectMetrics,
                    global: {
                        co2: globalCo2,
                        energy: globalEnergy,
                        tokens: globalTokens,
                        requests: globalRequests
                    }
                });

                // RAG Integration: Upsert detailed text description into Qdrant
                try {
                    const { ragService } = await import('./rag');
                    // Ensure full init, including local model loading
                    await ragService.init();

                    // Create meaningful text chunks for RAG
                    // Use local time for clarity in RAG responses so user recognizes "now"
                    const timestampStr = new Date().toLocaleString();
                    const descriptions = [];

                    // 1. Global Summary
                    descriptions.push(`[Global Simulation Report] Timestamp: ${timestampStr}. Total CO2: ${globalCo2.toFixed(2)}g. Total Energy: ${globalEnergy.toFixed(6)}kWh. Total Tokens: ${globalTokens}. Total Requests: ${globalRequests}.`);

                    // 2. Project Summaries (CSV-like format included for structured search)
                    // CSV Header: Timestamp,Project,Model,Energy(kWh),CO2(g),Tokens
                    for (const p of PROJECTS) {
                        const m = projectMetrics[p.name];
                        if (m && m.tokens > 0) {
                            // Natural Language Description
                            const desc = `At ${timestampStr}, project "${p.name}" (Model: ${p.model}) consumed ${m.energy.toFixed(6)}kWh energy and emitted ${m.co2.toFixed(2)}g CO2 for ${m.tokens} tokens.`;

                            // CSV Format for data-centric retrieval
                            const csvLine = `CSV_DATA: ${timestampStr},${p.name},${p.model},${m.energy.toFixed(6)},${m.co2.toFixed(2)},${m.tokens}`;

                            descriptions.push(`${desc}\n${csvLine}`);
                        }
                    }

                    // Upsert each chunk
                    for (const desc of descriptions) {
                        const docId = crypto.randomUUID();
                        await ragService.upsertAnalysis(docId, desc, {
                            source: 'simulation',
                            userEmail,
                            timestamp: Date.now(),
                            type: 'traffic-report'
                        });
                    }
                    console.log(`Traffic Gen: Successfully upserted ${descriptions.length} records to RAG.`);

                    // Return enhanced result
                    return { results, ragSuccess: true, ragCount: descriptions.length };

                } catch (ragErr) {
                    console.error("Traffic Gen: RAG Upsert Error:", ragErr);
                    return { results, ragSuccess: false, ragError: String(ragErr) };
                }
            } catch (err) {
                console.error("Traffic Gen: Failed to save to MongoDB:", err);
                return { results, error: String(err) };
            }
        }

        return { results, ragSuccess: false, note: "No user email or no results" };
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
