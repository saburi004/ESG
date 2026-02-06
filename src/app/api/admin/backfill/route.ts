import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import DashboardData from '@/models/DashboardData';
import { ragService } from '@/services/rag'; // Adjust import if needed
import { PROJECTS } from '@/utils/constants';

// Force dynamic
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        // Allow admin or default user to backfill
        const userEmail = session?.user?.email || 'saburinikam@gmail.com';

        if (!userEmail) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        await dbConnect();
        await ragService.init();

        // 1. Fetch all data for this user
        const allData = await DashboardData.find({ userEmail }).sort({ timestamp: -1 }).limit(50).lean(); // Limit 50 recent points

        let indexedCount = 0;

        for (const entry of allData) {
            const timestampStr = new Date(entry.timestamp).toLocaleString();

            // Reconstruct text chunks
            // A. Global Summary (Smaller Chunk)
            const globalText = `Simulation Record ${timestampStr}: Global CO2: ${(entry.global?.co2 || 0).toFixed(2)}g, Energy: ${(entry.global?.energy || 0).toFixed(6)}kWh.`;
            await ragService.upsertAnalysis(crypto.randomUUID(), globalText, {
                source: 'backfill',
                timestamp: entry.timestamp,
                type: 'global'
            });
            indexedCount++;

            // B. Project Details (Chunked by Project to reduce size)
            for (const p of PROJECTS) {
                const pm = entry.projects?.[p.name];
                if (pm && pm.tokens > 0) {
                    const projectText = `Simulation Record ${timestampStr}: Project "${p.name}" (${p.model}) emitted ${typeof pm.co2 === 'number' ? pm.co2.toFixed(2) : pm.co2}g CO2.`;
                    await ragService.upsertAnalysis(crypto.randomUUID(), projectText, {
                        source: 'backfill',
                        timestamp: entry.timestamp,
                        projectName: p.name
                    });
                    indexedCount++;
                }
            }
        }

        return NextResponse.json({
            message: `Backfill Complete. Indexed ${indexedCount} chunks from ${allData.length} records.`
        });

    } catch (e: any) {
        console.error("Backfill Error:", e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
