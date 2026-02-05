import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';
// import qdrant from '@/lib/qdrant';
import { PROJECTS } from '@/utils/constants';

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
    try {
        if (!process.env.GROQ_API_KEY) {
            throw new Error('GROQ_API_KEY is missing');
        }
        const { message } = await req.json();

        // 1. Retrieve relevant context (Simplified RAG - Just fetching formatted project data for now as "documents")
        // In a real RAG, we would embed the query and search Qdrant. 
        // Here, we'll feed project metadata directly since it's small context.

        const context = JSON.stringify(PROJECTS);

        // 2. LLM Call
        const stream = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `You are the EcoGenAI Assistant. User asks questions about the ESG dashboard.
          Use the following Project Config Context: ${context}
          
          If asked about energy or CO2, pretend you looked up the live metrics (simulated).
          - A is Heavy Usage (High CO2)
          - B is Medium
          - C is Low
          - D is Very Low (Greenest)
          
          Keep answers concise and professional.
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
