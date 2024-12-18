import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const semester = searchParams.get('semester') || 'Fall 2024';

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: professorData, error: professorError } = await supabase
      .rpc('get_professor_by_user_id', {
        p_user_id: user.id,
        p_semester: semester
      });

    if (professorError) {
      return NextResponse.json({ error: professorError.message }, { status: 500 });
    }

    if (!professorData || professorData.length === 0) {
      return NextResponse.json({ error: "Professor not found" }, { status: 404 });
    }

    const transformedData = {
      firstName: professorData[0].first_name,
      lastName: professorData[0].last_name,
      department: professorData[0].department,
      courses: Array.isArray(professorData[0].courses) 
        ? professorData[0].courses.map((course: any) => ({
            id: course.courseID,
            name: course.courseTitle,
            code: `${course.coursePrefix} ${course.courseCode}`,
            professor: `${professorData[0].first_name} ${professorData[0].last_name}`,
            schedule: course.schedule || 'Schedule TBD',
            room: course.room || 'Room TBD',
            credits: course.credits
          }))
        : []
    };

    return NextResponse.json(transformedData);

  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 