'use client'
import React, { useState, useEffect } from 'react';
import { Spotlight } from "@/components/ui/spotlight";
import { Button } from "@/components/ui/button";
import { CreditCard } from 'lucide-react';
import { useRouter } from 'next/navigation';
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
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('subscription');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isNavCollapsed, setIsNavCollapsed] = useState(false);
    const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
    const supabase = createClient();

    useEffect(() => {
        fetchUserDetails();
    }, []);

    const fetchUserDetails = async () => {
        try {
            const response = await fetch('/api/user/details');
            const data = await response.json();
            setUserDetails(data);
        } catch (error) {
            console.error('Error fetching user details:', error);
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
            setIsDialogOpen(false);

        } catch (error) {
            console.error('Error cancelling subscription:', error);
            toast.error("Failed to cancel subscription");
        }
    };

    return (
        <div className="flex min-h-screen bg-black">
            <main className="flex-1">
                <div className="relative min-h-screen bg-black/[0.96] text-white p-8">
                    <Spotlight
                        className="-top-40 right-0 md:right-60 md:-top-20"
                        fill="#60A5FA"
                    />

                    {/* Navbar Section */}
                    <Navbar onCollapse={setIsNavCollapsed} />

                    {/* Header Section */}
                    <div className="relative z-10 max-w-4xl mx-auto pt-16">
                        <div className="mb-8">
                            <h1 className="text-2xl font-bold text-blue-400">Settings</h1>
                            <p className="text-gray-400 mt-1">Manage your account settings and preferences</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                            {/* Sidebar Navigation */}
                            <div className="space-y-2">
                                <Button
                                    variant="ghost"
                                    className={`w-full justify-start text-gray-400 hover:text-white hover:bg-gray-800 ${activeTab === 'subscription' ? 'bg-gray-800 text-white' : ''
                                        }`}
                                    onClick={() => setActiveTab('subscription')}
                                >
                                    <CreditCard className="mr-2 h-4 w-4" />
                                    Subscription
                                </Button>
                            </div>

                            {/* Main Content Area */}
                            <div className="md:col-span-3 space-y-6">
                                {/* Subscription Card */}
                                <div className="p-6 rounded-lg border border-gray-800 bg-black/50">
                                    <h2 className="text-xl font-semibold text-blue-400 mb-2">Subscription Management</h2>
                                    <p className="text-gray-400 mb-6">
                                        {userDetails?.userpremiumstatus
                                            ? "You are currently a premium member"
                                            : "You are currently using a free account"}
                                    </p>
                                    <Button
                                        className="w-full bg-red-500 text-white hover:bg-blue-400"
                                        onClick={() => setIsDialogOpen(true)}
                                    >
                                        Cancel Subscription
                                    </Button>
                                </div>
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
                                    className="bg-blue-500 text-white hover:bg-blue-400"
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