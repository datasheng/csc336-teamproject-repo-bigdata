'use client'

import React, { useState } from 'react';
import { Spotlight } from "@/components/ui/spotlight";
import { Plus, Clock, BookOpen, Hash, MapPin } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Navbar from '@/components/ui/navbar';

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

// Dummy data structure that matches potential PostgreSQL schema
const dummyCourses = [
    {
        id: 1,
        name: "Introduction to Computer Science",
        code: "CSC 101",
        location: "Room 405",
        startTime: "09:00",
        endTime: "10:30",
        dayOfWeek: "Monday",
        professorId: 1
    },
    {
        id: 2,
        name: "Data Structures",
        code: "CSC 201",
        location: "Room 302",
        startTime: "11:00",
        endTime: "12:30",
        dayOfWeek: "Wednesday",
        professorId: 1
    }
];

export default function CalendarPage() {
    const [isNavCollapsed, setIsNavCollapsed] = useState(false);
    const [courses, setCourses] = useState(dummyCourses);
    const [newCourse, setNewCourse] = useState({
        name: "",
        code: "",
        location: "",
        startTime: "",
        endTime: "",
        dayOfWeek: "Monday"
    });
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleCreateCourse = (e: React.FormEvent) => {
        e.preventDefault();
        // Validate time format and course overlap
        if (!isValidTimeRange(newCourse.startTime, newCourse.endTime)) {
            alert("Invalid time range. End time must be after start time.");
            return;
        }

        if (hasTimeConflict(newCourse)) {
            alert("This time slot conflicts with an existing course.");
            return;
        }

        setCourses([...courses, {
            ...newCourse,
            id: courses.length + 1,
            professorId: 1
        }]);
        setIsDialogOpen(false);
        setNewCourse({
            name: "",
            code: "",
            location: "",
            startTime: "",
            endTime: "",
            dayOfWeek: "Monday"
        });
    };

    const isValidTimeRange = (start: string, end: string) => {
        const startMinutes = timeToMinutes(start);
        const endMinutes = timeToMinutes(end);
        return startMinutes < endMinutes;
    };

    const hasTimeConflict = (newCourse: any) => {
        return courses.some(existingCourse => {
            if (existingCourse.dayOfWeek !== newCourse.dayOfWeek) return false;

            const newStart = timeToMinutes(newCourse.startTime);
            const newEnd = timeToMinutes(newCourse.endTime);
            const existingStart = timeToMinutes(existingCourse.startTime);
            const existingEnd = timeToMinutes(existingCourse.endTime);

            return (newStart < existingEnd && newEnd > existingStart);
        });
    };

    const timeToMinutes = (time: string) => {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
    };

    const doesCourseOverlap = (course: any, slotTime: string) => {
        const courseStart = timeToMinutes(course.startTime);
        const courseEnd = timeToMinutes(course.endTime);
        const slotStart = timeToMinutes(slotTime);
        const slotEnd = timeToMinutes(slotTime) + 60;

        return courseStart < slotEnd && courseEnd > slotStart;
    };

    const getCourseForSlot = (day: string, time: string) => {
        return courses.find(course =>
            course.dayOfWeek === day &&
            doesCourseOverlap(course, time)
        );
    };

    const getCourseHeight = (course: any) => {
        const startMinutes = timeToMinutes(course.startTime);
        const endMinutes = timeToMinutes(course.endTime);
        const duration = endMinutes - startMinutes;
        const hourHeight = 100;
        return (duration / 60) * hourHeight;
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

                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button className="flex items-center space-x-2 bg-blue-500 text-white hover:bg-blue-400">
                                    <Plus className="h-4 w-4" />
                                    <span>Create Course</span>
                                </Button>
                            </DialogTrigger>

                            <DialogContent className="bg-black/90 border border-gray-800 text-white">
                                <DialogHeader>
                                    <DialogTitle className="text-blue-400">Create New Course</DialogTitle>
                                    <DialogDescription className="text-gray-400">
                                        Add a new course to your teaching schedule.
                                    </DialogDescription>
                                </DialogHeader>

                                <form onSubmit={handleCreateCourse} className="space-y-4 mt-4">
                                    <div className="space-y-2">
                                        <label className="text-sm text-gray-400">Course Name</label>
                                        <div className="relative">
                                            <BookOpen className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                                            <input
                                                type="text"
                                                required
                                                className="w-full pl-10 px-4 py-2 bg-black border border-gray-800 rounded-lg focus:outline-none focus:border-blue-500"
                                                placeholder="Introduction to Computer Science"
                                                value={newCourse.name}
                                                onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm text-gray-400">Course Code</label>
                                        <div className="relative">
                                            <Hash className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                                            <input
                                                type="text"
                                                required
                                                className="w-full pl-10 px-4 py-2 bg-black border border-gray-800 rounded-lg focus:outline-none focus:border-blue-500"
                                                placeholder="CSC 101"
                                                value={newCourse.code}
                                                onChange={(e) => setNewCourse({ ...newCourse, code: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm text-gray-400">Start Time</label>
                                            <div className="relative">
                                                <Clock className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                                                <input
                                                    type="time"
                                                    required
                                                    className="w-full pl-10 px-4 py-2 bg-black border border-gray-800 rounded-lg focus:outline-none focus:border-blue-500"
                                                    value={newCourse.startTime}
                                                    onChange={(e) => setNewCourse({ ...newCourse, startTime: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm text-gray-400">End Time</label>
                                            <div className="relative">
                                                <Clock className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                                                <input
                                                    type="time"
                                                    required
                                                    className="w-full pl-10 px-4 py-2 bg-black border border-gray-800 rounded-lg focus:outline-none focus:border-blue-500"
                                                    value={newCourse.endTime}
                                                    onChange={(e) => setNewCourse({ ...newCourse, endTime: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm text-gray-400">Location</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                                            <input
                                                type="text"
                                                required
                                                className="w-full pl-10 px-4 py-2 bg-black border border-gray-800 rounded-lg focus:outline-none focus:border-blue-500"
                                                placeholder="Room 405"
                                                value={newCourse.location}
                                                onChange={(e) => setNewCourse({ ...newCourse, location: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm text-gray-400">Day of Week</label>
                                        <select
                                            required
                                            className="w-full px-4 py-2 bg-black border border-gray-800 rounded-lg focus:outline-none focus:border-blue-500"
                                            value={newCourse.dayOfWeek}
                                            onChange={(e) => setNewCourse({ ...newCourse, dayOfWeek: e.target.value })}
                                        >
                                            {daysOfWeek.map(day => (
                                                <option key={day} value={day}>{day}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full bg-blue-500 text-white hover:bg-blue-400"
                                    >
                                        Create Course
                                    </Button>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>

                    {/* Scrollable Calendar Grid */}
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
                                            const isStartTime = course && course.startTime === time;

                                            return (
                                                <div key={day} className="p-4 border-l border-gray-800 relative min-h-[100px]">
                                                    {course && isStartTime && (
                                                        <div
                                                            className="absolute left-0 right-0 bg-blue-500/10 rounded-lg border border-blue-500/20 p-2 mx-2"
                                                            style={{
                                                                height: `${getCourseHeight(course)}px`,
                                                                zIndex: 20,
                                                                backdropFilter: 'blur(8px)',
                                                                background: 'rgba(59, 130, 246, 0.1)',
                                                            }}
                                                        >
                                                            <div className="relative z-30">
                                                                <p className="text-blue-400 font-medium">{course.name}</p>
                                                                <p className="text-sm text-gray-400">{course.location}</p>
                                                                <p className="text-sm text-gray-400">
                                                                    {`${formatTime(course.startTime)} - ${formatTime(course.endTime)}`}
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
                </div>
            </main>
        </div>
    );
}