import React from 'react';
import type { HomeSelectionProps } from '../types';
import QuizIcon from './icons/QuizIcon';
import SummaryIcon from './icons/SummaryIcon';
import DocumentIcon from './icons/DocumentIcon';
import SettingsIcon from './icons/SettingsIcon';

const mainCategories = [
    { id: 'sorular', name: 'Sorular', icon: <QuizIcon />, color: 'cyan', action: 'onSelectSorular' },
    { id: 'bilgi-kartlari', name: 'Bilgi Kartları', icon: <DocumentIcon />, color: 'violet', action: 'onSelectBilgiKartlari' },
    { id: 'ozetler', name: 'Konu Özetleri', icon: <SummaryIcon />, color: 'amber', action: 'onSelectKonuOzetleri' },
];

const colorClasses = {
    cyan: {
        bgColor: 'bg-cyan-900/40',
        hoverBorder: 'hover:border-cyan-400',
        focusRing: 'focus:ring-cyan-500/50',
        iconBg: 'bg-cyan-500/20'
    },
    amber: {
        bgColor: 'bg-amber-900/40',
        hoverBorder: 'hover:border-amber-400',
        focusRing: 'focus:ring-amber-500/50',
        iconBg: 'bg-amber-500/20'
    },
    violet: {
        bgColor: 'bg-violet-900/40',
        hoverBorder: 'hover:border-violet-400',
        focusRing: 'focus:ring-violet-500/50',
        iconBg: 'bg-violet-500/20'
    }
}

const HomeSelection: React.FC<HomeSelectionProps> = (props) => {
  const { isMobileLayout } = props;
  
  return (
    <div className="relative text-center w-full animate-fade-in">
        <button 
            onClick={props.onSelectAyarlar} 
            aria-label="Ayarlar" 
            className="absolute -top-4 right-0 text-slate-400 hover:text-white transition-colors duration-200 z-10 p-2"
        >
            <SettingsIcon />
        </button>

       <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight uppercase">
          TTK GÖREVDE YÜKSELME SINAVI
        </h1>
      </div>

      <div className={`grid ${isMobileLayout ? 'grid-cols-1' : 'md:grid-cols-3'} gap-6`}>
        {mainCategories.map((category, index) => {
          const colors = colorClasses[category.color as keyof typeof colorClasses];
          const action = props[category.action as keyof Omit<HomeSelectionProps, 'isMobileLayout'>];

          return (
            <button
                key={category.id}
                onClick={action}
                style={{ animationDelay: `${index * 100}ms` }}
                className={`group animate-fade-in flex flex-col items-center justify-center p-6 rounded-xl shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-2 hover:shadow-2xl ${colors.bgColor} border-2 border-transparent ${colors.hoverBorder} focus:outline-none focus:ring-4 ${colors.focusRing}`}
            >
                <div className={`p-4 rounded-full mb-4 transition-transform duration-300 group-hover:scale-110 ${colors.iconBg}`}>
                {category.icon}
                </div>
                <h2 className="text-xl font-semibold text-white">{category.name}</h2>
            </button>
          )
        })}
      </div>
    </div>
  );
};

export default HomeSelection;