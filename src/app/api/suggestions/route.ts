import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { MODEL_ENERGY_ESTIMATES } from '@/utils/constants';

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY_SUGGESTIONS || process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
    try {
        const apiKey = process.env.GROQ_API_KEY_SUGGESTIONS || process.env.GROQ_API_KEY;
        if (!apiKey) {
            throw new Error('GROQ_API_KEY_SUGGESTIONS or GROQ_API_KEY is missing');
        }
        const { model, region, priority, requestsPerDay, gpu } = await req.json();

        const systemPrompt = `
      You are an expert AI Sustainability Consultant. 
      Analyze the user's setup and provide 3 concrete suggestions to reduce carbon footprint.
      
      User Setup:
      - Model: ${model}
      - Region: ${region}
      - Priority: ${priority}
      - Avg Requests/Day: ${requestsPerDay}
      - HW: ${gpu}
      
      Reference Data:
      ${JSON.stringify(MODEL_ENERGY_ESTIMATES)}
      
      Output JSON format:
      {
        "suggestions": [
           { 
             "title": "Switch to Region X", 
             "description": "...", 
             "savings": "XX%",
             "tradeoff": "Latency +50ms"
           }
        ],
        "estimated_annual_co2_kgs": 123
      }
    `;

        const completion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: "You output strictly JSON." },
                { role: "user", content: systemPrompt }
            ],
            model: "llama-3.3-70b-versatile",
            response_format: { type: "json_object" },
        });

        const content = completion.choices[0].message.content;
        const json = JSON.parse(content || '{}');

        return NextResponse.json(json);
    } catch (error) {
        console.error("Suggestions Error:", error);
        return NextResponse.json({ error: 'Failed to generate suggestions' }, { status: 500 });
    }
}
