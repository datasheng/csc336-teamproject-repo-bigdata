import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

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

    // Get request body
    const { courseId } = await request.json();
    if (!courseId) {
      return NextResponse.json(
        { error: "Course ID is required" },
        { status: 400 }
      );
    }

    // Get course details before tracking
    const { data: courseData, error: courseError } = await supabase
      .from('course')
      .select(`
        coursetitle,
        courseprefix,
        coursecode,
        seatstaken,
        capacity
      `)
      .eq('courseid', courseId)
      .single();

    if (courseError) {
      return NextResponse.json(
        { error: courseError.message },
        { status: 500 }
      );
    }

    // Call the RPC function
    const { data: trackingData, error: trackingError } = await supabase.rpc('toggle_course_tracking', {
      p_user_id: user.id,
      p_course_id: courseId
    });

    if (trackingError) {
      console.error('RPC Error:', trackingError);
      return NextResponse.json(
        { error: trackingError.message },
        { status: 500 }
      );
    }

    // If tracking was successful and course was tracked (not untracked), send email
    if (trackingData.success && trackingData.tracked) {
      const isFull = courseData.seatstaken >= courseData.capacity;
      const courseCode = `${courseData.courseprefix} ${courseData.coursecode}`;

      await resend.emails.send({
        from: 'Lernen <notifications@1bid.app>',
        to: [user.email],
        subject: `Course Tracking Notification: ${courseCode}`,
        html: `
          <h2>Course Tracking Notification</h2>
          <p>You are now tracking ${courseData.coursetitle} (${courseCode}).</p>
          <p><strong>Current Status:</strong> ${isFull ? 'CLOSED' : 'OPEN'}</p>
          <p><strong>Seats Available:</strong> ${courseData.seatstaken}/${courseData.capacity}</p>
          <br>
          <p>You will receive notifications when the course status changes.</p>
        `
      });
    }

    return NextResponse.json(trackingData);

  } catch (error) {
    console.error('Server Error:', error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 