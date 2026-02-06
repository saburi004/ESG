import mongoose, { Schema, model, models } from 'mongoose';

const ConnectedProjectSchema = new Schema({
    userEmail: {
        type: String,
        required: true,
        index: true
    },
    projectName: {
        type: String,
        required: true
    },
    provider: {
        type: String,
        enum: ['groq', 'openai', 'azure-openai'],
        required: true
    },
    apiKey: {
        type: String,
        required: true,
        select: false // Never return API key in queries by default
    },
    isActive: {
        type: Boolean,
        default: true
    },
    lastSyncedAt: {
        type: Date,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    roomId: {
        type: String,
        index: true,
        default: null
    }
});

// Composite index to ensure unique project names per user
ConnectedProjectSchema.index({ userEmail: 1, projectName: 1 }, { unique: true });

const ConnectedProject = models.ConnectedProject || model('ConnectedProject', ConnectedProjectSchema);

export default ConnectedProject;
