'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import DropdownItem from './dropdownitems';
import { CourseDetails } from './types';

interface SemesterItem {
    title: string;
    enrollment: string;
    content: string;
    courses?: CourseDetails[];
}

interface SemesterGroupProps {
    title: string;
    items: SemesterItem[];
}

const SemesterGroup: React.FC<SemesterGroupProps> = ({ title, items }) => {
    const [isExpanded, setIsExpanded] = useState(title === 'Current Semester');

    return (
        <div className="mb-6">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-gray-900 to-gray-800 rounded-lg mb-2 group hover:from-blue-900 hover:to-blue-800 transition-all duration-200"
            >
                <span className="text-xl font-bold text-white">{title}</span>
                <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <ChevronDown className="w-6 h-6 text-gray-400 group-hover:text-white" />
                </motion.div>
            </button>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4"
                    >
                        {items.map((item) => (
                            <DropdownItem
                                key={item.title}
                                title={item.title}
                                enrollment={item.enrollment}
                                content={item.content}
                                courses={item.courses}
                            />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SemesterGroup;