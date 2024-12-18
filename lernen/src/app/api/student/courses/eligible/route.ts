import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

interface CourseDependencies {
    prereqs: string[];
    coreqs: string[];
    either: string[];
}

interface CoursesJson {
    [key: string]: CourseDependencies;
}

const coursesData: CoursesJson = {
    "MATH20100": {
      "prereqs": [],
      "coreqs": [],
      "either": []
    },
    "ENGL11000": {
      "prereqs": [],
      "coreqs": [],
      "either": []
    },
    "SPCH11100": {
      "prereqs": [],
      "coreqs": [],
      "either": []
    },
    "MATH21200": {
      "prereqs": ["MATH20100"],
      "coreqs": [],
      "either": []
    },
    "CSC10300": {
      "prereqs": [],
      "coreqs": [],
      "either": ["MATH20100"]
    },
    "CSC10400": {
      "prereqs": ["MATH20100"],
      "coreqs": [],
      "either": []
    },
    "ENGL21007": {
      "prereqs": ["ENGL11000"],
      "coreqs": [],
      "either": []
    },
    "MATH21300": {
      "prereqs": ["MATH21200"],
      "coreqs": [],
      "either": []
    },
    "CSC21100": {
      "prereqs": ["CSC10300"],
      "coreqs": [],
      "either": []
    },
    "CSC21200": {
      "prereqs": ["CSC10300"],
      "coreqs": [],
      "either": []
    },
    "CSC217000": {
      "prereqs": ["CSC10300","CSC10400","MATH20100"],
      "coreqs": [],
      "either": []
    },
    "MATH34600": {
      "prereqs": ["MATH21200"],
      "coreqs": [],
      "either": []
    },
    "CSC22000": {
      "prereqs": ["CSC21200"],
      "coreqs": [],
      "either": []
    },
    "CSC22100": {
      "prereqs": ["CSC21200","ENGL21007"],
      "coreqs": [],
      "either": []
    },
    "CSC11300": {
      "prereqs": ["CSC10300"],
      "coreqs": [],
      "either": []
    },
    "CSC30400": {
      "prereqs": ["CSC22000"],
      "coreqs": [],
      "either": []
    },
    "CSC30100": {
      "prereqs": ["CSC21700","CSC22000","MATH21300"],
      "coreqs": [],
      "either": []
    },
    "CSC38000": {
      "prereqs": ["CSC21100","CSC22000"],
      "coreqs": [],
      "either": []
    },
    "CSC33500": {
      "prereqs": ["CSC22000","CSC22100"],
      "coreqs": [],
      "either": []
    },
    "CSC32200": {
      "prereqs": ["CSC22000","CSC22100"],
      "coreqs": [],
      "either": []
    },
    "CSC33600": {
      "prereqs": ["CSC22000","CSC22100"],
      "coreqs": [],
      "either": []
    },
    "CSC33200": {
      "prereqs": ["CSC22000","CSC22100"],
      "coreqs": [],
      "either": []
    },
    "CSC34200": {
      "prereqs": ["CSC21100"],
      "coreqs": ["CSC34300"],
      "either": []
    },
    "CSC34300": {
      "prereqs": [],
      "coreqs": ["CSC34200"],
      "either": []
    },
    "ENG27600": {
      "prereqs": ["MATH20100"],
      "coreqs": [],
      "either": []
    },
    "CSC42200": {
      "prereqs": ["CSC22000","CSC30400","CSC30400"],
      "coreqs": [],
      "either": []
    },
    "CSC42300": {
      "prereqs": ["CSC22000"],
      "coreqs": [],
      "either": []
    },
    "CSC42800": {
      "prereqs": ["CSC30400"],
      "coreqs": [],
      "either": []
    },
    "CSC44800": {
      "prereqs": ["CSC30400"],
      "coreqs": [],
      "either": []
    },
    "CSC45000": {
      "prereqs": ["CSC21700","CSC22000"],
      "coreqs": [],
      "either": []
    },
    "CSC48000": {
      "prereqs": ["CSC22000","CSC30400","CSC21700"],
      "coreqs": [],
      "either": []
    },
    "CSC48600": {
      "prereqs": ["CSC21700","CSC30400"],
      "coreqs": [],
      "either": []
    },
    "CSC44000": {
      "prereqs": ["CSC30100"],
      "coreqs": [],
      "either": []
    },
    "CSC44200": {
      "prereqs": ["CSC30100"],
      "coreqs": [],
      "either": []
    },
    "CSC44500": {
      "prereqs": ["CSC22000","CSC22100"],
      "coreqs": [],
      "either": []
    },
    "CSC44600": {
      "prereqs": ["CSC30100"],
      "coreqs": [],
      "either": []
    },
    "CSC44700": {
      "prereqs": ["CSC22000","CSC22100","MATH21300"],
      "coreqs": [],
      "either": []
    },
    "CSC46000": {
      "prereqs": ["CSC22000","CSC22100"],
      "coreqs": [],
      "either": []
    },
    "CSC47000": {
      "prereqs": ["CSC30100","CSC32200"],
      "coreqs": [],
      "either": []
    },
    "CSC47100": {
      "prereqs": ["CSC30100","CSC32200"],
      "coreqs": [],
      "either": []
    },
    "CSC47200": {
      "prereqs": ["CSC30100","CSC32200"],
      "coreqs": [],
      "either": []
    },
    "CSC47400": {
      "prereqs": ["CSC22000","CSC22100"],
      "coreqs": [],
      "either": []
    },
    "CSC47900": {
      "prereqs": ["CSC32200","MATH34600"],
      "coreqs": [],
      "either": []
    },
    "CSC31800": {
      "prereqs": ["CSC22100"],
      "coreqs": [],
      "either": []
    },
    "CSC41200": {
      "prereqs": ["CSC33200"],
      "coreqs": [],
      "either": []
    },
    "CSC42000": {
      "prereqs": ["CSC30400"],
      "coreqs": [],
      "either": []
    },
    "CSC43000": {
      "prereqs": ["CSC33200"],
      "coreqs": [],
      "either": []
    },
    "CSC43500": {
      "prereqs": ["CSC33200"],
      "coreqs": [],
      "either": []
    },
    "CSC43800": {
      "prereqs": ["CSC34200"],
      "coreqs": [],
      "either": []
    },
    "CSC45600": {
      "prereqs": ["CSC22000","CSC22100"],
      "coreqs": [],
      "either": []
    },
    "CSC47300": {
      "prereqs": ["CSC22100"],
      "coreqs": [],
      "either": []
    },
    "CSC49200": {
      "prereqs": ["CSC22000","CSC22100"],
      "coreqs": [],
      "either": []
    }
}

