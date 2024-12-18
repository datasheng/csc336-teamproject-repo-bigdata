'use client'
import React, { useState, useEffect } from 'react';
import { Spotlight } from "@/components/ui/spotlight";
import { Button } from "@/components/ui/button";
import { CreditCard, Check, X } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import Navbar from "@/components/ui/studentnavbar";
import toast from "react-hot-toast";
import { createClient } from '@/utils/supabase/client';

interface UserDetails {
    username: string;
    email: string;
    userpremiumstatus: boolean;
}

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('subscription');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isNavCollapsed, setIsNavCollapsed] = useState(false);
    const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
    const [selectedPlan, setSelectedPlan] = useState<'free' | 'premium'>('free');
    const supabase = createClient();

    useEffect(() => {
        fetchUserDetails();
    }, []);

    const fetchUserDetails = async () => {
        try {
            const response = await fetch('/api/user/details');
            const data = await response.json();
            setUserDetails(data);
            setSelectedPlan(data.userpremiumstatus ? 'premium' : 'free');
        } catch (error) {
            console.error('Error fetching user details:', error);
        }
    };

    const handleSubscriptionChange = async (plan: 'free' | 'premium') => {
        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) throw new Error('No user found');

            const { error } = await supabase
                .from('user')
                .update({ userPremiumStatus: plan === 'premium' })
                .eq('userID', user.id);

            if (error) throw error;

            setUserDetails(prev => prev ? { ...prev, userpremiumstatus: plan === 'premium' } : null);
            setSelectedPlan(plan);
            toast.success(`Successfully switched to ${plan} plan`);

            setTimeout(() => {
                window.location.reload();
            }, 500);

        } catch (error) {
            console.error('Error changing subscription:', error);
            toast.error("Failed to change subscription");
        }
    };

    const handleCancelSubscription = async () => {
        if (!userDetails?.userpremiumstatus) {
            toast.error("You are not currently a premium member");
            setIsDialogOpen(false);
            return;
        }

        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) throw new Error('No user found');

            const { error } = await supabase
                .from('user')
                .update({ userPremiumStatus: false })
                .eq('userID', user.id);

            if (error) throw error;

            toast.success("Successfully cancelled premium subscription");
            setUserDetails(prev => prev ? { ...prev, userpremiumstatus: false } : null);
            setSelectedPlan('free');
            setIsDialogOpen(false);

            setTimeout(() => {
                window.location.reload();
            }, 500);


        } catch (error) {
            console.error('Error cancelling subscription:', error);
            toast.error("Failed to cancel subscription");
        }
    };

    return (
        <div className="flex min-h-screen bg-black">
            <main className="flex-1">
                <div className="relative min-h-screen bg-black/[0.96] text-white p-8">
                    <Navbar onCollapse={setIsNavCollapsed} />
                    <Spotlight
                        className="-top-40 right-0 md:right-60 md:-top-20"
                        fill="#60A5FA"
                    />

                    <div className="relative z-10 max-w-4xl mx-auto pt-16">
                        <div className="mb-8">
                            <h1 className="text-2xl font-bold text-blue-400">Settings</h1>
                            <p className="text-gray-400 mt-1">Manage your account settings and preferences</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                            <div className="space-y-2">
                                <Button
                                    variant="ghost"
                                    className={`w-full justify-start text-gray-400 hover:text-white hover:bg-gray-800 ${activeTab === 'subscription' ? 'bg-gray-800 text-white' : ''}`}
                                    onClick={() => setActiveTab('subscription')}
                                >
                                    <CreditCard className="mr-2 h-4 w-4" />
                                    Subscription
                                </Button>
                            </div>

                            <div className="md:col-span-3 space-y-6">
                                <div className="p-6 rounded-lg border border-gray-800 bg-black/50">
                                    <h2 className="text-xl font-semibold text-blue-400 mb-2">Subscription Plans</h2>
                                    <p className="text-gray-400 mb-6">Choose the plan that works best for you</p>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        {/* Free Plan */}
                                        <div className={`p-6 rounded-lg border ${selectedPlan === 'free' ? 'border-blue-500' : 'border-gray-800'} bg-black/30`}>
                                            <h3 className="text-lg font-semibold">Free</h3>
                                            <div className="mt-4">
                                                <p className="text-3xl font-bold">$0</p>
                                                <p className="text-gray-400">For students getting started</p>
                                            </div>
                                            <ul className="mt-6 space-y-3">
                                                <li className="flex items-center text-gray-400">
                                                    <Check className="h-4 w-4 mr-2 text-blue-500" />
                                                    Basic course access
                                                </li>
                                                <li className="flex items-center text-gray-400">
                                                    <Check className="h-4 w-4 mr-2 text-blue-500" />
                                                    3 courses enrollment limit
                                                </li>
                                                <li className="flex items-center text-gray-400">
                                                    <Check className="h-4 w-4 mr-2 text-blue-500" />
                                                    Basic calendar features
                                                </li>
                                                <li className="flex items-center text-gray-400">
                                                    <Check className="h-4 w-4 mr-2 text-blue-500" />
                                                    Standard support
                                                </li>
                                                <li className="flex items-center text-gray-400">
                                                    <X className="h-4 w-4 mr-2 text-gray-500" />
                                                    Unlimited course enrollments
                                                </li>
                                                <li className="flex items-center text-gray-400">
                                                    <X className="h-4 w-4 mr-2 text-gray-500" />
                                                    Advanced calendar features
                                                </li>
                                                <li className="flex items-center text-gray-400">
                                                    <X className="h-4 w-4 mr-2 text-gray-500" />
                                                    Priority support
                                                </li>
                                            </ul>
                                            <Button
                                                className="w-full mt-6"
                                                variant="secondary"
                                                onClick={() => handleSubscriptionChange('free')}
                                                disabled={selectedPlan === 'free'}
                                            >
                                                {selectedPlan === 'free' ? 'Current Plan' : 'Select Free Plan'}
                                            </Button>
                                        </div>

                                        {/* Premium Plan */}
                                        <div className={`relative p-6 rounded-lg border ${selectedPlan === 'premium' ? 'border-blue-500' : 'border-gray-800'
                                            } bg-black/30 overflow-hidden`}>
                                            <div className="absolute top-0 left-0 w-full h-1 bg-blue-500" />
                                            <div className="relative z-10">
                                                <h3 className="text-lg font-semibold text-blue-500">Premium</h3>
                                                <div className="mt-4 flex items-baseline">
                                                    <p className="text-3xl font-bold">$2.99</p>
                                                    <span className="text-sm text-gray-400 ml-1">/month</span>
                                                </div>
                                                <p className="text-gray-400 mt-1">For students who want more</p>
                                                <ul className="mt-6 space-y-3">
                                                    <li className="flex items-center text-gray-300">
                                                        <Check className="h-4 w-4 mr-2 text-blue-500" />
                                                        Basic course access
                                                    </li>
                                                    <li className="flex items-center text-gray-300">
                                                        <Check className="h-4 w-4 mr-2 text-blue-500" />
                                                        3 courses enrollment limit
                                                    </li>
                                                    <li className="flex items-center text-gray-300">
                                                        <Check className="h-4 w-4 mr-2 text-blue-500" />
                                                        Basic calendar features
                                                    </li>
                                                    <li className="flex items-center text-gray-300">
                                                        <Check className="h-4 w-4 mr-2 text-blue-500" />
                                                        Standard support
                                                    </li>
                                                    <li className="flex items-center text-gray-300">
                                                        <Check className="h-4 w-4 mr-2 text-blue-500" />
                                                        Unlimited course enrollments
                                                    </li>
                                                    <li className="flex items-center text-gray-300">
                                                        <Check className="h-4 w-4 mr-2 text-blue-500" />
                                                        Advanced calendar features
                                                    </li>
                                                    <li className="flex items-center text-gray-300">
                                                        <Check className="h-4 w-4 mr-2 text-blue-500" />
                                                        Priority support
                                                    </li>
                                                </ul>
                                                <Button
                                                    className={`w-full mt-6 ${selectedPlan === 'premium'
                                                        ? 'bg-green-600 hover:bg-green-700 text-white'
                                                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                                                        }`}
                                                    onClick={() => handleSubscriptionChange('premium')}
                                                    disabled={selectedPlan === 'premium'}
                                                >
                                                    {selectedPlan === 'premium' ? 'Currently Enrolled' : 'Select Premium Plan'}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Subscription Management */}
                                {selectedPlan === 'premium' && (
                                    <div className="p-6 rounded-lg border border-gray-800 bg-black/50">
                                        <h2 className="text-xl font-semibold text-blue-400 mb-2">Subscription Management</h2>
                                        <p className="text-gray-400 mb-6">
                                            You are currently a premium member
                                        </p>
                                        <Button
                                            className="w-full bg-red-500 text-white hover:bg-red-600"
                                            onClick={() => setIsDialogOpen(true)}
                                        >
                                            Cancel Subscription
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Confirmation Dialog */}
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogContent className="bg-black border border-gray-800">
                            <DialogHeader>
                                <DialogTitle className="text-blue-400">Cancel Subscription</DialogTitle>
                                <DialogDescription className="text-gray-400">
                                    Are you sure you want to cancel your subscription? This action cannot be undone.
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter className="flex justify-end space-x-2 pt-4">
                                <Button
                                    variant="outline"
                                    onClick={() => setIsDialogOpen(false)}
                                    className="border-gray-800 hover:bg-gray-800 text-gray-400"
                                >
                                    Keep Subscription
                                </Button>
                                <Button
                                    onClick={handleCancelSubscription}
                                    className="bg-red-500 text-white hover:bg-red-600"
                                >
                                    Yes, Cancel Subscription
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </main>
        </div>
    );
}