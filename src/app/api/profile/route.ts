import { NextResponse } from 'next/server';
import db from '@/app/lib/db';
import jwt from 'jsonwebtoken';

export async function PUT(req: Request) {
  try {
    // Get token from headers
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ success: false, message: 'Token missing or malformed' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!);
    } catch (err) {
      return NextResponse.json({ success: false, message: 'Invalid or expired token' }, { status: 403 });
    }

    // Get user data from token
    const userEmail = decoded.email;

    // Get body data
    const body = await req.json();
    const { name, lastName, dob, description, image } = body;

    if (!name || !lastName || !dob || !description || !image) {
      return NextResponse.json({ success: false, message: 'All fields are required' }, { status: 400 });
    }

    // Update profile in signup table
    await db.query(
      'UPDATE signup SET name = ?, lastName = ?, dob = ?, description = ?, image = ? WHERE email = ?',
      [name, lastName, dob, description, image, userEmail]
    );

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
