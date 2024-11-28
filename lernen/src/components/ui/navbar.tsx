'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    BookPlus,
    LayoutDashboard,
    CalendarDays,
    Users,
    ClipboardList,
    BellRing,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';

interface NavbarProps {
    onCollapse?: (collapsed: boolean) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onCollapse }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const pathname = usePathname();

    const handleCollapse = () => {
        const newCollapsedState = !isCollapsed;
        setIsCollapsed(newCollapsedState);
        if (onCollapse) {
            onCollapse(newCollapsedState);
        }
    };

    const navItems = [
        {
            section: 'Main',
            items: [
                {
                    label: 'Dashboard',
                    icon: LayoutDashboard,
                    href: '/professor/dashboard'
                },
                {
                    label: 'Calendar',
                    icon: CalendarDays,
                    href: '/professor/calendar'
                },
                {
                    label: 'Announcements',
                    icon: BellRing,
                    href: 'professor/announcement',
                    notifications: 2
                }
            ]
        },
        {
            section: 'Manage',
            items: [
                {
                    label: 'Courses',
                    icon: ClipboardList,
                    href: '/professor/courses'
                },
                {
                    label: 'Students',
                    icon: Users,
                    href: '/professor/Students'
                }
            ]
        },
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
                            {section.items.map((item) => {
                                const Icon = item.icon;
                                const isActive = pathname === item.href;

                                return (
                                    <Link
                                        key={item.href}
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

                                        {!isCollapsed && item.notifications && (
                                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                                                {item.notifications}
                                            </span>
                                        )}

                                        {/* Tooltip for collapsed state */}
                                        {isCollapsed && (
                                            <div className="absolute left-full ml-2 hidden rounded-md bg-gray-800 px-2 py-1 text-xs text-white group-hover:block z-50">
                                                {item.label}
                                                {item.notifications && (
                                                    <span className="ml-2 inline-flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs">
                                                        {item.notifications}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    ))}
                </div>

                {/* Profile Section */}
                {!isCollapsed && (
                    <div className="border-t border-gray-800 p-4">
                        <div className="flex items-center space-x-3">
                            <div className="h-8 w-8 rounded-full bg-gray-800" />
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-white">Professor Name</span>
                                <span className="text-xs text-gray-400">professor@lernen.com</span>
                            </div>
                        </div>
                    </div>
                )}
                {isCollapsed && (
                    <div className="border-t border-gray-800 p-4 flex justify-center">
                        <div className="h-8 w-8 rounded-full bg-gray-800 group relative">
                            <div className="absolute left-full ml-2 hidden rounded-md bg-gray-800 px-2 py-1 text-xs text-white group-hover:block whitespace-nowrap">
                                Professor Name
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Navbar;