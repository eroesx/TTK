import React from 'react';

interface IconProps {
  className?: string;
}

const IncorrectIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className || "h-5 w-5 text-white"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export default IncorrectIcon;