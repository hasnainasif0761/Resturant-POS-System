"use client";
import { useState, useEffect } from "react";

export default function KitchenTab() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadPendingOrders = async () => {
        try {
            const res = await fetch("/api/orders?status=pending");
            const data = await res.json();
            if (Array.isArray(data)) setOrders(data);
            setLoading(false);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        loadPendingOrders();
        // Auto-refresh orders every 15 seconds for hot updates
        const interval = setInterval(loadPendingOrders, 15000);
        return () => clearInterval(interval);
    }, []);

    const markAsReady = async (orderId) => {
        try {
            const res = await fetch("/api/orders", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderId, nextStatus: "completed" })
            });
            if (res.ok) {
                alert("Order ready for billing service!");
                loadPendingOrders(); // Reload board
            }
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div className="p-4 text-center text-xs font-bold text-gray-500 uppercase">Syncing Kitchen Monitor View...</div>;

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <h2 className="font-black text-slate-800 text-base uppercase">👨‍🍳 Kitchen KOT Active Monitor</h2>
                <span className="bg-rose-100 text-rose-600 px-3 py-1 text-xs font-black rounded-full animate-pulse">{orders.length} Orders Live</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {orders.map(order => (
                    <div key={order._id} className="bg-white border-t-4 border-orange-500 rounded-xl shadow-sm flex flex-col overflow-hidden">
                        {/* Header card info */}
                        <div className="p-3 bg-slate-50 border-b border-gray-100 flex justify-between items-start">
                            <div>
                                <span className="text-[10px] bg-orange-100 text-orange-600 px-2 py-0.5 rounded font-black uppercase">{order.orderType}</span>
                                <h3 className="font-black text-xs text-slate-700 mt-1 uppercase">
                                    {order.orderType === "Dine In" ? `Table ${order.table?.name || "N/A"}` : order.customer?.name}
                                </h3>
                            </div>
                            <span className="text-[10px] font-bold text-gray-400">{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>

                        {/* Items list body layout */}
                        <div className="p-4 flex-1 space-y-2">
                            {order.items.map((item, i) => (
                                <div key={i} className="flex justify-between items-start text-xs border-b border-dashed border-gray-100 pb-1.5">
                                    <div>
                                        <p className="font-black text-slate-800 uppercase">{item.name}</p>
                                        {item.variantTitle && <p className="text-[10px] text-pink-500 font-bold uppercase">{item.variantTitle}</p>}
                                    </div>
                                    <span className="bg-slate-800 text-white font-black text-[11px] px-2 py-0.5 rounded-md">x{item.qty}</span>
                                </div>
                            ))}
                        </div>

                        {/* Action buttons footer stage */}
                        <div className="p-3 bg-slate-50 border-t border-gray-100">
                            <button 
                                onClick={() => markAsReady(order._id)}
                                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black uppercase py-2.5 rounded-lg tracking-wider"
                            >
                                ✔️ Mark Cooked & Dispatch
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}