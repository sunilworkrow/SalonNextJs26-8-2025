// app/api/refresh/route.ts
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { db } from '@/app/lib/db';
import { RowDataPacket } from "mysql2";

const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET || 'refresh_dummy_key';
const ACCESS_TOKEN_SECRET = process.env.JWT_SECRET || 'access_dummy_key';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { refreshToken } = body;

        if (!refreshToken) {
            return NextResponse.json({ success: false, message: 'Refresh token is required' }, { status: 400 });
        }

        const [rows]: [RowDataPacket[], unknown] = await (await db).query(
            'SELECT * FROM signup WHERE refresh_token = ?', [refreshToken]
        );

        console.log("refreshToken => ", rows)


        if (rows.length === 0) {
            return NextResponse.json({ success: false, message: 'Invalid refresh token' }, { status: 403 });
        }

        let decoded;
        try {
            decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) as { id: number, email: string };
        } catch (err) {
            return NextResponse.json({ success: false, message: 'Invalid or expired token' }, { status: 403 });
        }

        const newAccessToken = jwt.sign(
            { id: decoded.id, email: decoded.email },
            ACCESS_TOKEN_SECRET,
            { expiresIn: '1h' }
        );

        return NextResponse.json({ success: true, accessToken: newAccessToken });

    } catch (error: unknown) {
        return NextResponse.json({ success: false, message: (error as Error).message }, { status: 500 });
    }
}
