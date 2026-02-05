import { QdrantClient } from '@qdrant/js-client-rest';

// Ensure Qdrant is running: docker run -p 6333:6333 qdrant/qdrant
const qdrant = new QdrantClient({
    url: process.env.QDRANT_URL || 'http://localhost:6333',
    apiKey: process.env.QDRANT_API_KEY, // Optional
});

export default qdrant;
