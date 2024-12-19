'use client'

import React, { useState, useEffect } from 'react';
import { Spotlight } from "@/components/ui/spotlight";
import StudentNavbar from '@/components/ui/studentnavbar';

interface CourseScheduleSlot {
    day: string;
    startTime: string;
    endTime: string;
}

interface Course {
    id: number;
    name: string;
    code: string;
    professor: string;
    location: string;
    schedule: string;
    enrolled: number;
    capacity: number;
    department: string;
    credits: number;
}

// Helper function to format time in 12-hour format
const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    return `${formattedHours}:${minutes.toString().padStart(2, '0')} ${period}`;
};

// Generate time slots from 7 AM to 9 PM
const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 7; hour <= 21; hour++) {
        const formattedHour = hour.toString().padStart(2, '0');
        slots.push(`${formattedHour}:00`);
    }
    return slots;
};

const timeSlots = generateTimeSlots();
const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function CalendarPage() {
    const [isNavCollapsed, setIsNavCollapsed] = useState(false);
    const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchEnrolledCourses = async () => {
            try {
                const response = await fetch('/api/student/courses');
                if (!response.ok) throw new Error('Failed to fetch courses');
                const data = await response.json();
                setEnrolledCourses(data.courses || []);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchEnrolledCourses();
    }, []);

    const parseSchedule = (scheduleString: string): CourseScheduleSlot[] => {
        // Split the schedule into multiple time slots
        const timeSlots = scheduleString.split(',').map(slot => slot.trim());

        return timeSlots.map(slot => {
            const match = slot.match(/(\w+)\s+(\d+):(\d+)\s*(AM|PM)\s*-\s*(\d+):(\d+)\s*(AM|PM)/i);
            if (match) {
                const [_, day, startHour, startMin, startPeriod, endHour, endMin, endPeriod] = match;

                const convertTo24Hour = (hour: string, min: string, period: string) => {
                    let h = parseInt(hour);
                    if (period.toUpperCase() === 'PM' && h !== 12) h += 12;
                    if (period.toUpperCase() === 'AM' && h === 12) h = 0;
                    return `${h.toString().padStart(2, '0')}:${min}`;
                };

                return {
                    day,
                    startTime: convertTo24Hour(startHour, startMin, startPeriod),
                    endTime: convertTo24Hour(endHour, endMin, endPeriod)
                };
            }
            return null;
        }).filter((slot): slot is CourseScheduleSlot => slot !== null);
    };

    const timeToMinutes = (time: string): number => {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
    };

    const doesCourseOverlap = (scheduleString: string, day: string, slotTime: string): boolean => {
        const timeSlots = parseSchedule(scheduleString);
        return timeSlots.some(slot => {
            if (!slot || slot.day !== day) return false;

            const slotMinutes = timeToMinutes(slotTime);
            const courseStartMinutes = timeToMinutes(slot.startTime);
            const courseEndMinutes = timeToMinutes(slot.endTime);

            return slotMinutes >= courseStartMinutes && slotMinutes < courseEndMinutes;
        });
    };

    const getCourseForSlot = (day: string, time: string): Course | undefined => {
        return enrolledCourses.find(course =>
            doesCourseOverlap(course.schedule, day, time)
        );
    };

    const getCourseHeight = (scheduleString: string, day: string): number => {
        const timeSlots = parseSchedule(scheduleString);
        const daySlot = timeSlots.find(slot => slot?.day === day);

        if (!daySlot) return 0;

        const startMinutes = timeToMinutes(daySlot.startTime);
        const endMinutes = timeToMinutes(daySlot.endTime);
        const duration = endMinutes - startMinutes;
        const hourHeight = 100;
        return (duration / 60) * hourHeight;
    };

    const isStartTimeForDay = (scheduleString: string, day: string, time: string): boolean => {
        const timeSlots = parseSchedule(scheduleString);
        return timeSlots.some(slot =>
            slot?.day === day && slot?.startTime === time
        );
    };

    if (loading) {
        return (
            <div className="flex h-screen bg-black">
                <StudentNavbar onCollapse={setIsNavCollapsed} />
                <main className={`flex-1 transition-all duration-300 ${isNavCollapsed ? 'ml-16' : 'ml-64'}`}>
                    <div className="flex items-center justify-center h-full">
                        <p className="text-gray-400">Loading your schedule...</p>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-black overflow-hidden">
            <StudentNavbar onCollapse={setIsNavCollapsed} />

            <main className={`flex-1 transition-all duration-300 ${isNavCollapsed ? 'ml-16' : 'ml-64'}`}>
                <div className="relative min-h-screen bg-black/[0.96] text-white p-8">
                    <Spotlight
                        className="-top-40 right-0 md:right-60 md:-top-20"
                        fill="#60A5FA"
                    />

                    {/* Header Section */}
                    <div className="relative z-10 flex justify-between items-center mb-8">
                        <h1 className="text-2xl font-bold text-blue-400">Course Calendar</h1>
                    </div>

                    {/* Scrollable Calendar Grid */}
                    <div className="relative z-10 h-[calc(100vh-200px)] overflow-hidden">
                        <div className="h-full overflow-x-auto overflow-y-auto 
                                        scrollbar-thin scrollbar-track-black scrollbar-thumb-blue-600">
                            <div className="min-w-[800px] bg-black/50 rounded-lg border border-gray-800">
                                {/* Calendar Header */}
                                <div className="grid grid-cols-8 border-b border-gray-800">
                                    <div className="p-4 text-gray-400">Time</div>
                                    {daysOfWeek.map(day => (
                                        <div key={day} className="p-4 text-gray-400 font-medium border-l border-gray-800">
                                            {day}
                                        </div>
                                    ))}
                                </div>
                                <div className="relative">
                                    {timeSlots.map(time => (
                                        <div key={time} className="grid grid-cols-8 border-b border-gray-800">
                                            <div className="p-4 text-gray-400">{formatTime(time)}</div>
                                            {daysOfWeek.map(day => {
                                                const course = getCourseForSlot(day, time);
                                                const isStartTime = course && isStartTimeForDay(course.schedule, day, time);

                                                return (
                                                    <div key={day} className="p-4 border-l border-gray-800 relative min-h-[100px]">
                                                        {course && isStartTime && (
                                                            <div
                                                                className="absolute left-0 right-0 bg-blue-500/10 rounded-lg border border-blue-500/20 p-2 mx-2"
                                                                style={{
                                                                    height: `${getCourseHeight(course.schedule, day)}px`,
                                                                    zIndex: 20,
                                                                    backdropFilter: 'blur(8px)',
                                                                    background: 'rgba(59, 130, 246, 0.1)',
                                                                }}
                                                            >
                                                                <div className="relative z-30">
                                                                    <p className="text-blue-400 font-medium">{course.name}</p>
                                                                    <p className="text-sm text-gray-400">{course.code}</p>
                                                                    <p className="text-sm text-gray-400">{course.location}</p>
                                                                    {parseSchedule(course.schedule)
                                                                        .filter(slot => slot.day === day)
                                                                        .map((slot, index) => (
                                                                            <p key={index} className="text-sm text-gray-400">
                                                                                {`${formatTime(slot.startTime)} - ${formatTime(slot.endTime)}`}
                                                                            </p>
                                                                        ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}