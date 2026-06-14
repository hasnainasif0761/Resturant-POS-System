import { connectDb } from "@/utils/db";
import { CategoryModal } from "@/models/Category";
import { NextResponse } from "next/server";

// 📥 GET: Saari categories frontend ko bhejo
export async function GET() {
    try {
        await connectDb();
        const categories = await CategoryModal.find().sort({ createdAt: -1 });
        return NextResponse.json(categories, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
    }
}

// 📤 POST: Nayi category add karo
export async function POST(req) {
    try {
        await connectDb();
        const { name } = await req.json();
        if (!name) return NextResponse.json({ error: "Name is required" }, { status: 400 });

        const newCategory = await CategoryModal.create({ name });
        return NextResponse.json(newCategory, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Already exists or server error" }, { status: 500 });
    }
}