"use client";
import { useState, useEffect } from "react";
import { Plus, Trash2, Edit } from "lucide-react";

export default function TableManagementTab() {
    const [tables, setTables] = useState([]);
    const [tableName, setTableName] = useState("");
    const [editingId, setEditingId] = useState(null);

    const fetchTables = async () => {
        const res = await fetch("/api/tables");
        if (res.ok) setTables(await res.json());
    };

    useEffect(() => { fetchTables(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!tableName) return;

        const url = editingId ? `/api/tables/${editingId}` : "/api/tables";
        const method = editingId ? "PUT" : "POST";

        const res = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: tableName })
        });

        if (res.ok) {
            setTableName("");
            setEditingId(null);
            fetchTables();
        }
    };

    const handleDelete = async (id) => {
        if (confirm("Are you sure you want to delete this table?")) {
            const res = await fetch(`/api/tables/${id}`, { method: "DELETE" });
            if (res.ok) fetchTables();
        }
    };

    return (
        <div className="p-6 bg-white text-black rounded-xl border border-gray-200 shadow-sm">
            <h2 className="text-xl font-bold mb-4">Restaurant Table Manager</h2>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="flex gap-3 mb-6 max-w-md">
                <input 
                    type="text" 
                    placeholder="e.g. Table 1, Table 2" 
                    value={tableName}
                    onChange={(e) => setTableName(e.target.value)}
                    className="border border-gray-300 rounded-lg p-2 flex-1 outline-none text-sm bg-gray-50 focus:bg-white"
                    required
                />
                <button type="submit" className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-1 cursor-pointer">
                    <Plus className="w-4 h-4" /> {editingId ? "Update" : "Add Table"}
                </button>
                {editingId && (
                    <button type="button" onClick={() => { setTableName(""); setEditingId(null); }} className="text-gray-500 text-sm">Cancel</button>
                )}
            </form>

            {/* Visual Grid Layout */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {tables.map((table) => (
                    <div 
                        key={table._id} 
                        className={`p-4 rounded-xl border flex flex-col justify-between h-32 transition shadow-sm relative ${
                            table.status === "Occupied" 
                                ? "bg-red-50 border-red-200 text-red-700" 
                                : "bg-green-50 border-green-200 text-green-700"
                        }`}
                    >
                        {/* Upper Badges */}
                        <div className="flex justify-between items-start">
                            <span className="font-extrabold text-lg">{table.name}</span>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                                table.status === "Occupied" ? "bg-red-200" : "bg-green-200"
                            }`}>{table.status}</span>
                        </div>

                        {/* Bottom Actions */}
                        <div className="flex justify-end gap-2 pt-2 border-t border-gray-100/40">
                            <button 
                                onClick={() => { setTableName(table.name); setEditingId(table._id); }}
                                className="p-1.5 hover:bg-black/5 rounded text-gray-600 cursor-pointer"
                                title="Rename Table"
                            >
                                <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button 
                                onClick={() => handleDelete(table._id)}
                                className="p-1.5 hover:bg-black/5 rounded text-rose-600 cursor-pointer"
                                title="Delete Table"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}