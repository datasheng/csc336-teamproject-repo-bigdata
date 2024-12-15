import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

interface TeamMember {
    name: string;
    role: string;
    image: string;
}

const teamMembers: TeamMember[] = [
    {
        name: "Timson Tan",
        role: "Frontend Developer",
        image: "/team/Timson.png"
    },
    {
        name: "Jawad Chowdhury",
        role: "Full-Stack Engineer",
        image: "/team/Jawad.png"
    },
    {
        name: "Zakaria Chowdhury",
        role: "Backend Engineer",
        image: "/team/Zak.jpg"
    },
    {
        name: "Anas Ahmed",
        role: "Backend Engineer",
        image: "/team/Anas.png"
    },
    {
        name: "Darren Ling",
        role: "Backend Engineer",
        image: "/team/Darren.png"
    }
];

export function TeamDropdown() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            <button
                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-800 text-lg"
                onClick={() => setIsOpen(!isOpen)}
                onBlur={() => setTimeout(() => setIsOpen(false), 200)}
            >
                <span>Meet the Team</span>
                <ChevronDown
                    className={`h-5 w-5 transition-transform duration-800 ease-in-out ${isOpen ? 'rotate-180' : ''
                        }`}
                />
            </button>

            <div
                className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 w-96 rounded-lg border border-gray-800 bg-black/95 backdrop-blur-sm shadow-xl
                    transition-all duration-800 ease-in-out origin-top
                    ${isOpen
                        ? 'opacity-100 translate-y-0 scale-100'
                        : 'opacity-0 -translate-y-2 scale-95 pointer-events-none'
                    }`}
            >
                <div className="text-center px-6 py-3 border-b border-gray-800">
                    <p className="text-base text-gray-400">Our Team</p>
                </div>
                <div className="py-3">
                    {teamMembers.map((member, index) => (
                        <div
                            key={index}
                            className="px-6 py-4 hover:bg-gray-800/50 transition-colors duration-800 cursor-pointer flex items-center space-x-5"
                            style={{
                                transitionDelay: `${index * 50}ms`
                            }}
                        >
                            <div className="flex-shrink-0">
                                <img
                                    src={member.image}
                                    alt={member.name}
                                    className="h-16 w-16 rounded-full object-cover border border-gray-800 transition-transform duration-800 hover:scale-105"
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-base font-medium text-white truncate">{member.name}</p>
                                <p className="text-sm text-gray-400">{member.role}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}