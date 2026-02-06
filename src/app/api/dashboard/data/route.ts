import { NextResponse } from 'next/server';
import redis from '@/lib/redis';
import { PROJECTS } from '@/utils/constants';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import DashboardData from '@/models/DashboardData';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        const userEmail = session?.user?.email;

        // Access Control: Only saburinikam@gmail.com can see project data
        // Other users (or no session) see empty data
        if (userEmail !== 'saburinikam@gmail.com') {
            return NextResponse.json({
                global: { co2: 0, energy: 0, tokens: 0, requests: 0 },
                projects: {},
                history: []
            });
        }

        // Fetch History from MongoDB (Last 12 hours max, sorted by time)
        await dbConnect();
        const mongoHistory = await DashboardData.find({ userEmail })
            .sort({ timestamp: 1 }) // Oldest to Newest
            .select('timestamp global.co2 global.tokens -_id')
            .lean();

        // Map Mongo data to chart format
        const history = mongoHistory.map((h: any) => ({
            ts: h.timestamp.getTime(),
            co2: h.global?.co2 || 0,
            tokens: h.global?.tokens || 0
        }));

        // Get Real-time Globals (Mixed approach: Real-time from Redis for counters, History from Mongo)
        // Ideally we should aggregate Mongo, but for "live" feel we can keep Redis counters 
        // OR aggregate Mongo. Let's aggregate Mongo for "genuine stored analysis".
        // HOWEVER, aggregating might be slow.
        // Let's use Redis for the "Global Metrics" cards (fast counters) and Mongo for the "History" chart.
        // Actually, user said "dashboard analysis... should be store on mongo db... if other person logs in dashboard should be empty".
        // This implies the *whole* dashboard should reflect the user's data.

        // Let's fetch the latest metrics from Mongo (Snapshot) or keep Redis for performance?
        // User wants "visible only for login...". Redis is global. 
        // So we MUST use MongoDB aggregations or just the last record if we want true isolation.
        // But the counters are cumulative.
        // Let's stick to Redis for global counters (simulating a shared system view BUT restricted by user?)
        // Wait, "if other person logs in the dashboard should be empty". 
        // This implies the DATA is personal. 
        // So I should calculate totals from MongoDB for this user.

        // Aggregate totals for this user
        // Note: This might be heavy if many records. For hackathon/demo with TTL 12h it's fine.
        /* 
           Using Redis for the Counters is "System Status". 
           The prompt implies "My Dashboard".
           Let's fetch the Aggregated totals from Mongo.
        */

        // Simple aggregation or sum in code (since we fetched history but only selected fields previously)
        // Let's do a separate aggregation for totals
        const totals = await DashboardData.aggregate([
            { $match: { userEmail } },
            {
                $group: {
                    _id: null,
                    co2: { $sum: "$global.co2" },
                    energy: { $sum: "$global.energy" },
                    tokens: { $sum: "$global.tokens" },
                    requests: { $sum: "$global.requests" }
                }
            }
        ]);

        const aggregatedGlobal = totals[0] || { co2: 0, energy: 0, tokens: 0, requests: 0 };

        // We also need per-project breakdown for the Bar Chart
        // We can get the latest breakdown or aggregate. 
        // Aggregating per project:
        // We stored "projects" as a Map in Mongo. Aggregating dynamic keys is tricky.
        // We can just fetch all and reduce in JS (12h data is small enough).

        const allData = await DashboardData.find({ userEmail }).lean();
        const projectMetrics: Record<string, any> = {};

        allData.forEach((d: any) => {
            if (d.projects) {
                Object.keys(d.projects).forEach(pKey => {
                    if (!projectMetrics[pKey]) {
                        projectMetrics[pKey] = { co2: 0, energy: 0, tokens: 0 };
                    }
                    projectMetrics[pKey].co2 += d.projects[pKey].co2 || 0;
                    projectMetrics[pKey].energy += d.projects[pKey].energy || 0;
                    projectMetrics[pKey].tokens += d.projects[pKey].tokens || 0;
                });
            }
        });

        // Ensure all constants projects exist
        PROJECTS.forEach(p => {
            if (!projectMetrics[p.name]) {
                projectMetrics[p.name] = { co2: 0, energy: 0, tokens: 0 };
            }
        });

        return NextResponse.json({
            global: aggregatedGlobal,
            projects: projectMetrics,
            history: history // Already sorted
        });

    } catch (error) {
        console.error("Dashboard API Error:", error);
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
}
