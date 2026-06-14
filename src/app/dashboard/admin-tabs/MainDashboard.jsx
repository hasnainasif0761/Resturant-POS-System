"use client";
export default function MainDashboard() {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                    <span className="text-sm text-gray-400 font-bold uppercase">Today's Revenue</span>
                    <h3 className="text-2xl font-black text-gray-800 mt-2">Rs. 48,250</h3>
                </div>
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                    <span className="text-sm text-gray-400 font-bold uppercase">Total Orders</span>
                    <h3 className="text-2xl font-black text-gray-800 mt-2">124 Orders</h3>
                </div>
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                    <span className="text-sm text-gray-400 font-bold uppercase">Active Staff</span>
                    <h3 className="text-2xl font-black text-gray-800 mt-2">6 On Duty</h3>
                </div>
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                    <span className="text-sm text-gray-400 font-bold uppercase">Kitchen Status</span>
                    <h3 className="text-2xl font-black text-yellow-600 mt-2">4 Pending</h3>
                </div>
            </div>
        </div>
    );
}