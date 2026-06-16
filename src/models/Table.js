import mongoose from "mongoose";

const TableSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true, 
        unique: true // Taaki Table 1 do baar add na ho sake
    },
    status: { 
        type: String, 
        enum: ["Available", "Occupied"], 
        default: "Available" 
    }
}, { timestamps: true });

export const TableModal = mongoose.models.Table || mongoose.model("Table", TableSchema);