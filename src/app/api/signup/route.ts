// app/api/signup/route.ts
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import db from '@/app/lib/db'

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: 'All fields are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const [existingUser]: any = await db.query('SELECT * FROM signup WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      return NextResponse.json(
        { success: false, message: 'User already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    await db.query('INSERT INTO signup (name, email, password) VALUES (?, ?, ?)', [
      name,
      email,
      hashedPassword,
    ]);

    return NextResponse.json({
      success: true,
      message: 'User registered successfully',
    });
  } 
  
  
  catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
