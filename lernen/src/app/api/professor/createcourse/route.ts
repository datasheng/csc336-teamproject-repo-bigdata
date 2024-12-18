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
        console.log("Create Course - User ID:", user?.id);

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

        console.log("Professor Data:", professorData);
        console.log("Professor Error:", professorError);

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

        // Before the RPC call
        console.log("Creating course with data:", {
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

        // Create new course using RPC
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
            console.error('Error creating course:', courseError);
            return NextResponse.json(
                { error: courseError.message },
                { status: 500 }
            );
        }

        // After the RPC call
        console.log("Course creation response:", newCourse);

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