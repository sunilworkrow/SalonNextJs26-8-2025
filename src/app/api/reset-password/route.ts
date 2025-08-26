// app/api/reset-password/route.ts
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { db } from '@/app/lib/db';
import { RowDataPacket } from "mysql2";

export async function POST(req: Request) {
  try {
    const { email, token, newPassword } = await req.json();

    if (!email || !token || !newPassword) {
      return NextResponse.json({ success: false, message: 'All fields are required' }, { status: 400 });
    }

    const [userResult]: [RowDataPacket[], unknown] = await (await db).query(
      'SELECT * FROM signup WHERE email = ? AND reset_token = ? AND reset_token_expiry > NOW()',
      [email, token]
    );

    if (userResult.length === 0) {
      return NextResponse.json({ success: false, message: 'Invalid or expired token' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await (await db).query(
      'UPDATE signup SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE email = ?',
      [hashedPassword, email]
    );

    return NextResponse.json({ success: true, message: 'Password reset successful' });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, message: (error as Error).message }, { status: 500 });
  }
}
