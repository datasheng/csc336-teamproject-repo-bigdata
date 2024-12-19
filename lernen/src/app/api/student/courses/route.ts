import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

interface Course {
  id: number;
  name: string;
  code: string;
  professor: string;
  location: string;
  schedule: string;
  enrolled: number;
  capacity: number;
  department: string;
  credits: number;
}

export async function GET() {
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

    // Get enrolled courses
    const { data, error } = await supabase.rpc('get_student_enrolled_courses', {
      p_user_id: user.id
    });

    if (error) {
      console.error('RPC Error:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    // Transform the data to match the frontend expectations
    const courses = data.map((course: any): Course => ({
      id: course.course_id,
      name: course.course_title,
      code: `${course.course_prefix} ${course.course_code}`,
      professor: `${course.professor_first_name} ${course.professor_last_name}`,
      location: course.room,
      schedule: course.schedule,
      enrolled: course.seats_taken,
      capacity: course.capacity,
      department: course.department,
      credits: course.credits
    }));

    return NextResponse.json({ courses });

  } catch (error) {
    console.error('Server Error:', error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 