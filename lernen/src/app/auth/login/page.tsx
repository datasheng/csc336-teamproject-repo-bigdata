"use client";

import { useState } from "react";
import { Spotlight } from "@/components/ui/spotlight";
import { LogIn, Mail, Lock, BookPlus } from "lucide-react";
import Link from "next/link";
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation';


export default function LoginPage() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const supabase = createClient()

    const handleEmailSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try { // First, authenticate the user
            const { data: { user }, error: signInError } = await supabase.auth.signInWithPassword({
                email: formData.email,
                password: formData.password,
            });

            if (signInError) throw signInError;
            if (!user) throw new Error('No user found');

            // Then fetch the user's details from your user table
            const { data: userData, error: userError } = await supabase
                .from('user')
                .select('userID, userType')
                .eq('email', user.email)
                .single();

            if (userError) throw userError;

            // usertype redirect
            if (userData.userType === "Professor") {
                router.push('/professor');
            } else if (userData.userType === "Student") {
                router.push('/student');
            } else {
                throw new Error('Invalid user type');
            }

            router.refresh();


        } catch (error: any) {
            setError(error.message || 'Failed to sign in');
        } finally {
            setIsLoading(false);
        }
    };

    const handleOAuthSignIn = async (provider: 'google') => {
        try {
            setIsLoading(true);
            setError(null);

            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: provider,
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`
                }
            });
            if (error) throw error;
        } catch (error: any) {
            setError(error.message || `Failed to sign in with ${provider}`);
        } finally {
            setIsLoading(false);
        }
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
                    className="-top-40 left-0 md:left-60 md:-top-20"
                    fill="#60A5FA"
                />

                <div className="relative z-10 w-full max-w-md mx-auto px-4">
                    <div className="w-full space-y-6 backdrop-blur-md p-8 rounded-2xl border border-gray-800">
                        {/* Header */}
                        <div className="space-y-2 text-center">
                            <h1 className="text-3xl font-bold bg-gradient-to-b from-blue-50 to-blue-400 bg-clip-text text-transparent">
                                Welcome Back!
                            </h1>
                            <p className="text-sm text-gray-400">
                                Please login to your account
                            </p>
                        </div>

                        {error && (
                            <div className="p-3 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg">
                                {error}
                            </div>
                        )}


                        {/* Form */}
                        <form onSubmit={handleEmailSignIn} className="space-y-4">
                            {/* Email Input */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-200">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        placeholder="username@example.com"
                                        className="w-full px-4 py-2.5 bg-black border border-gray-800 rounded-lg pr-10 focus:outline-none focus:border-blue-500 transition-colors"
                                        value={formData.email}
                                        onChange={(e) =>
                                            setFormData({ ...formData, email: e.target.value })
                                        }
                                        disabled={isLoading}
                                    />
                                    <Mail className="absolute right-3 top-[50%] -translate-y-[50%] h-4 w-4 text-gray-500 pointer-events-none" />
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
                                        className="w-full px-4 py-2.5 bg-black border border-gray-800 rounded-lg pr-10 focus:outline-none focus:border-blue-500 transition-colors"
                                        value={formData.password}
                                        onChange={(e) =>
                                            setFormData({ ...formData, password: e.target.value })
                                        }
                                    />
                                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                                </div>
                            </div>

                            {/* Forgot Password Link */}
                            <div className="flex justify-end">
                                <Link
                                    href="/auth/forgotpassword"
                                    className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                                >
                                    Forgot Password?
                                </Link>
                            </div>

                            {/* Login Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center justify-center space-x-2 hover:bg-blue-400 transition-colors"
                            >
                                <span>{isLoading ? 'Signing in...' : 'Login'}</span>
                                <LogIn className="h-4 w-4" />
                            </button>

                            {/* OAuth Buttons */}
                            <div className="space-y-3">
                                <button
                                    onClick={() => handleOAuthSignIn('google')}
                                    disabled={isLoading}
                                    className="w-full px-4 py-2 bg-black border border-gray-800 rounded-lg flex items-center justify-center space-x-2 hover:bg-gray-800/50 transition-colors text-gray-200"
                                >
                                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                                        <path
                                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                            fill="#4285F4"
                                        />
                                        <path
                                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                            fill="#34A853"
                                        />
                                        <path
                                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                            fill="#FBBC05"
                                        />
                                        <path
                                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                            fill="#EA4335"
                                        />
                                    </svg>
                                    <span>Continue with Google</span>
                                </button>
                            </div>

                            {/* Sign Up Link */}
                            <p className="text-center text-sm text-gray-400">
                                New User?{" "}
                                <Link
                                    href="/selectrole"
                                    className="text-blue-400 hover:text-blue-300 transition-colors"
                                >
                                    Sign up
                                </Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
}