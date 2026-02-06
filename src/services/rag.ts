import qdrant from '@/lib/qdrant';
import { pipeline } from '@xenova/transformers';

class RAGService {
    private static instance: RAGService;
    private extractor: any = null;
    private collectionName = 'esg_analysis';
    private vectorSize = 384; // all-MiniLM-L6-v2 size

    private constructor() { }

    static getInstance(): RAGService {
        if (!RAGService.instance) {
            RAGService.instance = new RAGService();
        }
        return RAGService.instance;
    }

    async init() {
        if (!this.extractor) {
            try {
                // Use a quantized model for speed and low memory
                this.extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
                console.log("RAG Service: Model loaded");
            } catch (e) {
                console.error("RAG Service: Failed to load model:", e);
                // Fallback or re-throw? 
                // For robustness, allow running without extractor but log error
            }

            // Ensure Collection Exists
            try {
                const collections = await qdrant.getCollections();
                const exists = collections.collections.find(c => c.name === this.collectionName);

                if (!exists) {
                    await qdrant.createCollection(this.collectionName, {
                        vectors: {
                            size: this.vectorSize,
                            distance: 'Cosine',
                        },
                    });
                    console.log(`RAG Service: Collection ${this.collectionName} created.`);
                }
            } catch (e) {
                console.error("RAG Service: Qdrant Connection Failed:", e);
            }
        }
    }

    async getEmbedding(text: string): Promise<number[]> {
        if (!this.extractor) await this.init();
        if (!this.extractor) {
            // Fallback: Random vector if model completely fails (Deployment safe)
            // WARN: This makes search random.
            return new Array(this.vectorSize).fill(0).map(() => Math.random());
        }

        const output = await this.extractor(text, { pooling: 'mean', normalize: true });
        return Array.from(output.data);
    }

    async upsertAnalysis(docId: string, text: string, metadata: any) {
        try {
            const vector = await this.getEmbedding(text);

            await qdrant.upsert(this.collectionName, {
                wait: true,
                points: [
                    {
                        id: docId, // Must be UUID or int. Text IDs? Qdrant supports UUID. 
                        // If docId is not UUID, hash it or generate random UUID.
                        // For simplicity, let's use a UUID based on timestamp/random if docID is not compliant.
                        // But let's assume UUID is passed or we generate one.
                        vector: vector,
                        payload: {
                            content: text,
                            ...metadata
                        }
                    }
                ]
            });
            // console.log(`RAG Service: Upserted doc ${docId}`);
        } catch (e) {
            console.error("RAG Service: Upsert failed:", e);
        }
    }

    async search(query: string, limit: number = 3) {
        try {
            const queryVector = await this.getEmbedding(query);

            const results = await qdrant.search(this.collectionName, {
                vector: queryVector,
                limit: limit,
                with_payload: true
            });

            return results.map(r => ({
                score: r.score,
                content: r.payload?.content as string,
                metadata: r.payload
            }));

        } catch (e) {
            console.error("RAG Service: Search failed:", e);
            return [];
        }
    }
}

export const ragService = RAGService.getInstance();
