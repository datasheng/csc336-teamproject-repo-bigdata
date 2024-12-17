import React from 'react';
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { GraduationCap, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Course {
  id: number;
  name: string;
  code: string;
  professor: string;
  schedule: string;
  room: string;
  credits: number;
}

interface ClassContainerProps {
  courses: Course[];
  userType?: 'student' | 'professor';
  onCreateCourse?: () => void;
}

const ClassContainer: React.FC<ClassContainerProps> = ({ 
  courses, 
  userType = 'student',
  onCreateCourse 
}) => {
  const totalCredits = courses.reduce((sum, course) => sum + course.credits, 0);

  return (
    <div className="w-full max-w-5xl px-4">
      <div className="bg-black/50 rounded-t-[2.5rem] border border-gray-800 min-h-[calc(100vh-15rem)]">
        {/* Stats Header */}
        <div className="px-8 pt-6 pb-3 flex justify-between items-center border-b border-gray-800/50">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <BookOpen className="w-5 h-5 text-blue-400" />
            <span className="text-gray-400">
              Total Courses: <span className="text-white font-medium">{courses.length}</span>
            </span>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <GraduationCap className="w-5 h-5 text-blue-400" />
            <span className="text-gray-400">
              Total Credits: <span className="text-white font-medium">{totalCredits}</span>
            </span>
          </motion.div>
        </div>

        <div className="p-6 space-y-6 max-h-[calc(100vh-25rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
          {courses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Card className="bg-black/30 border-gray-800 hover:bg-black/40 transition-all duration-300 hover:border-gray-700">
                  <motion.div 
                    className="p-6 flex items-center gap-6"
                    initial="hidden"
                    whileHover="visible"
                  >
                    {/* Course Initial Circle */}
                    <motion.div 
                      className="w-14 h-14 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0"
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                      <span className="text-blue-400 text-2xl font-bold">
                        {course.name[0]}
                      </span>
                    </motion.div>

                    {/* Course Information */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-semibold text-white">
                            {course.name} - {course.code}
                          </h3>
                          <p className="text-gray-400 text-lg">
                            {course.professor}
                          </p>
                        </div>
                        <motion.span 
                          className="text-blue-400 text-lg font-medium"
                          whileHover={{ scale: 1.1 }}
                        >
                          {course.credits} cr
                        </motion.span>
                      </div>
                      <div className="mt-3 space-y-1 text-gray-400">
                        <p>{course.schedule}</p>
                        <p>{course.room}</p>
                      </div>
                    </div>
                  </motion.div>
                </Card>
              </motion.div>
            </motion.div>
          ))}
          
          {courses.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-8 space-y-4"
            >
              {userType === 'professor' && (
                <Button
                  onClick={onCreateCourse}
                  className="bg-blue-500 hover:bg-blue-600 mb-4"
                >
                  Create Course
                </Button>
              )}
              <p className="text-center text-gray-400 text-lg">
                No classes to show
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8 text-gray-500 text-base"
            >
              No more classes to show
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClassContainer;