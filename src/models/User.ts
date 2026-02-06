import mongoose, { Schema, model, models } from 'mongoose';

const UserSchema = new Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please fill a valid email address',
        ],
    },
    password: {
        type: String, // Hashed password
        required: [true, 'Password is required'],
        select: false, // Do not return password by default
    },
    name: {
        type: String,
        default: 'User',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    role: {
        type: String,
        enum: ['ADMIN', 'MEMBER'],
        default: 'MEMBER',
    },
    roomId: {
        type: String,
        index: true,
        default: null,
    },
});

const User = models.User || model('User', UserSchema);

export default User;
