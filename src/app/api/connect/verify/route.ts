import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import ConnectedProject from '@/models/ConnectedProject';
import Groq from 'groq-sdk';

// Helper to verify OpenAI Key
async function verifyOpenAI(apiKey: string) {
    try {
        const res = await fetch('https://api.openai.com/v1/models', {
            headers: { Authorization: `Bearer ${apiKey}` },
        });
        return res.ok;
    } catch {
        return false;
    }
}

// Helper to verify Groq Key
async function verifyGroq(apiKey: string) {
    try {
        const groq = new Groq({ apiKey });
        await groq.models.list(); // Lightweight call
        return true;
    } catch {
        return false;
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        const userEmail = session?.user?.email;

        if (!userEmail) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const { provider, apiKey, projectName, dateRange } = await req.json();

        if (!provider || !apiKey || !projectName) {
            return new NextResponse('Missing required fields', { status: 400 });
        }

        // 1. Verify API Key
        let isValid = false;
        if (provider === 'groq') {
            isValid = await verifyGroq(apiKey);
        } else if (provider === 'openai') {
            isValid = await verifyOpenAI(apiKey);
        } else {
            return new NextResponse('Unsupported provider', { status: 400 });
        }

        if (!isValid) {
            return new NextResponse('Invalid API Key or Provider Connection Failed', { status: 400 });
        }

        await dbConnect();

        // 2. Save/Update Connected Project
        // Upsert based on user + projectName
        await ConnectedProject.findOneAndUpdate(
            { userEmail, projectName },
            {
                provider,
                apiKey, // In prod, encrypt this!
                isActive: true,
                updatedAt: new Date(),
                // Store dateRange preference here if needed in future
            },
            { upsert: true, new: true }
        );

        return NextResponse.json({ success: true, message: `Connected to ${provider} successfully.` });

    } catch (error: any) {
        console.error("Connect Verify Error:", error);
        return NextResponse.json({ error: error.message || 'Verification failed' }, { status: 500 });
    }
}
