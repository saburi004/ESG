import mongoose, { Schema, model, models } from 'mongoose';

const RoomSchema = new Schema({
    roomId: {
        type: String,
        required: [true, 'Room ID is required'],
        unique: true,
        index: true,
    },
    adminUserId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Room = models.Room || model('Room', RoomSchema);

export default Room;
