"use client";

import { useState } from "react";
import { Spotlight } from "@/components/ui/spotlight";
import BlurFade from "@/components/ui/blur-fade";
import { LogIn, Mail, Lock } from "lucide-react";
import Link from "next/link";

{/* TODO: Add a Forgot Password Page*/ }
export default function LoginPage() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle login logic here
        console.log(formData);
    };

    return (
        <main className="flex min-h-screen flex-col bg-black text-white">
            <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-black/[0.96] antialiased bg-grid-white/[0.02]">
                <Spotlight
                    className="-top-40 left-0 md:left-60 md:-top-20"
                    fill="#60A5FA"
                />

                <div className="relative z-10 flex w-full max-w-md flex-col items-center justify-center px-4">
                    <BlurFade delay={0.15} inView>
                        <div className="w-full space-y-6 bg-black/50 p-8 rounded-2xl border border-gray-800">
                            {/* Header */}
                            <div className="space-y-2 text-center">
                                <h1 className="text-3xl font-bold bg-gradient-to-b from-blue-50 to-blue-400 bg-clip-text text-transparent">
                                    Welcome Back!
                                </h1>
                                <p className="text-sm text-gray-400">
                                    Please login to your account
                                </p>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Email Input */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-200">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="email"
                                            placeholder="username@example.com"
                                            className="w-full px-4 py-2 bg-black border border-gray-800 rounded-lg pl-10 focus:outline-none focus:border-blue-500 transition-colors"
                                            value={formData.email}
                                            onChange={(e) =>
                                                setFormData({ ...formData, email: e.target.value })
                                            }
                                        />
                                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                                    </div>
                                </div>

                                {/* Password Input */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-200">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="password"
                                            placeholder="••••••••"
                                            className="w-full px-4 py-2 bg-black border border-gray-800 rounded-lg pl-10 focus:outline-none focus:border-blue-500 transition-colors"
                                            value={formData.password}
                                            onChange={(e) =>
                                                setFormData({ ...formData, password: e.target.value })
                                            }
                                        />
                                        <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                                    </div>
                                </div>

                                {/* Forgot Password Link */}
                                <div className="flex justify-end">
                                    <Link
                                        href="/forgotpassword"
                                        className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                                    >
                                        Forgot Password?
                                    </Link>
                                </div>

                                {/* Login Button */}
                                <button
                                    type="submit"
                                    className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center justify-center space-x-2 hover:bg-blue-400 transition-colors"
                                >
                                    <span>Login</span>
                                    <LogIn className="h-4 w-4" />
                                </button>

                                {/* Sign Up Link */}
                                <p className="text-center text-sm text-gray-400">
                                    New User?{" "}
                                    <Link
                                        href="/selectrole/signup"
                                        className="text-blue-400 hover:text-blue-300 transition-colors"
                                    >
                                        Sign up
                                    </Link>
                                </p>
                            </form>
                        </div>
                    </BlurFade>
                </div>
            </div>
        </main>
    );
}