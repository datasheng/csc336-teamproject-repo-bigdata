'use client'

import React, { useState } from 'react';
import { Spotlight } from "@/components/ui/spotlight";
import { Search, ChevronDown, Users, Mail } from "lucide-react";
import StudentNavbar from '@/components/ui/studentnavbar';
import BlurFade from "@/components/ui/blur-fade";

export default function ClassStudentsPage() {
    const [isNavCollapsed, setIsNavCollapsed] = useState(false);
    const [selectedSemester, setSelectedSemester] = useState("Fall 2024");
    const [selectedClass, setSelectedClass] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    const courses = {
        "Fall 2024": [
            { id: "CSC382-01", name: "Algorithms Session 1" },
            { id: "CSC382-02", name: "Algorithms Session 2" },
            { id: "CSC382-03", name: "Algorithms Session 3" }
        ],
        "Spring 2024": [
            { id: "CSC382-01", name: "Algorithms Session 1" },
            { id: "CSC382-02", name: "Algorithms Session 2" }
        ]
    };

    const students = [
        {
            name: "John Smith",
            email: "john.smith@university.edu",
            major: "Computer Science",
            imgUrl: "/api/placeholder/32/32"
        },
        {
            name: "Emily Johnson",
            email: "emily.j@university.edu",
            major: "Computer Science",
            imgUrl: "/api/placeholder/32/32"
        },
        {
            name: "Michael Brown",
            email: "m.brown@university.edu",
            major: "Mathematics",
            imgUrl: "/api/placeholder/32/32"
        }
    ];

    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex h-screen bg-black overflow-hidden">
            <StudentNavbar onCollapse={setIsNavCollapsed} />

            <main className={`flex-1 transition-all duration-300 ${isNavCollapsed ? 'ml-16' : 'ml-64'}`}>
                <div className="relative min-h-screen bg-black/[0.96] antialiased bg-grid-white/[0.02] p-8">
                    <Spotlight
                        className="-top-40 right-0 md:right-60 md:-top-20"
                        fill="#60A5FA"
                    />

                    <div className="relative z-10 max-w-6xl mx-auto">
                        <BlurFade delay={0.15} inView>
                            {/* Header Section */}
                            <div className="flex justify-between items-center mb-8">
                                <div>
                                    <h1 className="text-4xl font-bold bg-gradient-to-b from-blue-50 to-blue-400 bg-clip-text text-transparent">
                                        Class Students
                                    </h1>
                                    <p className="text-gray-400 mt-1">Manage and view enrolled students</p>
                                </div>

                                <div className="relative">
                                    <select
                                        value={selectedSemester}
                                        onChange={(e) => setSelectedSemester(e.target.value)}
                                        className="w-[180px] appearance-none rounded-lg border border-gray-800 bg-black/50 px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
                                    >
                                        <option value="Fall 2024">Fall 2024</option>
                                        <option value="Spring 2024">Spring 2024</option>
                                    </select>
                                    <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-500 pointer-events-none" />
                                </div>
                            </div>

                            {/* Controls Section */}
                            <div className="bg-black/50 border border-gray-800 rounded-2xl p-6 mb-6 backdrop-blur-sm">
                                <h2 className="text-xl font-bold bg-gradient-to-b from-blue-50 to-blue-400 bg-clip-text text-transparent mb-4">
                                    Select Course Section
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="relative">
                                        <select
                                            value={selectedClass}
                                            onChange={(e) => setSelectedClass(e.target.value)}
                                            className="w-full appearance-none rounded-lg border border-gray-800 bg-black/50 px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
                                        >
                                            <option value="">Select a course section</option>
                                            {courses[selectedSemester as keyof typeof courses].map((course) => (
                                                <option key={course.id} value={course.id}>
                                                    {course.id} - {course.name}
                                                </option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-500 pointer-events-none" />
                                    </div>

                                    <div className="relative">
                                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                                        <input
                                            type="text"
                                            placeholder="Search by student name..."
                                            className="w-full rounded-lg border border-gray-800 bg-black/50 px-4 py-2 pl-10 text-white focus:border-blue-500 focus:outline-none"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Students Table */}
                            <div className="bg-black/50 border border-gray-800 rounded-2xl overflow-hidden backdrop-blur-sm">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-gray-800">
                                                <th className="p-4 text-left font-medium text-gray-400">Student</th>
                                                <th className="p-4 text-left font-medium text-gray-400">Email</th>
                                                <th className="p-4 text-left font-medium text-gray-400">Major</th>
                                                <th className="p-4 text-left font-medium text-gray-400">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredStudents.map((student, index) => (
                                                <tr key={index} className="border-b border-gray-800 hover:bg-gray-900/50 transition-colors">
                                                    <td className="p-4">
                                                        <div className="flex items-center space-x-3">
                                                            <img
                                                                src={student.imgUrl}
                                                                alt={`${student.name}'s profile`}
                                                                className="h-8 w-8 rounded-full border border-gray-800"
                                                            />
                                                            <span className="font-medium text-white">{student.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="p-4 text-gray-300">{student.email}</td>
                                                    <td className="p-4 text-gray-300">{student.major}</td>
                                                    <td className="p-4">
                                                        <button className="p-2 rounded-full hover:bg-gray-800 text-blue-400 hover:text-blue-300 transition-colors">
                                                            <Mail className="h-4 w-4" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </BlurFade>
                    </div>
                </div>
            </main>
        </div>
    );
}