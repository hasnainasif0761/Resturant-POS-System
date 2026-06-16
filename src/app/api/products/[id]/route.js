import { connectDb } from "@/utils/db";
import { ProductModal } from "@/models/Product";
import { NextResponse } from "next/server";


export async function PUT(req, { params }) {
    try {
        await connectDb();
        const { id } = await params;
        const body = await req.json();

        const updatedProduct = await ProductModal.findByIdAndUpdate(id, body, { new: true });
        return NextResponse.json(updatedProduct, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Update product failed" }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    try {
        await connectDb();
        const { id } = await params;
        await ProductModal.findByIdAndDelete(id);
        return NextResponse.json({ message: "Product deleted" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Delete product failed" }, { status: 500 });
    }
}
