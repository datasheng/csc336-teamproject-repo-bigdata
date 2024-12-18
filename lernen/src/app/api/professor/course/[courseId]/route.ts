import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { data, error } = await supabase.rpc('delete_course', {
      p_user_id: user.id,
      p_course_id: params.courseId
    });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const courseData = await request.json();

    const { data, error } = await supabase.rpc('edit_course', {
      p_user_id: user.id,
      p_course_id: params.courseId,
      p_course_code: courseData.courseCode,
      p_course_prefix: courseData.coursePrefix,
      p_course_title: courseData.courseTitle,
      p_capacity: courseData.capacity,
      p_credits: courseData.credits,
      p_schedule: courseData.schedule,
      p_prerequisites: courseData.prerequisites?.map((p: any) => p.courseId) || []
    });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 