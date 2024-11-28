import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    BookPlus,
    LayoutDashboard,
    FileText,
    Users,
    Calendar,
    ClipboardList,
    MessagesSquare,
    Settings,
    GraduationCap
} from 'lucide-react';

const pnavbar = () => {
    const pathname = usePathname();

    const navItems = [
        {
            label: 'Dashboard',
            icon: LayoutDashboard,
            href: '/professor/dashboard'
        },
        {
            label: 'Course Management',
            icon: GraduationCap,
            href: '/professor/courses'
        },
        {
            label: 'Student Enrollment',
            icon: Users,
            href: '/professor/enrollment'
        },
        {
            label: 'Schedule',
            icon: Calendar,
            href: '/professor/schedule'
        },
        {
            label: 'Assignments',
            icon: ClipboardList,
            href: '/professor/assignments'
        },
        {
            label: 'Messages',
            icon: MessagesSquare,
            href: '/professor/messages'
        },
        {
            label: 'Settings',
            icon: Settings,
            href: '/professor/settings'
        }
    ];

    return (
        <nav className="fixed left-0 top-0 flex h-screen w-64 flex-col border-r border-gray-800 bg-black/50 p-4">
            {/* Logo Section */}
            <Link href="/" className="flex items-center space-x-2 pb-6">
                <BookPlus className="h-8 w-8 text-blue-400" />
                <span className="text-xl font-bold text-blue-400">Lernen</span>
            </Link>

            {/* Navigation Items */}
            <div className="flex-1 space-y-1">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center space-x-2 rounded-lg px-3 py-2 text-sm transition-colors ${isActive
                                ? 'bg-blue-500/10 text-blue-400'
                                : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
                                }`}
                        >
                            <Icon className="h-4 w-4" />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </div>

            {/* Profile Section */}
            <div className="border-t border-gray-800 pt-4">
                <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 rounded-full bg-gray-800" />
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-white">Professor Name</span>
                        <span className="text-xs text-gray-400">professor@lernen.com</span>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default pnavbar;