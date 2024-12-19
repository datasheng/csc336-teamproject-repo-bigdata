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
    semester: string;
    schedule: CourseTime[];
    prerequisites?: { courseId: string }[];
}

export async function POST(request: Request) {
    try {
        const supabase = await createClient();
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const courseData: CreateCourseRequest = await request.json();

        if (!courseData.courseCode || !courseData.coursePrefix || !courseData.courseTitle) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        const formattedSchedule = courseData.schedule.map(slot => ({
            day_of_week: slot.dayOfWeek,
            start_time: slot.startTime,
            end_time: slot.endTime,
            room: slot.room
        }));

        const prerequisites = courseData.prerequisites?.map(p => p.courseId) || [];

        const { data, error } = await supabase.rpc('create_course_with_prereqs', {
            p_user_id: user.id,
            p_course_code: courseData.courseCode,
            p_course_prefix: courseData.coursePrefix,
            p_course_title: courseData.courseTitle,
            p_capacity: courseData.capacity,
            p_credits: courseData.credits,
            p_semester: courseData.semester,
            p_schedule: formattedSchedule,
            p_prerequisites: prerequisites
        });

        if (error) {
            console.error('RPC Error:', error);
            return NextResponse.json(
                { 
                    error: error.message,
                    details: error.details,
                    hint: error.hint 
                },
                { status: 500 }
            );
        }

        if (!data.success) {
            return NextResponse.json(
                { error: data.message },
                { status: 400 }
            );
        }

        return NextResponse.json({
            message: "Course created successfully",
            course: data
        });

    } catch (error) {
        console.error('Server Error:', error);
        return NextResponse.json(
            { 
                error: "Internal Server Error",
                details: error instanceof Error ? error.message : String(error)
            },
            { status: 500 }
        );
    }
}