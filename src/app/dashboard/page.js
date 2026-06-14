"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    // 🛡️ Security Check: Agar banda login nahi hai, to use automatic login page pr bhej do
    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        }
    }, [status, router]);

    // Jab tak Next-Auth check kar raha hai, tab tak loading dikhao
    if (status === "loading") {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-900 text-white font-bold text-xl">
                Loading POS System...
            </div>
        );
    }

    // Session se user ka naam aur role nikal rahe hain
    const userRole = session?.user?.role;
    const userName = session?.user?.name;

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            
            {/* 🌐 Top Navigation Bar */}
            <header className="bg-blue-700 text-white p-4 shadow-md flex justify-between items-center">
                <h1 className="text-xl font-bold tracking-wider">🍕 Restaurant POS Dashboard</h1>
                <div className="flex items-center gap-4">
                    <span className="bg-blue-800 px-3 py-1 rounded text-sm font-semibold uppercase">
                        {userRole}: {userName}
                    </span>
                    <button 
                        onClick={() => signOut({ callbackUrl: "/login" })}
                        className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded font-bold transition text-sm cursor-pointer"
                    >
                        Logout
                    </button>
                </div>
            </header>

            {/* 📊 Main Content Area (Role Ke Mutabik Badlega) */}
            <main className="flex-1 p-6">
                
                {/* 👑 1. ADMIN PANEL */}
                {userRole === "admin" && (
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome, Admin Boss!</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-purple-600">
                                <h3 className="text-lg font-bold text-gray-700">💰 Total Sales Today</h3>
                                <p className="text-3xl font-black text-purple-600 mt-2">Rs. 45,000</p>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-blue-600">
                                <h3 className="text-lg font-bold text-gray-700">👥 Staff Management</h3>
                                <p className="text-gray-500 mt-2 text-sm">Control Cashiers and Waiters accounts.</p>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-green-600">
                                <h3 className="text-lg font-bold text-gray-700">📋 Inventory & Food Menu</h3>
                                <p className="text-gray-500 mt-2 text-sm">Add new items and change prices.</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* 💵 2. CASHIER PANEL */}
                {userRole === "cashier" && (
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome to Billing Counter</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-green-500">
                                <h3 className="text-lg font-bold text-gray-700">🛒 New Digital Bill</h3>
                                <p className="text-gray-500 mt-2 text-sm">Punch items and print receipt for customers.</p>
                                <button className="mt-4 bg-green-500 text-white px-4 py-2 rounded font-bold hover:bg-green-600 text-sm cursor-pointer">
                                    Create New Bill
                                </button>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-yellow-500">
                                <h3 className="text-lg font-bold text-gray-700">⏳ Active Kitchen Orders</h3>
                                <p className="text-2xl font-black text-yellow-600 mt-2">5 Orders Pending</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* 🧑 3. USER / WAITER PANEL */}
                {userRole === "user" && (
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Waiter Ordering Screen</h2>
                        <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-orange-500 max-w-xl">
                            <h3 className="text-lg font-bold text-gray-700">📋 Take Customer Order</h3>
                            <p className="text-gray-500 mt-2 text-sm">Select tables and send items directly to the kitchen.</p>
                            <div className="mt-4 p-4 bg-orange-50 rounded text-orange-800 text-sm font-medium">
                                Active Tables: Table 1, Table 4
                            </div>
                        </div>
                    </div>
                )}

            </main>
        </div>
    );
}