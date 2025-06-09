// app/api/forgot-password/route.ts
import { NextResponse } from 'next/server';
import db from '@/app/lib/db';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        {
          success: false, message: 'Email is required'
        }, {
        status: 400
      });
    }

    const [userResult]: any = await db.query('SELECT * FROM signup WHERE email = ?', [email]);

    if (userResult.length === 0) {
      return NextResponse.json(
        {
          success: false, message: 'User not found'
        }, {
        status: 404
      });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    const tokenExpiry = new Date(Date.now() + 3600000); // 1 hour

    await db.query('UPDATE signup SET reset_token = ?, reset_token_expiry = ? WHERE email = ?', [
      resetToken,
      tokenExpiry,
      email,
    ]);

    const resetLink = `http://localhost:3000/reset-password?token=${resetToken}&email=${email}`;

    return NextResponse.json({
      success: true,
      message: 'Reset link generated',
      resetLink, // Normally you'd send this via email
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
