import React from 'react';

interface IconProps {
  className?: string;
}

const CorrectIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className || "h-5 w-5 text-white"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

export default CorrectIcon;