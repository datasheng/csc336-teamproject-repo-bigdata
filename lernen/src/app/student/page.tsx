"use client";

import React, { useState } from "react";
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

// Dummy data structure that matches potential PostgreSQL schema
const dummyCourses = {
  "Fall 2024": [
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
      upcomingDeadlines: 2,
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
      upcomingDeadlines: 1,
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
      upcomingDeadlines: 3,
    },
  ],
  "Spring 2024": [
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
      upcomingDeadlines: 0,
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
      upcomingDeadlines: 0,
    },
  ],
};

export default function StudentDashboard() {
  const [isNavCollapsed, setIsNavCollapsed] = useState(false);
  const [selectedSemester, setSelectedSemester] = useState("Fall 2024");

  // Calculate semester statistics
  const currentCourses =
    dummyCourses[selectedSemester as keyof typeof dummyCourses];
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
  <BlurFade delay={0} inView>
    <h1 className="text-6xl font-bold tracking-[0.04em] bg-gradient-to-b from-blue-400/90 via-blue-400/70 to-blue-400/50 bg-clip-text text-transparent">
      Hi Jawad!
    </h1>
  </BlurFade>
  
  <BlurFade delay={0.1} inView>
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
