import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

interface CourseData {
  course_id: string;
  course_code: string;
  course_prefix: string;
  course_title: string;
  seats_taken: number;
  capacity: number;
  credits: number;
  department: string;
  professor_first_name: string;
  professor_last_name: string;
  schedule: string;
  room: string;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const searchTerm = searchParams.get('q');
    const department = searchParams.get('department');
    const credits = searchParams.get('credits');
    const term = searchParams.get('term');
    const showOpenOnly = searchParams.get('openOnly') === 'true';

    const supabase = await createClient();

    const { data, error } = await supabase.rpc('search_available_courses', {
      search_term: searchTerm,
      department_filter: department === 'All' ? null : department,
      credits_filter: credits ? parseInt(credits) : null,
      term_filter: term,
      show_open_only: showOpenOnly
    });

    if (error) {
      console.error('RPC Error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Transform the data to match the frontend expectations
    const transformedData = (data as CourseData[]).map(course => ({
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

    return NextResponse.json(transformedData);
  } catch (error) {
    console.error('Server Error:', error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}