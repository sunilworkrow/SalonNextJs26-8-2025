
import { db } from '@/app/lib/db'

import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const [rows] = await (await db).query('SELECT NOW() AS time');
    return NextResponse.json({ success: true, data: rows });
  } catch (err: unknown) {
    return NextResponse.json({ success: false, error: (err as Error).message }, { status: 500 });
  }
}

