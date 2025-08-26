
// app/api/staff/route.ts

import { NextResponse } from 'next/server';
import { db } from '@/app/lib/db';

import { RowDataPacket } from "mysql2";
import jwt from 'jsonwebtoken';

interface JwtPayload {
  companyId: any;
  id: number;
  email: string;
  companies_id: number;
}

export async function POST(res: Request) {

  try {

    const authHeader = res.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    const { name, email, role, phone, staff_join_date,  address } = await res.json()

    if (!name || !email || !role || !phone || !staff_join_date || !address) {

      return NextResponse.json({ success: false, message: "Staff info is required" }, { status: 400 });

    }

    const user_id = decoded.id;
    const companies_id = decoded.companyId;

    const [existing]: [RowDataPacket[], unknown] = await (await db).query(
      'SELECT * FROM signup WHERE email = ? AND role = ? AND companies_id = ?',
      [ email, role, companies_id]
    );



    if (existing.length > 0) {
      return NextResponse.json({ success: false, message: "Staff already exists" }, { status: 400 });
    }


    await (await db).query(
      'INSERT INTO signup (`name`, `email`, `role`, `phone` , `staff_join_date` , `address` , companies_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, email, role, phone, staff_join_date,  address, companies_id, ]
    );


    return NextResponse.json({ success: true, message: "Staff created successfully" });

  } catch (error) {
    return NextResponse.json({ success: false, message: (error as Error).message }, { status: 500 });
  }

}

export async function GET(req: Request) {

  try {

    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer")) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    const companies_id = decoded.companyId;

    const [rows]: [RowDataPacket[], unknown] = await (await db).query(
      'SELECT * FROM signup WHERE companies_id = ? AND role != "admin"',
      [companies_id]
    );

    return NextResponse.json({ success: true, data: rows });


  } catch (error: unknown) {
    return NextResponse.json({ success: false, message: (error as Error).message }, { status: 500 });
  }

}


export async function DELETE(req: Request) {

  try {

    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    const companies_id = decoded.companyId;

    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID is required" },
        { status: 400 }
      );
    }


    await (await db).query("DELETE FROM signup WHERE id = ? AND companies_id = ?", [id, companies_id]);

    return NextResponse.json({
      success: true,
      message: "staffs deleted successfully",
    });


  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, message: (error as Error).message },
      { status: 500 }
    );
  }


}





// PUT: Update category
export async function PUT(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    const { id,  name, email, role, phone, staff_join_date,  address } = await req.json()

    if (!id || !name || !email || !role || !phone || !staff_join_date || !address) {
      return NextResponse.json(
        { success: false, message: 'ID and Name are required' },
        { status: 400 }
      );
    }

    const user_id = decoded.id;
    const companies_id = decoded.companyId;

    const [existing]: [RowDataPacket[], unknown] = await (await db).query(
      'SELECT * FROM signup WHERE name = ? AND email = ? AND role = ? AND phone = ? AND address = ? AND staff_join_date = ? AND companies_id = ?',
      [name,  email, role, phone, staff_join_date,  address, companies_id]
    );

    
    if (existing.length > 0) {
      return NextResponse.json(
        { success: false, message: 'Another Staff with this name already exists' },
        { status: 400 }
      );
    }

 await (await db).query(
  `UPDATE signup 
   SET name = ?, email = ?, role = ?, phone = ?, address = ?, staff_join_date = ?, companies_id = ? 
   WHERE id = ?`,
  [name, email, role, phone, address, staff_join_date, companies_id, id]
);



    return NextResponse.json({
      success: true,
      message: 'Staff updated successfully',
    });

  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, message: (error as Error).message },
      { status: 500 }
    );
  }
}








