'use client'

import React, { useState } from 'react';
import { Spotlight } from "@/components/ui/spotlight";
import { BookOpen, Calendar, Edit2 } from 'lucide-react';
import Navbar from '@/components/ui/navbar';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Course {
    id: number;
    name: string;
    code: string;
    semester: string;
    enrolled: number;
    maxCapacity: number;
    schedule: string;
    room: string;
}

// Dummy data structure that matches potential PostgreSQL schema
const dummyCourses = {
    'Fall 2024': [
        {
            id: 1,
            name: "Algorithms Session 1",
            code: "CSC 382-01",
            semester: "Fall 2024",
            enrolled: 35,
            maxCapacity: 40,
            schedule: "Mon/Wed 10:00 AM - 11:30 AM",
            room: "Room 405"
        },
        {
            id: 2,
            name: "Algorithms Session 2",
            code: "CSC 382-02",
            semester: "Fall 2024",
            enrolled: 38,
            maxCapacity: 40,
            schedule: "Mon/Wed 2:00 PM - 3:30 PM",
            room: "Room 405"
        },
        {
            id: 3,
            name: "Algorithms Session 3",
            code: "CSC 382-03",
            semester: "Fall 2024",
            enrolled: 32,
            maxCapacity: 40,
            schedule: "Tue/Thu 1:00 PM - 2:30 PM",
            room: "Room 407"
        }
    ],
    'Spring 2024': [
        {
            id: 4,
            name: "Algorithms Session 1",
            code: "CSC 382-01",
            semester: "Spring 2024",
            enrolled: 40,
            maxCapacity: 40,
            schedule: "Mon/Wed 10:00 AM - 11:30 AM",
            room: "Room 405"
        },
        {
            id: 5,
            name: "Algorithms Session 2",
            code: "CSC 382-02",
            semester: "Spring 2024",
            enrolled: 37,
            maxCapacity: 40,
            schedule: "Mon/Wed 2:00 PM - 3:30 PM",
            room: "Room 405"
        },
        {
            id: 6,
            name: "Algorithms Session 3",
            code: "CSC 382-03",
            semester: "Spring 2024",
            enrolled: 39,
            maxCapacity: 40,
            schedule: "Tue/Thu 1:00 PM - 2:30 PM",
            room: "Room 407"
        }
    ]
};

export default function CoursesPage() {
    const [isNavCollapsed, setIsNavCollapsed] = useState(false);
    const [selectedSemester, setSelectedSemester] = useState('Fall 2024');
    const [courses, setCourses] = useState(dummyCourses);
    const [editingCourse, setEditingCourse] = useState<Course | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleEditCourse = (courseId: number) => {
        const semester = selectedSemester as keyof typeof courses;
        const course = courses[semester].find(c => c.id === courseId);
        if (course) {
            setEditingCourse({ ...course });
            setIsDialogOpen(true);
        }
    };

    const handleSaveEdit = () => {
        if (!editingCourse) return;

        const semester = selectedSemester as keyof typeof courses;
        const updatedCourses = {
            ...courses,
            [semester]: courses[semester].map(course =>
                course.id === editingCourse.id ? editingCourse : course
            )
        };

        setCourses(updatedCourses);
        setIsDialogOpen(false);
        setEditingCourse(null);
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
                        <div>
                            <h1 className="text-2xl font-bold text-blue-400">My Courses</h1>
                            <p className="text-gray-400 mt-1">Manage your course sections</p>
                        </div>

                        <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                            <SelectTrigger className="w-[180px] border-gray-800">
                                <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                                <SelectValue placeholder="Select semester" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Fall 2024">Fall 2024</SelectItem>
                                <SelectItem value="Spring 2024">Spring 2024</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Courses Grid */}
                    <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {courses[selectedSemester as keyof typeof courses].map((course) => (
                            <Card key={course.id} className="bg-black/50 border-gray-800">
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <CardTitle className="text-blue-400">{course.name}</CardTitle>
                                            <CardDescription className="text-gray-400">{course.code}</CardDescription>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleEditCourse(course.id)}
                                            className="hover:bg-gray-800 rounded-full"
                                        >
                                            <Edit2 className="h-4 w-4 text-gray-400" />
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between items-center">
                                            <span className="text-black">Enrollment:</span>
                                            <span className="text-black">
                                                {course.enrolled}/{course.maxCapacity}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-black">Schedule:</span>
                                            <span className="text-black">{course.schedule}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-black">Room:</span>
                                            <span className="text-black">{course.room}</span>
                                        </div>

                                        <div className="mt-4">
                                            <div className="h-2 bg-gray-800 rounded-full">
                                                <div
                                                    className="h-2 bg-blue-500 rounded-full transition-all duration-300"
                                                    style={{
                                                        width: `${(course.enrolled / course.maxCapacity) * 100}%`
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Edit Course Dialog */}
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogContent className="bg-black border border-gray-800">
                            <DialogHeader>
                                <DialogTitle className="text-blue-400">Edit Course Details</DialogTitle>
                                <DialogDescription className="text-gray-400">
                                    Make changes to the course details here.
                                </DialogDescription>
                            </DialogHeader>

                            {editingCourse && (
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm text-gray-200">Max Capacity</label>
                                        <Input
                                            type="number"
                                            className="bg-black border-gray-800 text-white"
                                            value={editingCourse.maxCapacity}
                                            onChange={(e: any) => setEditingCourse({
                                                ...editingCourse,
                                                maxCapacity: parseInt(e.target.value)
                                            })}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm text-gray-200">Schedule</label>
                                        <Input
                                            type="text"
                                            className="bg-black border-gray-800 text-white"
                                            value={editingCourse.schedule}
                                            onChange={(e: any) => setEditingCourse({
                                                ...editingCourse,
                                                schedule: e.target.value
                                            })}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm text-gray-200">Room</label>
                                        <Input
                                            type="text"
                                            className="bg-black border-gray-800 text-white"
                                            value={editingCourse.room}
                                            onChange={(e: any) => setEditingCourse({
                                                ...editingCourse,
                                                room: e.target.value
                                            })}
                                        />
                                    </div>

                                    <DialogFooter className="flex justify-end space-x-2 pt-4">
                                        <Button
                                            variant="outline"
                                            onClick={() => setIsDialogOpen(false)}
                                            className="border-gray-800 hover:bg-gray-800 text-black"
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            onClick={handleSaveEdit}
                                            className="bg-blue-500 text-white hover:bg-blue-400"
                                        >
                                            Save Changes
                                        </Button>
                                    </DialogFooter>
                                </div>
                            )}
                        </DialogContent>
                    </Dialog>
                </div>
            </main>
        </div>
    );
}