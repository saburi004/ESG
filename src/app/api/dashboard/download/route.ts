import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import DashboardData from '@/models/DashboardData';
import { PROJECTS } from '@/utils/constants';

// Force dynamic to ensure no static optimization
export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        const userEmail = session?.user?.email;

        // Access Control
        if (userEmail !== 'saburinikam@gmail.com') {
            return new NextResponse('Unauthorized: Access Restricted to saburinikam@gmail.com', { status: 403 });
        }

        await dbConnect();

        // Fetch ALL data for this user sorted by time
        const data = await DashboardData.find({ userEmail }).sort({ timestamp: 1 }).lean();

        if (!data || data.length === 0) {
            return new NextResponse('No data found for this session.', { status: 404 });
        }

        // Generate CSV
        const rows = [];

        // Header
        const header = [
            "Timestamp",
            "Global CO2 (g)",
            "Global Energy (kWh)",
            "Global Tokens",
            "Global Requests",
            ...PROJECTS.flatMap(p => [
                `${p.name} CO2`,
                `${p.name} Energy`,
                `${p.name} Tokens`
            ])
        ];
        rows.push(header.join(","));

        // Data Rows
        data.forEach((entry: any) => {
            const row = [
                new Date(entry.timestamp).toISOString(),
                entry.global?.co2 || 0,
                entry.global?.energy || 0,
                entry.global?.tokens || 0,
                entry.global?.requests || 0,
            ];

            PROJECTS.forEach(p => {
                const pMetrics = entry.projects?.[p.name] || { co2: 0, energy: 0, tokens: 0 };
                row.push(pMetrics.co2 || 0);
                row.push(pMetrics.energy || 0);
                row.push(pMetrics.tokens || 0);
            });
            rows.push(row.join(","));
        });

        const csvContent = rows.join("\n");

        return new NextResponse(csvContent, {
            status: 200,
            headers: {
                'Content-Type': 'text/csv',
                'Content-Disposition': `attachment; filename="EcoGenAI_Full_Report_${new Date().toISOString().split('T')[0]}.csv"`,
            },
        });

    } catch (error) {
        console.error("Download Error:", error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
