import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true }
}, { timestamps: true });

export const CategoryModal = mongoose.models.Category || mongoose.model("Category", categorySchema);