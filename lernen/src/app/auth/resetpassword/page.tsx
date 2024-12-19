'use client';

import { useState, useEffect } from "react";
import { Spotlight } from "@/components/ui/spotlight";
import BlurFade from "@/components/ui/blur-fade";
import { Lock, Check, BookPlus } from "lucide-react";
import Link from "next/link";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

export default function ResetPasswordPage() {
    const [formData, setFormData] = useState({
        newPassword: '',
        confirmPassword: '',
    });
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const router = useRouter();
    const supabase = createClientComponentClient();

    useEffect(() => {
        if (isSuccess) {
            const timer = setTimeout(() => {
                router.push('/auth/login');
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [isSuccess, router]);

    const validateForm = () => {
        if (!formData.newPassword || !formData.confirmPassword) {
            setError('All fields are required');
            return false;
        }
        if (formData.newPassword !== formData.confirmPassword) {
            setError('Passwords do not match');
            return false;
        }
        if (formData.newPassword.length < 6) {
            setError('Password must be at least 6 characters long');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!validateForm()) return;

        try {
            setIsLoading(true);

            const { error } = await supabase.auth.updateUser({
                password: formData.newPassword
            });

            if (error) throw error;

            setIsSuccess(true);
        } catch (error) {
            console.error('Error resetting password:', error);
            setError(error instanceof Error ? error.message : 'An error occurred while resetting password');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="flex min-h-screen flex-col bg-black text-white">
            <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-black/[0.96] antialiased bg-grid-white/[0.02]">
                {/* Lernen Home Redirection */}
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

                <div className="relative z-10 flex w-full max-w-md flex-col items-center justify-center px-4">
                    <BlurFade delay={0.15} inView>
                        {isSuccess ? (
                            <div className="w-full space-y-6 bg-black/50 p-8 rounded-2xl border border-gray-800 text-center">
                                <div className="flex justify-center">
                                    <div className="rounded-full bg-green-500/20 p-3">
                                        <Check className="h-8 w-8 text-green-400" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <h1 className="text-3xl font-bold bg-gradient-to-b from-blue-50 to-blue-400 bg-clip-text text-transparent">
                                        Password Reset Complete!
                                    </h1>
                                    <p className="text-gray-400">
                                        Your password has been successfully updated.
                                    </p>
                                    <p className="text-sm text-gray-400">
                                        Redirecting to login page in 3 seconds...
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="w-full space-y-6 bg-black/50 p-8 rounded-2xl border border-gray-800">
                                <div className="space-y-2 text-center">
                                    <h1 className="text-3xl font-bold bg-gradient-to-b from-blue-50 to-blue-400 bg-clip-text text-transparent">
                                        Reset Password
                                    </h1>
                                    <p className="text-sm text-gray-400">
                                        Please enter your new password
                                    </p>
                                </div>

                                {error && (
                                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                                        {error}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-200">
                                            New Password
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="password"
                                                placeholder="••••••••"
                                                className="w-full px-4 py-2 bg-black border border-gray-800 rounded-lg pl-10 focus:outline-none focus:border-blue-500 transition-colors"
                                                value={formData.newPassword}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, newPassword: e.target.value })
                                                }
                                            />
                                            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-200">
                                            Confirm New Password
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="password"
                                                placeholder="••••••••"
                                                className="w-full px-4 py-2 bg-black border border-gray-800 rounded-lg pl-10 focus:outline-none focus:border-blue-500 transition-colors"
                                                value={formData.confirmPassword}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, confirmPassword: e.target.value })
                                                }
                                            />
                                            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? "Resetting Password..." : "Reset Password"}
                                    </button>
                                </form>
                            </div>
                        )}
                    </BlurFade>
                </div>
            </div>
        </main>
    );
}