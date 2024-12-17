import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

interface UserDetails {
  username: string;
  email: string;
}

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

    const { data, error } = await supabase.rpc('get_user_details', {
      p_user_id: user.id
    });

    if (error) {
      console.error('RPC Error:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data[0] as UserDetails);

  } catch (error) {
    console.error('Server Error:', error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 