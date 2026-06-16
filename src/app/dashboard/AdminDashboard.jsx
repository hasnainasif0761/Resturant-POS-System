"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";

// Components Imports
import MainDashboard from "./admin-tabs/MainDashboard";
import CategoryTab from "./admin-tabs/CategoryTab";
import ProductTab from "./admin-tabs/ProductTab";
import Tables from './admin-tabs/TableManagementTab'
import Staff from './admin-tabs/StaffManagementTab'
import PosCount from './page'
import { LayoutDashboard, FolderOpen, ShoppingCart, LogOut, Boxes, PackageSearch, Armchair, Users, Laptop, ChefHat, ClipboardPlus, Settings  } from "lucide-react";

export default function AdminDashboard({ user }) {
    const [activeTab, setActiveTab] = useState("dashboard");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const tabs = [
        { id: "dashboard", name: "Dashboard",icon:<LayoutDashboard/> },
        { id: "category", name: "Category",icon:<Boxes/> },
        { id: "product", name: "Product" ,icon:<PackageSearch />},
        { id: "tables", name: "Tables",icon:<Armchair /> },
        { id: "staff", name: "Staff",icon:<Users /> },
        { id: "pos", name: "POS Counter", icon:<Laptop /> },
        { id: "kitchen", name: "Kitchen", icon:<ChefHat /> },
        { id: "report", name: "Report", icon:<ClipboardPlus /> },
        { id: "setting", name: "Setting", icon:<Settings /> },
    ];

    const handleTabClick = (tabId) => {
        setActiveTab(tabId);
        setIsSidebarOpen(false);
    };

    return (
        <div className="flex min-h-screen bg-gray-100 text-black relative overflow-x-hidden">
            
            {/* 📱 Mobile Overlay: Jab mobile par sidebar khule to piche ka screen dhundla/dark ho jaye */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* ─── SIDEBAR (Responsive classes added) ─── */}
            <aside className={`
                w-64 bg-gray-900 text-white flex flex-col shadow-xl fixed lg:static top-0 bottom-0 left-0 z-50
                transition-transform duration-300 ease-in-out
                ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
            `}>
                <div className="p-5 bg-blue-700 text-center font-black text-xl tracking-wider flex justify-between items-center lg:justify-center">
                    <span>POS System</span>
                    {/* Mobile Close Button */}
                    <button 
                        onClick={() => setIsSidebarOpen(false)}
                        className="lg:hidden text-white text-2xl cursor-pointer"
                    >
                        ✕
                    </button>
                </div>

                <nav className="flex-1 p-3 space-y-1 overflow-y-auto mt-3">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => handleTabClick(tab.id)}
                            className={`w-full text-left flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition duration-200 cursor-pointer text-sm ${
                                activeTab === tab.id
                                    ? "bg-blue-600 text-white shadow-md font-bold"
                                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                            }`}
                        >
                            {tab.icon} <span className="mt-1 text-[16.7px]">{tab.name}</span>
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-800">
                    <button
                        onClick={() => signOut({ callbackUrl: "/login" })}
                        className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-bold text-sm transition cursor-pointer text-center"
                    >
                       <LogOut className="w-[12px]"/> EXIT
                    </button>
                </div>
            </aside>

            {/* ─── MAIN CONTENT ─── */}
            <main className="flex-1 flex flex-col min-w-0 w-full">
                
                {/* Responsive Top Navbar */}
                <header className="bg-white shadow-sm h-16 flex items-center justify-between px-4 sm:px-6 border-b border-gray-200">
                    <div className="flex items-center gap-3 justify-between  w-full">
                        {/* 📱 Mobile Hamburger Button: Sirf choti screen par dikhega */}
                        <button 
                            onClick={() => setIsSidebarOpen(true)}
                            className="lg:hidden p-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 cursor-pointer transition text-xl"
                        >
                            ☰
                        </button>
                        <h1 className="text-lg sm:text-xl font-bold text-gray-800 capitalize">
                            {activeTab} Panel
                        </h1>
                        <div className="flex gap-2">
                        <p className="text-gray-400">User Name:</p>
                        <p className="font-bold text-green-400 truncate capitalize">{user?.role || "Admin"}</p>
                        </div>
                    </div>
                </header>

                {/* Dashboard content wrapper */}
                <div className="p-4 sm:p-6 flex-1 overflow-y-auto">
                    
                    {activeTab === "dashboard" && <MainDashboard />}
                    {activeTab === "category" && <CategoryTab />}
                    {activeTab === "product" && <ProductTab />}
                    {activeTab === 'tables' && <Tables/>}
                    {activeTab === 'staff' && <Staff/>}
                    {activeTab === 'pos' && <PosCount/>}

                    {!["dashboard", "category", "product", "tables", "staff", "pos"].includes(activeTab) && (
                        <div className="bg-white p-8 rounded-xl text-center text-gray-500 shadow-sm border border-gray-200">
                            Is tab ka component <span className="font-bold text-blue-600">"{activeTab}Tab.jsx"</span> abhi design karna baqi hai.
                        </div>
                    )}

                </div>
            </main>
        </div>
    );
}