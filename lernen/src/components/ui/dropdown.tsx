import DropdownItem from "./dropdownitems";

interface ListItem {
    title: string;
    enrollment: string;
    content: string;
}

interface DropdownListProps {
    listData: ListItem[];
}

const DropdownList: React.FC<DropdownListProps> = ({ listData }) => {
    return (
        <div className="space-y-4">
            {listData.map((item) => (
                <DropdownItem key={item.title} enrollment={item.enrollment} title={item.title} content={item.content} />
            ))}
        </div>
    );
};

export default DropdownList;
