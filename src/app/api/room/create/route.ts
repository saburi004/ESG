import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Room from '@/models/Room';
import bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';

export async function POST(req: Request) {
    try {
        const { email, password, name } = await req.json();

        if (!email || !password) {
            return NextResponse.json(
                { message: 'Email and password are required' },
                { status: 400 }
            );
        }

        await dbConnect();

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { message: 'User already exists' },
                { status: 400 }
            );
        }

        // Generate a unique roomId (6 chars)
        let roomId;
        let isUnique = false;
        while (!isUnique) {
            roomId = randomBytes(3).toString('hex').toUpperCase(); // 6 chars
            const existingRoom = await Room.findOne({ roomId });
            if (!existingRoom) isUnique = true;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create Admin User
        const newUser = await User.create({
            email,
            password: hashedPassword,
            name: name || 'Admin',
            role: 'ADMIN',
            roomId,
        });

        // Create Room
        await Room.create({
            roomId,
            adminUserId: newUser._id,
        });

        return NextResponse.json(
            { message: 'Room created successfully', roomId },
            { status: 201 }
        );

    } catch (error: any) {
        console.error('Room creation error:', error);
        return NextResponse.json(
            { message: 'Internal server error', error: error.message },
            { status: 500 }
        );
    }
}
