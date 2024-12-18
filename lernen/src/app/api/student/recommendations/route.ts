import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Use the existing RPC function
    const { data: completedCourses, error: coursesError } = await supabase
      .rpc('get_courses_by_user', {
        user_id: user.id
      });

    if (coursesError) {
      console.error('Error fetching completed courses:', coursesError);
      return NextResponse.json(
        { error: coursesError.message },
        { status: 500 }
      );
    }

    // For now, just get all available courses for Fall 2024
    const { data: availableCourses, error: availableError } = await supabase
      .from('course')
      .select('courseprefix, coursecode')
      .eq('semester', 'Fall 2024');

    if (availableError) {
      console.error('Error fetching available courses:', availableError);
      return NextResponse.json(
        { error: availableError.message },
        { status: 500 }
      );
    }

    // Format the responses
    const formattedCompletedCourses = completedCourses?.map(c => 
      `${c.course.courseprefix} ${c.course.coursecode}`
    ) || [];

    const formattedEligibleCourses = availableCourses?.map(course => 
      `${course.courseprefix} ${course.coursecode}`
    ) || [];

    return NextResponse.json({
      completedCourses: formattedCompletedCourses,
      eligibleCourses: formattedEligibleCourses
    });

  } catch (error) {
    console.error('Server Error:', error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}