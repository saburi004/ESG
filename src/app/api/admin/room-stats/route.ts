import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import ConnectedProject from '@/models/ConnectedProject';
import DashboardData from '@/models/DashboardData';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { role, roomId } = session.user as any;

        if (role !== 'ADMIN' || !roomId) {
            return NextResponse.json({ message: 'Forbidden: Admin access required' }, { status: 403 });
        }

        await dbConnect();

        // 1. Get all members of the room
        const members = await User.find({ roomId }).select('name email role');
        const memberEmails = members.map((m) => m.email);

        // 2. Get all projects in the room (via User's email)
        // ConnectedProject has userEmail, but ConnectedProject also has roomId now.
        // We can query by roomId directly.
        const projects = await ConnectedProject.find({ roomId });

        // 3. Aggregate Usage Stats
        // We need the *latest* DashboardData for each user/project in the room.
        // DashboardData has roomId too.

        // Let's aggregate from DashboardData where roomId matches.
        // We want to sum up `global.totalCarbon` and `global.totalRequests` (assuming these fields exist, implied by context)
        // Or aggregate from `projects` map.

        // Since DashboardData is a snapshot, we should probably take the most recent one for each user?
        // OR, if DashboardData represents "current state", we just sum them up.
        // But DashboardData has a TTL and `timestamp`.

        // Strategy: Get the latest DashboardData document for EACH unique userEmail in this roomId.
        const latestDashboardData = await DashboardData.aggregate([
            { $match: { roomId: roomId } },
            { $sort: { timestamp: -1 } },
            {
                $group: {
                    _id: '$userEmail',
                    doc: { $first: '$$ROOT' }
                }
            },
            { $replaceRoot: { newRoot: '$doc' } }
        ]);

        let totalCarbon = 0;
        let totalAIUsage = 0;
        const modelBreakdown: Record<string, number> = {};

        latestDashboardData.forEach((data: any) => {
            // Aggregate Global Stats
            if (data.global) {
                totalCarbon += data.global.carbonFootprint || 0;
                totalAIUsage += data.global.totalTokens || 0; // Assuming tokens or requests
            }

            // Aggregate Model Breakdown (if available in projects)
            if (data.projects) {
                Object.values(data.projects).forEach((proj: any) => {
                    // logic to sum up models if structure allows
                    // For now, let's keep it simple.
                });
            }
        });

        return NextResponse.json({
            room: {
                roomId,
                totalUsers: members.length,
                totalProjects: projects.length,
            },
            aggregated: {
                carbonEmission: totalCarbon,
                aiUsage: totalAIUsage,
                projects: projects.length
            },
            members: members
        });

    } catch (error: any) {
        console.error('Room stats error:', error);
        return NextResponse.json(
            { message: 'Internal server error', error: error.message },
            { status: 500 }
        );
    }
}
