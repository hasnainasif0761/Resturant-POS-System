import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb"; // Aapka database connection helper
import Order from "@/models/Order";     // Aapka Order Model path

export async function PUT(request, { params }) {
    try {
        await connectDB();
        
        // URL se Order ID nikalna
        const { id } = params; 
        
        // Frontend se bheja hua data parsee karna ({ paymentStatus: "paid" })
        const body = await request.json(); 
        
        // ✨ FIX: Database mein order ko find karke poori body ke sath update karna
        const updatedOrder = await Order.findByIdAndUpdate(
            id, 
            { $set: body }, // Yeh automatic status ya paymentStatus jo bhi aayega update kar dega
            { new: true, runValidators: true }
        );

        if (!updatedOrder) {
            return NextResponse.json({ error: "Order nahi mila" }, { status: 404 });
        }

        return NextResponse.json({ success: true, order: updatedOrder }, { status: 200 });

    } catch (error) {
        console.error("Backend Update Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}