"use client";
import { useState, useEffect, useRef } from "react";
import { Maximize2, Minimize2, Search, Power } from "lucide-react";

export default function POSCounterPage() {
    const [categories, setCategories] = useState(["All Categories", "Drinks", "Burger", "Pizza", "Bar BQ"]);
    const [activeCategory, setActiveCategory] = useState("All Categories");
    const [searchQuery, setSearchQuery] = useState("");
    const [cart, setCart] = useState([]);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const posContainerRef = useRef(null);

    // Dummy Products Data (Aap isko apni API `/api/products` se fetch kar sakte hain)
    const [products, setProducts] = useState([
        { id: 1, name: "Zinger Burger", price: 350, image: "https://placehold.co/150x120?text=Zinger", category: "Burger" },
        { id: 2, name: "Pizza", price: 850, image: "https://placehold.co/150x120?text=Pizza", category: "Pizza" },
        { id: 3, name: "Sprite", price: 80, image: "https://placehold.co/150x120?text=Sprite", category: "Drinks" },
        { id: 4, name: "Chicken Tikka", price: 280, image: "https://placehold.co/150x120?text=Tikka", category: "Bar BQ" },
        { id: 5, name: "Chicken Fajita", price: 900, image: "https://placehold.co/150x120?text=Fajita", category: "Pizza" },
        { id: 6, name: "Cheeze Lover", price: 950, image: "https://placehold.co/150x120?text=Cheeze", category: "Pizza" },
    ]);

    // ✨ Google/Browser Title Bar Ko Hata Kar Fullscreen Karne Ka Logic
    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            posContainerRef.current.requestFullscreen().then(() => {
                setIsFullscreen(true);
            }).catch((err) => {
                console.error(`Error enabling fullscreen: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    // Esc key dabane par fullscreen status update rakhne ke liye listeners
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener("fullscreenchange", handleFullscreenChange);
        return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
    }, []);

    // Cart Handlers
    const addToCart = (product) => {
        const existing = cart.find(item => item.id === product.id);
        if (existing) {
            setCart(cart.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item));
        } else {
            setCart([...cart, { ...product, qty: 1 }]);
        }
    };

    const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
    const filteredProducts = products.filter(p => 
        (activeCategory === "All Categories" || p.category === activeCategory) &&
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div 
            ref={posContainerRef} 
            className="w-full h-screen bg-gray-100 flex flex-col text-black font-sans select-none overflow-hidden"
        >
            {/* 1. TOP NAVBAR (Pink Action Buttons like New, Hold, Bill List, KOT etc) */}
            <div className="bg-[#2c324e] text-white px-4 py-2 flex items-center justify-between shadow-md">
                <div className="flex items-center gap-3">
                    <span className="text-pink-500 text-2xl font-black tracking-wider">🍴 POS</span>
                    <div className="flex gap-1">
                        {["New", "Hold", "Bill List", "KOT", "Delivery", "Take Away", "Din In"].map((btn, idx) => (
                            <button 
                                key={idx} 
                                className={`px-4 py-1.5 rounded-t-md text-xs font-bold transition flex flex-col items-center justify-center cursor-pointer min-w-[70px] ${
                                    btn === "New" ? "bg-pink-500 text-white" : "bg-pink-500/20 hover:bg-pink-500/40 text-pink-200"
                                }`}
                            >
                                <span className="text-[10px] mb-0.5">📂</span>
                                {btn}
                            </button>
                        ))}
                    </div>
                </div>
                
                {/* Right Utilities (Fullscreen Control & Exit) */}
                <div className="flex items-center gap-3">
                    <button 
                        onClick={toggleFullscreen} 
                        className="p-2 hover:bg-white/10 rounded-lg text-pink-400 transition cursor-pointer"
                        title="Toggle Fullscreen"
                    >
                        {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                    </button>
                    <button className="p-2 hover:bg-red-600 rounded-lg text-red-400 hover:text-white transition cursor-pointer">
                        <Power className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* MAIN WORKING AREA CONTAINER */}
            <div className="flex-1 flex overflow-hidden">
                
                {/* LEFT & CENTER ROW (Product Management) */}
                <div className="flex-1 flex flex-col p-2 overflow-hidden gap-2">
                    
                    {/* Search Bar Line */}
                    <div className="relative w-full max-w-md">
                        <input 
                            type="text" 
                            placeholder="Search item here..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-3 pr-10 py-1.5 border border-gray-300 rounded-md bg-white text-sm outline-none shadow-inner"
                        />
                        <Search className="w-4 h-4 text-pink-500 absolute right-3 top-2.5" />
                    </div>

                    {/* Content Splitter (Categories left, Grid right) */}
                    <div className="flex-1 flex gap-2 overflow-hidden">
                        
                        {/* 2. SIDE CATEGORIES LIST */}
                        <div className="w-32 bg-slate-800 p-1.5 rounded-lg flex flex-col gap-1 overflow-y-auto">
                            {categories.map((cat, idx) => (
                                <button 
                                    key={idx}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`w-full text-left px-3 py-2.5 rounded text-xs font-bold transition border border-transparent cursor-pointer break-words ${
                                        activeCategory === cat 
                                            ? "bg-slate-600 text-white border-pink-400 shadow" 
                                            : "bg-slate-700 hover:bg-slate-650 text-slate-300"
                                    }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        {/* 3. CENTER GRAPHIC PRODUCT GRID */}
                        <div className="flex-1 bg-white border border-gray-200 rounded-lg p-3 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 h-full content-start">
                            {filteredProducts.map((prod) => (
                                <div 
                                    key={prod.id}
                                    onClick={() => addToCart(prod)}
                                    className="border border-gray-200 rounded-lg p-2 flex flex-col justify-between items-center text-center cursor-pointer hover:shadow-md hover:border-pink-300 transition active:scale-95 bg-gray-50/50 h-36"
                                >
                                    <div className="w-full h-20 overflow-hidden rounded bg-white flex items-center justify-center border border-gray-100">
                                        <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="mt-1.5 w-full">
                                        <div className="text-xs font-bold text-gray-800 truncate px-1">{prod.name}</div>
                                        <div className="text-[11px] text-gray-400 font-medium mt-0.5">Rs {prod.price}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 4. RIGHT SIDEBAR (The POS Cart Invoice) */}
                <div className="w-80 bg-slate-100 border-l border-gray-200 flex flex-col overflow-hidden">
                    
                    {/* Cart Header Table */}
                    <div className="bg-[#dbe1e8] text-gray-700 text-[11px] font-bold uppercase grid grid-cols-12 py-2 px-3 border-b border-gray-300">
                        <span className="col-span-2">SR#</span>
                        <span className="col-span-5">Product Name</span>
                        <span className="col-span-2 text-center">Qty</span>
                        <span className="col-span-3 text-right">Amount</span>
                    </div>

                    {/* Cart Body (Scrollable items selected list) */}
                    <div className="flex-1 overflow-y-auto divide-y divide-gray-200 bg-white">
                        {cart.length > 0 ? (
                            cart.map((item, index) => (
                                <div key={item.id} className="grid grid-cols-12 text-xs py-2 px-3 items-center font-semibold text-gray-800">
                                    <span className="col-span-2 text-gray-400">{index + 1}</span>
                                    <span className="col-span-5 truncate">{item.name}</span>
                                    <span className="col-span-2 text-center bg-gray-100 py-0.5 rounded border border-gray-200 text-[11px]">{item.qty}</span>
                                    <span className="col-span-3 text-right text-emerald-600">Rs {item.price * item.qty}</span>
                                </div>
                            ))
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400 text-xs">
                                <span>🛒 Cart is empty</span>
                            </div>
                        )}
                    </div>

                    {/* 5. BOTTOM BILLING ACTIONS PANELS */}
                    <div className="bg-[#2c324e] p-3 text-white border-t border-slate-700 space-y-3">
                        {/* Total Display Block */}
                        <div className="flex justify-between items-center bg-black/20 p-2 rounded border border-white/5">
                            <span className="text-xs text-slate-300 font-bold tracking-wider uppercase">Total Bill Amount</span>
                            <span className="text-xl font-black text-yellow-400 tracking-mono">Rs {cartTotal}.00</span>
                        </div>

                        {/* Checkout Interactive Action Buttons */}
                        <div className="grid grid-cols-2 gap-2">
                            <button className="bg-rose-500 hover:bg-rose-600 active:scale-95 text-white py-2.5 px-3 rounded-lg text-xs font-black uppercase transition tracking-wider shadow cursor-pointer">
                                ⚡ Fast Cash
                            </button>
                            <button className="bg-pink-500 hover:bg-pink-600 active:scale-95 text-white py-2.5 px-3 rounded-lg text-xs font-black uppercase transition tracking-wider shadow cursor-pointer">
                                💳 Check Out
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}