export interface CourseDetails {
    courseCode: string;
    courseName: string;
    professor: string;
    schedule: {
        days: string;
        time: string;
        room: string;
    };
    seats: {
        total: number;
        enrolled: number;
    };
    dates: {
        start: string;
        end: string;
    };
    status: 'Open' | 'Closed' | 'Waitlist';
}

export interface ListItem {
    title: string;
    enrollment: string;
    content: string;
    courses?: CourseDetails[];
}