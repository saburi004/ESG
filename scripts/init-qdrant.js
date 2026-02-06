const { QdrantClient } = require('@qdrant/js-client-rest');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const qdrant = new QdrantClient({
    url: process.env.QDRANT_URL || 'http://localhost:6333',
    apiKey: process.env.QDRANT_API_KEY,
});

const COLLECTION_NAME = 'esg-documents';

const DOCUMENTS = [
    {
        id: 1,
        content: "Project Alpha-Gen is a high-performance LLM deployment using GPT-4. It handles heavy traffic loads and has a carbon intensity rating of B due to optimization.",
        metadata: { project: 'Alpha-Gen', type: 'overview' }
    },
    {
        id: 2,
        content: "Project Beta-Bot utilizes GPT-3 for medium traffic tasks. It is hosted in us-east-1 and has moderate energy consumption.",
        metadata: { project: 'Beta-Bot', type: 'overview' }
    },
    {
        id: 3,
        content: "Project Gamma-Lite is an experimental lightweight deployment using LLaMA-3 Small. It runs on renewable energy sources in eu-north-1, achieving an A rating.",
        metadata: { project: 'Gamma-Lite', type: 'overview' }
    },
    {
        id: 4,
        content: "Project Delta-Experimental uses Gemini for research purposes. Traffic is very low, resulting in negligible caron footprint.",
        metadata: { project: 'Delta-Experimental', type: 'overview' }
    }
];

// Simple mock embedding function since we might not have an embedding model set up in this script environment easily
// In a real app, use OpenAI/Cohere/HuggingFace embeddings
function mockEmbed(text) {
    // Create a random vector of dimension 384 (common small model size)
    return Array.from({ length: 384 }, () => Math.random());
}

async function init() {
    console.log(`Checking collection '${COLLECTION_NAME}'...`);

    try {
        const collections = await qdrant.getCollections();
        const exists = collections.collections.some(c => c.name === COLLECTION_NAME);

        if (exists) {
            console.log(`Collection '${COLLECTION_NAME}' already exists.`);
            // Optional: Re-create if force argument passed
            // await qdrant.deleteCollection(COLLECTION_NAME);
        } else {
            console.log(`Creating collection '${COLLECTION_NAME}'...`);
            await qdrant.createCollection(COLLECTION_NAME, {
                vectors: {
                    size: 384, // Matching our mock embedding size
                    distance: 'Cosine',
                },
            });
            console.log("Collection created.");
        }

        console.log("Seeding documents...");

        const points = DOCUMENTS.map(doc => ({
            id: doc.id,
            vector: mockEmbed(doc.content),
            payload: {
                content: doc.content,
                ...doc.metadata
            }
        }));

        await qdrant.upsert(COLLECTION_NAME, {
            wait: true,
            points: points
        });

        console.log(`✅ Successfully seeded ${points.length} documents.`);

    } catch (error) {
        console.error("❌ Failed to initialize Qdrant:", error);
    }
}

init();
