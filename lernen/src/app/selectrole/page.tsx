"use client";

import { useState } from "react";
import { GraduationCap, School } from "lucide-react";
import BlurFade from "@/components/ui/blur-fade";
import { HoverEffect } from "@/components/ui/card-hover-effect";

{/* TODO : student page.tsx, and prof page.tsx*/ }
{/* Redirect back to Student Dashboard, going to have a signup*/ }

export default function SelectRole() {
  const roles = [
    {
      title: "Student",
      description: "Access your courses, schedules, and ratings.",
      link: "/selectrole/signup",
      icon: GraduationCap,
    },
    {
      title: "Professor",
      description: "Manage your courses and student interactions.",
      link: "/selectsemester/professor",
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