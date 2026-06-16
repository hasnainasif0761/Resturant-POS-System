import { connectDb } from "@/utils/db";
import { TableModal } from "@/models/Table";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await connectDb();
        const tables = await TableModal.find().sort({ name: 1 });
        return NextResponse.json(tables, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch tables" }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        await connectDb();
        const { name, status } = await req.json();
        if (!name) return NextResponse.json({ error: "Table name is required" }, { status: 400 });

        const newTable = await TableModal.create({ name, status });
        return NextResponse.json(newTable, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Table already exists or server error" }, { status: 500 });
    }
}