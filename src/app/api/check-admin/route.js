import { connectDb } from "@/utils/db";
import { UserModal } from "@/models/User";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        // 1. Database se connect karein
        await connectDb();
        
        // 2. await lagana LAZMI hai taaki database response ka wait ho
        const adminExist = await UserModal.findOne({ role: 'admin' });
        
        // 3. Response bhein
        return NextResponse.json({ hasAdmin: !!adminExist });
    } catch (error) {
        console.error("Backend Check Admin Error:", error);
        // 4. Agar crash ho toh HTML ke bajaye JSON error bhein
        return NextResponse.json(
            { hasAdmin: false, error: error.message },
            { status: 500 }
        );
    }
}