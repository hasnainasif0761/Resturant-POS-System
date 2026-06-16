import { connectDb } from "@/utils/db";
import { StaffModal } from "@/models/Staff";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
    try {
        await connectDb();
        const resolvedParams = await params;
        const id = resolvedParams.id;
        const body = await req.json();

        const updatedStaff = await StaffModal.findByIdAndUpdate(id, body, { returnDocument: 'after' });
        return NextResponse.json(updatedStaff, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Update failed" }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    try {
        await connectDb();
        const resolvedParams = await params;
        const id = resolvedParams.id;

        await StaffModal.findByIdAndDelete(id);
        return NextResponse.json({ message: "Staff deleted" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Delete failed" }, { status: 500 });
    }
}