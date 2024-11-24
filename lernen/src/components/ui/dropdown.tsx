import { motion } from 'framer-motion';
import BlurFade from './blur-fade';
import SemesterGroup from './semestergroup';
import { GroupedSemesters } from './types';

interface DropdownListProps {
    listData: GroupedSemesters;
}

const DropdownList: React.FC<DropdownListProps> = ({ listData }) => {
    return (
        <BlurFade>
            <div className="space-y-6 max-w-4xl mx-auto px-4">
                {listData.future.length > 0 && (
                    <SemesterGroup title="Future Semesters" items={listData.future} />
                )}
                {listData.current.length > 0 && (
                    <SemesterGroup title="Current Semester" items={listData.current} />
                )}
                {listData.past.length > 0 && (
                    <SemesterGroup title="Past Semesters" items={listData.past} />
                )}
            </div>
        </BlurFade>
    );
};

export default DropdownList;