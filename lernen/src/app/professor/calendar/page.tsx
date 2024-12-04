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

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const timeSlots = Array.from({ length: 15 }, (_, i) => `${i + 8}:00`); // 7 AM to 9 PM

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

    const handleCreateCourse = (e: any) => {
        e.preventDefault();
        // DummyData, use POST request when using PostgreSQL
        setCourses([...courses, {
            ...newCourse,
            id: courses.length + 1,
            professorId: 1
        }]);
        setIsDialogOpen(false);
    };

    // Helper function to convert time string to minutes since midnight
    const timeToMinutes = (time: any) => {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
    };

    // Helper function to check if a course overlaps with a given time slot
    const doesCourseOverlap = (course: any, slotTime: any) => {
        const courseStart = timeToMinutes(course.startTime);
        const courseEnd = timeToMinutes(course.endTime);
        const slotStart = timeToMinutes(slotTime);
        const slotEnd = timeToMinutes(slotTime) + 60; // Assuming 1-hour slots

        return courseStart < slotEnd && courseEnd > slotStart;
    };

    const getCourseForSlot = (day: any, time: any) => {
        return courses.find(course =>
            course.dayOfWeek === day &&
            doesCourseOverlap(course, time)
        );
    };

    // Calculate the height of a course card based on its duration
    const getCourseHeight = (course: any) => {
        const startMinutes = timeToMinutes(course.startTime);
        const endMinutes = timeToMinutes(course.endTime);
        const duration = endMinutes - startMinutes;
        const hourHeight = 100; // Base height for one hour in pixels
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
                                    {/* Form fields remain the same */}
                                    <div className="space-y-2">
                                        <label className="text-sm text-gray-400">Course Name</label>
                                        <div className="relative">
                                            <BookOpen className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                                            <input
                                                type="text"
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

                    {/* Calendar Grid */}
                    <div className="relative z-10 overflow-x-auto">
                        <div className="min-w-[800px] bg-black/50 rounded-lg border border-gray-800">
                            <div className="relative">
                                {timeSlots.map(time => (
                                    <div key={time} className="grid grid-cols-6 border-b border-gray-800">
                                        <div className="p-4 text-gray-400">{time}</div>
                                        {daysOfWeek.map(day => {
                                            const course = getCourseForSlot(day, time);
                                            const isStartTime = course && course.startTime === time;
                                            const colIndex = daysOfWeek.indexOf(day) + 1;

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
                                                                <p className="text-sm text-gray-400">{`${course.startTime} - ${course.endTime}`}</p>
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
            </main>
        </div>
    );
}