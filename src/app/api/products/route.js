import { connectDb } from "@/utils/db";
import { ProductModal } from "@/models/Product";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await connectDb();
        const products = await ProductModal.find().populate('category').sort({ createdAt: -1 });
        return NextResponse.json(products, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message || "Product Fetching Failed" }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        await connectDb();
        const body = await req.json();
        const { name, category, barcode, isActive, image, variants } = body;

        if (!name || !category || !variants || variants.length === 0) {
            return NextResponse.json({ error: "Missing Required Fields" }, { status: 400 });
        }

        const newProduct = await ProductModal.create({
            name,
            category,
            barcode,
            isActive,
            image,
            variants
        });

        return NextResponse.json(newProduct, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error.message || "Server error creating product" }, { status: 500 });    
    }
}