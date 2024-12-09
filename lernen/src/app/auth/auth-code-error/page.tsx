'use client';

import { useState, useEffect } from "react";
import { Spotlight } from "@/components/ui/spotlight";
import BlurFade from "@/components/ui/blur-fade";
import { AlertCircle, BookPlus } from "lucide-react";
import Link from "next/link";

export default function AuthCodeError() {
    const [isRedirecting, setIsRedirecting] = useState(false);

    // Auto-redirect after 5 seconds
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsRedirecting(true);
            window.location.href = "/auth/signup";
        }, 5000);

        return () => clearTimeout(timer);
    }, []);

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
                        <div className="w-full space-y-6 bg-black/50 p-8 rounded-2xl border border-gray-800 text-center">
                            {/* Error Icon */}
                            <div className="flex justify-center">
                                <div className="rounded-full bg-red-500/20 p-3">
                                    <AlertCircle className="h-8 w-8 text-red-400" />
                                </div>
                            </div>

                            {/* Header */}
                            <div className="space-y-2">
                                <h1 className="text-3xl font-bold bg-gradient-to-b from-blue-50 to-blue-400 bg-clip-text text-transparent">
                                    Authentication Error
                                </h1>
                                <p className="text-gray-400">
                                    There was a problem with your authentication code.
                                    This could be because the link has expired or was already used.
                                </p>
                            </div>

                            {/* Redirect Message */}
                            <div className="text-sm text-gray-400">
                                {isRedirecting ? (
                                    <p>Redirecting to sign up page...</p>
                                ) : (
                                    <p>You will be redirected to the sign up page in 5 seconds.</p>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="space-y-3">
                                <Link
                                    href="/auth/signup"
                                    className="block w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-400 transition-colors"
                                >
                                    Try Signing Up Again
                                </Link>

                                <Link
                                    href="/auth/login"
                                    className="block w-full px-4 py-2 bg-transparent border border-gray-800 text-gray-400 rounded-lg hover:bg-gray-800/50 transition-colors"
                                >
                                    Back to Login
                                </Link>
                            </div>
                        </div>
                    </BlurFade>
                </div>
            </div>
        </main>
    );
}