import React from 'react';
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

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
}

const ClassContainer: React.FC<ClassContainerProps> = ({ courses }) => {
  return (
    <div className="w-full max-w-5xl px-4">
      <div className="bg-black/50 rounded-t-[2.5rem] border border-gray-800 min-h-[calc(100vh-15rem)]">
        <div className="p-8 space-y-6 max-h-[calc(100vh-20rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
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
              className="text-center py-8 text-gray-400 text-lg"
            >
              No classes to show
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 mb-8 text-gray-500 text-base"
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