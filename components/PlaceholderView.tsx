
import React from 'react';

interface PlaceholderViewProps {
    title: string;
    onBack: () => void;
}

const PlaceholderView: React.FC<PlaceholderViewProps> = ({ title, onBack }) => (
    <div className="relative flex flex-col items-center justify-center bg-slate-800/50 p-8 rounded-2xl shadow-2xl text-center animate-fade-in w-full">
        <button onClick={onBack} aria-label="Ana menüye geri dön" className="absolute top-6 left-6 text-slate-400 hover:text-white transition-colors duration-200 z-10">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h2 className="text-4xl font-bold text-cyan-400 mb-4">{title}</h2>
        <p className="text-xl text-slate-300">Bu bölüm yakında eklenecektir.</p>
    </div>
);

export default PlaceholderView;