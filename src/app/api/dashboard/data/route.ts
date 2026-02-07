import { NextResponse } from 'next/server';

import { PROJECTS } from '@/utils/constants';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import DashboardData from '@/models/DashboardData';
import ConnectedProject from '@/models/ConnectedProject';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        const userEmail = session?.user?.email;

        if (!userEmail) {
            return NextResponse.json({
                global: { co2: 0, energy: 0, tokens: 0, requests: 0 },
                projects: {},
                history: []
            });
        }

        await dbConnect();

        // 1. Fetch User's Dashboard History (for charts)
        const mongoHistory = await DashboardData.find({ userEmail })
            .sort({ timestamp: 1 })
            .select('timestamp global.co2 global.tokens -_id')
            .lean();

        // Map Mongo data to chart format
        const history = mongoHistory.map((h: any) => ({
            ts: h.timestamp.getTime(),
            co2: h.global?.co2 || 0,
            tokens: h.global?.tokens || 0
        }));

        // 2. Determine Visible Projects
        let visibleProjects: string[] = [];
        const projectMetrics: Record<string, any> = {};

        // If Admin, include Static Projects
        if (userEmail === 'saburinikam@gmail.com') {
            PROJECTS.forEach(p => {
                visibleProjects.push(p.name);
                projectMetrics[p.name] = { co2: 0, energy: 0, tokens: 0, requests: 0 };
            });
        }

        // 3. Fetch Connected Projects (To ensure visibility even without history)
        const connectedProjs = await ConnectedProject.find({ userEmail, isActive: true }).lean();
        connectedProjs.forEach((p: any) => {
            visibleProjects.push(p.projectName);
            // Initialize with zero
            if (!projectMetrics[p.projectName]) {
                projectMetrics[p.projectName] = { co2: 0, energy: 0, tokens: 0, requests: 0 };
            }
        });

        // 4. Fetch Aggregated Metrics from DashboardData
        // We accumulate data into projectMetrics.

        const allData = await DashboardData.find({ userEmail }).lean();

        let totalGlobalRequests = 0; // Accumulate from global field for backward compatibility

        allData.forEach((d: any) => {
            // Sum global requests from the document (which TrafficGen always populated correctly)
            totalGlobalRequests += d.global?.requests || 0;

            if (d.projects) {
                Object.keys(d.projects).forEach(pKey => {
                    if (!projectMetrics[pKey]) {
                        projectMetrics[pKey] = { co2: 0, energy: 0, tokens: 0, requests: 0 };
                        // In case historical data found but project was deleted/inactive? 
                        // We still show it if it has data.
                        visibleProjects.push(pKey);
                    }
                    projectMetrics[pKey].co2 += d.projects[pKey].co2 || 0;
                    projectMetrics[pKey].energy += d.projects[pKey].energy || 0;
                    projectMetrics[pKey].tokens += d.projects[pKey].tokens || 0;
                    projectMetrics[pKey].requests = (projectMetrics[pKey].requests || 0) + (d.projects[pKey].requests || 0);
                });
            }
        });

        // 5. Calculate Global Totals
        // Use totalGlobalRequests for requests to ensure we capture historical data where project.requests was missing
        const aggregatedGlobal = {
            co2: Object.values(projectMetrics).reduce((a: any, b: any) => a + b.co2, 0),
            energy: Object.values(projectMetrics).reduce((a: any, b: any) => a + b.energy, 0),
            tokens: Object.values(projectMetrics).reduce((a: any, b: any) => a + b.tokens, 0),
            requests: totalGlobalRequests
        };

        return NextResponse.json({
            global: aggregatedGlobal,
            projects: projectMetrics,
            availableProjects: Array.from(new Set(visibleProjects)), // Unique list
            history: history
        });

    } catch (error) {
        console.error("Dashboard API Error:", error);
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
}
