"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Pencil, Trash2, X } from "lucide-react";

export default function CategoryTab() {
    // States
    const [categories, setCategories] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [categoryName, setCategoryName] = useState("");
    const [editingId, setEditingId] = useState(null); // Simple Check: null matlab Add mode, ID matlab Edit mode

    // 1. 🔄 Read: Database se categories load karo
    const fetchCategories = async () => {
        const res = await fetch("/api/categories");
        const data = await res.json();
        if (res.ok) setCategories(data);
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    // 2. 💾 Create & Update Logic
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (editingId) {
            // PUT Request (Update)
            const res = await fetch(`/api/categories/${editingId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: categoryName }),
            });
            if (res.ok) fetchCategories();
        } else {
            // POST Request (Create)
            const res = await fetch("/api/categories", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: categoryName }),
            });
            if (res.ok) fetchCategories();
        }

        // Reset and close
        setCategoryName("");
        setEditingId(null);
        setIsModalOpen(false);
    };

    // 3. 📝 Edit Trigger Setup
    const handleEditClick = (category) => {
        setEditingId(category._id);
        setCategoryName(category.name);
        setIsModalOpen(true); // Modal khulega par value fields pehle se filled hongi
    };

    // 4. ❌ Delete Logic
    const handleDelete = async (id) => {
        if (confirm("Are you sure you want to delete this category?")) {
            const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
            if (res.ok) fetchCategories();
        }
    };

    // 🔍 Search Filter Filteration
    const filteredCategories = categories.filter((cat) =>
        cat.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 text-black">
            
            {/* ─── TOP ACTION BAR (Plus, Entries count, Search) ─── */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                
                {/* Left Side: Add Button & Show Entries Dropdown */}
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => { setEditingId(null); setCategoryName(""); setIsModalOpen(true); }}
                        className="bg-pink-500 hover:bg-pink-600 text-white p-2.5 rounded-lg transition shadow-md cursor-pointer flex items-center justify-center"
                    >
                        <Plus className="w-6 h-6 stroke-[3]" />
                    </button>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                        <select className="border border-gray-300 rounded px-2 py-1 bg-gray-50 outline-none">
                            <option>100</option>
                            <option>50</option>
                            <option>25</option>
                        </select>
                    </div>
                </div>

                {/* Right Side: Search Box */}
                <div className="relative max-w-xs w-full">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                        <Search className="w-4 h-4" />
                    </span>
                    <input 
                        type="text" 
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm focus:bg-white focus:border-blue-500 outline-none transition"
                    />
                </div>
            </div>

            {/* ─── DATA TABLE GRID ─── */}
            <div className="overflow-x-auto rounded-lg border border-gray-100">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-100 text-gray-600 uppercase text-xs font-bold tracking-wider border-b border-gray-200">
                            <th className="py-3 px-4 w-20">SR#</th>
                            <th className="py-3 px-4">Category Name</th>
                            <th className="py-3 px-4 text-right w-32">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm font-medium text-gray-700">
                        {filteredCategories.length > 0 ? (
                            filteredCategories.map((cat, index) => (
                                <tr key={cat._id} className="hover:bg-gray-50/70 transition">
                                    <td className="py-3.5 px-4 text-gray-400">{index + 1}</td>
                                    <td className="py-3.5 px-4 font-semibold text-gray-800">{cat.name}</td>
                                    <td className="py-3.5 px-4 text-right">
                                        <div className="flex items-center justify-end gap-3">
                                            <button 
                                                onClick={() => handleEditClick(cat)}
                                                className="text-amber-500 hover:text-amber-600 p-1 rounded hover:bg-amber-50 transition cursor-pointer"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(cat._id)}
                                                className="text-blue-500 hover:text-blue-600 p-1 rounded hover:bg-blue-50 transition cursor-pointer"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="py-8 text-center text-gray-400 font-normal">
                                    No categories found. Click the pink '+' to add one!
                                bagai.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* ─── INLINE POPOVER MODAL (No redirection) ─── */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-[999]">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md border border-gray-200 overflow-hidden transform transition-all">
                        
                        {/* Modal Header */}
                        <div className="bg-gray-50 px-5 py-4 border-b border-gray-200 flex items-center justify-between">
                            <h3 className="font-bold text-gray-800 text-base">
                                {editingId ? "✏️ Edit Food Category" : "➕ Add New Category"}
                            </h3>
                            <button 
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600 cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Form Content */}
                        <form onSubmit={handleSubmit} className="p-5 space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-400 mb-1.5 tracking-wide">
                                    Category Name
                                </label>
                                <input 
                                    type="text" 
                                    required
                                    placeholder="e.g. Italian Pizza, Bar BQ"
                                    value={categoryName}
                                    onChange={(e) => setCategoryName(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-blue-500 outline-none bg-gray-50 focus:bg-white transition"
                                />
                            </div>

                            {/* Actions Buttons */}
                            <div className="flex justify-end gap-2 pt-2">
                                <button 
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-xs font-bold uppercase text-gray-500 bg-gray-100 rounded-lg hover:bg-gray-200 cursor-pointer transition"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    className="px-4 py-2 text-xs font-bold uppercase text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-md cursor-pointer transition"
                                >
                                    {editingId ? "Save Changes" : "Create"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
}