'use client'

import React, { useState, useEffect } from 'react';
import { Spotlight } from "@/components/ui/spotlight";
import { Clock } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import Navbar from '@/components/ui/navbar';
import toast from 'react-hot-toast';

interface Course {
    id: string;
    name: string;
    code: string;
    professor: string;
    schedule: string;
    room: string;
    credits: number;
}

interface ProfessorData {
    firstName: string;
    lastName: string;
    department: string;
    courses: Course[];
}

const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    return `${formattedHours}:${minutes.toString().padStart(2, '0')} ${period}`;
};

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
    const [selectedSemester, setSelectedSemester] = useState("Fall 2024");
    const [professorData, setProfessorData] = useState<ProfessorData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProfessorData = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`/api/professor?semester=${selectedSemester}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch professor data');
            }

            setProfessorData(data);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to load professor data');
            toast.error("Failed to load professor data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfessorData();
    }, [selectedSemester]);

    const parseSchedule = (scheduleString: string) => {
        const match = scheduleString.match(/(\w+)\s+(\d+):(\d+)\s*(AM|PM)\s*-\s*(\d+):(\d+)\s*(AM|PM)/i);
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
        return { day: '', startTime: '', endTime: '' };
    };

    const timeToMinutes = (time: string) => {
        try {
            const [hours, minutes] = time.split(':').map(Number);
            return hours * 60 + (minutes || 0);
        } catch {
            return 0;
        }
    };

    const doesCourseOverlap = (courseSchedule: string, slotTime: string) => {
        const { startTime, endTime } = parseSchedule(courseSchedule);
        const slotTimeMinutes = timeToMinutes(slotTime);
        const courseStartMinutes = timeToMinutes(startTime);

        // Check if this is the starting hour slot for the course
        return slotTimeMinutes === Math.floor(courseStartMinutes / 60) * 60;
    };

    const getCourseForSlot = (day: string, time: string) => {
        return professorData?.courses.find(course => {
            const { day: courseDay } = parseSchedule(course.schedule);
            return courseDay === day && doesCourseOverlap(course.schedule, time);
        });
    };

    const getCourseHeight = (scheduleString: string) => {
        const { startTime, endTime } = parseSchedule(scheduleString);
        const startMinutes = timeToMinutes(startTime);
        const endMinutes = timeToMinutes(endTime);
        const duration = endMinutes - startMinutes;
        const hourHeight = 100; // height of one hour slot

        // Instead of using Math.ceil, calculate exact pixels
        return (duration / 60) * hourHeight - 16; // Subtract padding (8px top + 8px bottom)
    };

    return (
        <div className="flex h-screen bg-black overflow-hidden">
            <Navbar onCollapse={setIsNavCollapsed} />

            <main className={`flex-1 transition-all duration-300 ${isNavCollapsed ? 'ml-16' : 'ml-64'}`}>
                <div className="relative min-h-screen bg-black/[0.96] text-white p-8">
                    <Spotlight
                        className="-top-40 right-0 md:right-60 md:-top-20"
                        fill="#60A5FA"
                    />

                    {/* Header Section */}
                    <div className="relative z-10 flex justify-between items-center mb-8">
                        <h1 className="text-2xl font-bold text-blue-400">Course Calendar</h1>

                        <Select
                            value={selectedSemester}
                            onValueChange={setSelectedSemester}
                        >
                            <SelectTrigger className="w-[200px] text-gray-200">
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-gray-400" />
                                    <SelectValue placeholder="Select semester" />
                                </div>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Fall 2024">Fall 2024</SelectItem>
                                <SelectItem value="Spring 2024">Spring 2024</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {loading ? (
                        <div className="text-center py-8">
                            <p className="text-gray-400">Loading...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-8">
                            <p className="text-red-400">{error}</p>
                        </div>
                    ) : (
                        <div className="relative z-10 h-[calc(100vh-200px)] overflow-hidden">
                            <div className="h-full overflow-x-auto overflow-y-auto 
                                        scrollbar-thin scrollbar-track-black scrollbar-thumb-blue-600">
                                <div className="min-w-[800px] bg-black/50 rounded-lg border border-gray-800">
                                    {/* Calendar Header*/}
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
                                                    const isStartTime = course && parseSchedule(course.schedule).startTime === time;

                                                    return (
                                                        <div key={day} className="p-4 border-l border-gray-800 relative min-h-[100px]">
                                                            {course && isStartTime && (
                                                                <div
                                                                    className="absolute left-0 right-0 bg-blue-500/10 rounded-lg border border-blue-500/20 p-2 mx-2"
                                                                    style={{
                                                                        height: `${getCourseHeight(course.schedule)}px`,
                                                                        zIndex: 20,
                                                                        backdropFilter: 'blur(8px)',
                                                                        background: 'rgba(59, 130, 246, 0.1)',
                                                                    }}
                                                                >
                                                                    <div className="relative z-30">
                                                                        <p className="text-blue-400 font-medium">{course.name}</p>
                                                                        <p className="text-sm text-gray-400">{course.code}</p>
                                                                        <p className="text-sm text-gray-400">{course.room}</p>
                                                                        <p className="text-sm text-gray-400">
                                                                            {`${formatTime(parseSchedule(course.schedule).startTime)} - ${formatTime(parseSchedule(course.schedule).endTime)}`}
                                                                        </p>
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
                    )}
                </div>
            </main>
        </div>
    );
}