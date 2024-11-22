import DropdownList from "@/components/ui/dropdown";

interface ListItem {
    title: string;
    content: string;
}

export default function studentPage() {
    /* This list should be based on the student's ongoing/future semester,
       Update when we got the database up and going
       
       Maybe on their page show a short list of their classes and have a clickable button for full view
    */
    const listData: ListItem[] = [
        { title: "Spring 2025", content: "Enrollment Date: ..." },
        { title: "Winter 2024", content: "Enrollment Date: ..." },
        { title: "Fall 2024", content: "Enrollment Date: ..." },
        { title: "Summer 2024", content: "Enrollment Date: ..." },
        { title: "Spring 2024", content: "Enrollment Date: ..." },
        { title: "Winter 2023", content: "Enrollment Date: ..." },
        { title: "Fall 2023", content: "Enrollment Date: ..." },
        { title: "Summer 2023", content: "Enrollment Date: ..." },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-r from-black via-gray-900 to-gray-800 text-white">
            <header className="text-center py-10">
                <h1 className="text-4xl font-bold">Next.js Dropdown List Component</h1>
            </header>
            <main className="max-w-2xl mx-auto py-10">
                <DropdownList listData={listData} />
            </main>
        </div>
    );
}
