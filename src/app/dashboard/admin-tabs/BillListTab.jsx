"use client";
import { useState, useEffect } from "react";

export default function BillListTab() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadCompletedOrders = async () => {
        try {
            const res = await fetch("/api/orders?status=completed");
            const data = await res.json();
            if (Array.isArray(data)) setOrders(data);
            setLoading(false);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => { loadCompletedOrders(); }, []);

    const completePayment = async (orderId) => {
        try {
            const res = await fetch("/api/orders", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderId, nextStatus: "paid" })
            });
            if (res.ok) {
                alert("💵 Invoice Paid successfully! Receipt logged into system.");
                loadCompletedOrders();
            }
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div className="p-4 text-center text-xs font-bold text-gray-500 uppercase">Loading Counter Bills Ledger...</div>;

    return (
        <div className="space-y-4">
            <h2 className="font-black text-slate-800 text-base uppercase bg-white p-4 rounded-xl shadow-sm border border-gray-100">🧾 Counter Active Bills Settlement Board</h2>
            
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                    <thead>
                        <tr className="bg-slate-800 text-white font-black uppercase tracking-wider text-[10px]">
                            <th className="p-3">Order Type</th>
                            <th className="p-3">Customer Reference</th>
                            <th className="p-3">Total Amount</th>
                            <th className="p-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {orders.map(ord => (
                            <tr key={ord._id} className="hover:bg-slate-50 transition font-medium text-slate-700">
                                <td className="p-3 font-bold"><span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded uppercase text-[10px]">{ord.orderType}</span></td>
                                <td className="p-3 uppercase font-black">{ord.orderType === "Dine In" ? `Table ${ord.table?.number || "N/A"} (W: ${ord.waiter?.name || "N/A"})` : ord.customer?.name}</td>
                                <td className="p-3 font-black text-emerald-600 text-sm">Rs {ord.totalAmount}</td>
                                <td className="p-3 text-right">
                                    <button 
                                        onClick={() => completePayment(ord._id)}
                                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-black px-4 py-2 rounded-lg text-[11px] uppercase cursor-pointer"
                                    >
                                        💵 Settle & Print
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}