import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { GraduationCap, BookOpen, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import TimePicker from "@/components/ui/time-picker";

interface Course {
  id: string;
  name: string;
  code: string;
  professor: string;
  schedule: string;
  room: string;
  credits: number;
  seatsTaken?: number;
  capacity?: number;
}

interface ClassContainerProps {
  courses: Course[];
  userType?: 'student' | 'professor';
  onCreateCourse?: () => void;
  onEditCourse?: (courseId: string, formData: any) => void;
  onDeleteCourse?: (courseId: string) => void;
}

const ClassContainer: React.FC<ClassContainerProps> = ({ 
  courses, 
  userType = 'student',
  onCreateCourse,
  onEditCourse,
  onDeleteCourse
}) => {
  const totalCredits = courses.reduce((sum, course) => sum + (course.credits || 0), 0);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [editFormData, setEditFormData] = useState({
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

  const handleEditClick = (courseId: string) => {
    const course = courses.find(c => c.id === courseId);
    if (course) {
      const [prefix, code] = course.code.split(' ');
      
      const scheduleMatch = course.schedule.match(/(\w+)\s+(\d+:\d+(?:\s*[AP]M)?)\s*-\s*(\d+:\d+(?:\s*[AP]M)?)/);
      
      const scheduleData = scheduleMatch ? {
        dayOfWeek: scheduleMatch[1],
        startTime: scheduleMatch[2],
        endTime: scheduleMatch[3],
        room: course.room
      } : {
        dayOfWeek: "Monday",
        startTime: "09:00",
        endTime: "10:15",
        room: course.room
      };

      setSelectedCourse(course);
      setEditFormData({
        courseCode: code,
        coursePrefix: prefix,
        courseTitle: course.name,
        capacity: course.capacity || 30,
        credits: course.credits,
        schedule: [scheduleData]
      });
      setIsEditDialogOpen(true);
    }
  };

  const handleDeleteClick = (courseId: string) => {
    const course = courses.find(c => c.id === courseId);
    if (course) {
      setSelectedCourse(course);
      setIsDeleteDialogOpen(true);
    }
  };

  return (
    <div className="w-full max-w-5xl px-4">
      <div className="bg-black/50 rounded-t-[2.5rem] border border-gray-800 h-[calc(100vh-22rem)] flex flex-col">
        {/* Stats Header */}
        <div className="px-8 pt-6 pb-3 flex justify-between items-center border-b border-gray-800/50 flex-shrink-0">
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

        <div className="p-6 space-y-6 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
          {courses?.map((course, idx) => (
            <motion.div
              key={course?.id || idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.1 }}
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Card className="bg-black/30 border-gray-800 hover:bg-black/40 transition-all duration-300 hover:border-gray-700">
                  <motion.div 
                    className="p-6 flex items-center gap-6 relative"
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
                      <div className="flex justify-between items-start pr-24">
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
                        {course.seatsTaken !== undefined && course.capacity !== undefined && (
                          <p className="text-sm">
                            {course.seatsTaken}/{course.capacity} seats taken
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Add action buttons for professors */}
                    {userType === 'professor' && (
                      <div className="absolute top-6 right-4 flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          className="p-2 rounded-full hover:bg-blue-500/10 text-blue-400"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditClick(course.id);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          className="p-2 rounded-full hover:bg-red-500/10 text-gray-400 hover:text-red-400"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClick(course.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </motion.button>
                      </div>
                    )}
                  </motion.div>
                </Card>
              </motion.div>
            </motion.div>
          ))}
          
          {/* Create Course button for professors */}
          {userType === 'professor' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-8 space-y-4"
            >
              <Button
                onClick={onCreateCourse}
                className="bg-blue-500 hover:bg-blue-600"
              >
                Create Course
              </Button>
            </motion.div>
          )}

          {/* Empty state message */}
          {courses.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-8 space-y-4"
            >
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

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-black/90 border border-gray-800 text-white max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-blue-400">Edit Course</DialogTitle>
            <DialogDescription className="text-gray-400">
              Make changes to {selectedCourse?.name}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={async (e) => {
            e.preventDefault();
            if (selectedCourse) {
              await onEditCourse?.(selectedCourse.id, editFormData);
              setIsEditDialogOpen(false);
            }
          }} className="space-y-4 mt-4">
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Course Name</label>
              <div className="relative">
                <BookOpen className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                <input
                  type="text"
                  required
                  className="w-full pl-10 px-4 py-2 bg-black border border-gray-800 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="Introduction to Computer Science"
                  value={editFormData.courseTitle}
                  onChange={(e) => setEditFormData({ ...editFormData, courseTitle: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Course Prefix</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 bg-black border border-gray-800 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="CSC"
                  value={editFormData.coursePrefix}
                  onChange={(e) => setEditFormData({ ...editFormData, coursePrefix: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-400">Course Code</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 bg-black border border-gray-800 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="101"
                  value={editFormData.courseCode}
                  onChange={(e) => setEditFormData({ ...editFormData, courseCode: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Capacity</label>
                <input
                  type="number"
                  required
                  className="w-full px-4 py-2 bg-black border border-gray-800 rounded-lg focus:outline-none focus:border-blue-500"
                  value={editFormData.capacity}
                  onChange={(e) => setEditFormData({ ...editFormData, capacity: parseInt(e.target.value) })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-400">Credits</label>
                <input
                  type="number"
                  required
                  className="w-full px-4 py-2 bg-black border border-gray-800 rounded-lg focus:outline-none focus:border-blue-500"
                  value={editFormData.credits}
                  onChange={(e) => setEditFormData({ ...editFormData, credits: parseInt(e.target.value) })}
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-sm text-gray-400">Schedule</label>
              {editFormData.schedule.map((scheduleItem, index) => (
                <div key={index} className="grid grid-cols-2 gap-4 p-4 border border-gray-800 rounded-lg">
                  <Select
                    value={scheduleItem.dayOfWeek}
                    onValueChange={(value) => {
                      const newSchedule = [...editFormData.schedule];
                      newSchedule[index] = { ...scheduleItem, dayOfWeek: value };
                      setEditFormData({ ...editFormData, schedule: newSchedule });
                    }}
                  >
                    <SelectTrigger className="bg-black border-gray-800">
                      <SelectValue placeholder="Select day" />
                    </SelectTrigger>
                    <SelectContent>
                      {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((day) => (
                        <SelectItem key={day} value={day}>{day}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <input
                    type="text"
                    placeholder="Room"
                    className="w-full px-4 py-2 bg-black border border-gray-800 rounded-lg focus:outline-none focus:border-blue-500"
                    value={scheduleItem.room}
                    onChange={(e) => {
                      const newSchedule = [...editFormData.schedule];
                      newSchedule[index] = { ...scheduleItem, room: e.target.value };
                      setEditFormData({ ...editFormData, schedule: newSchedule });
                    }}
                  />

                  <TimePicker
                    value={scheduleItem.startTime}
                    onChange={(value) => {
                      const newSchedule = [...editFormData.schedule];
                      newSchedule[index] = { ...scheduleItem, startTime: value };
                      setEditFormData({ ...editFormData, schedule: newSchedule });
                    }}
                  />

                  <TimePicker
                    value={scheduleItem.endTime}
                    onChange={(value) => {
                      const newSchedule = [...editFormData.schedule];
                      newSchedule[index] = { ...scheduleItem, endTime: value };
                      setEditFormData({ ...editFormData, schedule: newSchedule });
                    }}
                  />
                </div>
              ))}
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 text-white hover:bg-blue-700"
            >
              Save Changes
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-black/90 border border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle className="text-red-400">Delete Course</DialogTitle>
            <DialogDescription className="text-gray-400">
              Are you sure you want to delete {selectedCourse?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-6">
            <div className="flex justify-end gap-4">
              <Button
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
                className="bg-transparent border-gray-800 text-gray-400 hover:bg-gray-800"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  if (selectedCourse) {
                    onDeleteCourse?.(selectedCourse.id);
                    setIsDeleteDialogOpen(false);
                  }
                }}
                className="bg-black border border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
              >
                Delete Course
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClassContainer;