"use client";

export default function loginPage (){

    const handleLoginVal = () => {
        
    }

    return(
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="w-full max-w-md p-8 rounded-lg shadow-xl bg-white flex flex-col gap-6">
                <h2 className="text-center text-black text-xl font-semibold">Welcome Back! POS - Login Page</h2>
                <form>
                    <div>
                        <label className="block text-md tracking-wider  font-medium text-gray-500">Email Address:</label>
                        <input type="email" placeholder="Enter your email" required onChange={handleLoginVal}  className="w-full p-2 border rounded mt-1 text-black outline-none" />
                    </div>
                    <div className="mt-4">
                        <label className="block text-md tracking-wider  font-medium text-gray-500">Password:</label>
                        <input type="password" placeholder="Enter your password" required onChange={handleLoginVal} className="w-full p-2 border rounded mt-1 text-black outline-none" />
                    </div>
                    <button type="submit" className="mt-4 w-full cursor-pointer bg-blue-600 text-white p-2 rounded hover:bg-blue-700 font-bold transition">Login Now...</button>
                     <p className="text-center text-sm text-gray-600 mt-2">
                        Don't have an account?{" "}
                        <Link href="/register" className="text-blue-600 font-bold hover:underline">
                            Go to Register Page
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    )
}
