'use client';

import React, { useState, useEffect } from "react";
import { Spotlight } from "@/components/ui/spotlight";
import { BookOpen, Users, Clock, MapPin, Plus, Hash, GraduationCap } from "lucide-react";
import Navbar from "@/components/ui/navbar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import BlurFade from "@/components/ui/blur-fade";
import ClassContainer from "@/components/ui/classcontainer";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

interface ProfessorData {
  firstName: string;
  lastName: string;
  department: string;
  avgRating: number;
  courses: Course[];
}

interface Course {
  courseID: string;
  courseCode: string;
  coursePrefix: string;
  courseTitle: string;
  seatsTaken: number;
  capacity: number;
  credits: number;
}

interface CourseFormData {
  courseCode: string;
  coursePrefix: string;
  courseTitle: string;
  capacity: number;
  credits: number;
  schedule: {
    dayOfWeek: string;
    startTime: string;
    endTime: string;
    room: string;
  }[];
}

export default function ProfessorDashboard() {
  const [isNavCollapsed, setIsNavCollapsed] = useState(false);
  const [selectedSemester, setSelectedSemester] = useState("Fall 2024");
  const [professorData, setProfessorData] = useState<ProfessorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [formData, setFormData] = useState<CourseFormData>({
    courseCode: "",
    coursePrefix: "",
    courseTitle: "",
    capacity: 30,
    credits: 3,
    schedule: [{
      dayOfWeek: "Monday",
      startTime: "09:00",
      endTime: "10:15",
      room: ""
    }]
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newCourse, setNewCourse] = useState({
    name: "",
    code: "",
    startTime: "",
    endTime: "",
    location: "",
    dayOfWeek: "Monday"
  });

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  const fetchProfessorData = async () => {
    try {
      const response = await fetch("/api/professor");
      const data = await response.json();
      setProfessorData(data);
    } catch (error) {
      console.error("Error fetching professor data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfessorData();
  }, []);

  // Calculate statistics with better handling of empty data
  const totalStudents = professorData?.courses?.reduce(
    (sum, course) => sum + course.seatsTaken,
    0
  ) || 0;

  const totalCourses = professorData?.courses?.length || 0;

  const totalCapacity = professorData?.courses?.reduce(
    (sum, course) => sum + course.capacity,
    0
  ) || 0;

  const capacityPercentage = totalCapacity > 0
    ? ((totalStudents / totalCapacity) * 100).toFixed(1)
    : "0";

  // Transform courses data for ClassContainer
  const formattedCourses = professorData?.courses?.map(course => ({
    id: course.courseID,
    name: course.courseTitle,
    code: `${course.coursePrefix} ${course.courseCode}`,
    professor: `${professorData.firstName} ${professorData.lastName}`,
    schedule: "Schedule TBD", // Add this to your course data if needed
    room: "Room TBD", // Add this to your course data if needed
    credits: course.credits
  })) || [];

  const handleCreateCourse = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    try {
      const response = await fetch('/api/professor/course', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to create course');

      const data = await response.json();
      toast.success('Course created successfully');
      setIsCreateDialogOpen(false);
      setIsDialogOpen(false); // Close both dialogs
      // Refresh the course list
      fetchProfessorData();
    } catch (error) {
      console.error('Error creating course:', error);
      toast.error('Failed to create course');
    }
  };

  return (
    <div className="flex h-screen bg-black overflow-hidden">
      <Navbar onCollapse={setIsNavCollapsed} />

      <main className={`flex-1 transition-all duration-300 ${isNavCollapsed ? "ml-16" : "ml-64"}`}>
        <div className="relative min-h-screen bg-black/[0.96] text-white p-8 overflow-y-auto">
          <Spotlight
            className="-top-40 right-0 md:right-60 md:-top-20"
            fill="#60A5FA"
          />

          {/* Header Section */}
          <div className="relative z-10 flex flex-col items-center mt-[12vh]">
            <BlurFade delay={0.54} inView>
              <h1 className="text-6xl font-bold tracking-[0.04em] bg-gradient-to-b from-blue-400/90 via-blue-400/70 to-blue-400/50 bg-clip-text text-transparent">
                Welcome, {professorData?.firstName || "Professor"}!
              </h1>
            </BlurFade>
          </div>

          {/* Stats Cards */}
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Card className="bg-black/30 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-blue-400">Total Students</CardTitle>
                  <CardDescription>Across all courses</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold text-white">{totalStudents}</p>
                  <p className="text-sm text-gray-400">
                    {capacityPercentage}% capacity filled
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Card className="bg-black/30 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-blue-400">Active Courses</CardTitle>
                  <CardDescription>Current semester</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold text-white">{totalCourses}</p>
                  <p className="text-sm text-gray-400">
                    Teaching load: {totalCourses * 3} credits
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <Card className="bg-black/30 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-blue-400">Rating</CardTitle>
                  <CardDescription>Overall performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold text-white">{professorData?.avgRating?.toFixed(1) || "0.0"}</p>
                  <p className="text-sm text-gray-400">
                    Based on student feedback
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>



          {/* Semester Select */}
          <div className="relative z-10 flex justify-center mt-8 mb-6">
            <div className="w-full max-w-5xl px-4 flex justify-end">
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
          </div>

          {/* Classes Container */}
          <div className="relative z-10 flex justify-center">
            <ClassContainer
              courses={formattedCourses}
              userType="professor"
              onCreateCourse={() => setIsCreateDialogOpen(true)}
            />
          </div>

          {/* Create Course Dialog */}
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
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
                      value={formData.courseTitle}
                      onChange={(e) => setFormData({ ...formData, courseTitle: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400">Course Prefix</label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                      <input
                        type="text"
                        required
                        className="w-full pl-10 px-4 py-2 bg-black border border-gray-800 rounded-lg focus:outline-none focus:border-blue-500"
                        placeholder="CSC"
                        value={formData.coursePrefix}
                        onChange={(e) => setFormData({ ...formData, coursePrefix: e.target.value })}
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
                        placeholder="101"
                        value={formData.courseCode}
                        onChange={(e) => setFormData({ ...formData, courseCode: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400">Capacity</label>
                    <div className="relative">
                      <Users className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                      <input
                        type="number"
                        required
                        className="w-full pl-10 px-4 py-2 bg-black border border-gray-800 rounded-lg focus:outline-none focus:border-blue-500"
                        value={formData.capacity}
                        onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-gray-400">Credits</label>
                    <div className="relative">
                      <GraduationCap className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                      <input
                        type="number"
                        required
                        className="w-full pl-10 px-4 py-2 bg-black border border-gray-800 rounded-lg focus:outline-none focus:border-blue-500"
                        value={formData.credits}
                        onChange={(e) => setFormData({ ...formData, credits: parseInt(e.target.value) })}
                      />
                    </div>
                  </div>
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

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center space-x-2 bg-blue-500 text-white hover:bg-blue-400">
                <Plus className="h-4 w-4" />
                <span>Create Course</span>
              </Button>
            </DialogTrigger>

            <DialogContent className="bg-black/90 border border-gray-800 text-white">
              {/* Rest of the dialog content you provided */}
            </DialogContent>
          </Dialog>
        </div>
      </main>
    </div>
  );
}