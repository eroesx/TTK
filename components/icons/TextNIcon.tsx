
import React from 'react';

interface TextNIconProps {
    className?: string;
}

const TextNIcon: React.FC<TextNIconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-6 w-6"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.25 5l-8.5 14M6.75 5h3l8.5 14h-3M6 5h.75M17.25 19h.75" />
    </svg>
);

export default TextNIcon;
