"use client";
import { useState, useEffect } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";

export default function StaffManagementTab() {
    const [staffList, setStaffList] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    
    // Form States
    const [formData, setFormData] = useState({ name: "", role: "Waiter", phone: "", status: "Active" });

    const fetchStaff = async () => {
        const res = await fetch("/api/staff");
        if (res.ok) setStaffList(await res.json());
    };

    useEffect(() => { fetchStaff(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = editingId ? `/api/staff/${editingId}` : "/api/staff";
        const method = editingId ? "PUT" : "POST";

        const res = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        });

        if (res.ok) {
            setShowModal(false);
            setEditingId(null);
            setFormData({ name: "", role: "Waiter", phone: "", status: "Active" });
            fetchStaff();
        }
    };

    const handleEdit = (staff) => {
        setEditingId(staff._id);
        setFormData({ name: staff.name, role: staff.role, phone: staff.phone, status: staff.status });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (confirm("Are you sure you want to remove this staff member?")) {
            const res = await fetch(`/api/staff/${id}`, { method: "DELETE" });
            if (res.ok) fetchStaff();
        }
    };

    // Role ke mutabik badge styling helper function
    const getRoleBadge = (role) => {
        const styles = {
            Admin: "bg-purple-100 text-purple-700",
            Cashier: "bg-blue-100 text-blue-700",
            Waiter: "bg-amber-100 text-amber-700",
            Chef: "bg-emerald-100 text-emerald-700"
        };
        return styles[role] || "bg-gray-100 text-gray-700";
    };

    return (
        <div className="p-6 bg-white text-black min-h-screen">
            {/* Top Action Bar */}
            <div className="flex justify-between items-center mb-6">
                <button 
                    onClick={() => { setEditingId(null); setShowModal(true); }}
                    className="bg-pink-500 hover:bg-pink-600 text-white p-2.5 rounded-lg transition shadow-sm cursor-pointer"
                >
                    <Plus className="w-5 h-5" />
                </button>
                <div className="flex gap-2">
                    <select className="border border-gray-200 rounded-lg p-1.5 text-sm outline-none bg-gray-50">
                        <option>100</option>
                    </select>
                    <input type="text" placeholder="Search Staff..." className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none bg-gray-50 w-48" />
                </div>
            </div>

            {/* Staff Data Table */}
            <div className="overflow-x-auto rounded-lg border border-gray-100">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-100 text-gray-600 uppercase text-xs font-bold border-b border-gray-200">
                            <th className="py-3 px-4 w-16">SR#</th>
                            <th className="py-3 px-4">Staff Name</th>
                            <th className="py-3 px-4">Role</th>
                            <th className="py-3 px-4">Phone Number</th>
                            <th className="py-3 px-4">Status</th>
                            <th className="py-3 px-4 text-right w-24">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm text-gray-700 font-medium">
                        {staffList.length > 0 ? (
                            staffList.map((staff, index) => (
                                <tr key={staff._id} className="hover:bg-gray-50/60 transition">
                                    <td className="py-3.5 px-4 text-gray-400">{index + 1}</td>
                                    <td className="py-3.5 px-4 text-gray-900 font-semibold">{staff.name}</td>
                                    <td className="py-3.5 px-4">
                                        <span className={`px-2.5 py-1 rounded text-xs font-bold ${getRoleBadge(staff.role)}`}>
                                            {staff.role}
                                        </span>
                                    </td>
                                    <td className="py-3.5 px-4 text-gray-500">{staff.phone}</td>
                                    <td className="py-3.5 px-4">
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                                            staff.status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                        }`}>
                                            {staff.status}
                                        </span>
                                    </td>
                                    <td className="py-3.5 px-4 text-right">
                                        <div className="flex items-center justify-end gap-2.5">
                                            <button onClick={() => handleEdit(staff)} className="text-amber-500 hover:bg-amber-50 p-1 rounded cursor-pointer">
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => handleDelete(staff._id)} className="text-blue-500 hover:bg-blue-50 p-1 rounded cursor-pointer">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="py-8 text-center text-gray-400 font-normal">No staff members found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Add/Edit Popup Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white w-full max-w-md rounded-xl shadow-xl overflow-hidden border border-gray-100">
                        <div className="bg-slate-800 text-white px-6 py-4 flex items-center gap-2">
                            <span className="text-lg">📋</span>
                            <h3 className="font-bold text-base">{editingId ? "Edit Staff Details" : "Add New Staff"}</h3>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="text-xs font-bold text-gray-500 block mb-1">Name</label>
                                <input 
                                    type="text" 
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full border border-gray-200 rounded-lg p-2 text-sm outline-none focus:border-pink-500"
                                    placeholder="Enter full name"
                                    required 
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 block mb-1">Role</label>
                                <select 
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    className="w-full border border-gray-200 rounded-lg p-2 text-sm outline-none bg-gray-50"
                                >
                                    <option value="Waiter">Waiter</option>
                                    <option value="Cashier">Cashier</option>
                                    <option value="Chef">Chef</option>
                                    <option value="Admin">Admin</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 block mb-1">Phone Number</label>
                                <input 
                                    type="text" 
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full border border-gray-200 rounded-lg p-2 text-sm outline-none focus:border-pink-500"
                                    placeholder="e.g. 03001234567"
                                    required 
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 block mb-1">Status</label>
                                <select 
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    className="w-full border border-gray-200 rounded-lg p-2 text-sm outline-none bg-gray-50"
                                >
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                            </div>
                            <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                                <button 
                                    type="button" 
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 text-sm font-semibold border border-gray-200 rounded-full hover:bg-gray-50 cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="px-6 py-2 text-sm font-semibold bg-pink-500 hover:bg-pink-600 text-white rounded-full transition cursor-pointer"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}