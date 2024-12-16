"use client";

import React, { useState } from "react";
import { Spotlight } from "@/components/ui/spotlight";
import { Search, Users, Clock, MapPin, Plus, Check } from "lucide-react";
import StudentNavbar from "@/components/ui/studentnavbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import toast from "react-hot-toast";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Switch } from "@/components/ui/switch";

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
        professor: "Dr. Wes Anderson",
        location: "Room 405",
        startTime: "10:00",
        endTime: "11:30",
        dayOfWeek: "Monday",
        schedule: "Mon/Wed 10:00 AM - 11:30 AM",
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
        schedule: "Mon/Wed 1:00 PM - 2:30 PM",
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
  const [enrolledCourses, setEnrolledCourses] = useState<typeof availableCourses>([]);
  
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Get search params with defaults
  const currentTerm = searchParams.get("term") || "Fall 2024";
  const currentDepartment = searchParams.get("department") || "All";
  const currentCredits = searchParams.get("credits") || "";
  const searchQuery = searchParams.get("q") || "";

  const [searchInput, setSearchInput] = useState(searchQuery);
  const [showOpenOnly, setShowOpenOnly] = useState(false);

  const createQueryString = (params: Record<string, string>) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    
    // Update or delete params
    Object.entries(params).forEach(([key, value]) => {
      if (value === null || value === "") {
        current.delete(key);
      } else {
        current.set(key, value);
      }
    });

    return current.toString();
  };

  const handleEnroll = (course: typeof availableCourses[0]) => {
    if (!enrolledCourses.find(c => c.id === course.id)) {
        setEnrolledCourses([...enrolledCourses, course]);
        const updatedCourses = availableCourses.map(c => 
            c.id === course.id ? { ...c, enrolled: c.enrolled + 1 } : c
        );
        availableCourses.splice(0, availableCourses.length, ...updatedCourses);
        
        toast.success(`Enrolled in ${course.name}`, {
            icon: '📚',
        });
    }
  };

  const handleUnenroll = (courseId: number) => {
    setEnrolledCourses(enrolledCourses.filter(course => course.id !== courseId));
    const updatedCourses = availableCourses.map(c => 
        c.id === courseId ? { ...c, enrolled: c.enrolled - 1 } : c
    );
    availableCourses.splice(0, availableCourses.length, ...updatedCourses);
    
    toast('Successfully unenrolled', {
        icon: '🔄',
    });
  };

  const isEnrolled = (courseId: number) => {
    return enrolledCourses.some(course => course.id === courseId);
  };

  const handleSearch = () => {
    router.push(
      `${pathname}?${createQueryString({
        q: searchInput,
      })}`
    );
  };

  return (
    <div className="flex h-screen bg-black overflow-hidden">
      <StudentNavbar onCollapse={setIsNavCollapsed} />

      <main className={`flex-1 transition-all duration-300 ${isNavCollapsed ? "ml-16" : "ml-64"}`}>
        <div className="relative min-h-screen bg-black/[0.96] text-white p-8">
          <Spotlight className="-top-40 right-0 md:right-60 md:-top-20" fill="#60A5FA" />

          {/* Header Section */}
          <div className="relative z-10 flex flex-col items-center mt-[12vh] mb-12">
            <h1 className="text-6xl font-bold tracking-[0.04em] bg-gradient-to-b from-blue-400/90 via-blue-400/70 to-blue-400/50 bg-clip-text text-transparent mb-8">
              Course Enrollment
            </h1>

            {/* Search Bar and Button */}
            <div className="w-full max-w-3xl flex items-center gap-4">
              <div className="flex-1 relative flex items-center">
                <Search className="absolute left-4 h-5 w-5 text-gray-500 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search for courses..."
                  className="w-full pl-12 pr-4 h-12 bg-black border border-gray-800 rounded-lg focus:outline-none focus:border-blue-500 text-lg"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch();
                    }
                  }}
                />
              </div>
              <Button 
                onClick={handleSearch}
                className="h-12 px-6 bg-blue-500 hover:bg-blue-600 flex items-center justify-center"
              >
                <Search className="h-5 w-5" />
              </Button>
            </div>

            {/* Filters Section */}
            <div className="w-full max-w-3xl mt-6 flex flex-wrap items-center gap-4">
              <Select
                value={currentTerm}
                onValueChange={(value) => {
                  router.push(
                    `${pathname}?${createQueryString({
                      term: value,
                    })}`
                  );
                }}
              >
                <SelectTrigger className="w-[180px] bg-black border-gray-800">
                  <SelectValue placeholder="Select term" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Fall 2024">Fall 2024</SelectItem>
                  <SelectItem value="Spring 2024">Spring 2024</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={currentDepartment}
                onValueChange={(value) => {
                  router.push(
                    `${pathname}?${createQueryString({
                      department: value,
                    })}`
                  );
                }}
              >
                <SelectTrigger className="w-[180px] bg-black border-gray-800">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Departments</SelectItem>
                  <SelectItem value="CSC">Computer Science</SelectItem>
                  <SelectItem value="MATH">Mathematics</SelectItem>
                  <SelectItem value="ENGL">English</SelectItem>
                  <SelectItem value="PHYS">Physics</SelectItem>
                </SelectContent>
              </Select>

              <input
                type="number"
                placeholder="Credits"
                className="w-[120px] px-4 py-2 bg-black border border-gray-800 rounded-lg focus:outline-none focus:border-blue-500"
                value={currentCredits}
                onChange={(e) => {
                  router.push(
                    `${pathname}?${createQueryString({
                      credits: e.target.value,
                    })}`
                  );
                }}
                min="1"
                max="4"
              />

              <div className="flex items-center gap-2">
                <Switch
                  checked={showOpenOnly}
                  onCheckedChange={setShowOpenOnly}
                  className="data-[state=checked]:bg-blue-500"
                />
                <label className="text-sm text-gray-400">
                  Show Open Classes Only
                </label>
              </div>
            </div>
          </div>

          {/* Course Grid */}
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableCourses.map((course, index) => (
                <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                        <Card className="bg-black/30 border-gray-800 hover:bg-black/40 transition-all duration-300 hover:border-gray-700">
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-blue-400">{course.name}</CardTitle>
                                        <CardDescription className="text-lg font-medium text-gray-200">
                                            {course.code}
                                        </CardDescription>
                                    </div>
                                    <motion.button
                                        onClick={() => isEnrolled(course.id) ? handleUnenroll(course.id) : handleEnroll(course)}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.99 }}
                                        transition={{ type: "spring", stiffness: 400, damping: 5 }}
                                        className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                                            isEnrolled(course.id)
                                                ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                                                : "bg-blue-500 text-white hover:bg-blue-400"
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
                                    </motion.button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
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
                                    
                                    <div className="mt-4">
                                        <div className="flex justify-between text-sm text-gray-400 mb-2">
                                            <span>Available Seats</span>
                                            <span>{course.enrolled}/{course.capacity}</span>
                                        </div>
                                        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${(course.enrolled / course.capacity) * 100}%` }}
                                                transition={{ duration: 0.5, ease: "easeOut" }}
                                                className="h-full bg-blue-500"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}