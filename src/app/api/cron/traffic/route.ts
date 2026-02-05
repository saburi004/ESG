import { NextResponse } from 'next/server';
import { TrafficSimulator } from '@/services/traffic-gen';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const results = await TrafficSimulator.simulateTraffic();
        return NextResponse.json({
            message: 'Traffic Simulation Run',
            generated: results.length,
            details: results
        });
    } catch (error) {
        console.error("Simulation Error:", error);
        return NextResponse.json({ error: 'Simulation Failed' }, { status: 500 });
    }
}
