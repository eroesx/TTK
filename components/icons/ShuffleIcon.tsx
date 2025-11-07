import React from 'react';

interface ShuffleIconProps {
    isActive: boolean;
}

const ShuffleIcon: React.FC<ShuffleIconProps> = ({ isActive }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 transition-colors duration-200 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 12L3 8m4 4l4 4m6-12v12m0-12l4 8m-4-8l-4 8" />
    </svg>
);

export default ShuffleIcon;