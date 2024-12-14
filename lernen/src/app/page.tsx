import React from "react";
import { Spotlight } from "@/components/ui/spotlight";
import BlurFade from "@/components/ui/blur-fade";
import { GraduationCap, BookPlus, LogIn, BookOpen, Clock, Users, Bot } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-black text-white">
      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full border-b border-gray-800 bg-black/50 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <BookPlus className="h-8 w-8 text-blue-400" />
            <span className="text-2xl font-bold text-blue-400">Lernen</span>
          </div>
          <div className="hidden space-x-8 md:flex">
            <Link href="#about" className="text-gray-300 hover:text-white">About Us</Link>
            <a href='mailto:support@lernen.com' className='text-gray-300 hover:text-white'>Contact Us</a>
            <Link href="/auth/login" className="text-gray-300 hover:text-white">Login</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-black/[0.96] antialiased bg-grid-white/[0.02]">
        <Spotlight
          className="-top-40 right-0 md:right-60 md:-top-20"
          fill="#60A5FA"
        />

        <div className="relative z-10 grid w-full max-w-7xl grid-cols-1 gap-12 px-4 md:grid-cols-2 md:items-center">
          {/* Left Column - Text Content */}
          <BlurFade delay={0.15} inView>
            <div className="space-y-6">
              <h1 className="text-4xl font-bold leading-tight md:text-6xl">
                Your future is created by
                <span className="block bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                  What You're Going To Do Today
                </span>
              </h1>

              <p className="max-w-lg text-lg text-gray-400">
                Whether you're a student or professor, Lernen makes course planning
                and management easier. Join others in achieving their educational goals.
              </p>

              <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                <Link href="/selectrole">
                  <button className="group flex transform items-center justify-center space-x-2 rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-all hover:scale-110 hover:bg-blue-600">
                    <span>Get Started</span>
                    <GraduationCap className="h-4 w-4" />
                  </button>
                </Link>

                <Link href="/auth/login">
                  <button className="group flex items-center justify-center space-x-2 rounded-lg border border-blue-500 px-6 py-3 text-sm font-medium text-blue-500 transition-all hover:bg-blue-500 hover:scale-110 hover:text-white">
                    <span>Login</span>
                    <LogIn className="h-4 w-4" />
                  </button>
                </Link>
              </div>
            </div>
          </BlurFade>

          {/* Right Column - Feature Cards */}
          <BlurFade delay={0.3} inView>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-xl border border-gray-800 bg-black/50 p-6 backdrop-blur-sm">
                <div className="mb-4 inline-block rounded-lg bg-blue-500/10 p-3">
                  <BookOpen className="h-6 w-6 text-blue-400" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">Course Management</h3>
                <p className="text-sm text-gray-400">Easily manage your courses, assignments, and schedules in one place</p>
              </div>

              <div className="rounded-xl border border-gray-800 bg-black/50 p-6 backdrop-blur-sm">
                <div className="mb-4 inline-block rounded-lg bg-blue-500/10 p-3">
                  <Clock className="h-6 w-6 text-blue-400" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">Real-time Updates</h3>
                <p className="text-sm text-gray-400">Stay updated with course changes and announcements instantly</p>
              </div>

              <div className="rounded-xl border border-gray-800 bg-black/50 p-6 backdrop-blur-sm">
                <div className="mb-4 inline-block rounded-lg bg-blue-500/10 p-3">
                  <Users className="h-6 w-6 text-blue-400" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">Student Tracking</h3>
                <p className="text-sm text-gray-400">Monitor student progress and engagement effectively</p>
              </div>
              <div className="rounded-xl border border-gray-800 bg-black/50 p-6 backdrop-blur-sm">
                <div className="mb-4 inline-block rounded-lg bg-blue-500/10 p-3">
                  <Bot className="h-6 w-6 text-blue-400" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">AI Assistance</h3>
                <p className="text-sm text-gray-400">Get personalized recommendations and insights</p>
              </div>
            </div>
          </BlurFade>
        </div>
      </div>
    </main>
  );
}