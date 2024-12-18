"use client";

import React, { useState, useEffect } from "react";
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

export default function StudentCoursesPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Initialize state from URL parameters
  const [searchInput, setSearchInput] = useState(searchParams.get('q') || "");
  const [filters, setFilters] = useState({
    showOpenOnly: searchParams.get('openOnly') === 'true',
    term: searchParams.get('term') || "All",
    department: searchParams.get('department') || "All",
    credits: searchParams.get('credits') || "",
  });

  const [isNavCollapsed, setIsNavCollapsed] = useState(false);
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  const fetchCourses = async (params: URLSearchParams) => {
    try {
      const response = await fetch(`/api/courses?${params}`);
      if (!response.ok) throw new Error('Failed to fetch courses');
      
      const data = await response.json();
      setAvailableCourses(data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  // Handle search and filter updates
  const handleSearch = () => {
    const params = new URLSearchParams();
    
    if (searchInput) params.set('q', searchInput);
    if (filters.term !== "All") params.set('term', filters.term);
    if (filters.department !== 'All') params.set('department', filters.department);
    if (filters.credits) params.set('credits', filters.credits);
    if (filters.showOpenOnly) params.set('openOnly', 'true');

    // Update URL and fetch courses
    router.push(`${pathname}?${params.toString()}`);
    fetchCourses(params);
  };

  // Initial load using URL parameters
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    fetchCourses(params);
  }, [searchParams]);

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const response = await fetch('/api/student/courses');
        if (!response.ok) throw new Error('Failed to fetch enrolled courses');
        
        const data = await response.json();
        setEnrolledCourses(data.courses || []);
      } catch (error) {
        console.error('Error fetching enrolled courses:', error);
      }
    };

    fetchEnrolledCourses();
  }, []);

  const handleEnroll = async (course: Course) => {
    try {
      const response = await fetch('/api/student/enroll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ courseId: course.id }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.prerequisites) {
          const prereqList = data.prerequisites
            .map((prereq: { code: string, title: string }) => 
              `${prereq.code} (${prereq.title})`
            )
            .join(', ');
          toast.error(`Missing prerequisites: ${prereqList}`);
        } else {
          toast.error(data.error || 'Failed to enroll in course');
        }
        return;
      }

      // Update local state only after successful enrollment
      setEnrolledCourses([...enrolledCourses, course]);
      setAvailableCourses((prevCourses: Course[]) => 
        prevCourses.map((c: Course) => 
          c.id === course.id ? { ...c, enrolled: c.enrolled + 1 } : c
        )
      );
      
      toast.success(`Enrolled in ${course.name}`, {
        icon: '📚',
      });

    } catch (error) {
      console.error('Error enrolling in course:', error);
      toast.error('Failed to enroll in course');
    }
  };

  const handleUnenroll = async (courseId: number) => {
    try {
      const response = await fetch('/api/student/unenroll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ courseId }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || 'Failed to unenroll from course');
        return;
      }

      // Update local state only after successful unenrollment
      setEnrolledCourses(enrolledCourses.filter((course: Course) => course.id !== courseId));
      setAvailableCourses((prevCourses: Course[]) => 
        prevCourses.map((c: Course) => 
          c.id === courseId ? { ...c, enrolled: c.enrolled - 1 } : c
        )
      );
      
      toast.success('Successfully unenrolled', {
        icon: '🔄',
      });

    } catch (error) {
      console.error('Error unenrolling from course:', error);
      toast.error('Failed to unenroll from course');
    }
  };

  const isEnrolled = (courseId: number) => {
    return enrolledCourses.some((course: Course) => course.id === courseId);
  };

  return (
    <div className="flex min-h-screen bg-black">
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
                value={filters.term}
                onValueChange={(value) => setFilters(prev => ({ ...prev, term: value }))}
              >
                <SelectTrigger className="w-[180px] bg-black border-gray-800">
                  <SelectValue placeholder="Select term" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Terms</SelectItem>
                  <SelectItem value="Fall 2024">Fall 2024</SelectItem>
                  <SelectItem value="Spring 2024">Spring 2024</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filters.department}
                onValueChange={(value) => setFilters(prev => ({ ...prev, department: value }))}
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
                value={filters.credits}
                onChange={(e) => setFilters(prev => ({ ...prev, credits: e.target.value }))}
                min="1"
                max="4"
              />

              <div className="flex items-center gap-2">
                <Switch
                  checked={filters.showOpenOnly}
                  onCheckedChange={(checked) => setFilters(prev => ({ ...prev, showOpenOnly: checked }))}
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
            {availableCourses.map((course: Course, index: number) => (
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