import { connectDb } from "@/utils/db";
import { TableModal } from "@/models/Table";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
    try {
        await connectDb();
        const resolvedParams = await params;
        const id = resolvedParams.id;
        const body = await req.json();

        const updatedTable = await TableModal.findByIdAndUpdate(id, body, { returnDocument: 'after' });
        return NextResponse.json(updatedTable, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Update failed" }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    try {
        await connectDb();
        const resolvedParams = await params;
        const id = resolvedParams.id;

        await TableModal.findByIdAndDelete(id);
        return NextResponse.json({ message: "Table deleted" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Delete failed" }, { status: 500 });
    }
}