import { NextResponse } from 'next/server';
import db from '@/app/lib/db';
import crypto from 'crypto';
const SibApiV3Sdk = require('@sendinblue/client'); // ✅ Correct for CommonJS

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ success: false, message: 'Email is required' }, { status: 400 });
    }

    const [userResult]: any = await db.query(
      'SELECT * FROM signup WHERE email = ?',
      [email]
    );

    if (userResult.length === 0) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    const tokenExpiry = new Date(Date.now() + 3600000); // 1 hour

    await db.query(
      'UPDATE signup SET reset_token = ?, reset_token_expiry = ? WHERE email = ?',
      [resetToken, tokenExpiry, email]
    );

    const resetLink = `http://localhost:3000/reset-password?token=${resetToken}&email=${email}`;
    console.log("Reset link:", resetLink);

    // ✅ Brevo email sending
    const brevoClient = new SibApiV3Sdk.TransactionalEmailsApi();
    brevoClient.setApiKey(
      SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey,
      process.env.BREVO_API_KEY
    );

    await brevoClient.sendTransacEmail({
      sender: {
        email: 'ksunil@workrow.io',
        name: 'workrow',
      },
      to: [{ email }],
      subject: 'Reset your password',
      htmlContent: `
        <h2>Password Reset</h2>
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>This link will expire in 1 hour.</p>
      `,
    });

    return NextResponse.json({
      success: true,
      message: 'Reset email sent successfully!',
    });

  } catch (error: any) {
    console.error("Forgot Password Error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
