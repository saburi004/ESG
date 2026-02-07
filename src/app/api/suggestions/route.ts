import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { MODEL_ENERGY_ESTIMATES, REGIONS } from '@/utils/constants';
import { EmberService } from '@/services/ember';
import { rateLimit } from '@/lib/rate-limit';



export async function POST(req: Request) {
    try {
        const apiKey = process.env.GROQ_API_KEY_SUGGESTIONS || process.env.GROQ_API_KEY;
        if (!apiKey) {
            throw new Error('GROQ_API_KEY_SUGGESTIONS or GROQ_API_KEY is missing');
        }

        const groq = new Groq({
            apiKey: apiKey,
        });

        // Rate Limiting
        const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
        const { success } = await rateLimit(ip);

        if (!success) {
            return NextResponse.json(
                { error: "Too many requests. Please wait a moment." },
                { status: 429 }
            );
        }

        const { model, region, priority, requestsPerDay, gpu } = await req.json();

        // 1. Fetch Real-Time/Yearly Carbon Intensity from Ember
        let carbonIntensity = 475; // Default Global Avg
        const regionName = REGIONS.find(r => r.id === region)?.name || region;

        // Try Ember
        const emberValue = await EmberService.getCarbonIntensity(region);
        if (emberValue) {
            carbonIntensity = emberValue;
            console.log(`Using Ember Data for ${region}: ${emberValue} gCO2/kWh`);
        } else {
            // Fallback to constants
            const fallback = REGIONS.find(r => r.id === region)?.carbonIntensity;
            if (fallback) carbonIntensity = fallback;
        }

        const systemPrompt = `
      You are an expert AI Sustainability Consultant. 
      Analyze the user's setup and provide 3 concrete suggestions to reduce carbon footprint.
      
      User Setup:
      - Model: ${model}
      - Region: ${regionName} (Carbon Intensity: ${carbonIntensity} gCO2/kWh)
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
