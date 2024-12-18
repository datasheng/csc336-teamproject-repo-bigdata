import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

interface CourseTime {
    dayOfWeek: string;
    startTime: string;
    endTime: string;
    room: string;
}

interface CreateCourseRequest {
    courseCode: string;
    coursePrefix: string;
    courseTitle: string;
    capacity: number;
    credits: number;
    schedule: CourseTime[];
}

export async function POST(request: Request) {
    try {
        const supabase = await createClient();

        // Get authenticated user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Get professor ID from user table
        const { data: professorData, error: professorError } = await supabase
            .from('user')
            .select('userID')
            .eq('email', user.email)
            .single();

        if (professorError || !professorData) {
            return NextResponse.json(
                { error: "Professor not found" },
                { status: 404 }
            );
        }

        // Parse request body
        const courseData: CreateCourseRequest = await request.json();

        // Validate request data
        if (!courseData.courseCode || !courseData.coursePrefix || !courseData.courseTitle) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Create new course using RPC
        const { data: newCourse, error: courseError } = await supabase
            .rpc('create_course', {
                p_course_code: courseData.courseCode,
                p_course_prefix: courseData.coursePrefix,
                p_course_title: courseData.courseTitle,
                p_capacity: courseData.capacity,
                p_credits: courseData.credits,
                p_prof_id: professorData.userID,
                p_semester: 'Fall 2024',
                p_schedule: courseData.schedule.map(slot => ({
                    day_of_week: slot.dayOfWeek,
                    start_time: slot.startTime,
                    end_time: slot.endTime,
                    room: slot.room
                }))
            });

        if (courseError) {
            console.error('Error creating course:', courseError);
            return NextResponse.json(
                { error: courseError.message },
                { status: 500 }
            );
        }

        return NextResponse.json({
            message: "Course created successfully",
            course: newCourse
        });

    } catch (error) {
        console.error('Server Error:', error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}