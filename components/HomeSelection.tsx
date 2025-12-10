
import React from 'react';
import type { HomeSelectionProps } from '../types';
import QuizIcon from './icons/QuizIcon';
import SummaryIcon from './icons/SummaryIcon';
import DocumentIcon from './icons/DocumentIcon';
import SettingsIcon from './icons/SettingsIcon';
import PenPaperIcon from './icons/PenPaperIcon';
import ErrorHistoryIcon from './icons/ErrorHistoryIcon';

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
    sky: {
        bgColor: 'bg-sky-900/40',
        hoverBorder: 'hover:border-sky-400',
        focusRing: 'focus:ring-sky-500/50',
        iconBg: 'bg-sky-500/20'
    },
    violet: {
        bgColor: 'bg-violet-900/40',
        hoverBorder: 'hover:border-violet-400',
        focusRing: 'focus:ring-violet-500/50',
        iconBg: 'bg-violet-500/20'
    },
    rose: {
        bgColor: 'bg-rose-900/40',
        hoverBorder: 'hover:border-rose-400',
        focusRing: 'focus:ring-rose-500/50',
        iconBg: 'bg-rose-500/20'
    }
}

const HomeSelection: React.FC<HomeSelectionProps> = (props) => {
  const { isMobileLayout, appTitle, mistakeCount } = props;
  
  const mainCategories = [
    { id: 'sorular', name: 'Sorular', icon: <QuizIcon />, color: 'cyan', action: 'onSelectSorular' },
    { id: 'deneme-sinavi', name: 'Deneme Sınavı', icon: <PenPaperIcon />, color: 'violet', action: 'onSelectDenemeSinavi' },
    { id: 'hatalarim', name: 'Hatalarım', icon: <ErrorHistoryIcon />, color: 'rose', action: 'onSelectHatalarim', count: mistakeCount },
    { id: 'bilgi-kartlari', name: 'Bilgi Kartları', icon: <DocumentIcon />, color: 'sky', action: 'onSelectBilgiKartlari' },
    { id: 'ozetler', name: 'Konu Özetleri', icon: <SummaryIcon />, color: 'amber', action: 'onSelectKonuOzetleri' },
  ];

  return (
    <div className="relative text-center w-full animate-fade-in">
        <button 
            onClick={props.onSelectAyarlar} 
            aria-label="Ayarlar" 
            className="absolute top-2 right-0 text-slate-400 hover:text-white transition-colors duration-200 z-10 p-2"
        >
            <SettingsIcon />
        </button>

       <div className={`${isMobileLayout ? 'mb-6 mt-12' : 'mb-12 mt-12'} px-4`}>
        <h1 className={`font-extrabold text-white tracking-tight uppercase ${isMobileLayout ? 'text-2xl' : 'text-4xl md:text-5xl'}`}>
          {appTitle}
        </h1>
      </div>

      <div className={`grid ${isMobileLayout ? 'grid-cols-1 gap-3' : 'md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 max-w-6xl mx-auto'}`}>
        {mainCategories.map((category, index) => {
          const colors = colorClasses[category.color as keyof typeof colorClasses];
          const action = props[category.action as keyof Omit<HomeSelectionProps, 'isMobileLayout' | 'appTitle' | 'mistakeCount'>];

          return (
            <button
                key={category.id}
                onClick={action}
                style={{ animationDelay: `${index * 100}ms` }}
                className={`group relative animate-fade-in flex ${isMobileLayout ? 'flex-row items-center justify-start text-left px-6 py-3' : 'flex-col items-center justify-center p-6'} rounded-xl shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-2 hover:shadow-2xl ${colors.bgColor} border-2 border-transparent ${colors.hoverBorder} focus:outline-none focus:ring-4 ${colors.focusRing}`}
            >
                <div className={`rounded-full transition-transform duration-300 group-hover:scale-110 ${colors.iconBg} ${isMobileLayout ? 'p-3 mr-4 mb-0' : 'p-4 mb-4'}`}>
                {category.icon}
                </div>
                <h2 className={`${isMobileLayout ? 'text-lg' : 'text-xl'} font-semibold text-white`}>{category.name}</h2>
                
                {/* Count Badge for Mistakes */}
                {category.id === 'hatalarim' && category.count !== undefined && category.count > 0 && (
                    <div className={`absolute ${isMobileLayout ? 'right-4' : 'top-4 right-4'} bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md animate-pulse`}>
                        {category.count}
                    </div>
                )}
            </button>
          )
        })}
      </div>
    </div>
  );
};

export default HomeSelection;
