'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Users, Calendar } from 'lucide-react';
import { CourseDetails } from './types';

interface DropdownItemProps {
    title: string;
    enrollment: string;
    content: string;
    courses?: CourseDetails[];
}

const DropdownItem: React.FC<DropdownItemProps> = ({ title, enrollment, content, courses }) => {
    const [isOpen, setIsOpen] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);

    const getStatusColor = (status: string): string => {
        switch (status) {
            case 'Open':
                return 'text-green-500';
            case 'Closed':
                return 'text-red-500';
            case 'Waitlist':
                return 'text-yellow-500';
            default:
                return 'text-gray-500';
        }
    };

    return (
        <motion.div
            className="relative group rounded-lg px-1"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
        >
            <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-blue-600 to-blue-400 opacity-0 group-hover:opacity-50 transition duration-200" />
            <div className="relative rounded-lg border border-gray-800 bg-black">
                <button
                    className="w-full text-left px-6 py-4 rounded-lg focus:outline-none group-hover:text-white flex justify-between items-center"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <span className="text-lg font-semibold">{title}</span>
                    <span className="text-sm text-gray-400">{enrollment}</span>
                </button>

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            ref={contentRef}
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                        >
                            <div className="px-6 py-4 border-t border-gray-800">
                                <div className="mb-4">{content}</div>

                                {courses && courses.map((course, index) => (
                                    <div
                                        key={course.courseCode}
                                        className={`p-4 rounded-lg bg-gray-900 ${index !== courses.length - 1 ? 'mb-4' : ''}`}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="text-lg font-semibold">{course.courseCode}</h3>
                                                <p className="text-gray-400">{course.courseName}</p>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(course.status)}`}>
                                                {course.status}
                                            </span>
                                        </div>

                                        <p className="text-gray-400 mb-2">Professor: {course.professor}</p>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4 text-gray-400" />
                                                <span>
                                                    {course.schedule.days} {course.schedule.time}
                                                    <br />
                                                    Room: {course.schedule.room}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <Users className="w-4 h-4 text-gray-400" />
                                                <span>
                                                    Seats: {course.seats.enrolled}/{course.seats.total}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-gray-400" />
                                                <span>
                                                    {course.dates.start} - {course.dates.end}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

export default DropdownItem;