import { ListItem } from '../types';

export const getStudentData = () => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    const semesters = {
        future: [
            {
                title: "Spring 2025",
                enrollment: 'Enrollment Opens: Dec 1, 2024',
                content: "Early Registration Period"
            }
        ],
        current: [
            {
                title: "Fall 2024",
                enrollment: 'Currently Enrolled',
                content: "Current Semester",
                courses: [
                    {
                        courseCode: "CSC 10300",
                        courseName: "Introduction to Computing",
                        professor: "Dr. John Smith",
                        schedule: {
                            days: "Mon/Wed",
                            time: "10:00 AM - 11:40 AM",
                            room: "NAC 7/107"
                        },
                        seats: {
                            total: 25,
                            enrolled: 25
                        },
                        dates: {
                            start: "Aug 25, 2024",
                            end: "Dec 20, 2024"
                        },
                        status: 'Closed'
                    }
                ]
            }
        ],
        past: [
            {
                title: "Summer 2024",
                enrollment: 'Past Semester',
                content: "Past Semester",
                courses: [
                    {
                        courseCode: "CSC 21200",
                        courseName: "Data Structures",
                        professor: "Dr. Jane Doe",
                        schedule: {
                            days: "Mon/Wed",
                            time: "2:00 PM - 3:40 PM",
                            room: "NAC 6/102"
                        },
                        seats: {
                            total: 30,
                            enrolled: 30
                        },
                        dates: {
                            start: "Jun 1, 2024",
                            end: "Aug 15, 2024"
                        },
                        status: 'Waitlist'
                    }
                ]
            },
            {
                title: "Spring 2024",
                enrollment: 'Past Semester',
                content: "Past Semester",
                courses: [
                    {
                        courseCode: "CSC 11300",
                        courseName: "Programming Methods I",
                        professor: "Dr. Michael Chen",
                        schedule: {
                            days: "Tue/Thu",
                            time: "11:00 AM - 12:40 PM",
                            room: "NAC 4/209"
                        },
                        seats: {
                            total: 25,
                            enrolled: 25
                        },
                        dates: {
                            start: "Jan 25, 2024",
                            end: "May 20, 2024"
                        },
                        status: 'Open'
                    }
                ]
            }
        ]
    };

    return semesters;
};

export const getProfessorData = () => {
    return {
        future: [
            { title: "Spring 2025", enrollment: 'Upcoming', content: "Updates Due Date by." }
        ],
        current: [
            { title: "Fall 2024", enrollment: 'Current', content: "Updates Due Date by." }
        ],
        past: [
            { title: "Spring 2024", enrollment: 'Past', content: "Updates Due Date by." }
        ]
    };
};