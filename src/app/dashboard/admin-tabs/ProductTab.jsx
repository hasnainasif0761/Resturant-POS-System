"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Pencil, Trash2, X } from "lucide-react";

export default function ProductTab() {
    // Core List States
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);

    // Form Inputs Fields States
    const [name, setName] = useState("");
    const [barcode, setBarcode] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [isActive, setIsActive] = useState(true);
    const [image, setImage] = useState(""); 
    
    // Variants Handler States
    const [variants, setVariants] = useState([]);
    const [vTitle, setVTitle] = useState("");
    const [vPrice, setVPrice] = useState("");

    const loadData = async () => {
        try {
            const prodRes = await fetch("/api/products");
            const prodData = await prodRes.json();
            if (prodRes.ok) setProducts(prodData);

            const catRes = await fetch("/api/categories");
            const catData = await catRes.json();
            if (catRes.ok) setCategories(catData);
        } catch (error) {
            console.error("Data loading failed:", error);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const addVariantToGrid = () => {
        if (!vTitle || !vPrice) return alert("Enter Variant Title & Price first");
        setVariants([...variants, { title: vTitle, price: Number(vPrice) }]);
        setVTitle("");
        setVPrice("");
    };

    const removeVariantFromGrid = (idx) => {
        setVariants(variants.filter((_, i) => i !== idx));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (variants.length === 0) return alert("Please add at least one Size/Price row");

        const payload = { name, barcode, category: selectedCategory, isActive, image, variants };
        const url = editingId ? `/api/products/${editingId}` : "/api/products";
        const method = editingId ? "PUT" : "POST";

        const res = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (res.ok) {
            loadData();
            closeAndResetModal();
        }
    };

    const handleEditClick = (product) => {
        setEditingId(product._id);
        setName(product.name);
        setBarcode(product.barcode);
        setSelectedCategory(product.category?._id || "");
        setIsActive(product.isActive);
        setImage(product.image || ""); 
        setVariants(product.variants || []);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (confirm("Delete this product permanently?")) {
            const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
            if (res.ok) loadData();
        }
    };

    const closeAndResetModal = () => {
        setEditingId(null);
        setName("");
        setBarcode("");
        setSelectedCategory("");
        setIsActive(true);
        setImage(""); 
        setVariants([]);
        setIsModalOpen(false);
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.barcode.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 text-black">
            
            {/* TOP BAR */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => { closeAndResetModal(); setIsModalOpen(true); }}
                        className="bg-pink-500 hover:bg-pink-600 text-white p-2.5 rounded-lg transition shadow-md cursor-pointer flex items-center justify-center"
                    >
                        <Plus className="w-6 h-6 stroke-[3]" />
                    </button>
                    <select className="border border-gray-300 rounded px-2 py-1 bg-gray-50 text-sm outline-none">
                        <option>100</option>
                    </select>
                </div>

                <div className="relative max-w-xs w-full">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                        <Search className="w-4 h-4" />
                    </span>
                    <input 
                        type="text" 
                        placeholder="Search product..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm outline-none"
                    />
                </div>
            </div>

            {/* MAIN DATA TABLE */}
            <div className="overflow-x-auto rounded-lg border border-gray-100">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-100 text-gray-600 uppercase text-xs font-bold border-b border-gray-200">
                            <th className="py-3 px-4 w-16">SR#</th>
                            <th className="py-3 px-4">Image</th>
                            <th className="py-3 px-4">Product Name</th>
                            <th className="py-3 px-4">Barcode</th>
                            <th className="py-3 px-4">Category</th>
                            <th className="py-3 px-4">Prices</th>
                            <th className="py-3 px-4">Status</th>
                            <th className="py-3 px-4 text-right w-24">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm text-gray-700 font-medium">
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map((prod, index) => (
                                <tr key={prod._id} className="hover:bg-gray-50/60 transition">
                                    <td className="py-3.5 px-4 text-gray-400">{index + 1}</td>
                                    <td className="py-3.5 px-4">
                                        <img 
                                            src={prod.image || "https://placehold.co/100x100?text=No+Image"} 
                                            alt=""
                                            className="w-10 h-10 object-cover rounded-lg border border-gray-200 bg-gray-50"
                                        />
                                    </td>
                                    <td className="py-3.5 px-4 text-gray-900 font-semibold">{prod.name}</td>
                                    <td className="py-3.5 px-4 text-gray-500 text-xs">{prod.barcode || "---"}</td>
                                    <td className="py-3.5 px-4">
                                        <span className="bg-gray-100 px-2.5 py-1 rounded text-xs text-gray-600 font-bold">
                                            {prod.category?.name || "Uncategorized"}
                                        </span>
                                    </td>
                                    <td className="py-3.5 px-4 text-xs space-y-0.5">
                                        {prod.variants?.map((v, i) => (
                                            <div key={i} className="text-gray-600">
                                                <span className="font-bold text-gray-800">{v.title}:</span> Rs {v.price}
                                            </div>
                                        ))}
                                    </td>
                                    <td className="py-3.5 px-4">
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                                            prod.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                        }`}>
                                            {prod.isActive ? "Active" : "Inactive"}
                                        </span>
                                    </td>
                                    <td className="py-3.5 px-4 text-right">
                                        <div className="flex items-center justify-end gap-2.5">
                                            <button onClick={() => handleEditClick(prod)} className="text-amber-500 hover:bg-amber-50 p-1 rounded cursor-pointer">
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => handleDelete(prod._id)} className="text-blue-500 hover:bg-blue-50 p-1 rounded cursor-pointer">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8" className="py-8 text-center text-gray-400 font-normal">
                                    No products found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* POPUP MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[999]">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden border border-gray-200">
                        
                        {/* Header */}
                        <div className="bg-slate-700 text-white px-6 py-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className="bg-pink-500 p-2 rounded-lg text-white font-black text-sm">📦</span>
                                <h3 className="font-bold text-lg tracking-wide">Product Details Manager</h3>
                            </div>
                            <button type="button" onClick={closeAndResetModal} className="text-gray-300 hover:text-white cursor-pointer">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Split Form Layout */}
                        <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            
                            {/* LEFT COLUMN */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Name</label>
                                    <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Chicken Karahi" className="w-full border border-gray-300 rounded-lg p-2 text-sm bg-gray-50 outline-none focus:bg-white" />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Barcode</label>
                                    <input type="text" value={barcode} onChange={(e) => setBarcode(e.target.value)} placeholder="Enter Barcode" className="w-full border border-gray-300 rounded-lg p-2 text-sm bg-gray-50 outline-none" />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Category Connection</label>
                                    <select required value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2 text-sm bg-gray-50 outline-none">
                                        <option value="">Select Category...</option>
                                        {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Product Image URL</label>
                                    <input 
                                        type="text" 
                                        value={image} 
                                        onChange={(e) => setImage(e.target.value)} 
                                        placeholder="Paste image link here" 
                                        className="w-full border border-gray-300 rounded-lg p-2 text-sm bg-gray-50 outline-none focus:bg-white text-xs" 
                                    />
                                </div>

                                <div className="flex items-center gap-3 pt-1">
                                    <span className="text-xs font-bold text-gray-400 uppercase">Is Active?</span>
                                    <button 
                                        type="button"
                                        onClick={() => setIsActive(!isActive)}
                                        className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${isActive ? 'bg-green-500' : 'bg-gray-300'}`}
                                    >
                                        <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${isActive ? 'translate-x-6' : 'translate-x-0'}`} />
                                    </button>
                                </div>
                            </div>

                            {/* RIGHT COLUMN */}
                            <div className="flex flex-col border-l border-gray-100 pl-0 md:pl-6">
                                <div className="mb-4 flex items-center gap-4 bg-gray-50 p-3 rounded-lg border border-gray-200">
                                    <div className="w-20 h-20 bg-white border border-gray-300 rounded-lg overflow-hidden flex items-center justify-center shadow-inner">
                                        <img 
                                            src={image || "https://placehold.co/100x100?text=Preview"} 
                                            alt="Preview" 
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="text-xs text-gray-400">
                                        <p className="font-bold text-gray-600">Live Image Box</p>
                                        <p>Image link paste karte hi yahan dikhegi.</p>
                                    </div>
                                </div>

                                <span className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Sizes & Prices Multi-Grid</span>
                                
                                <div className="grid grid-cols-2 gap-2 mb-3">
                                    <input type="text" value={vTitle} onChange={(e) => setVTitle(e.target.value)} placeholder="Title (e.g. Full)" className="border border-gray-300 rounded-lg p-2 text-xs bg-gray-50 outline-none" />
                                    <div className="flex gap-1.5">
                                        <input type="number" value={vPrice} onChange={(e) => setVPrice(e.target.value)} placeholder="Price" className="w-full border border-gray-300 rounded-lg p-2 text-xs bg-gray-50 outline-none" />
                                        <button type="button" onClick={addVariantToGrid} className="bg-pink-500 hover:bg-pink-600 text-white px-3 rounded-lg cursor-pointer font-bold">+</button>
                                    </div>
                                </div>

                                <div className="flex-1 min-h-[100px] max-h-[140px] overflow-y-auto border border-gray-200 rounded-lg p-2 bg-gray-50/50 space-y-1.5">
                                    {variants.length === 0 ? (
                                        <p className="text-center text-xs text-gray-400 pt-6 font-normal">No sizes assigned yet.</p>
                                    ) : (
                                        variants.map((v, i) => (
                                            <div key={i} className="flex justify-between items-center bg-white p-2 rounded border border-gray-100 text-xs shadow-sm">
                                                <span className="font-bold text-gray-800 uppercase">{v.title}</span>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-green-600 font-bold">Rs {v.price}</span>
                                                    <button type="button" onClick={() => removeVariantFromGrid(i)} className="text-red-500 hover:text-red-700 font-bold">✕</button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* SUBMIT BUTTONS */}
                            <div className="col-span-1 md:col-span-2 flex justify-end gap-3 pt-4 border-t border-gray-100">
                                <button type="button" onClick={closeAndResetModal} className="px-5 py-2 text-xs font-bold uppercase text-gray-500 bg-gray-100 rounded-lg hover:bg-gray-200 cursor-pointer">
                                    Cancel
                                </button>
                                <button type="submit" className="px-5 py-2 text-xs font-bold uppercase text-white bg-blue-600 hover:bg-blue-700 shadow-md rounded-lg cursor-pointer">
                                    {editingId ? "Save Changes" : "Save Product"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
}