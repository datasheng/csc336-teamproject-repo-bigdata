'use client'

import React, { useState } from 'react';
import { Spotlight } from "@/components/ui/spotlight";
import { Search, Star, ThumbsUp, MessageCircle, User, Filter } from "lucide-react";
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

// Dummy data
const dummyProfessors = [
    {
        id: 1,
        name: "Dr. Smith",
        department: "Computer Science",
        courses: ["Algorithms", "Data Structures", "Advanced Algorithms"],
        averageRating: 4.5,
        totalRatings: 45,
        ratings: [
            {
                id: 1,
                rating: 5,
                comment: "Excellent professor, very clear explanations",
                course: "Algorithms",
                helpful: 12,
                date: "2024-03-15"
            },
            {
                id: 2,
                rating: 4,
                comment: "Good teaching style but assignments can be challenging",
                course: "Data Structures",
                helpful: 8,
                date: "2024-03-10"
            }
        ]
    },
    {
        id: 2,
        name: "Dr. Johnson",
        department: "Computer Science",
        courses: ["Database Systems", "Web Development", "SQL Programming"],
        averageRating: 4.2,
        totalRatings: 38,
        ratings: [
            {
                id: 3,
                rating: 4,
                comment: "Very knowledgeable about databases",
                course: "Database Systems",
                helpful: 15,
                date: "2024-03-12"
            },
            {
                id: 4,
                rating: 5,
                comment: "Makes complex concepts easy to understand",
                course: "Web Development",
                helpful: 10,
                date: "2024-03-01"
            }
        ]
    },
    {
        id: 3,
        name: "Dr. Williams",
        department: "Mathematics",
        courses: ["Calculus I", "Linear Algebra", "Differential Equations"],
        averageRating: 4.8,
        totalRatings: 52,
        ratings: [
            {
                id: 5,
                rating: 5,
                comment: "Best math professor I've ever had. Explains everything thoroughly",
                course: "Calculus I",
                helpful: 20,
                date: "2024-03-14"
            },
            {
                id: 6,
                rating: 5,
                comment: "Amazing at breaking down complex topics",
                course: "Linear Algebra",
                helpful: 18,
                date: "2024-03-08"
            }
        ]
    },
    {
        id: 4,
        name: "Dr. Brown",
        department: "Computer Science",
        courses: ["Operating Systems", "Computer Networks", "System Programming"],
        averageRating: 4.0,
        totalRatings: 41,
        ratings: [
            {
                id: 7,
                rating: 4,
                comment: "Very thorough in covering course material",
                course: "Operating Systems",
                helpful: 9,
                date: "2024-03-11"
            },
            {
                id: 8,
                rating: 3,
                comment: "Good knowledge but lectures can be dense",
                course: "Computer Networks",
                helpful: 5,
                date: "2024-03-05"
            }
        ]
    },
    {
        id: 5,
        name: "Dr. Davis",
        department: "Mathematics",
        courses: ["Statistics", "Probability Theory", "Data Analysis"],
        averageRating: 4.6,
        totalRatings: 35,
        ratings: [
            {
                id: 9,
                rating: 5,
                comment: "Makes statistics interesting and engaging",
                course: "Statistics",
                helpful: 14,
                date: "2024-03-13"
            },
            {
                id: 10,
                rating: 4,
                comment: "Great real-world examples in lectures",
                course: "Data Analysis",
                helpful: 11,
                date: "2024-03-07"
            }
        ]
    },
    {
        id: 6,
        name: "Dr. Martinez",
        department: "Computer Science",
        courses: ["Artificial Intelligence", "Machine Learning", "Deep Learning"],
        averageRating: 4.7,
        totalRatings: 48,
        ratings: [
            {
                id: 11,
                rating: 5,
                comment: "Passionate about AI and really knows the subject matter",
                course: "Artificial Intelligence",
                helpful: 16,
                date: "2024-03-09"
            },
            {
                id: 12,
                rating: 4,
                comment: "Challenging but rewarding course content",
                course: "Machine Learning",
                helpful: 13,
                date: "2024-03-02"
            }
        ]
    },
    {
        id: 7,
        name: "Dr. Anderson",
        department: "Mathematics",
        courses: ["Abstract Algebra", "Number Theory", "Discrete Mathematics"],
        averageRating: 4.3,
        totalRatings: 39,
        ratings: [
            {
                id: 13,
                rating: 4,
                comment: "Very structured and organized teaching approach",
                course: "Abstract Algebra",
                helpful: 8,
                date: "2024-03-06"
            },
            {
                id: 14,
                rating: 5,
                comment: "Excellent at explaining abstract concepts",
                course: "Number Theory",
                helpful: 12,
                date: "2024-03-04"
            }
        ]
    },
    {
        id: 8,
        name: "Dr. Taylor",
        department: "Computer Science",
        courses: ["Software Engineering", "Project Management", "Agile Development"],
        averageRating: 4.4,
        totalRatings: 43,
        ratings: [
            {
                id: 15,
                rating: 4,
                comment: "Great industry experience and practical insights",
                course: "Software Engineering",
                helpful: 17,
                date: "2024-03-03"
            },
            {
                id: 16,
                rating: 5,
                comment: "Really prepares you for real-world software development",
                course: "Agile Development",
                helpful: 14,
                date: "2024-02-28"
            }
        ]
    }
];

