import { db } from '@/app/lib/db';
import { NextResponse } from 'next/server';
import { RowDataPacket } from "mysql2";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, userId, companyName, industry, address } = body;

    console.log("BODY:", body);

    if (!type || !userId) {
      return NextResponse.json(
        { success: false, message: 'Request must include type and userId' },
        { status: 400 }
      );
    }

    //  CHECK if company exists

    if (type === "check") {
      const [result]: [RowDataPacket[], unknown] = await (await db).query(
        "SELECT * FROM companies WHERE user_id = ?", [userId]
      );

      return NextResponse.json({ exists: result.length > 0 });
    }

    //  REGISTER a new company
    if (type === "register") {
      if (!companyName || !industry || !address) {
        return NextResponse.json(
          { success: false, message: "All fields are required for registration" },
          { status: 400 }
        );
      }

      const [result]: [RowDataPacket[], unknown] = await (await db).query(
        "INSERT INTO companies (user_id, company_name, industry, address) VALUES (?, ?, ?, ?)",
        [userId, companyName, industry, address]
      );



      //  console.log("companyId =", (result as RowDataPacket).insertId)


      const companyId = (result as RowDataPacket).insertId;

        console.log("myCompanyId myCompanyId", companyId);


      await (await db).query(
        "UPDATE signup SET companies_id = ? WHERE id = ?",
        [companyId, userId]
      );



      return NextResponse.json({
        success: true,
        message: "Company registered successfully",
        companies_id: (result as RowDataPacket).insertId, // ✅ now this will work
      });


    }

    //  Invalid type

    return NextResponse.json(
      { success: false, message: "Invalid request type" },
      { status: 400 }
    );

  }
  catch (error: unknown) {
    return NextResponse.json(
      { success: false, message: (error as Error).message },
      { status: 500 }
    );
  }
}
