"use client";

import { useParams } from "next/navigation";
import DropdownList from "@/components/ui/dropdown";
import { redirect } from "next/navigation";
import { getStudentData, getProfessorData } from "@/components/ui/dummydata/data";

export default function SelectSemesterPage() {
  const params = useParams();
  const role = params.role as string;

  // invalid role redirect
  if (role !== "student" && role !== "professor") {
    redirect("/selectrole");
  }

  const getListData = () => {
    return role === "professor" ? getProfessorData() : getStudentData();
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-black via-gray-900 to-gray-800 text-white">
      <header className="text-center py-10">
        <h1 className="text-4xl font-bold">
          {role === "professor" ? "Teacher's Dashboard" : "Student's Dashboard"}
        </h1>
      </header>

      <main className="max-w-5xl mx-auto py-10 px-4">
        <DropdownList listData={getListData()} />
      </main>
    </div>
  );
}