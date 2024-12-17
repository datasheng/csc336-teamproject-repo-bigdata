"use client";

import React, { useState, useEffect } from "react";
import { Spotlight } from "@/components/ui/spotlight";
import { Calendar, GraduationCap, Clock, MapPin } from "lucide-react";
import Navbar from "@/components/ui/studentnavbar";
import ClassContainer from "@/components/ui/classcontainer";
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
import Chatbot from "@/components/ui/chatbot";
import BlurFade from "@/components/ui/blur-fade";
import { createClient } from "@/utils/supabase/client";

// Define types for our data
interface Professor {
  firstName: string;
  lastName: string;
}

interface Course {
  courseID: string;
  courseCode: string;
  coursePrefix: string;
  courseTitle: string;
  credits: number;
  professor: Professor;
}

interface ScheduleCourse {
  course: Course;
}

interface Schedule {
  scheduleID: string;
  semester: string;
  scheduleCourse: {
    course: Course;
  }[];
}

interface UserData {
  username: string;
  email: string;
  schedule: Schedule[];
}

export default function StudentDashboard() {
  const [isNavCollapsed, setIsNavCollapsed] = useState(false);
  const [selectedSemester, setSelectedSemester] = useState("Fall 2024");
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await fetch("/api/student");
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, []);

  // Get current semester's courses
  const currentSchedule = userData?.schedule?.find(
    (s) => s.semester === selectedSemester
  );
  
  const courses = currentSchedule?.scheduleCourse 
    ? Array.isArray(currentSchedule.scheduleCourse) 
      ? currentSchedule.scheduleCourse 
      : Object.values(currentSchedule.scheduleCourse)
    : [];

  const currentCourses = courses.map((sc) => ({
    id: sc.course.courseID,
    name: sc.course.courseTitle,
    code: `${sc.course.coursePrefix} ${sc.course.courseCode}`,
    professor: `${sc.course.professor.firstName} ${sc.course.professor.lastName}`,
    credits: sc.course.credits,
    // You might want to add these fields to your database schema
    grade: "N/A",
    assignments: 0,
    upcomingDeadlines: 0,
  }));

  // Calculate semester statistics
  const totalCredits = currentCourses.reduce(
    (sum, course) => sum + course.credits,
    0
  );
  const totalAssignments = currentCourses.reduce(
    (sum, course) => sum + course.assignments,
    0
  );
  const upcomingDeadlines = currentCourses.reduce(
    (sum, course) => sum + course.upcomingDeadlines,
    0
  );

  // Calculate GPA (assuming A=4.0, A-=3.7, B+=3.3, B=3.0)
  const gradePoints = {
    A: 4.0,
    "A-": 3.7,
    "B+": 3.3,
    B: 3.0,
  };

  const semesterGPA =
    currentCourses.reduce((sum, course) => {
      return (
        sum +
        gradePoints[course.grade as keyof typeof gradePoints] * course.credits
      );
    }, 0) / totalCredits;

  return (
    <div className="flex h-screen bg-black overflow-hidden">
      <Navbar onCollapse={setIsNavCollapsed} />

      <main
        className={`flex-1 transition-all duration-300 ${
          isNavCollapsed ? "ml-16" : "ml-64"
        }`}
      >
        <div className="relative min-h-screen bg-black/[0.96] text-white p-8">
          <Spotlight
            className="-top-40 right-0 md:right-60 md:-top-20"
            fill="#60A5FA"
          />

{/* Header Section */}
<div className="relative z-10 flex flex-col items-center mt-[12vh]">
  <BlurFade delay={0.54} inView>
    <h1 className="text-6xl font-bold tracking-[0.04em] bg-gradient-to-b from-blue-400/90 via-blue-400/70 to-blue-400/50 bg-clip-text text-transparent">
      Hi {userData?.username || "Student"}!
    </h1>
  </BlurFade>
  
  <BlurFade delay={0.5} inView>
    <h2 className="text-3xl text-gray-400 mt-6 font-medium tracking-wide">
      Your Classes for {selectedSemester}
    </h2>
  </BlurFade>
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
                    <Calendar className="h-4 w-4 text-gray-400" />
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
            <ClassContainer courses={currentCourses} />
          </div>
        </div>
      </main>
      <Chatbot />
    </div>
  );
}
