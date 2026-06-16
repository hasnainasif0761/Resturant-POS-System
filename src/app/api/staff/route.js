import { connectDb } from "@/utils/db";
import { StaffModal } from "@/models/Staff";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await connectDb();
        const staff = await StaffModal.find().sort({ createdAt: -1 });
        return NextResponse.json(staff, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch staff" }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        await connectDb();
        const { name, role, phone, status } = await req.json();
        if (!name || !role || !phone) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const newStaff = await StaffModal.create({ name, role, phone, status });
        return NextResponse.json(newStaff, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to add staff" }, { status: 500 });
    }
}