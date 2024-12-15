import React, { useState, ReactNode } from 'react';
import { ChevronDown, ChevronUp, LucideIcon } from 'lucide-react';
import { cn } from "@/lib/utils";

interface CollapsibleSectionProps {
    title: string;
    description?: string;
    icon?: LucideIcon;
    defaultExpanded?: boolean;
    headerClassName?: string;
    contentClassName?: string;
    children: ReactNode;
    stats?: {
        label: string;
        value: string | number;
    }[];
}

const CollapsibleSection = ({
    title,
    description,
    icon: Icon,
    defaultExpanded = false,
    headerClassName,
    contentClassName,
    children,
    stats,
}: CollapsibleSectionProps) => {
    const [isExpanded, setIsExpanded] = useState(defaultExpanded);

    return (
        <div className="w-full">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className={cn(
                    "w-full flex items-center justify-between p-4 bg-black/50 border border-gray-800 rounded-lg hover:bg-gray-900/50 transition-colors",
                    headerClassName
                )}
            >
                <div className="flex items-center space-x-3">
                    {Icon && <Icon className="h-5 w-5 text-blue-400" />}
                    <div className="text-left">
                        <h3 className="text-lg font-semibold text-white">{title}</h3>
                        {description && (
                            <p className="text-sm text-gray-400">{description}</p>
                        )}
                        {stats && (
                            <div className="flex gap-4 mt-1">
                                {stats.map((stat, index) => (
                                    <p key={index} className="text-sm text-gray-400">
                                        {stat.label}: <span className="text-white">{stat.value}</span>
                                    </p>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                {isExpanded ? (
                    <ChevronUp className="h-5 w-5 text-gray-400" />
                ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                )}
            </button>

            {isExpanded && (
                <div
                    className={cn(
                        "mt-4 space-y-4 animate-in slide-in-from-top-4 duration-200",
                        contentClassName
                    )}
                >
                    {children}
                </div>
            )}
        </div>
    );
};

export default CollapsibleSection;