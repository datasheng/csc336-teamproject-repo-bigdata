'use client';

import { useState, useRef } from 'react';

interface DropdownItemProps {
    title: string;
    enrollment: string;
    content: string;
}

const DropdownItem: React.FC<DropdownItemProps> = ({ title, content }) => {
    const [isOpen, setIsOpen] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);

    return (
        <div className="border border-gray-700 rounded-md overflow-hidden">
            <button
                className="w-full text-left px-4 py-2 bg-gray-800 rounded-t-md focus:outline-none hover:bg-gray-700"
                onClick={() => setIsOpen(!isOpen)}
            >
                {title}
            </button>
            <div
                ref={contentRef}
                className={`transition-height duration-500 ease-in-out ${isOpen ? 'h-auto' : 'h-0'}`}
                style={{
                    height: isOpen && contentRef.current ? `${contentRef.current.scrollHeight}px` : '0',
                }}
            >
                <div className="px-4 py-2 bg-gray-900 rounded-b-md">{content}</div>
            </div>
        </div>
    );
};

export default DropdownItem;
