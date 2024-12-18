// GET api/student/ratings/getRatings

import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        // Establish Supabase client
        const supabase = await createClient();
        // Validate the request
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Call the 'get_all_professors_details' function
        const { data: professorsData, error: professorsError } = await supabase
            .rpc('get_all_professors_details');

        if (professorsError) {
            console.error("Error fetching professor details:", professorsError);
            return NextResponse.json(
                { error: professorsError.message || "An error occurred while fetching professor data" },
                { status: 500 }
            );
        }

        // Call 'get_courses_for_rating' function with user_id in params - This returns which courses user may rate (not done previously but have taken course)
        const { data: coursesData, error: coursesError } = await supabase
            .rpc('get_courses_for_rating', { user_id_param: user.id }); 

        if (coursesError) {
            console.error("Error fetching courses to rating:", coursesError);
            return NextResponse.json(
                { error: coursesError.message || "An error occurred while fetching courses to rate" },
                { status: 500 }
            );
        }

        // Return final response
        return NextResponse.json({
            professors: professorsData,
            rateCourses: coursesData
        });

    } catch (error) {
        console.error('Unexpected error:', error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
