import { NextResponse } from "next/server";
// 🔌 Named import connectDb direct standard custom path se
import { connectDb } from "@/utils/db"; 
// 🪑 Compiler ke mutabik file me sirf TableModal export ho raha hai
import { TableModal } from "@/models/Table"; 

export async function GET() {
    try {
        // 1. Database connection check
        if (typeof connectDb === "function") {
            await connectDb();
        } else {
            throw new Error("connectDb utility is not a valid function.");
        }

        // 2. Database query using the actual model name discovered by compiler
        const tables = await TableModal.find({}).sort({ number: 1, name: 1 });
        
        return NextResponse.json(tables, { status: 200 });
    } catch (error) {
        console.error("GET TABLES API ERROR:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}