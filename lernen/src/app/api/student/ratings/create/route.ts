// POST api/student/ratings/create

import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

// Define the expected structure of the request body
interface RatingRequest {
    courseid: string;
    numrating: number;
    ratingtext: string; // Optional comment
}

export async function POST(request: Request) {
    try {
        // Establish supabase client
        const supabase = await createClient();

        // Authenticate user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Unload the POST request contents
        const { courseid, numrating, ratingtext }: RatingRequest = await request.json();

        // Step 4: Validate the incoming data
        if (!courseid || !numrating) {
            return NextResponse.json(
                { error: "Missing required field(s): courseID or numrating" },
                { status: 400 }
            );
        }

        // Call the supabase stored procedure
        let { data, error } = await supabase
        .rpc('insert_rating', {
            courseid, 
            numrating, 
            ratingtext, 
            userid: user.id
        })

        // Step 6: Handle errors from the RPC call
        if (error) {
            console.error("Error inserting rating:", error);
            return NextResponse.json(
                { error: error.message || "An error occurred while inserting the rating" },
                { status: 500 }
            );
        }

        // Step 7: Return success response
        return NextResponse.json({
            data
        });
    } catch (error) {
        console.error('Server Error:', error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
