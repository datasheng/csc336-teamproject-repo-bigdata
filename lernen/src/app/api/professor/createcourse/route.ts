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

        const { data: professorData, error: professorError } = await supabase
            .rpc('get_professor_id_by_user', {
                p_user_id: user.id
            });

        if (professorError || !professorData) {
            return NextResponse.json(
                { error: "Professor not found" },
                { status: 404 }
            );
        }

        const courseData: CreateCourseRequest = await request.json();

        if (!courseData.courseCode || !courseData.coursePrefix || !courseData.courseTitle) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        const { data: newCourse, error: courseError } = await supabase
            .rpc('create_course_with_prereqs', {
                p_course_code: courseData.courseCode,
                p_course_prefix: courseData.coursePrefix,
                p_course_title: courseData.courseTitle,
                p_capacity: courseData.capacity,
                p_credits: courseData.credits,
                p_prof_id: professorData,
                p_semester: courseData.semester,
                p_schedule: courseData.schedule.map(slot => ({
                    day_of_week: slot.dayOfWeek,
                    start_time: `${slot.startTime}:00`,
                    end_time: `${slot.endTime}:00`,
                    room: slot.room
                })),
                p_prerequisites: courseData.prerequisites?.map(p => p.courseId) || []
            });

        if (courseError) {
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
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}