import React from "react";
import { Spotlight } from "@/components/ui/spotlight";
import BlurFade  from "@/components/ui/blur-fade";
import { GraduationCap, BookPlus } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-black text-white">
      <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-black/[0.96] antialiased bg-grid-white/[0.02]">
        <Spotlight
          className="-top-40 right-0 md:right-60 md:-top-20"
          fill="#60A5FA"
        />
        <div className="relative z-10 flex w-full max-w-7xl flex-col items-center justify-center px-4">
          {/* <div className="opacity-0 animate-[fadeIn_2s_ease_0.75s_forwards]"> */}
          <BlurFade delay={0.15} inView>
            <div className="mb-6 flex items-center justify-center space-x-2">
              <BookPlus className="h-12 w-12 text-blue-400"/>
              <h2 className="text-6xl font-bold text-blue-400">Lernen</h2>
            </div>
            <h1 className="bg-gradient-to-b from-blue-50 to-blue-400 bg-clip-text py-4 text-center text-2xl font-bold text-transparent md:text-4xl">
              Course Management, <br /> but easier.
            </h1>
            <p className="mx-auto mt-4 max-w-lg text-center text-sm text-neutral-300">
              Whether you're a student, or a professor. Lernen makes planning courses
              easier. Join others in achieving and fulfilling their educational goals.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/selectrole">
                <button className="group relative flex w-48 items-center justify-center overflow-hidden rounded-full bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-all duration-300 ease-out hover:bg-blue-400 hover:scale-105">
                  Get Started
                  <GraduationCap className="ml-2 h-4 w-4" />
                </button>
              </Link>
            </div>
          </BlurFade>
          {/* </div> */}
        </div>
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]" />
    </main>
  );
}