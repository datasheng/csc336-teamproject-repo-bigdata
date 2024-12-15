'use client'

import React, { useState } from 'react';
import { Spotlight } from "@/components/ui/spotlight";
import { Calendar, Search, BookOpen, Clock, MapPin, Users, Plus, Check, GraduationCap } from 'lucide-react';
import StudentNavbar from '@/components/ui/studentnavbar';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import CollapsibleSection from '@/components/ui/collapsible';

// Helper function to format time
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

// Dummy data structure
const availableCourses = [
    {
        id: 1,
        name: "Introduction to Computer Science",
        code: "CSC 103",
        professor: "Wes",
        location: "Room 405",
        startTime: "10:00",
        endTime: "11:30",
        dayOfWeek: "Monday",
        capacity: 40,
        enrolled: 35,
        description: "Introduction to programming concepts and computational thinking."
    },
    {
        id: 2,
        name: "Data Structures",
        code: "CSC 201",
        professor: "Dr. Johnson",
        location: "Room 302",
        startTime: "13:00",
        endTime: "14:30",
        dayOfWeek: "Wednesday",
        capacity: 35,
        enrolled: 30,
        description: "Advanced programming concepts and data structure implementations."
    }
];

// Previous courses data 
const previouslyEnrolledCourses = {
    'Spring 2024': [
        {
            id: 101,
            name: "Advanced Data Structures",
            code: "CSC 220",
            professor: "Dr. Anderson",
            finalGrade: "A",
            credits: 3,
            location: "Room 301",
            schedule: "Mon/Wed 9:00 AM - 10:30 AM"
        },
        {
            id: 102,
            name: "Object-Oriented Programming",
            code: "CSC 211",
            professor: "Dr. Wilson",
            finalGrade: "A-",
            credits: 3,
            location: "Room 405",
            schedule: "Tue/Thu 11:00 AM - 12:30 PM"
        }
    ],
    'Fall 2023': [
        {
            id: 103,
            name: "Discrete Mathematics",
            code: "CSC 104",
            professor: "Dr. Martinez",
            finalGrade: "B+",
            credits: 4,
            location: "Room 204",
            schedule: "Mon/Wed 2:00 PM - 3:30 PM"
        },
        {
            id: 104,
            name: "Introduction to Programming",
            code: "CSC 102",
            professor: "Dr. Thompson",
            finalGrade: "A",
            credits: 3,
            location: "Room 401",
            schedule: "Tue/Thu 3:00 PM - 4:30 PM"
        }
    ]
};