export default function RatingPage() {
    const [isNavCollapsed, setIsNavCollapsed] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedDepartment, setSelectedDepartment] = useState("all");
    const [isRatingDialogOpen, setIsRatingDialogOpen] = useState(false);
    const [selectedProfessor, setSelectedProfessor] = useState<typeof dummyProfessors[0] | null>(null);
    const [newRating, setNewRating] = useState({
        rating: 5,
        comment: "",
        course: ""
    });

    const handleSubmitRating = () => {
        // Handle rating submission logic here
        setIsRatingDialogOpen(false);
        setNewRating({ rating: 5, comment: "", course: "" });
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

    const filteredProfessors = dummyProfessors.filter(professor =>
        (professor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            professor.department.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (selectedDepartment === "all" || professor.department === selectedDepartment)
    );

    return (
        <div className="flex h-screen bg-black overflow-hidden">
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
                                    <SelectItem value="Computer Science">Computer Science</SelectItem>
                                    <SelectItem value="Mathematics">Mathematics</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Professors Grid */}
                    <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredProfessors.map((professor) => (
                            <Card key={professor.id} className="bg-black/50 border-gray-800">
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle className="text-blue-400">{professor.name}</CardTitle>
                                            <CardDescription className="text-gray-400">
                                                {professor.department}
                                            </CardDescription>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            onClick={() => {
                                                setSelectedProfessor(professor);
                                                setIsRatingDialogOpen(true);
                                            }}
                                            className="space-y-2 p-3 rounded-lg bg-gray/50 border border-gray-800/50"
                                        >
                                            Rate
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <StarRating rating={professor.averageRating} />
                                            <span className="text-sm text-gray-400">
                                                {professor.totalRatings} ratings
                                            </span>
                                        </div>

                                        <div className="space-y-4">
                                            {professor.ratings.slice(0, 2).map((rating) => (
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
                                                    <p className="text-sm text-gray-600">{rating.comment}</p>
                                                    <div className="flex items-center justify-between text-xs text-gray-400">
                                                        <div className="flex items-center space-x-2">
                                                            <ThumbsUp className="h-3 w-3" />
                                                            <span>{rating.helpful} helpful</span>
                                                        </div>
                                                        <span>{rating.date}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Rating Dialog */}
                    <Dialog open={isRatingDialogOpen} onOpenChange={setIsRatingDialogOpen}>
                        <DialogContent className="bg-black border border-gray-800">
                            <DialogHeader>
                                <DialogTitle className="text-blue-400">
                                    Rate {selectedProfessor?.name}
                                </DialogTitle>
                                <DialogDescription className="text-gray-400">
                                    Share your experience with this professor
                                </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-200">Rating</label>
                                    <div className="flex space-x-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                onClick={() => setNewRating({ ...newRating, rating: star })}
                                                className="focus:outline-none"
                                            >
                                                <Star
                                                    className={`h-6 w-6 ${star <= newRating.rating
                                                        ? "fill-yellow-400 text-yellow-400"
                                                        : "text-gray-400"
                                                        }`}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm text-gray-200">Course</label>
                                    <Select
                                        value={newRating.course}
                                        onValueChange={(value) => setNewRating({ ...newRating, course: value })}
                                    >
                                        <SelectTrigger className="w-full border-gray-800">
                                            <SelectValue placeholder="Select course" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {selectedProfessor?.courses.map((course) => (
                                                <SelectItem key={course} value={course}>
                                                    {course}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm text-gray-200">Comment</label>
                                    <textarea
                                        className="w-full h-32 px-4 py-2 bg-black border border-gray-800 rounded-lg focus:outline-none focus:border-blue-500"
                                        placeholder="Share your experience..."
                                        value={newRating.comment}
                                        onChange={(e) => setNewRating({ ...newRating, comment: e.target.value })}
                                    />
                                </div>

                                <DialogFooter className="flex justify-end space-x-2">
                                    <Button
                                        variant="outline"
                                        onClick={() => setIsRatingDialogOpen(false)}
                                        className="border-gray-800 hover:bg-gray-800"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={handleSubmitRating}
                                        className="bg-blue-500 text-white hover:bg-blue-400"
                                    >
                                        Submit Rating
                                    </Button>
                                </DialogFooter>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </main>
        </div>
    );
}