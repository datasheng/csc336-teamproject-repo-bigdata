import { motion } from 'framer-motion';
import BlurFade from './blur-fade';
import DropdownItem from './dropdownitems';
import { ListItem } from './types';

interface DropdownListProps {
    listData: ListItem[];
}

const DropdownList: React.FC<DropdownListProps> = ({ listData }) => {
    return (
        <BlurFade>
            <div className="space-y-4 max-w-4xl mx-auto px-4">
                {listData.map((item) => (
                    <motion.div
                        key={item.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <DropdownItem
                            title={item.title}
                            enrollment={item.enrollment}
                            content={item.content}
                            courses={item.courses}
                        />
                    </motion.div>
                ))}
            </div>
        </BlurFade>
    );
};

export default DropdownList;