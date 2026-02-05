import { NextResponse } from 'next/server';
import redis from '@/lib/redis';
import { PROJECTS } from '@/utils/constants';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // console.log("Dashboard API: Fetching data...");
        const pipeline = redis.pipeline();

        // Get Global Metrics
        pipeline.hgetall('global:metrics');

        // Get Project Metrics
        for (const p of PROJECTS) {
            pipeline.hgetall(`project:${p.id}:metrics`);
        }

        // Get History (Global)
        pipeline.lrange(`history:global`, 0, 50);

        const results = await pipeline.exec();
        // console.log("Dashboard API: Pipeline results length:", results.length);

        // Parse Pipeline Results
        // Result 0: Global
        const global: any = results[0];

        // Results 1 to N: Projects
        const projectMetrics: Record<string, any> = {};
        PROJECTS.forEach((p, i) => {
            projectMetrics[p.name] = results[1 + i] || { co2: 0, energy: 0, tokens: 0 };
        });

        // Result N+1: History
        const history = results[results.length - 1]; // Last item

        return NextResponse.json({
            global: global || { co2: 0, energy: 0, tokens: 0, requests: 0 },
            projects: projectMetrics,
            history: history || []
        });
    } catch (error) {
        console.error("Dashboard API Error:", error);
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
}
