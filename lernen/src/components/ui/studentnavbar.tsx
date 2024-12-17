'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    BookPlus,
    LayoutDashboard,
    CalendarDays,
    Users,
    ChevronLeft,
    ChevronRight,
    ScrollText,
    Star,
    LogOut,
    Settings
} from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { motion } from "framer-motion";

interface NavbarProps {
    onCollapse?: (collapsed: boolean) => void;
}

// temp type for nav items
// logout here is temp as well, i'll make this nicer later.
type NavItem = {
    label: string;
    icon: any;
    href?: string;
    onClick?: () => Promise<void>;
};

const StudentNavbar: React.FC<NavbarProps> = ({ onCollapse }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const supabase = createClient();
    const [userDetails, setUserDetails] = useState<{ username: string; email: string } | null>(null);

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await fetch('/api/user/details');
                const data = await response.json();
                setUserDetails(data);
            } catch (error) {
                console.error('Error fetching user details:', error);
            }
        };

        fetchUserDetails();
    }, []);

    const handleCollapse = () => {
        const newCollapsedState = !isCollapsed;
        setIsCollapsed(newCollapsedState);
        if (onCollapse) {
            onCollapse(newCollapsedState);
        }
    };

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (!error) {
            router.push('/');
        }
    };

    const navItems = [
        {
            section: 'Main',
            items: [
                {
                    label: 'Dashboard',
                    icon: LayoutDashboard,
                    href: '/student'
                },
                {
                    label: 'Enroll',
                    icon: ScrollText,
                    href: '/student/enroll'
                },
                {
                    label: 'Calendar',
                    icon: CalendarDays,
                    href: '/student/calendar'
                }
            ]
        },
        {
            section: 'View',
            items: [
                {
                    label: 'Students',
                    icon: Users,
                    href: '/student/list'
                },
                {
                    label: 'Professor Reviews',
                    icon: Star,
                    href: '/rating'
                }
            ]
        },
        {
            section: 'Account',
            items: [

                {
                    label: 'Settings',
                    icon: Settings,
                    href: '/student/settings'
                },
                {
                    label: 'Logout',
                    icon: LogOut,
                    onClick: handleLogout
                }
            ]
        }
    ];

    return (
        <div className="relative">
            <div
                className={`fixed left-0 top-0 flex h-screen flex-col border-r border-gray-800 bg-white/[0.02] transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'}`}
            >
                {/* Logo Section */}
                <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'px-4'} py-4`}>
                    {!isCollapsed && (
                        <Link href="/" className="flex items-center space-x-2">
                            <BookPlus className="h-8 w-8 text-blue-400" />
                            <span className="text-xl font-bold text-blue-400">Lernen</span>
                        </Link>
                    )}
                    {isCollapsed && (
                        <BookPlus className="h-8 w-8 text-blue-400" />
                    )}
                </div>

                {/* Collapse Toggle Button */}
                <button
                    onClick={handleCollapse}
                    className={`absolute -right-3 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border border-gray-800 bg-black text-gray-400 hover:text-white transition-transform duration-300 hover:scale-110`}
                >
                    {isCollapsed ? (
                        <ChevronRight className="h-4 w-4" />
                    ) : (
                        <ChevronLeft className="h-4 w-4" />
                    )}
                </button>

                {/* Navigation Sections */}
                <div className="flex-1 space-y-6 overflow-y-auto p-4">
                    {navItems.map((section, idx) => (
                        <div key={idx} className="space-y-2">
                            {!isCollapsed && (
                                <div className="text-xs font-semibold uppercase text-gray-400 pl-3">
                                    {section.section}
                                </div>
                            )}
                            {section.items.map((item: NavItem) => {
                                const Icon = item.icon;
                                const isActive = item.href ? pathname === item.href : false;

                                if (item.href) {
                                    return (
                                        <Link
                                            key={item.label}
                                            href={item.href}
                                            className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors relative group ${isActive
                                                ? 'bg-blue-500/10 text-blue-400'
                                                : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
                                                }`}
                                        >
                                            <div className="flex items-center space-x-2">
                                                <Icon className="h-4 w-4 flex-shrink-0" />
                                                {!isCollapsed && <span>{item.label}</span>}
                                            </div>

                                            {/* Tooltip for collapsed state */}
                                            {isCollapsed && (
                                                <div className="absolute left-full ml-2 hidden rounded-md bg-gray-800 px-2 py-1 text-xs text-white group-hover:block z-50">
                                                    {item.label}
                                                </div>
                                            )}
                                        </Link>
                                    );
                                }

                                return (
                                    <button
                                        key={item.label}
                                        onClick={item.onClick}
                                        className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors relative group text-gray-400 hover:bg-gray-800/50 hover:text-white`}
                                    >
                                        <div className="flex items-center space-x-2">
                                            <Icon className="h-4 w-4 flex-shrink-0" />
                                            {!isCollapsed && <span>{item.label}</span>}
                                        </div>

                                        {/* Tooltip for collapsed state */}
                                        {isCollapsed && (
                                            <div className="absolute left-full ml-2 hidden rounded-md bg-gray-800 px-2 py-1 text-xs text-white group-hover:block z-50">
                                                {item.label}
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    ))}
                </div>

                {/* Profile Section */}
                {!isCollapsed && (
                    <div className="border-t border-gray-800 p-4">
                        <div className="flex items-center space-x-3">
                            <motion.div 
                                className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0"
                                whileHover={{ scale: 1.1 }}
                                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                            >
                                <span className="text-blue-400 text-xl font-bold">
                                    {userDetails?.username?.[0] || '?'}
                                </span>
                            </motion.div>
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-white">
                                    {userDetails?.username || 'Loading...'}
                                </span>
                                <span className="text-xs text-gray-400">
                                    {userDetails?.email || 'Loading...'}
                                </span>
                            </div>
                        </div>
                    </div>
                )}
                {isCollapsed && (
                    <div className="border-t border-gray-800 p-4 flex justify-center">
                        <div className="h-8 w-8 rounded-full bg-gray-800 group relative">
                            <div className="absolute left-full ml-2 hidden rounded-md bg-gray-800 px-2 py-1 text-xs text-white group-hover:block whitespace-nowrap">
                                {userDetails?.username || 'Loading...'}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentNavbar;