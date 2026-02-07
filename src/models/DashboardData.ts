import mongoose, { Schema, model, models } from 'mongoose';

const DashboardDataSchema = new Schema({
    userEmail: {
        type: String,
        required: true,
        index: true
    },
    timestamp: {
        type: Date,
        default: Date.now,
        required: true
    },
    projects: {
        type: Schema.Types.Mixed, // Map of project metrics
        default: {}
    },
    global: {
        type: Schema.Types.Mixed, // Global metrics
        default: {}
    },
    roomId: {
        type: String,
        index: true,
        default: null
    }
});

// TTL Index: Expire documents after 3 days (259200 seconds)
DashboardDataSchema.index({ timestamp: 1 }, { expireAfterSeconds: 259200 });

const DashboardData = models.DashboardData || model('DashboardData', DashboardDataSchema);

export default DashboardData;
