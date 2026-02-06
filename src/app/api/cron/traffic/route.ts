import { NextResponse } from 'next/server';
import { TrafficSimulator } from '@/services/traffic-gen';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        const userEmail = session?.user?.email;

        // If no user, we might mock a generic run or skip DB save
        // But for this use case, we simulate for the logged in user

        const results = await TrafficSimulator.simulateTraffic(userEmail || undefined);
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
