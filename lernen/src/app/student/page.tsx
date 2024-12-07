'use client'

import React, { useState } from 'react';
import { Spotlight } from "@/components/ui/spotlight";
import { Calendar, GraduationCap, Clock, MapPin } from 'lucide-react';
import Navbar from '@/components/ui/studentnavbar';
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

// Dummy data structure that matches potential PostgreSQL schema
const dummyCourses = {
    'Fall 2024': [
        {
            id: 1,
            name: "Algorithms",
            code: "CSC 382",
            professor: "Dr. Smith",
            schedule: "Mon/Wed 10:00 AM - 11:30 AM",
            room: "Room 405",
            credits: 3,
            grade: "A-",
            assignments: 12,
            upcomingDeadlines: 2
        },
        {
            id: 2,
            name: "Database Systems",
            code: "CSC 336",
            professor: "Dr. Johnson",
            schedule: "Tue/Thu 2:00 PM - 3:30 PM",
            room: "Room 301",
            credits: 3,
            grade: "B+",
            assignments: 8,
            upcomingDeadlines: 1
        },
        {
            id: 3,
            name: "Software Engineering",
            code: "CSC 322",
            professor: "Dr. Williams",
            schedule: "Mon/Wed 2:00 PM - 3:30 PM",
            room: "Room 405",
            credits: 4,
            grade: "A",
            assignments: 15,
            upcomingDeadlines: 3
        }
    ],
    'Spring 2024': [
        {
            id: 4,
            name: "Operating Systems",
            code: "CSC 332",
            professor: "Dr. Brown",
            schedule: "Mon/Wed 11:00 AM - 12:30 PM",
            room: "Room 402",
            credits: 3,
            grade: "B",
            assignments: 10,
            upcomingDeadlines: 0
        },
        {
            id: 5,
            name: "Computer Networks",
            code: "CSC 345",
            professor: "Dr. Davis",
            schedule: "Tue/Thu 1:00 PM - 2:30 PM",
            room: "Room 304",
            credits: 3,
            grade: "A-",
            assignments: 9,
            upcomingDeadlines: 0
        }
    ]
};

export default function StudentDashboard() {
    const [isNavCollapsed, setIsNavCollapsed] = useState(false);
    const [selectedSemester, setSelectedSemester] = useState('Fall 2024');
    
    // Calculate semester statistics
    const currentCourses = dummyCourses[selectedSemester as keyof typeof dummyCourses];
    const totalCredits = currentCourses.reduce((sum, course) => sum + course.credits, 0);
    const totalAssignments = currentCourses.reduce((sum, course) => sum + course.assignments, 0);
    const upcomingDeadlines = currentCourses.reduce((sum, course) => sum + course.upcomingDeadlines, 0);
    
    // Calculate GPA (assuming A=4.0, A-=3.7, B+=3.3, B=3.0)
    const gradePoints = {
        'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0
    };
    
    const semesterGPA = currentCourses.reduce((sum, course) => {
        return sum + (gradePoints[course.grade as keyof typeof gradePoints] * course.credits);
    }, 0) / totalCredits;

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
                            <p className="text-gray-400 mt-1">View your enrolled courses and progress</p>
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

                    {/* Semester Overview Cards */}
                    <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <Card className="bg-black/50 border-gray-800">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-gray-400">
                                    Enrolled Courses
                                </CardTitle>
                                <GraduationCap className="h-4 w-4 text-blue-400" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-black">{currentCourses.length}</div>
                                <p className="text-xs text-gray-400 mt-1">Total Credits: {totalCredits}</p>
                            </CardContent>
                        </Card>

                        <Card className="bg-black/50 border-gray-800">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-gray-400">
                                    Current GPA
                                </CardTitle>
                                <Clock className="h-4 w-4 text-blue-400" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-black">{semesterGPA.toFixed(2)}</div>
                                <p className="text-xs text-gray-400 mt-1">Semester Average</p>
                            </CardContent>
                        </Card>

                        <Card className="bg-black/50 border-gray-800">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-gray-400">
                                    Total Assignments
                                </CardTitle>
                                <Clock className="h-4 w-4 text-blue-400" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-black">{totalAssignments}</div>
                                <p className="text-xs text-gray-400 mt-1">{upcomingDeadlines} upcoming deadlines</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Courses Grid */}
                    <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {currentCourses.map((course) => (
                            <Card key={course.id} className="bg-black/50 border-gray-800">
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <CardTitle className="text-blue-400">{course.name}</CardTitle>
                                            <CardDescription className="text-gray-400">{course.code}</CardDescription>
                                        </div>
                                        <span className={`px-2 py-1 rounded-full text-xs ${
                                            course.grade.startsWith('A') ? 'bg-green-500/20 text-green-400' :
                                            course.grade.startsWith('B') ? 'bg-blue-500/20 text-blue-400' :
                                            'bg-yellow-500/20 text-yellow-400'
                                        }`}>
                                            {course.grade}
                                        </span>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-400">Professor:</span>
                                            <span className="text-black">{course.professor}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-400">Schedule:</span>
                                            <span className="text-black">{course.schedule}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-400">Room:</span>
                                            <span className="text-black">{course.room}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-400">Credits:</span>
                                            <span className="text-black">{course.credits}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-400">Assignments:</span>
                                            <span className="text-black">{course.assignments} 
                                                {course.upcomingDeadlines > 0 && 
                                                    <span className="text-yellow-400 ml-1">
                                                        ({course.upcomingDeadlines} due soon)
                                                    </span>
                                                }
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}