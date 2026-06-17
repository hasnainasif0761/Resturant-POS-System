import connectDb from "@/utils/db";
import Order from "@/models/Order";
import { NextResponse } from "next/server";

// 1. Get Orders (Kitchen & Bill List)
export async function GET(req) {
    try {
        await connectDb();
        const { searchParams } = new URL(req.url);
        const status = searchParams.get("status");

        let filter = {};
        if (status) filter.status = status;

        // Table aur Waiter details populate karne ke liye
        const orders = await Order.find(filter)
            .populate("table")
            .populate("waiter")
            .sort({ createdAt: -1 });

        return NextResponse.json(orders, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// 2. Place New Order
export async function POST(req) {
    try {
        await connectDb();
        const body = await req.json();

        const newOrder = new Order({
            orderType: body.orderType,
            customer: body.customer,
            table: body.table || null,
            waiter: body.waiter || null,
            items: body.items,
            totalAmount: body.totalAmount,
            status: "pending"
        });

        await newOrder.save();
        return NextResponse.json({ message: "Order placed successfully!", order: newOrder }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// 3. Update Status (Kitchen complete ya Bill payment ke liye)
export async function PUT(req) {
    try {
        await connectDb();
        const body = await req.json();
        const { orderId, nextStatus } = body;

        const updatedOrder = await Order.findByIdAndUpdate(
            orderId, 
            { status: nextStatus }, 
            { new: true }
        );

        return NextResponse.json({ message: "Status updated!", order: updatedOrder }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}