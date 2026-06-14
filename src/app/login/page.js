"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Next-Auth ke signIn function ko call kar rahe hain
            const res = await signIn("credentials", {
                redirect: false, // Taaki hum khud control kar sakein ke user ko kahan bhejna hai
                email: formData.email,
                password: formData.password,
            });

            if (res?.error) {
                alert(res.error); // Agar password galat hua ya email na mili
            } else {
                alert("Login Successful! Redirecting...");
                
                // 🚀 Agla step: Yahan hum dashboard par bhejenge
                router.push("/dashboard"); 
                router.refresh();
            }
        } catch (error) {
            console.error("Login Error:", error);
            alert("Something went wrong during login.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="w-full max-w-md p-8 rounded-lg shadow-xl bg-white">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Restaurant POS - Login</h2>
                
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div>
                        <label className="block text-md font-medium text-gray-500 tracking-wider">Email Address:</label>
                        <input 
                            type="email" 
                            name="email" 
                            placeholder="Enter your registered email" 
                            onChange={handleChange} 
                            required 
                            className="w-full p-2 border rounded mt-1 text-black outline-none" 
                        />
                    </div>

                    <div>
                        <label className="block text-md font-medium text-gray-500 tracking-wider">Password:</label>
                        <input 
                            type="password" 
                            name="password" 
                            placeholder="Enter your password" 
                            onChange={handleChange} 
                            required 
                            className="w-full p-2 border rounded mt-1 text-black outline-none" 
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full cursor-pointer bg-green-600 text-white p-2 rounded hover:bg-green-700 font-bold transition disabled:bg-gray-400"
                    >
                        {loading ? "Logging in..." : "Login to System"}
                    </button>

                    <p className="text-center text-sm text-gray-600 mt-2">
                        Don't have an account?{" "}
                        <Link href="/register" className="text-blue-600 font-bold hover:underline">
                            Register Staff Here
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}