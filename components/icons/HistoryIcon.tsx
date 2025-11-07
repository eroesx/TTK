
import React from 'react';

const HistoryIcon: React.FC = () => (
    // FIX: Updated icon color to text-orange-400 to match the history topic color scheme.
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547a2 2 0 00-.547 1.806l.477 2.387a6 6 0 00.517 3.86l.158.318a6 6 0 00.517 3.86l2.387.477a2 2 0 001.806-.547a2 2 0 00.547-1.806l-.477-2.387a6 6 0 00-.517-3.86l-.158-.318a6 6 0 00-.517-3.86l-2.387-.477a2 2 0 00-1.022.547m0 0l-2.828-2.828a2 2 0 00-2.828 0L2 14.172" transform="rotate(-45 12 12)" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.732 21.732a2 2 0 01-2.828 0l-2.828-2.828a2 2 0 010-2.828l2.828-2.828a2 2 0 012.828 0l2.828 2.828a2 2 0 010 2.828l-2.828 2.828z" />
    </svg>
);

export default HistoryIcon;