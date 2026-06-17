import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
    orderType: { type: String, enum: ["Dine In", "Take Away", "Delivery"], required: true },
    customer: {
        name: { type: String, default: "Walk-in Customer" },
        phone: { type: String },
        address: { type: String } // Sirf Delivery ke liye
    },
    table: { type: mongoose.Schema.Types.ObjectId, ref: "Table", default: null },
    waiter: { type: mongoose.Schema.Types.ObjectId, ref: "Staff", default: null },
    items: [{
        name: { type: String, required: true },
        variantTitle: { type: String },
        currentPrice: { type: Number, required: true },
        qty: { type: Number, required: true }
    }],
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: ["pending", "completed", "paid"], default: "pending" },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);