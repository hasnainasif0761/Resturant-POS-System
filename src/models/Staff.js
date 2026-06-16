import mongoose from "mongoose";

const StaffSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    role: { 
        type: String, 
        required: true,
        enum: ["Admin", "Cashier", "Waiter", "Chef"] // Restaurant ke mutabik roles
    },
    phone: { 
        type: String, 
        required: true 
    },
    status: { 
        type: String, 
        enum: ["Active", "Inactive"], 
        default: "Active" 
    }
}, { timestamps: true });

export const StaffModal = mongoose.models.Staff || mongoose.model("Staff", StaffSchema);