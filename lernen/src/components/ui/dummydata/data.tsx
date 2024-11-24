import { ListItem } from '../types';

export const getStudentData = () => {
    return [
        {
            title: "Spring 2025",
            enrollment: 'Enrollment Opens: Dec 1, 2024',
            content: "Early Registration Period"
        },
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
                },
            ]
        },

    ];
}

export const getProfessorData = () => {
    return [
        { title: "Spring 2025", enrollment: 'Upcoming', content: "Updates Due Date by." },
        { title: "Fall 2024", enrollment: 'Current', content: "Updates Due Date by." },
        { title: "Spring 2024", enrollment: 'Past', content: "Updates Due Date by." }
    ];
};