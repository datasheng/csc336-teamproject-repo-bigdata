'use client'

import React, { useState, useEffect } from 'react';
import { Spotlight } from "@/components/ui/spotlight";
import { Search, Star, ThumbsUp, MessageCircle, User, Filter, X } from "lucide-react";
import StudentNavbar from '@/components/ui/studentnavbar';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface Professor {
    profid: string;
    name: string;
    ratings: Rating[];
    department: string;
    totalRatings: number;
    averageRating: number;
}

interface Rating {
    id: string;
    course: string;
    rating: number;
    comment: string;
}

interface RateCourse {
    profid: string;
    courseid: string;
    coursetitle: string;
}

export default function RatingPage() {
    const [isNavCollapsed, setIsNavCollapsed] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedDepartment, setSelectedDepartment] = useState("all");
    const [professors, setProfessors] = useState<Professor[]>([]);
    const [rateCourses, setRateCourses] = useState<RateCourse[]>([]);
    const [isRatingDialogOpen, setIsRatingDialogOpen] = useState(false);
    const [selectedProfessor, setSelectedProfessor] = useState<Professor | null>(null);
    const [newRating, setNewRating] = useState({
        rating: 5,
        comment: "",
        course: ""
    });

    useEffect(() => {
        fetchRatings();
    }, []);

    const fetchRatings = async () => {
        try {
            const response = await fetch('/api/student/ratings/getRatings');
            const data = await response.json();
            setProfessors(data.professors);
            setRateCourses(data.rateCourses);
        } catch (error) {
            console.error('Error fetching ratings:', error);
        }
    };

    const handleSubmitRating = async () => {
        try {
            const response = await fetch('/api/student/ratings/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    courseid: newRating.course,
                    numrating: newRating.rating,
                    ratingtext: newRating.comment
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to submit rating');
            }

            setIsRatingDialogOpen(false);
            setNewRating({ rating: 5, comment: "", course: "" });
            fetchRatings(); // Refresh the ratings
        } catch (error) {
            console.error('Error submitting rating:', error);
        }
    };

    const StarRating = ({ rating }: { rating: number }) => {
        return (
            <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`h-4 w-4 ${star <= rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-400"
                            }`}
                    />
                ))}
            </div>
        );
    };

    const filteredProfessors = professors.filter(professor =>
        professor.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedDepartment === "all" || professor.department === selectedDepartment)
    );

    const getCoursesForProfessor = (profid: string) => {
        return rateCourses.filter(course => course.profid === profid);
    };
    
    return (
        <div className="flex min-h-screen bg-black">
            <StudentNavbar onCollapse={setIsNavCollapsed} />

            <main className={`flex-1 transition-all duration-300 ${isNavCollapsed ? 'ml-16' : 'ml-64'}`}>
                <div className="relative min-h-screen bg-black/[0.96] text-white p-8">
                    <Spotlight
                        className="-top-40 right-0 md:right-60 md:-top-20"
                        fill="#60A5FA"
                    />

                    {/* Header Section */}
                    <div className="relative z-10 flex flex-col gap-6 mb-8">
                        <div className="flex justify-between items-center">
                            <div>
                                <h1 className="text-2xl font-bold text-blue-400">Professor Ratings</h1>
                                <p className="text-gray-400 mt-1">View and submit professor ratings</p>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                                <input
                                    type="text"
                                    placeholder="Search professors..."
                                    className="w-full pl-10 px-4 py-2 bg-black border border-gray-800 rounded-lg focus:outline-none focus:border-blue-500"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                                <SelectTrigger className="w-[200px] border-gray-800">
                                    <Filter className="mr-2 h-4 w-4 text-gray-400" />
                                    <SelectValue placeholder="Select department" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Departments</SelectItem>
                                    <SelectItem value="CSC">Computer Science</SelectItem>
                                    <SelectItem value="MATH">Mathematics</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Professors Grid */}
                    <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredProfessors.map((professor) => (
                            <Card 
                                key={professor.name} 
                                className="bg-black/50 border-gray-800 cursor-pointer hover:border-gray-700 transition-colors"
                                onClick={() => {
                                    setSelectedProfessor(professor);
                                    setIsRatingDialogOpen(true);
                                }}
                            >
                                <CardHeader>
                                    <CardTitle className="text-blue-400">{professor.name}</CardTitle>
                                    <CardDescription>Department: {professor.department}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <StarRating rating={professor.averageRating} />
                                            <span className="text-sm text-gray-400">
                                                {professor.totalRatings} {professor.totalRatings === 1 ? 'rating' : 'ratings'}
                                            </span>
                                        </div>

                                        <div className="space-y-4">
                                            {professor.ratings.length > 0 ? (
                                                professor.ratings.slice(0, 2).map((rating) => (
                                                    <div
                                                        key={rating.id}
                                                        className="space-y-2 p-3 rounded-lg bg-gray-800/20"
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <StarRating rating={rating.rating} />
                                                            <span className="text-xs text-gray-400">
                                                                {rating.course}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-gray-400">{rating.comment}</p>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="p-3 text-gray-400">No Ratings Yet</div>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Rating Dialog */}
                    <Dialog open={isRatingDialogOpen} onOpenChange={setIsRatingDialogOpen}>
                        <DialogContent className="bg-black border border-gray-800">
                            <DialogHeader className="relative">
                                <DialogTitle className="text-blue-400">
                                    {selectedProfessor?.name} - Ratings
                                </DialogTitle>
                                <DialogDescription className="text-gray-400">
                                    View all ratings or submit a new one
                                </DialogDescription>
                                <button
                                    onClick={() => setIsRatingDialogOpen(false)}
                                    className="absolute right-0 top-0 p-2 rounded-full hover:bg-gray-800/50 transition-colors"
                                >
                                    <X className="h-4 w-4 text-gray-400" />
                                </button>
                            </DialogHeader>

                            <div className="space-y-6">
                                {/* Rating Form */}
                                {getCoursesForProfessor(selectedProfessor?.profid || "").length > 0 && (
                                    <div className="space-y-4 border-b border-gray-800 pb-6">
                                        <h3 className="text-lg font-semibold text-blue-400">Submit a Rating</h3>
                                        <div className="space-y-4">
                                            <Select
                                                value={newRating.course}
                                                onValueChange={(value) => setNewRating({ ...newRating, course: value })}
                                            >
                                                <SelectTrigger className="w-full border-gray-800">
                                                    <SelectValue placeholder="Select a course" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {getCoursesForProfessor(selectedProfessor?.profid || "").map((course) => (
                                                        <SelectItem key={course.courseid} value={course.courseid}>
                                                            {course.coursetitle}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>

                                            <div className="flex items-center space-x-2">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <Star
                                                        key={star}
                                                        className={`h-6 w-6 cursor-pointer ${
                                                            star <= newRating.rating
                                                                ? "fill-yellow-400 text-yellow-400"
                                                                : "text-gray-400"
                                                        }`}
                                                        onClick={() => setNewRating({ ...newRating, rating: star })}
                                                    />
                                                ))}
                                            </div>

                                            <textarea
                                                placeholder="Write your review..."
                                                className="w-full h-24 px-4 py-2 bg-black border border-gray-800 rounded-lg focus:outline-none focus:border-blue-500 text-white"
                                                value={newRating.comment}
                                                onChange={(e) => setNewRating({ ...newRating, comment: e.target.value })}
                                            />

                                            <Button
                                                className="w-full"
                                                onClick={handleSubmitRating}
                                                disabled={!newRating.course}
                                            >
                                                Submit Rating
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {/* All Ratings */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-blue-400">All Ratings</h3>
                                    <div className="space-y-4 max-h-[400px] overflow-y-auto">
                                    {selectedProfessor?.ratings && selectedProfessor.ratings.length > 0 ? (
                                        selectedProfessor.ratings.map((rating) => (
                                            <div
                                                key={rating.id}
                                                className="p-4 rounded-lg bg-gray-800/20 space-y-2"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <StarRating rating={rating.rating} />
                                                    <span className="text-sm text-gray-400">
                                                        {rating.course}
                                                    </span>
                                                </div>
                                                <p className="text-gray-300">{rating.comment}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-4 text-gray-400">No Ratings Yet</div>
                                    )}
                                    </div>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </main>
        </div>
    );
}