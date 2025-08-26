import { NextResponse } from 'next/server';
import { db } from '@/app/lib/db';
import { RowDataPacket } from "mysql2";
import jwt from 'jsonwebtoken';

interface JwtPayload {
  companyId: number;
  id: number;
  email: string;
}

// ✅ POST: Add new category
export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    const { name } = await req.json();

    if (!name) {
      return NextResponse.json(
        { success: false, message: 'Name is required' },
        { status: 400 }
      );
    }

    const user_id = decoded.id;
    const companies_id = decoded.companyId;


    // console.log("category JWT:", decoded);

    const [existing]: [RowDataPacket[], unknown] = await (await db).query(
      'SELECT * FROM category WHERE name = ? AND companies_id = ?',
      [name, companies_id]
    );

    if (existing.length > 0) {
      return NextResponse.json(
        { success: false, message: 'Category already exists' },
        { status: 400 }
      );
    }

    await (await db).query(
      'INSERT INTO category (name, user_id, companies_id) VALUES (?, ?, ?)',
      [name, user_id, companies_id]
    );

    return NextResponse.json({
      success: true,
      message: 'Category created successfully',
    });

  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, message: (error as Error).message },
      { status: 500 }
    );
  }
}

// ✅ GET: Get all categories for logged-in user’s company
export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    const companies_id = decoded.companyId;

    const [rows]: [RowDataPacket[], unknown] = await (await db).query(
      `SELECT * FROM category WHERE companies_id = ?`,
      [companies_id]
    );

    return NextResponse.json({
      success: true,
      data: rows,
    });

  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, message: (error as Error).message },
      { status: 500 }
    );
  }
}

// ✅ PUT: Update category
export async function PUT(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    const { id, name } = await req.json();

    if (!id || !name) {
      return NextResponse.json(
        { success: false, message: 'ID and Name are required' },
        { status: 400 }
      );
    }

    const user_id = decoded.id;
    const companies_id = decoded.companyId;

    const [existing]: [RowDataPacket[], unknown] = await (await db).query(
      'SELECT * FROM category WHERE name = ? AND companies_id = ? AND id != ?',
      [name, companies_id, id]
    );

    if (existing.length > 0) {
      return NextResponse.json(
        { success: false, message: 'Another category with this name already exists' },
        { status: 400 }
      );
    }

    await (await db).query(
      'UPDATE category SET name = ?, user_id = ?, companies_id = ? WHERE id = ?',
      [name, user_id, companies_id, id]
    );

    return NextResponse.json({
      success: true,
      message: 'Category updated successfully',
    });

  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, message: (error as Error).message },
      { status: 500 }
    );
  }
}

// ✅ DELETE: Delete a category
export async function DELETE(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    const companies_id = decoded.companyId;

    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'ID is required' },
        { status: 400 }
      );
    }

    await (await db).query(
      'DELETE FROM category WHERE id = ? AND companies_id = ?',
      [id, companies_id]
    );

    return NextResponse.json({
      success: true,
      message: 'Category deleted successfully',
    });

  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, message: (error as Error).message },
      { status: 500 }
    );
  }
}
