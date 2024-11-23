"use client";

import { useParams } from "next/navigation";
import DropdownList from "@/components/ui/dropdown";
import { redirect } from "next/navigation";

interface ListItem {
  title: string;
  enrollment: string;
  content: string;
}

export default function SelectSemesterPage() {
  const params = useParams();
  const role = params.role as string;

  // invalid role redirect
  if (role !== "student" && role !== "professor") {
    redirect("/selectrole");
  }

  const getListData = (): ListItem[] => {
    
    if (role === "professor") {
      return [
        { title: "Spring 2025", enrollment: 'test', content: "Updates Due Date by." },
        { title: "Winter 2024", enrollment: 'test', content: "Updates Due Date by." },
        { title: "Fall 2024", enrollment: 'test', content: "Updates Due Date by." }
      ];
    }

    return [
      { title: "Spring 2025", enrollment: 'These Nuts', content: "Enrollment Date: ... <br>Test" },
      { title: "Winter 2024", enrollment: 'Test', content: "Enrollment Date: ..." },
      { title: "Fall 2024", enrollment: 'Test', content: "Enrollment Date: ..." },
      { title: "Summer 2024", enrollment: 'Test', content: "Enrollment Date: ..." },
      { title: "Spring 2024", enrollment: 'Test', content: "Enrollment Date: ..." },
      { title: "Winter 2023", enrollment: 'Test', content: "Enrollment Date: ..." },
      { title: "Fall 2023", enrollment: 'Test', content: "Enrollment Date: ..." },
      { title: "Summer 2023", enrollment: 'Test', content: "Enrollment Date: ..." },
    ];
  };

  const getPageTitle = () => {
    return role === "professor" 
      ? "Teacher's Dashboard"
      : "Student's List";
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-black via-gray-900 to-gray-800 text-white">
      <header className="text-center py-10">
        <h1 className="text-4xl font-bold">{getPageTitle()}</h1>
      </header>

      <main className="max-w-2xl mx-auto py-10">
        <DropdownList listData={getListData()} />
      </main>
    </div>
  );
}