export default function StudentCoursesPage() {
    const [isNavCollapsed, setIsNavCollapsed] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [showCalendar, setShowCalendar] = useState(false);
    const [enrolledCourses, setEnrolledCourses] = useState<typeof availableCourses>([]);
    const [selectedSemester, setSelectedSemester] = useState<string | null>(null);

    const handleEnroll = (course: typeof availableCourses[0]) => {
        if (!enrolledCourses.find(c => c.id === course.id)) {
            setEnrolledCourses([...enrolledCourses, course]);
        }
    };

    const handleUnenroll = (courseId: number) => {
        setEnrolledCourses(enrolledCourses.filter(course => course.id !== courseId));
    };

    const isEnrolled = (courseId: number) => {
        return enrolledCourses.some(course => course.id === courseId);
    };

    const filteredCourses = availableCourses.filter(course =>
        course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getCourseForSlot = (day: string, time: string) => {
        return enrolledCourses.find(course =>
            course.dayOfWeek === day &&
            timeToMinutes(course.startTime) <= timeToMinutes(time) &&
            timeToMinutes(course.endTime) > timeToMinutes(time)
        );
    };

    const timeToMinutes = (time: string) => {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
    };

    const getCourseHeight = (course: typeof availableCourses[0]) => {
        const startMinutes = timeToMinutes(course.startTime);
        const endMinutes = timeToMinutes(course.endTime);
        const duration = endMinutes - startMinutes;
        return (duration / 60) * 100;
    };

    // Calculate total credits and GPA
    const totalCredits = Object.values(previouslyEnrolledCourses)
        .flat()
        .reduce((sum, course) => sum + course.credits, 0);

    const gpa = Object.values(previouslyEnrolledCourses)
        .flat()
        .reduce((sum, course) => {
            const gradePoints = {
                'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0,
                'B-': 2.7, 'C+': 2.3, 'C': 2.0, 'F': 0.0
            };
            return sum + (gradePoints[course.finalGrade as keyof typeof gradePoints] * course.credits);
        }, 0) / totalCredits;

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
                        <div>
                            <h1 className="text-2xl font-bold text-blue-400">Course Enrollment</h1>
                            <p className="text-gray-400 mt-1">Browse and enroll in available courses</p>
                        </div>

                        <button
                            onClick={() => setShowCalendar(!showCalendar)}
                            className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-400 transition-colors"
                        >
                            <Calendar className="h-4 w-4" />
                            <span>{showCalendar ? "View Courses" : "View Schedule"}</span>
                        </button>
                    </div>

                    {!showCalendar ? (
                        <>
                            {/* Search Bar */}
                            <div className="relative z-10 mb-6">
                                <div className="relative">
                                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                                    <input
                                        type="text"
                                        placeholder="Search courses..."
                                        className="w-full pl-10 px-4 py-2 bg-black border border-gray-800 rounded-lg focus:outline-none focus:border-blue-500"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Course Grid */}
                            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredCourses.map((course) => (
                                    <Card key={course.id} className="bg-black/50 border-gray-800">
                                        <CardHeader>
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <CardTitle className="text-blue-400">{course.name}</CardTitle>
                                                    <CardDescription className="text-gray-400">{course.code}</CardDescription>
                                                </div>
                                                <button
                                                    onClick={() => isEnrolled(course.id) ? handleUnenroll(course.id) : handleEnroll(course)}
                                                    className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${isEnrolled(course.id)
                                                        ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                                                        : 'bg-blue-500 text-white hover:bg-blue-400'
                                                        }`}
                                                >
                                                    {isEnrolled(course.id) ? (
                                                        <>
                                                            <Check className="h-4 w-4" />
                                                            <span>Enrolled</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Plus className="h-4 w-4" />
                                                            <span>Enroll</span>
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex items-center text-gray-400">
                                                    <Users className="h-4 w-4 mr-2" />
                                                    <span>Professor: {course.professor}</span>
                                                </div>
                                                <div className="flex items-center text-gray-400">
                                                    <Clock className="h-4 w-4 mr-2" />
                                                    <span>{course.dayOfWeek} {formatTime(course.startTime)} - {formatTime(course.endTime)}</span>
                                                </div>
                                                <div className="flex items-center text-gray-400">
                                                    <MapPin className="h-4 w-4 mr-2" />
                                                    <span>{course.location}</span>
                                                </div>
                                                <div className="mt-4">
                                                    <div className="flex justify-between text-sm text-gray-400 mb-1">
                                                        <span>Enrollment</span>
                                                        <span>{course.enrolled}/{course.capacity}</span>
                                                    </div>
                                                    <div className="h-2 bg-gray-800 rounded-full">
                                                        <div
                                                            className="h-2 bg-blue-500 rounded-full transition-all"
                                                            style={{
                                                                width: `${(course.enrolled / course.capacity) * 100}%`
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>

                            {/* Previous Courses Section */}
                            <div className="mt-8">
                                <CollapsibleSection
                                    title="Previous Courses"
                                    icon={GraduationCap}
                                    stats={[
                                        { label: "Total Credits", value: totalCredits },
                                        { label: "GPA", value: gpa.toFixed(2) }
                                    ]}
                                >
                                    <div className="space-y-6">
                                        {/* Semester selector buttons */}
                                        <div className="flex flex-wrap gap-2">
                                            {Object.keys(previouslyEnrolledCourses).map((semester) => (
                                                <button
                                                    key={semester}
                                                    onClick={() => setSelectedSemester(semester === selectedSemester ? null : semester)}
                                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${semester === selectedSemester
                                                        ? 'bg-blue-500 text-white'
                                                        : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800'
                                                        }`}
                                                >
                                                    {semester}
                                                </button>
                                            ))}
                                        </div>

                                        {/* Previous courses grid */}
                                        {selectedSemester && (
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {previouslyEnrolledCourses[selectedSemester].map((course: any) => (
                                                    <Card key={course.id} className="bg-black/50 border-gray-800">
                                                        <CardHeader>
                                                            <div className="flex justify-between items-start">
                                                                <div>
                                                                    <CardTitle className="text-blue-400">{course.name}</CardTitle>
                                                                    <CardDescription className="text-gray-400">{course.code}</CardDescription>
                                                                </div>
                                                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${course.finalGrade.startsWith('A') ? 'bg-green-500/20 text-green-400' :
                                                                    course.finalGrade.startsWith('B') ? 'bg-blue-500/20 text-blue-400' :
                                                                        'bg-yellow-500/20 text-yellow-400'
                                                                    }`}>
                                                                    {course.finalGrade}
                                                                </span>
                                                            </div>
                                                        </CardHeader>
                                                        <CardContent>
                                                            <div className="space-y-2 text-sm">
                                                                <div className="flex items-center text-gray-400">
                                                                    <Users className="h-4 w-4 mr-2" />
                                                                    <span>Professor: {course.professor}</span>
                                                                </div>
                                                                <div className="flex items-center text-gray-400">
                                                                    <Clock className="h-4 w-4 mr-2" />
                                                                    <span>{course.schedule}</span>
                                                                </div>
                                                                <div className="flex items-center text-gray-400">
                                                                    <MapPin className="h-4 w-4 mr-2" />
                                                                    <span>{course.location}</span>
                                                                </div>
                                                                <div className="mt-2 pt-2 border-t border-gray-800">
                                                                    <span className="text-gray-400">Credits: {course.credits}</span>
                                                                </div>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </CollapsibleSection>
                            </div>
                        </>
                    ) : (

                        // Calendar View
                        <div className="relative z-10 h-[calc(100vh-200px)] overflow-hidden">
                            <div className="h-full overflow-x-auto overflow-y-auto scrollbar-thin scrollbar-track-black scrollbar-thumb-blue-600">
                                <div className="min-w-[800px] bg-black/50 rounded-lg border border-gray-800">
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
                    )}
                </div>
            </main>
        </div>
    );
}