"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { GraduationCap, School } from "lucide-react";
import BlurFade from "@/components/ui/blur-fade";
import React from "react";
import Link from "next/link";
import { HoverEffect } from "@/components/ui/card-hover-effect";

export default function SelectRole() {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    
    const roles = [
      {
        title: "Student",
        link: "/student",
        icon: GraduationCap,
        color: "text-blue-400"
      },
      {
        title: "Professor",
        link: "/professor",
        icon: School,
        color: "text-violet-400"
      }
    ];
  
    return (
      <main className="flex min-h-screen flex-col bg-black text-white">
        <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-black/[0.96] antialiased bg-grid-white/[0.02]">
          <BlurFade delay={0.15} inView>
            <h1 className="bg-gradient-to-b from-blue-50 to-blue-400 bg-clip-text text-center text-4xl font-bold text-transparent mb-12">
              Select your role
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl px-4">
              {roles.map((role, idx) => (
                <Link
                  href={role.link}
                  key={role.link}
                  className="relative group block"
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <AnimatePresence>
                    {hoveredIndex === idx && (
                      <motion.span
                        className="absolute inset-0 h-full w-full bg-neutral-200 dark:bg-slate-800/[0.8] block rounded-3xl"
                        layoutId="hoverBackground"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1, transition: { duration: 0.15 } }}
                        exit={{ opacity: 0, transition: { duration: 0.15, delay: 0.2 } }}
                      />
                    )}
                  </AnimatePresence>
                  <div className="rounded-2xl h-48 w-full p-4 overflow-hidden bg-black border border-transparent dark:border-white/[0.2] group-hover:border-slate-700 relative z-20">
                    <div className="relative z-50 h-full flex flex-col items-center justify-center">
                      <role.icon className={`h-20 w-20 ${role.color} mb-4`} />
                      <h4 className="text-zinc-100 font-bold tracking-wide text-xl">
                        {role.title}
                      </h4>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </BlurFade>
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]" />
      </main>
    );
  }