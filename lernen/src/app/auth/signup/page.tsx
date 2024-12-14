'use client';

import { useState } from "react";
import { Spotlight } from "@/components/ui/spotlight";
import { UserPlus, Mail, Lock, User, Home, BookPlus } from "lucide-react";
import Link from "next/link";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';


{/* Add a Home Button to redirect you to homepage */ }
export default function SignUpPage() {
    const router = useRouter();
    const supabase = createClientComponentClient();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });


    const validateForm = () => {
        if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
            setError('All fields are required');
            return false;
        }
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return false;
        }
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if(!validateForm()) return;
        try{
          setIsLoading(true);
          const { data, error: signUpError} = await supabase.auth.signUp({
            email: formData.email,
            password: formData.password,
            options: {
              emailRedirectTo: `${window.location.origin}/auth/callback`,
              data: {
                full_name: formData.fullName,
              },
            },
          });
      
          if (signUpError) {
            throw signUpError;
          }
          const userID =data?.user?.id;

          if (!userID) {
            setError('Failed to retrieve user ID. Please try again.');
            return;
          }
          const { data: insertData, error: insertError } = await supabase
            .from('user')
            .insert({
                userID: userID,
                userName: formData.fullName,
                email: formData.email,
                password: formData.password, 
                userType: "Professor", 
                userPremiumStatus: false,
            });

          if (insertError) {
            console.error('Error inserting into user table:', insertError);
            setError('An error occurred while saving your information. Please try again.');
            return;
          }
          router.push('/auth/login?message=Check your email to confirm your account');
        } catch (error: unknown) {
          console.error('Error during sign up:', error);
          setError(error instanceof Error ? error.message : 'An error occurred during sign up');
        } finally {
          setIsLoading(false);
        }
      };
      
    const handleOAuthSignIn = async (provider: 'google' | 'github') => {
        try {
            setIsLoading(true);
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: provider,
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`
                }
            });

            if (error) throw error;
        } catch (error) {
            console.error('OAuth sign in error:', error);
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
                    className="-top-40 right-0 md:right-60 md:-top-20"
                    fill="#60A5FA"
                />

                <div className="relative z-10 w-full max-w-md mx-auto px-4">
                    <div className="w-full space-y-6 backdrop-blur-md p-8 rounded-2xl border border-gray-800">
                        {/* Header */}
                        <div className="space-y-2 text-center">
                            <h1 className="text-3xl font-bold bg-gradient-to-b from-blue-50 to-blue-400 bg-clip-text text-transparent">
                                Create Account
                            </h1>
                            <p className="text-sm text-gray-400">
                                Join Lernen to start managing your courses
                            </p>
                        </div>

                        {error && (
                            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                                {error}
                            </div>
                        )}

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Full Name Input*/}
                            <div className="space-y-2">
                                <label className="text-sm font_medium text-gray-200"> Full Name </label>
                                <div className="relative">
                                    <input
                                        type='text'
                                        placeholder='John Doe'
                                        className="w-full px-4 py-2.5 bg-black border border-gray-800 rounded-lg pr-10 focus:outline-none focus:border-blue-500 transition-colors"
                                        value={formData.fullName}
                                        onChange={(e) =>
                                            setFormData({ ...formData, fullName: e.target.value })
                                        }
                                    />
                                    <User className="absolute right-3 top-[50%] -translate-y-[50%] h-4 w-4 text-gray-500 pointer-events-none" />
                                </div>
                            </div>

                            {/* Email Input*/}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-200"> Email Address</label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        placeholder="username@example.com"
                                        className="w-full px-4 py-2.5 bg-black border border-gray-800 rounded-lg pr-10 focus:outline-none focus:border-blue-500 transition-colors"
                                        value={formData.email}
                                        onChange={(e) =>
                                            setFormData({ ...formData, email: e.target.value })
                                        }
                                    />
                                    <Mail className="absolute right-3 top-3 h-4 w-4 text-gray-500" />
                                </div>
                            </div>

                            {/* Password Input */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-200">Password</label>
                                <div className="relative">
                                    <input
                                        type="password"
                                        placeholder="•••••••••••••••"
                                        className="w-full px-4 py-2.5 bg-black border border-gray-800 rounded-lg pr-10 focus:outline-none focus:border-blue-500 transition-colors"
                                        value={formData.password}
                                        onChange={(e) =>
                                            setFormData({ ...formData, password: e.target.value })
                                        }
                                    />
                                    <Lock className="absolute right-3 top-3 h-4 w-4 text-gray-500" />
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
                                        className="w-full px-4 py-2.5 bg-black border border-gray-800 rounded-lg pr-10 focus:outline-none focus:border-blue-500 transition-colors"
                                        value={formData.confirmPassword}
                                        onChange={(e) =>
                                            setFormData({ ...formData, confirmPassword: e.target.value })
                                        }
                                    />
                                    <Lock className="absolute right-3 top-3 h-4 w-4 text-gray-500" />
                                </div>
                            </div>

                            {/* Sign Up Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center justify-center space-x-2 hover:bg-blue-400 transition-colors"
                            >
                                {isLoading ? (
                                    <span>Creating account...</span>
                                ) : (
                                    <>
                                        <span>Sign Up</span>
                                        <UserPlus className="h-4 w-4" />
                                    </>
                                )}
                            </button>

                            {/* Login Link */}
                            <p className="text-center text-sm text-gray-400">
                                Already have an account?{" "}
                                <Link
                                    href="/auth/login"
                                    className="text-blue-400 hover:text-blue-300 transition-colors"
                                >
                                    Login
                                </Link>
                            </p>
                        </form>

                        <div className="relative flex items-center justify-center">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-800"></div>
                            </div>
                            <div className="relative px-4 bg-black text-sm text-gray-400">
                                Or continue with
                            </div>
                        </div>

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
                    </div>
                </div>
            </div >
        </main >
    );
}