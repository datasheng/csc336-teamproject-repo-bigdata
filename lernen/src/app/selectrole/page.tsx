"use client";

import { useState } from "react";
import { GraduationCap, School, BookPlus } from "lucide-react";
import BlurFade from "@/components/ui/blur-fade";
import { HoverEffect } from "@/components/ui/card-hover-effect";
import Link from "next/link";

{/* TODO : student page.tsx, and prof page.tsx 
           Redirect back to Student Dashboard, going to have a signup */}

export default function SelectRole() {
  const roles = [
    {
      title: "Student",
      description: "Access your courses, schedules, and ratings.",
      link: "/selectrole/signup",
      icon: GraduationCap,
    },
    { // Change this to /selectrole/signup after we finish up the auth and ETC
      // Can also change to /selectsemester/student to see the current dashboard in the making
      title: "Professor",
      description: "Manage your courses and student interactions.",
      link: "/professor",
      icon: School,
    },
  ];

  const items = roles.map((role) => ({
    title: role.title,
    description: role.description,
    link: role.link,
  }));

  return (
    <main className="flex min-h-screen flex-col bg-black text-white">
      <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-black/[0.96] antialiased bg-grid-white/[0.02]">
        {/* Added Lernen Home Redirecton */}
        <div className="absolute top-4 left-4 z-20">
          <Link href="/">
            <div className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <BookPlus className="h-8 w-8 text-blue-400" />
              <span className="text-2xl font-bold text-blue-400">Lernen</span>
            </div>
          </Link>
        </div>

        <BlurFade delay={0.15} inView>
          <h1 className="bg-gradient-to-b from-blue-50 to-blue-400 bg-clip-text py-4 text-center text-4xl font-bold text-transparent md:text-6xl mb-12">
            Select your role
          </h1>

          <div className="w-full max-w-5xl px-4">
            <HoverEffect
              items={items}
              className="gap-8"
            />
          </div>

        </BlurFade>
      </div>
    </main>
  );
}