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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
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

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

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

  const formattedCourses = professorData?.courses?.map(course => ({
    id: course.courseID,
    name: course.courseTitle,
    code: `${course.coursePrefix} ${course.courseCode}`,
    professor: `${professorData.firstName} ${professorData.lastName}`,
    schedule: "Schedule TBD",
    room: "Room TBD",
    credits: course.credits
  })) || [];

  const handleCreateCourse = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    try {
      const response = await fetch('/api/professor/createcourse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseCode: formData.courseCode,
          coursePrefix: formData.coursePrefix,
          courseTitle: formData.courseTitle,
          capacity: formData.capacity,
          credits: formData.credits,
          schedule: formData.schedule.map(slot => ({
            dayOfWeek: slot.dayOfWeek,
            startTime: `${slot.startTime}:00`,
            endTime: `${slot.endTime}:00`,
            room: slot.room
          }))
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create course');
      }

      const data = await response.json();
      toast.success('Course created successfully');
      setIsCreateDialogOpen(false);

      setFormData({
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

      fetchProfessorData();
    } catch (error) {
      console.error('Error creating course:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create course');
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

          <div className="relative z-10 flex flex-col items-center mt-[12vh]">
            <BlurFade delay={0.54} inView>
              <h1 className="text-6xl font-bold tracking-[0.04em] bg-gradient-to-b from-blue-400/90 via-blue-400/70 to-blue-400/50 bg-clip-text text-transparent">
                Welcome, {professorData?.firstName || "Professor"}!
              </h1>
            </BlurFade>
          </div>

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

          <div className="relative z-10 flex justify-center">
            <ClassContainer
              courses={formattedCourses}
              userType="professor"
              onCreateCourse={() => setIsCreateDialogOpen(true)}
            />
          </div>

          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogContent className="bg-black/90 border border-gray-800 text-white max-h-[80vh] overflow-y-auto">
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

                <div className="space-y-4">
                  <label className="text-sm text-gray-400">Course Schedule</label>
                  {formData.schedule.map((scheduleItem, index) => (
                    <div key={index} className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Select
                          value={scheduleItem.dayOfWeek}
                          onValueChange={(value) => {
                            const newSchedule = [...formData.schedule];
                            newSchedule[index] = { ...scheduleItem, dayOfWeek: value };
                            setFormData({ ...formData, schedule: newSchedule });
                          }}
                        >
                          <SelectTrigger className="bg-black border-gray-800">
                            <SelectValue placeholder="Select day" />
                          </SelectTrigger>
                          <SelectContent>
                            {daysOfWeek.map((day) => (
                              <SelectItem key={day} value={day}>
                                {day}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <div className="relative">
                          <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                          <input
                            type="text"
                            required
                            placeholder="Room number"
                            className="w-full pl-10 px-4 py-2 bg-black border border-gray-800 rounded-lg focus:outline-none focus:border-blue-500"
                            value={scheduleItem.room}
                            onChange={(e) => {
                              const newSchedule = [...formData.schedule];
                              newSchedule[index] = { ...scheduleItem, room: e.target.value };
                              setFormData({ ...formData, schedule: newSchedule });
                            }}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="relative">
                          <Clock className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                          <input
                            type="time"
                            required
                            className="w-full pl-10 px-4 py-2 bg-black border border-gray-800 rounded-lg focus:outline-none focus:border-blue-500"
                            value={scheduleItem.startTime}
                            onChange={(e) => {
                              const newSchedule = [...formData.schedule];
                              newSchedule[index] = { ...scheduleItem, startTime: e.target.value };
                              setFormData({ ...formData, schedule: newSchedule });
                            }}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="relative">
                          <Clock className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                          <input
                            type="time"
                            required
                            className="w-full pl-10 px-4 py-2 bg-black border border-gray-800 rounded-lg focus:outline-none focus:border-blue-500"
                            value={scheduleItem.endTime}
                            onChange={(e) => {
                              const newSchedule = [...formData.schedule];
                              newSchedule[index] = { ...scheduleItem, endTime: e.target.value };
                              setFormData({ ...formData, schedule: newSchedule });
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        schedule: [
                          ...formData.schedule,
                          {
                            dayOfWeek: "Monday",
                            startTime: "09:00",
                            endTime: "10:15",
                            room: ""
                          }
                        ]
                      });
                    }}
                    className="w-full border-gray-800 text-gray-400 hover:bg-gray-800"
                  >
                    Add Another Time Slot
                  </Button>
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
      </main>
    </div>
  );
}