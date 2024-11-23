import DropdownList from "@/components/ui/dropdown";

interface ListItem {
    title: string;
    enrollment: string;
    content: string;
}

export default function professorpage() {
    /* This list should be based on the professors's ongoing/future semester,
       Update when we got the database up and going
       
       Maybe on their page show a short list of classes they are teaching and have a clickable button for full viewa
    */
    const listData: ListItem[] = [
        { title: "Spring 2025", enrollment: 'test', content: "Updates Due Date by." },
        { title: "Winter 2024", enrollment: 'test', content: "Updates Due Date by." },
        { title: "Fall 2024", enrollment: 'test', content: "Updates Due Date by." }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-r from-black via-gray-900 to-gray-800 text-white">
            <header className="text-center py-10">
                <h1 className="text-4xl font-bold">Teacher's Dashboard</h1>
            </header>
            <main className="max-w-2xl mx-auto py-10">
                <DropdownList listData={listData} />
            </main>
        </div>
    );
}
