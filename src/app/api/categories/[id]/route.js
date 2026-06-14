import { connectDb } from "@/utils/db";
import { CategoryModal } from "@/models/Category";
import { NextResponse } from "next/server";

// 📝 PUT: Category ka naam update karo
export async function PUT(req, { params }) {
    try {
        await connectDb();
        const { id } = params;
        const { name } = await req.json();

        const updated = await CategoryModal.findByIdAndUpdate(id, { name }, { new: true });
        return NextResponse.json(updated, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Update failed" }, { status: 500 });
    }
}

// ❌ DELETE: Category urado
export async function DELETE(req, { params }) {
    try {
        await connectDb();
        const { id } = params;
        await CategoryModal.findByIdAndDelete(id);
        return NextResponse.json({ message: "Deleted successfully" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Delete failed" }, { status: 500 });
    }
}