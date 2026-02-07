import { QdrantClient } from '@qdrant/js-client-rest';

// Ensure Qdrant is running: docker run -p 6333:6333 qdrant/qdrant
let url = process.env.QDRANT_URL || 'http://localhost:6333';
// Fix: If running locally (dev) and URL is 'http://qdrant:6333' (docker internal),
// fallback to localhost so the app works from host machine.
// We check if we are NOT running in docker (basic check) or just force it for dev.
// Also, checking for just "qdrant" hostname in case.
if (url.includes('//qdrant')) {
    console.log("Qdrant Factory: Rewriting 'qdrant' host to 'localhost' for local access.");
    url = url.replace('//qdrant', '//localhost');
}
const qdrant = new QdrantClient({
    url: url,
    apiKey: process.env.QDRANT_API_KEY, // Optional
});

export default qdrant;
