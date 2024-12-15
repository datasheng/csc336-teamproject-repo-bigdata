'use client';

import React, { useState } from 'react';
import { Spotlight } from "@/components/ui/spotlight";
import { Search, ChevronDown } from "lucide-react";
import Navbar from '@/components/ui/navbar';

export default function Students() {
    const [selectedClass, setSelectedClass] = useState("");
    const [isNavCollapsed, setIsNavCollapsed] = useState(false);

    // Remove once backend once implemented
    const classes = [
        { id: "CS101", name: "Introduction to Computer Science", semester: "Fall 2024" },
        { id: "CS201", name: "Data Structures", semester: "Fall 2024" },
        { id: "CS301", name: "Algorithms", semester: "Fall 2024" }
    ];

    const students = [
        {
            id: "23456789",
            name: "John Smith",
            email: "john.smith@email.com",
            altEmail: "johnsmith@gmail.com",
            status: "Enrolled",
            imgUrl: "/api/placeholder/32/32"
        },
        {
            id: "23456790",
            name: "Jane Doe",
            email: "jane.doe@email.com",
            altEmail: "janedoe@gmail.com",
            status: "Not Enrolled",
            imgUrl: "/api/placeholder/32/32"
        },
        {
            id: "23456791",
            name: "Alice Johnson",
            email: "alice.j@email.com",
            altEmail: "alicej@gmail.com",
            status: "Enrolled",
            imgUrl: "/api/placeholder/32/32"
        }
    ];

    return (
        <div className="flex h-screen bg-black overflow-hidden">
            <Navbar onCollapse={setIsNavCollapsed} />

            <main className={`flex-1 transition-all duration-300 ${isNavCollapsed ? 'ml-16' : 'ml-64'}`}>
                <div className="relative flex min-h-screen flex-col bg-black/[0.96] antialiased bg-grid-white/[0.02]">
                    <Spotlight
                        className="-top-40 right-0 md:right-60 md:-top-20"
                        fill="#60A5FA"
                    />

                    <div className="relative z-10 mx-auto w-full max-w-7xl space-y-6 p-4">
                        <div className="flex items-center justify-between">
                            <h1 className="text-2xl font-bold text-blue-400">Course Dashboard</h1>
                        </div>

                        <div className="rounded-lg border border-gray-800 bg-black/50 p-6">
                            <div className="mb-6 relative">
                                <div className="relative w-full max-w-md">
                                    <select
                                        value={selectedClass}
                                        onChange={(e) => setSelectedClass(e.target.value)}
                                        className="w-full appearance-none rounded-lg border border-gray-800 bg-black px-4 py-2 text-white focus:border-blue-500 focus:outline-none pr-10"
                                    >
                                        <option value="" disabled>Select a course</option>
                                        {classes.map((course) => (
                                            <option key={course.id} value={course.id}>
                                                {course.id} - {course.name} ({course.semester})
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-500 pointer-events-none" />
                                </div>
                            </div>

                            <div className="mb-4 flex items-center space-x-4">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                                    <input
                                        type="text"
                                        placeholder="Search students..."
                                        className="w-full rounded-lg border border-gray-800 bg-black px-4 py-2 pl-10 text-white focus:border-blue-500 focus:outline-none"
                                    />
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-800 text-left text-sm">
                                            <th className="p-3 font-medium text-gray-400">Profile</th>
                                            <th className="p-3 font-medium text-gray-400">Name</th>
                                            <th className="p-3 font-medium text-gray-400">Student ID</th>
                                            <th className="p-3 font-medium text-gray-400">Email</th>
                                            <th className="p-3 font-medium text-gray-400">Alt. Email</th>
                                            <th className="p-3 font-medium text-gray-400">Status</th>
                                            <th className="p-3 font-medium text-gray-400">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {students.map((student) => (
                                            <tr key={student.id} className="border-b border-gray-800 hover:bg-gray-900/50">
                                                <td className="p-3">
                                                    <img
                                                        src={student.imgUrl}
                                                        alt={`${student.name}'s profile`}
                                                        className="h-8 w-8 rounded-full"
                                                    />
                                                </td>
                                                <td className="p-3 text-gray-300 font-medium">{student.name}</td>
                                                <td className="p-3 text-gray-300">{student.id}</td>
                                                <td className="p-3 text-gray-300">{student.email}</td>
                                                <td className="p-3 text-gray-300">{student.altEmail}</td>
                                                <td className="p-3">
                                                    <span className={`rounded-full px-2 py-1 text-xs ${student.status === 'Enrolled'
                                                        ? 'bg-green-500/20 text-green-400'
                                                        : 'bg-red-500/20 text-red-400'
                                                        }`}>
                                                        {student.status}
                                                    </span>
                                                </td>
                                                <td className="p-3">
                                                    <button className="rounded-md bg-transparent border border-gray-800 px-4 py-1.5 text-xs text-gray-300 transition-colors hover:bg-gray-800">
                                                        View Details
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}