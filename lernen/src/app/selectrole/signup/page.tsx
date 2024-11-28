'use client';

import { useState } from "react";
import { Spotlight } from "@/components/ui/spotlight";
import BlurFade from "@/components/ui/blur-fade";
import { UserPlus, Mail, Lock, User, Home, BookPlus } from "lucide-react";
import Link from "next/link";

{/* Add a Home Button to redirect you to homepage */ }
export default function SignUpPage() {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Do Backend Here
        console.log(formData)
    };

    return (
        <main className="flex min-h-screen flex-col bg-black text-white">
            <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-black/[0.96] antialiased bg-grid-white/[0.02]">
                {/* Added Lernen Home Redirecton */}
                <div className="absolute top-4 left-4 z-20">
                    <Link href="/">
                        <div className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                            <BookPlus className="h-8 w-8 text-blue-400" />
                            <span className="text-2xl font-bold text-blue-400">Lernen</span>
                        </div>
                    </Link>
                </div>

                <Spotlight
                    className="-top-40 right-0 md:right-60 md:-top-20"
                    fill="#60A5FA"
                />

                <div className="relative z-10 flex w-full max-w-md flex-col items-center justify-center px-4">
                    <BlurFade delay={0.15} inView>
                        <div className="w-full space-y-6 bg-black/50 p-8 rounded-2xl border border-gray-800">
                            {/* Header */}
                            <div className="space-y-2 text-center">
                                <h1 className="text-3xl font-bold bg-gradient-to-b from-blue-50 to-blue-400 bg-clip-text text-transparent">
                                    Create Account
                                </h1>
                                <p className="text-sm text-gray-400">
                                    Join Lernen to start managing your courses
                                </p>
                            </div>


                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Full Name Input*/}
                                <div className="space-y-2">
                                    <label className="text-sm font_medium text-gray-200"> Full Name </label>
                                    <div className='relative'>
                                        <input
                                            type='text'
                                            placeholder='John Doe'
                                            className="w-full px-4 py-2 bg-black border border-gray-800 rounded-lg pl-10 focus:outline-none focus:border-blue-500 transition-colors"
                                            value={formData.fullName}
                                            onChange={(e) =>
                                                setFormData({ ...formData, fullName: e.target.value })
                                            }
                                        />
                                        <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                                    </div>
                                </div>

                                {/* Email Input*/}
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
                                            placeholder="•••••••••••••••"
                                            className="w-full px-4 py-2 bg-black border border-gray-800 rounded-lg pl-10 focus:outline-none focus:border-blue-500 transition-colors"
                                            value={formData.password}
                                            onChange={(e) =>
                                                setFormData({ ...formData, password: e.target.value })
                                            }
                                        />
                                        <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                                    </div>
                                </div>

                                {/* Confirm Password Input */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-200">
                                        Confirm Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="password"
                                            placeholder="•••••••••••••••"
                                            className="w-full px-4 py-2 bg-black border border-gray-800 rounded-lg pl-10 focus:outline-none focus:border-blue-500 transition-colors"
                                            value={formData.confirmPassword}
                                            onChange={(e) =>
                                                setFormData({ ...formData, confirmPassword: e.target.value })
                                            }
                                        />
                                        <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                                    </div>
                                </div>

                                {/* Sign Up Button */}
                                <button
                                    type="submit"
                                    className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center justify-center space-x-2 hover:bg-blue-400 transition-colors"
                                >
                                    <span>Sign Up</span>
                                    <UserPlus className="h-4 w-4" />
                                </button>

                                {/* Login Link */}
                                <p className="text-center text-sm text-gray-400">
                                    Already have an account?{" "}
                                    <Link
                                        href="/selectrole/login"
                                        className="text-blue-400 hover:text-blue-300 transition-colors"
                                    >
                                        Login
                                    </Link>
                                </p>
                            </form>
                        </div>
                    </BlurFade>
                </div>x
            </div>
        </main>
    );
}