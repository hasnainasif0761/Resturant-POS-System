import { connectDb } from "@/utils/db";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

// Category Schema fallback ke sath taaki compile overwrite error na aaye
const categorySchema = new mongoose.Schema({
    name: { type: String, required: true }
}, { timestamps: true });

const CategoryModal = mongoose.models.Category || mongoose.model("Category", categorySchema);

export async function GET() {
    try {
        await connectDb();
        const categories = await CategoryModal.find().sort({ createdAt: -1 });
        return NextResponse.json(categories, { status: 200 });
    } catch (error) {
        // Kisi bhi crash par HTML ke bajaye JSON error bhejein
        return NextResponse.json({ error: error.message || "Categories fetch failed" }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        await connectDb();
        const { name } = await req.json();
        if (!name) return NextResponse.json({ error: "Name is required" }, { status: 400 });

        const newCategory = await CategoryModal.create({ name });
        return NextResponse.json(newCategory, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error.message || "Create failed" }, { status: 500 });
    }
}