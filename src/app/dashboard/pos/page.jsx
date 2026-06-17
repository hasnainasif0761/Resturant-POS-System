"use client";
import { useState, useEffect, useRef } from "react";
import { Maximize2, Minimize2, Search, Power, Trash2, X, Armchair, Users } from "lucide-react";

export default function POSCounterPage() {
    // --- DATABASE & POS STATES ---
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [tables, setTables] = useState([]);
    const [waiters, setWaiters] = useState([]);
    const [loading, setLoading] = useState(true);

    // --- CART & TABS SYSTEM ---
    const [cart, setCart] = useState([]);
    const [activeCategory, setActiveCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [currentOrderType, setCurrentOrderType] = useState("Dine In"); // Default tab order status
    const [isFullscreen, setIsFullscreen] = useState(false);
    const posContainerRef = useRef(null);

    // --- TAB FLOW / MODAL STATES ---
    const [variantModalProduct, setVariantModalProduct] = useState(null);
    const [showOrderTypeModal, setShowOrderTypeModal] = useState(false);
    
    // Selected meta data for the current active order
    const [selectedTable, setSelectedTable] = useState(null);
    const [selectedWaiter, setSelectedWaiter] = useState(null);
    const [customerInfo, setCustomerInfo] = useState({ name: "Walk-in", phone: "", address: "" });

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                setLoading(true);
                const [cat, prod, tbl, stf] = await Promise.all([
                    fetch("/api/categories").then(res => res.json()),
                    fetch("/api/products").then(res => res.json()),
                    fetch("/api/tables").then(res => res.json().catch(() => [])),
                    fetch("/api/staff").then(res => res.json().catch(() => []))
                ]);
                
                if (Array.isArray(cat)) setCategories(cat);
                if (Array.isArray(prod)) setProducts(prod);
                if (Array.isArray(tbl)) setTables(tbl);
                // Filtering only waiters as required
                if (Array.isArray(stf)) setWaiters(stf.filter(s => s.role === "waiter"));
                
                setLoading(false);
            } catch (err) {
                console.error("Data load error", err);
                setLoading(false);
            }
        };
        fetchInitialData();
    }, []);

    // 🖥️ FULLSCREEN CONTROLLER
    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            posContainerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    // 🛒 CART LOGIC
    const handleProductClick = (product) => {
        if (product.variants && product.variants.length > 1) {
            setVariantModalProduct(product);
        } else {
            const defVar = product.variants?.[0] || { title: "Standard", price: 0 };
            executeAddToCart(product, defVar);
        }
    };

    const executeAddToCart = (product, variant) => {
        const cartItemId = `${product._id}-${variant.title}`;
        const existing = cart.find(item => item.cartItemId === cartItemId);
        if (existing) {
            setCart(cart.map(item => item.cartItemId === cartItemId ? { ...item, qty: item.qty + 1 } : item));
        } else {
            setCart([...cart, {
                cartItemId,
                _id: product._id,
                name: product.name,
                variantTitle: variant.title,
                currentPrice: variant.price,
                qty: 1
            }]);
        }
        setVariantModalProduct(null);
    };

    const cartTotal = cart.reduce((acc, item) => acc + (item.currentPrice * item.qty), 0);

    // 🎛️ TAB CLICK MANAGER (New, Dine In, Take Away, Delivery)
    const handleTabSwitch = (type) => {
        setCurrentOrderType(type);
        // Reset old flow values
        setSelectedTable(null);
        setSelectedWaiter(null);
        setCustomerInfo({ name: "", phone: "", address: "" });
        
        // Modal logic open for meta entry
        setShowOrderTypeModal(type);
    };

    // 🚀 CHECKOUT & PLACE ORDER TO DATABASE
    const handlePlaceOrder = async () => {
        if (cart.length === 0) return alert("Cart is empty!");
        
        // Dynamic valid validation checklist
        if (currentOrderType === "Dine In" && (!selectedTable || !selectedWaiter)) {
            return alert("Please select Table and Waiter before pushing order!");
        }
        if (currentOrderType === "Delivery" && !customerInfo.address) {
            return alert("Delivery Address is required!");
        }

        const orderPayload = {
            orderType: currentOrderType,
            customer: customerInfo,
            table: selectedTable?._id,
            waiter: selectedWaiter?._id,
            items: cart,
            totalAmount: cartTotal
        };

        try {
            const res = await fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(orderPayload)
            });

            if (res.ok) {
                alert("🎉 Order sent to Kitchen successfully!");
                setCart([]); // Clean cart as requested
                setSelectedTable(null);
                setSelectedWaiter(null);
                setCustomerInfo({ name: "Walk-in", phone: "", address: "" });
            } else {
                alert("Order failed to submit.");
            }
        } catch (err) {
            console.error(err);
        }
    };

    // 🔍 FILTER STAGE
    const filteredProducts = products.filter(p => {
        return (activeCategory === "All" || p.category?._id === activeCategory) &&
               p.name.toLowerCase().includes(searchQuery.toLowerCase()) && p.isActive;
    });

    if (loading) return <div className="h-screen flex items-center justify-center bg-slate-900 text-white font-bold">📡 Syncing POS System Terminal...</div>;

    return (
        <div ref={posContainerRef} className="w-full h-screen bg-[#f3f4f6] flex flex-col text-black select-none overflow-hidden relative">
            
            {/* --- TOP ACTION BAR --- */}
            <div className="bg-[#2c324e] text-white px-4 py-1.5 flex items-center justify-between shadow-lg">
                <div className="flex items-center gap-4">
                    <span className="text-pink-500 text-2xl font-black italic">🍴 POS</span>
                    <div className="flex gap-1 overflow-x-auto no-scrollbar">
                        {/* Dynamic Functional Tabs Trigger */}
                        {["Dine In", "Take Away", "Delivery"].map((tab) => (
                            <button 
                                key={tab} 
                                onClick={() => handleTabSwitch(tab)}
                                className={`px-4 py-2 rounded-t-lg text-[11px] font-bold uppercase transition min-w-[85px] cursor-pointer ${
                                    currentOrderType === tab ? "bg-pink-500 text-white font-black" : "bg-white/10 text-slate-300 hover:bg-white/20"
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {/* Active Order State Ribbon */}
                    <div className="bg-slate-700/50 rounded-lg px-3 py-1 text-[11px] max-hidden md:flex flex-col text-right">
                        <span className="text-slate-400 font-bold uppercase">Active Mode</span>
                        <span className="text-yellow-400 font-black uppercase">
                            {currentOrderType} {selectedTable && `- T: ${selectedTable.number}`}
                        </span>
                    </div>
                    <button onClick={toggleFullscreen} className="p-2 hover:bg-white/10 rounded-full text-pink-400 transition cursor-pointer">
                        {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* --- MAIN BASE WORKSPACE --- */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left side category & product list */}
                <div className="flex-1 flex flex-col p-3 overflow-hidden">
                    <div className="relative mb-3">
                        <input 
                            type="text" placeholder="Search menu catalog..." value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full max-w-lg pl-4 pr-10 py-2 border-2 border-gray-200 rounded-full bg-white text-sm outline-none focus:border-pink-400"
                        />
                        <Search className="w-5 h-5 text-pink-500 absolute right-4 top-2.5" />
                    </div>

                    <div className="flex-1 flex gap-3 overflow-hidden">
                        {/* Categories List */}
                        <div className="w-36 bg-[#1e293b] p-2 rounded-xl flex flex-col gap-1.5 overflow-y-auto no-scrollbar shadow-xl">
                            <button onClick={() => setActiveCategory("All")} className={`w-full text-left px-3 py-3 rounded-lg text-xs font-black uppercase border-l-4 ${activeCategory === "All" ? "bg-pink-500 text-white" : "bg-slate-700 text-slate-400"}`}>All Items</button>
                            {categories.map((cat) => (
                                <button key={cat._id} onClick={() => setActiveCategory(cat._id)} className={`w-full text-left px-3 py-3 rounded-lg text-xs font-black uppercase border-l-4 ${activeCategory === cat._id ? "bg-pink-500 text-white" : "bg-slate-700 text-slate-400"}`}>{cat.name}</button>
                            ))}
                        </div>

                        {/* Product Cards Layout Grid */}
                        <div className="flex-1 bg-white rounded-xl border border-gray-200 p-4 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 content-start">
                            {filteredProducts.map((prod) => (
                                <div key={prod._id} onClick={() => handleProductClick(prod)} className="group border border-gray-100 rounded-2xl p-2 flex flex-col items-center text-center cursor-pointer hover:border-pink-400 hover:shadow-xl transition-all bg-white relative overflow-hidden">
                                    <div className="w-full h-24 overflow-hidden rounded-xl bg-gray-50 flex items-center justify-center mb-2">
                                        <img src={prod.image || "https://placehold.co/150x120?text=Food"} alt="" className="w-full h-full object-cover group-hover:scale-110 transition duration-300" />
                                    </div>
                                    <div className="text-[11px] font-black text-gray-800 uppercase leading-tight line-clamp-2">{prod.name}</div>
                                    <div className="text-xs font-bold text-pink-600 mt-1">Rs {prod.variants?.[0]?.price || 0}{prod.variants?.length > 1 && "+"}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right side Invoice Area */}
                <div className="w-96 bg-white border-l border-gray-200 flex flex-col shadow-2xl">
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-slate-50">
                        <h2 className="font-black text-slate-700 text-sm uppercase">Current Basket</h2>
                        <button onClick={() => setCart([])} className="text-rose-500 hover:bg-rose-50 p-1.5 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                    </div>

                    <div className="flex-1 overflow-y-auto bg-white p-2 space-y-1">
                        {cart.map((item, idx) => (
                            <div key={item.cartItemId} className="flex justify-between items-center border-b border-gray-50 py-2 px-2 text-xs">
                                <div className="w-1/2">
                                    <p className="font-bold text-slate-800 uppercase truncate">{item.name}</p>
                                    {item.variantTitle && <span className="text-[9px] text-pink-500 font-bold bg-pink-50 px-1 rounded">{item.variantTitle}</span>}
                                </div>
                                <span className="font-black text-slate-600">x{item.qty}</span>
                                <span className="font-black text-emerald-600">Rs {(item.currentPrice * item.qty)}</span>
                            </div>
                        ))}
                    </div>

                    {/* BILLING AND CHECKOUT SUBMIT BUTTONS */}
                    <div className="bg-[#2c324e] p-4 space-y-3">
                        <div className="flex justify-between items-center text-white">
                            <span className="text-xs font-bold opacity-65">Grand Total</span>
                            <span className="text-yellow-400 text-2xl font-black">Rs {cartTotal}</span>
                        </div>
                        <button 
                            onClick={handlePlaceOrder}
                            className="w-full bg-pink-600 hover:bg-pink-500 text-white font-black py-4 rounded-xl text-xs uppercase tracking-wider shadow-lg cursor-pointer transition active:scale-95"
                        >
                            🚀 Send to Kitchen (KOT)
                        </button>
                    </div>
                </div>
            </div>

            {/* ========================================== */}
            {/* 🎛️ MODAL DIALOGS (DINE-IN / ORDER SETUP)  */}
            {/* ========================================== */}
            {showOrderTypeModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl border border-gray-100">
                        <div className="bg-[#2c324e] text-white p-4 flex justify-between items-center">
                            <h3 className="font-black text-sm uppercase tracking-wider">Configure Setup - {currentOrderType}</h3>
                            <button onClick={() => setShowOrderTypeModal(false)}><X className="w-5 h-5 text-slate-400 hover:text-white" /></button>
                        </div>

                        <div className="p-5 overflow-y-auto max-h-[75vh] space-y-4">
                            {/* DINE IN SPECIFIC RULES WIDGET */}
                            {currentOrderType === "Dine In" && (
                                <div className="space-y-4">
                                    {/* Table Grid Loader Section */}
                                    <div>
                                        <p className="text-xs font-black text-gray-400 uppercase mb-2 flex items-center gap-1"><Armchair className="w-4 h-4"/> 1. Select Table</p>
                                        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                                            {tables.map(tbl => (
                                                <button
                                                    key={tbl._id} type="button"
                                                    onClick={() => setSelectedTable(tbl)}
                                                    className={`p-3 rounded-xl border-2 font-black text-xs text-center uppercase transition ${
                                                        selectedTable?._id === tbl._id 
                                                            ? "bg-blue-600 text-white border-blue-600" 
                                                            : "bg-slate-50 border-gray-200 hover:border-gray-400"
                                                    }`}
                                                >
                                                    T - {tbl.number}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Staff Waiters Filtering Section */}
                                    <div>
                                        <p className="text-xs font-black text-gray-400 uppercase mb-2 flex items-center gap-1"><Users className="w-4 h-4"/> 2. Assign Waiter</p>
                                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                                            {waiters.map(waiter => (
                                                <button
                                                    key={waiter._id} type="button"
                                                    onClick={() => setSelectedWaiter(waiter)}
                                                    className={`p-2.5 rounded-xl border-2 font-bold text-xs text-center uppercase transition ${
                                                        selectedWaiter?._id === waiter._id 
                                                            ? "bg-pink-600 text-white border-pink-600" 
                                                            : "bg-slate-50 border-gray-200 hover:border-gray-400"
                                                    }`}
                                                >
                                                    {waiter.name}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* TAKE AWAY & DELIVERY CORE INPUTS FORM */}
                            {(currentOrderType === "Take Away" || currentOrderType === "Delivery") && (
                                <div className="space-y-3">
                                    <p className="text-xs font-black text-gray-400 uppercase">Customer Profile Fields</p>
                                    <div className="grid grid-cols-2 gap-3">
                                        <input 
                                            type="text" placeholder="Customer Full Name"
                                            value={customerInfo.name} onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                                            className="border-2 p-2.5 rounded-xl text-xs outline-none focus:border-blue-500"
                                        />
                                        <input 
                                            type="text" placeholder="Contact Mobile Number"
                                            value={customerInfo.phone} onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                                            className="border-2 p-2.5 rounded-xl text-xs outline-none focus:border-blue-500"
                                        />
                                    </div>
                                    {currentOrderType === "Delivery" && (
                                        <textarea 
                                            placeholder="Complete Destination Dropoff Address..." rows="3"
                                            value={customerInfo.address} onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
                                            className="w-full border-2 p-2.5 rounded-xl text-xs outline-none focus:border-blue-500"
                                        ></textarea>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="p-3 bg-slate-50 border-t flex justify-end gap-2">
                            <button onClick={() => setShowOrderTypeModal(false)} className="px-4 py-2 text-xs font-bold uppercase text-gray-500">Cancel</button>
                            <button onClick={() => setShowOrderTypeModal(false)} className="bg-emerald-600 text-white px-5 py-2 text-xs font-black uppercase rounded-lg">Apply Details</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}