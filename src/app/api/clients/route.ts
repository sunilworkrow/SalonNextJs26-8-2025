import { NextResponse } from 'next/server';
import { db } from '@/app/lib/db';
import jwt from 'jsonwebtoken';
import { RowDataPacket } from 'mysql2';


interface JwtPayload {
    id: number;
    email: string;
    companyId: number;
}

export async function POST(req: Request) {
    try {

        const authHeader = req.headers.get('authorization');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

        const { name, email, phone, gender, services_id, staffs_id, branch_id, price } = await req.json();

        if (!name || !email || !phone || !gender || !services_id || !staffs_id || !branch_id || !price) {

            return NextResponse.json({ success: false, message: 'All fields are required' }, { status: 400 });
        }


        const user_id = decoded.id;
        const companies_id = decoded.companyId;


        const [existing]: [RowDataPacket[], unknown] = await (await db).query(
            'SELECT * FROM clients WHERE phone = ? AND companies_id = ?',
            [phone, companies_id]
        );

        if (existing.length > 0) {
            return NextResponse.json({ success: false, message: 'Client already exists' }, { status: 400 });
        }

        await (await db).query(
            'INSERT INTO clients (name, email, phone, gender, services_id, staffs_id, branch_id, price, user_id, companies_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [name, email, phone, gender, services_id, staffs_id, branch_id, price, user_id, companies_id]
        );

        return NextResponse.json({ success: true, message: 'Client created successfully' });
    } catch (error: unknown) {
        return NextResponse.json({ success: false, message: (error as Error).message }, { status: 500 });
    }
}


// get all cients

export async function GET(req: Request) {


    try {

        const authHeader = req.headers.get('authorization');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }



        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

        const companies_id = decoded.companyId;

        const [clients]: [RowDataPacket[], unknown] = await (await db).query(
            `SELECT  c.*,  b.name AS branch_name,  a.name AS service_name, s.name AS staffs_name FROM clients c JOIN branch b ON c.branch_id = b.id JOIN allservices a ON c.services_id = a.id
    JOIN signup s ON c.staffs_id = s.id
    WHERE c.companies_id = ?`,
            [companies_id]
        );



        return NextResponse.json({ success: true, data: clients });
    } catch (error: unknown) {
        return NextResponse.json({ success: false, message: (error as Error).message }, { status: 500 });
    }

}


// client delete 

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
            return NextResponse.json({ success: false, message: 'Client ID is required' }, { status: 400 });
        }

        const companies_id = decoded.companyId;


        const [existing]: [RowDataPacket[], unknown] = await (await db).query(
            'SELECT * FROM clients WHERE id = ? AND companies_id = ?',
            [id, companies_id]
        );

        if (existing.length === 0) {
            return NextResponse.json({ success: false, message: 'clients not found or not authorized' }, { status: 404 });
        }

        await (await db).query('DELETE FROM clients WHERE id = ? AND companies_id = ?', [id, companies_id]);

        return NextResponse.json({ success: true, message: 'clients deleted successfully' });


    } catch (error: unknown) {
        return NextResponse.json({ success: false, message: (error as Error).message }, { status: 500 });
    }


}