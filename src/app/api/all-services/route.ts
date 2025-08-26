import { NextResponse } from 'next/server';
import { db } from '@/app/lib/db';
import jwt from 'jsonwebtoken';
import { RowDataPacket } from 'mysql2';


interface JwtPayload {
  id: number;
  email: string;
  companyId: number;
}

//  POST: Add new service
export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    const { name, category_id, branch_id, price } = await req.json();

    if (!name || !category_id || !branch_id || !price) {
      return NextResponse.json({ success: false, message: 'All fields are required' }, { status: 400 });
    }

    const user_id = decoded.id;
    const companies_id = decoded.companyId;

    const [existing]: [RowDataPacket[], unknown] = await (await db).query(
      'SELECT * FROM allservices WHERE name = ? AND companies_id = ?',
      [name, companies_id]
    );

    if (existing.length > 0) {
      return NextResponse.json({ success: false, message: 'Service already exists' }, { status: 400 });
    }

    await (await db).query(
      'INSERT INTO allservices (name, category_id, branch_id, price, user_id, companies_id) VALUES (?, ?, ?, ?, ?, ?)',
      [name, category_id, branch_id, price, user_id, companies_id]
    );

    return NextResponse.json({ success: true, message: 'Service created successfully' });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, message: (error as Error).message }, { status: 500 });
  }
}

// ✅ GET: Fetch all services
export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    const companies_id = decoded.companyId;

    

    const [services]: [RowDataPacket[], unknown] = await (await db).query(
      `SELECT s.*, b.name AS branch_name, c.name AS category_name
       FROM allservices s
       JOIN branch b ON s.branch_id = b.id
       JOIN category c ON s.category_id = c.id
       WHERE s.companies_id = ?`,
      [companies_id]
    );


    
    return NextResponse.json({ success: true, data: services });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, message: (error as Error).message }, { status: 500 });
  }
}

// ✅ DELETE: Delete service
export async function DELETE(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ success: false, message: 'Service ID is required' }, { status: 400 });
    }

    const companies_id = decoded.companyId;

    const [existing]: [RowDataPacket[], unknown] = await (await db).query(
      'SELECT * FROM allservices WHERE id = ? AND companies_id = ?',
      [id, companies_id]
    );

    if (existing.length === 0) {
      return NextResponse.json({ success: false, message: 'Service not found or not authorized' }, { status: 404 });
    }

    await (await db).query('DELETE FROM allservices WHERE id = ? AND companies_id = ?', [id, companies_id]);

    return NextResponse.json({ success: true, message: 'Service deleted successfully' });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, message: (error as Error).message }, { status: 500 });
  }
}
