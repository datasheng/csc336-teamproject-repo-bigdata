import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

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

    const body = await request.json();
    const { 
      courseCode,
      coursePrefix,
      courseTitle,
      capacity,
      credits,
      schedule 
    } = body;

    // Call the RPC function
    const { data, error } = await supabase.rpc('create_course', {
      p_prof_id: user.id,
      p_course_code: courseCode,
      p_course_prefix: coursePrefix,
      p_course_title: courseTitle,
      p_capacity: capacity,
      p_credits: credits,
      p_schedule: schedule
    });

    if (error) {
      console.error('RPC Error:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Server Error:', error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 