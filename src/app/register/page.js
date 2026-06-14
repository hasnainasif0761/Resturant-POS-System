"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function RegisterPage(){
    const [formData, setFormData] = useState({
        name: "",
        email: '',
        password: '',
        role: 'cashier' // Default role cashier hi rahega
    });
    const [isAdminDisable, setIsAdminDisable] = useState(false);

    useEffect(() => {
        async function checkAdminStatus() {
            try {
                const res = await fetch('/api/check-admin');
                const data = await res.json(); 
                if (data.hasAdmin) {
                    setIsAdminDisable(true);
                }
            } catch (error) {
                console.error('Error Checking Admin Status:', error);
            }
        }
        checkAdminStatus();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/register",{
                method:'POST',
                headers:{
                    "Content-Type":"application/json",
                },
                body: JSON.stringify(formData),
            });
            const data = await res.json();

            if(res.ok){
                alert('Account Created Successfully in MongoDb!');
                window.location.reload();
                setFormData({name:'', email:'', password:'', role:'cashier'});
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.log("Registration Error:", error);
            alert('Failed to register Staff.');
        }
    };

    return(
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="w-full max-w-md p-8 rounded-lg shadow-xl bg-white">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Restaurant POS - Register</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-7">
                    
                    <div>
                        <label className="block text-md tracking-wider font-medium text-gray-500">Full Name:</label>
                        <input type="text" placeholder="Enter your Name" name="name" onChange={handleChange} required className="w-full p-2 border rounded mt-1 text-black outline-none" />
                    </div>                    
                    
                    <div>
                        <label className="block text-md tracking-wider font-medium text-gray-500">Email Address:</label>
                        <input type="email" placeholder="Enter your Email Address" name="email" onChange={handleChange} required className="w-full p-2 border rounded mt-1 text-black outline-none" />
                    </div>                    
                    
                    <div>
                        <label className="block text-md tracking-wider font-medium text-gray-500">Password:</label>
                        <input type="password" placeholder="Enter your password" name="password" onChange={handleChange} required className="w-full p-2 border rounded mt-1 text-black outline-none" />
                    </div>                   
                    
                    <div>
                        <label className="block text-md tracking-wider font-medium text-gray-500">Assign Role:</label>
                        <select name="role" value={formData.role} onChange={handleChange} className="w-full p-2 border rounded mt-1 bg-white text-black font-semibold">
                           {/* 💡 Cashier ko upar rakh diya kyunki yeh state ka default value hai */}
                           <option value="cashier">Cashier (Counter Staff)</option>
                           <option value="user">User (Customer/Waiter)</option>
                           <option value="admin" disabled={isAdminDisable}>
                                Admin (Owner/Manager) {isAdminDisable ? "(Already Register)" : ""}
                           </option>
                        </select>
                    </div>                    

                    <button type="submit" className="w-full cursor-pointer bg-blue-600 text-white p-2 rounded hover:bg-blue-700 font-bold transition">Register Staff</button>
                    <p className="text-center text-sm text-gray-600 mt-2">
                        Already have an account?{" "}
                        <Link href="/login" className="text-blue-600 font-bold hover:underline">
                            Go to Login
                        </Link>
                    </p>
                 </form>
            </div>
        </div>
    );
}