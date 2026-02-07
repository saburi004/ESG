import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';
// import qdrant from '@/lib/qdrant';
import { PROJECTS } from '@/utils/constants';
import { rateLimit } from '@/lib/rate-limit';

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
    try {
        if (!process.env.GROQ_API_KEY) {
            throw new Error('GROQ_API_KEY is missing');
        }

        // Rate Limiting
        const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
        const { success } = await rateLimit(ip);

        if (!success) {
            return NextResponse.json(
                { error: "Too many requests. Please wait a moment." },
                { status: 429 }
            );
        }

        const { message } = await req.json();

        // 1. Retrieve relevant context using RAG Service
        let context = "";
        try {
            // Import dynamically to avoid side-effects if needed
            const { ragService } = await import('@/services/rag');
            await ragService.init();

            const searchResults = await ragService.search(message, 3);

            if (searchResults.length > 0) {
                context = "Relevant Dashboard Context:\n" + searchResults.map(r => `- ${r.content}`).join("\n");
            } else {
                context = "No specific simulation data found yet. Answer based on general knowledge or assume defaults.";
                // Fallback to static context if RAG empty (first run)
                context += "\nStatic Project Config: " + JSON.stringify(PROJECTS);
            }

        } catch (ragErr) {
            console.error("RAG Search Error:", ragErr);
            context = "Context retrieval failed. Answer generally.";
            context += "\nStatic Project Config: " + JSON.stringify(PROJECTS);
        }

        // 2. LLM Call
        const stream = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `You are the EcoGenAI Assistant. User asks questions about the ESG dashboard.
          
          Use the following Retrieved Context to answer: 
          ${context}
          
          If the context contains timestamps and CO2 values, use them.
          If no specific data is found in context, explain that you are waiting for the traffic simulation to run.
          
          Keep answers concise, professional, and data-driven.
          `
                },
                { role: "user", content: message }
            ],
            model: "llama-3.3-70b-versatile",
            max_tokens: 300,
        });

        return NextResponse.json({ reply: stream.choices[0].message.content });

    } catch (error: any) {
        console.error("Chat Error:", error);
        return NextResponse.json({ error: error.message || 'Chat failed' }, { status: 500 });
    }
}
