"use client";

import { useSession } from "next-auth/react";
import AdminDashboard from "./AdminDashboard";
import CashierDashboard from "./CashierDashboard";
import UserDashboard from "./UserDashboard";

// ✅ 1. Main function component banayein (Jaise page.js me banta hai)
export default function DashboardPage() {
    // ✅ 2. Saare hooks aur variables function ke andar aane chahiye
    const { data: session, status } = useSession();

    const userRole = session?.user?.role;
    const user = session?.user;

    // Loading state handle karna zaroori hai jab tak session load ho raha ho
    if (status === "loading") {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-900 text-white font-bold text-xl">
                Checking credentials...
            </div>
        );
    }

    // ✅ 3. Role ke mutabik component return karein
    if (userRole === 'admin') {
        return <AdminDashboard user={user} />;
    }
    
    if (userRole === 'cashier') {
        return <CashierDashboard user={user} />;
    }
    
    if (userRole === 'user') {
        return <UserDashboard user={user} />;
    }

    // Fallback: Agar koi role match na kare ya banda logged out ho
    return (
        <div className="flex min-h-screen items-center justify-center bg-red-100 text-red-700 font-bold">
            Access Denied. Please Login.
        </div>
    );
}