const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// Mock globals if needed for the service imports to work in standalone script
// (Next.js usually handles this, but for raw node script we might need to be careful with @/ alias)
// Actually, running this script locally might be hard due to alias resolution.
// Better to use fetch to call the API if the server is running.

const fetch = require('node-fetch'); // Needs node-fetch or native fetch in Node 18+

async function triggerSimulation() {
    console.log("Triggering Simulation via API...");
    try {
        const response = await fetch('http://localhost:3000/api/cron/traffic', {
            method: 'GET'
        });

        if (response.ok) {
            const json = await response.json();
            console.log("✅ Simulation Success:", json);
        } else {
            console.error("❌ Simulation Failed:", response.status, response.statusText);
            const text = await response.text();
            console.error("Response:", text);
        }
    } catch (e) {
        console.error("❌ Fetch Error:", e.message);
        console.log("Make sure 'npm run dev' is running on port 3000.");
    }
}

// Check RAG immediately after
async function checkRAG() {
    console.log("\nChecking RAG for recent data...");
    // We can use the rag service directly if we can import it? 
    // Or we can use the verify-fix logic to just search.

    // Let's rely on the API.
    // We'll ask a question about the recent data.

    const query = "What was the latest CO2 emission reported?";

    try {
        const response = await fetch('http://localhost:3000/api/ask', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: query })
        });

        const json = await response.json();
        console.log("Ask API Reply:", json.reply);

    } catch (e) {
        console.error("Ask API Error:", e.message);
    }
}

async function run() {
    await triggerSimulation();
    setTimeout(checkRAG, 5000); // Wait 5s for upsert to settle (Qdrant is fast but safe buffer)
}

run();