function courseScheduler(coursesJson: CoursesJson, inputCourses: string[]): string[][] {
    const completedCourses = new Set(inputCourses);
    const output: string[][] = [];
    const combinedGroups: [string, string[]][] = [];
    const combinedCourseSet = new Set(inputCourses);

    // Separate out combined dependencies for later resolution
    for (const [course, deps] of Object.entries(coursesJson)) {
        const { prereqs, coreqs, either } = deps;

        // Check strict prerequisites
        if (!prereqs.every(prereq => completedCourses.has(prereq))) {
            continue;
        }

        // Check if 'either' is satisfied as prereq or send to coreq group
        if (either.length && !either.some(option => completedCourses.has(option))) {
            combinedGroups.push([course, coreqs.concat(either)]);
            combinedCourseSet.add(course);
            continue;
        }

        // If there are corequisites, handle them similarly
        if (coreqs.length) {
            combinedGroups.push([course, coreqs.concat(either)]);
            combinedCourseSet.add(course);
            continue;
        }

        // Add course directly if it passes prerequisites and "either" checks as prereq
        output.push([course]);
    }

    // Check coreq groups
    for (const [course, deps] of combinedGroups) {
        // Ensure all dependencies in the group are satisfied
        if (deps.every(dep => combinedCourseSet.has(dep))) {
            output.push([course, ...deps]);
        }
    }

    // Remove any duplicate entries
    const flatOutput: string[][] = [];
    const seen = new Set<string>();
    for (const item of output) {
        const group = JSON.stringify(item.sort());
        if (!seen.has(group)) {
            seen.add(group);
            flatOutput.push(item);
        }
    }

    return flatOutput;
}


export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    const userId = user?.id;
    try {
      // Call the 'get_courses_by_user' function with userID to get courses taken before current semester
      const { data, error } = await supabase.rpc('get_courses_by_user', {
        user_id: userId
      });

      if (error) {
        console.error('RPC Error:', error);
        return NextResponse.json(
          { error: error.message },
          { status: 500 }
        );
      }

      // Returned data is array of course names like 'CSC22000'
      const courseNames = data.map((course: { course_name: string }) => course.course_name);
      
      try {
        // Call the built-in function to get list of eligible courses based on curriculum
        const eligibleCourses = courseScheduler(coursesData, courseNames);

        // Return the scheduled courses as JSON
        return NextResponse.json({ eligibleCourses });
      } catch (error) {
        console.error('Error scheduling courses:', error);
        return NextResponse.json(
          { error: 'Failed to schedule courses' },
          { status: 500 }
        );
      }

    } catch (error) {
      console.error('Error fetching courses by user:', error);
      return NextResponse.json(
        { error: 'Failed to fetch courses by user' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Server Error:', error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
