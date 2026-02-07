import getQdrantClient from '@/lib/qdrant';


class RAGService {
    private static instance: RAGService;

    private collectionName = 'esg_analysis';
    private vectorSize = 384;

    private constructor() { }

    static getInstance(): RAGService {
        if (!RAGService.instance) {
            RAGService.instance = new RAGService();
        }
        return RAGService.instance;
    }

    async init() {
        // No local model initialization needed for API
        try {
            const collections = await getQdrantClient().getCollections();
            const exists = collections.collections.find(c => c.name === this.collectionName);

            if (!exists) {
                await getQdrantClient().createCollection(this.collectionName, {
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

    async getEmbedding(text: string): Promise<number[]> {
        const hfToken = process.env.HF_TOKEN;
        if (!hfToken) {
            console.error("RAG Service: HF_TOKEN not found in environment variables.");
            // Fallback random vector if no token (dev mode safety)
            return new Array(this.vectorSize).fill(0).map(() => Math.random());
        }

        try {
            const response = await fetch(
                "https://api-inference.huggingface.co/pipeline/feature-extraction/sentence-transformers/all-MiniLM-L6-v2",
                {
                    headers: {
                        Authorization: `Bearer ${hfToken}`,
                        "Content-Type": "application/json",
                    },
                    method: "POST",
                    body: JSON.stringify({ inputs: text, options: { wait_for_model: true } }),
                }
            );

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HF API Error: ${response.status} ${errorText}`);
            }

            const result = await response.json();
            // result is usually number[] (the embedding) for a single string input
            // But sometimes it might be enclosed if batched, though here we send one string.
            // The API returns (n_samples, n_features) for feature-extraction.
            // Since we send one string, valid response is number[]. 
            // However, sometimes it returns [number[]] (array of embeddings).

            if (Array.isArray(result)) {
                if (Array.isArray(result[0])) {
                    return result[0] as number[]; // Handle [[...]]
                }
                return result as number[]; // Handle [...]
            }

            throw new Error("Unexpected response format from HF API");

        } catch (e) {
            console.error("RAG Service: Embedding failed:", e);
            // Fallback random vector to avoid crashing flow
            return new Array(this.vectorSize).fill(0).map(() => Math.random());
        }
    }

    async getCollectionInfo() {
        try {
            const info = await getQdrantClient().getCollection(this.collectionName);
            return info;
        } catch (e) {
            console.error("RAG Service: Failed to get collection info:", e);
            return null;
        }
    }

    async upsertAnalysis(docId: string, text: string, metadata: any) {
        try {
            const vector = await this.getEmbedding(text);

            await getQdrantClient().upsert(this.collectionName, {
                wait: true,
                points: [
                    {
                        id: docId,
                        vector: vector,
                        payload: {
                            content: text,
                            ...metadata
                        }
                    }
                ]
            });
            console.log(`RAG Service: Upserted doc ${docId} (Length: ${text.length})`);
        } catch (e) {
            console.error("RAG Service: Upsert failed:", e);
        }
    }

    async search(query: string, limit: number = 3) {
        try {
            // Debug info
            // const info = await this.getCollectionInfo();
            // console.log(`RAG Service: Start Search. Collection Size: ${info?.points_count}`);

            const queryVector = await this.getEmbedding(query);

            const results = await getQdrantClient().search(this.collectionName, {
                vector: queryVector,
                limit: limit,
                with_payload: true
            });

            console.log(`RAG Service: Search found ${results.length} results.`);
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
