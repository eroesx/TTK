import React, { useState, useEffect } from 'react';

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

interface SaveStatusToastProps {
  status: SaveStatus;
  onIdle: () => void;
}

const SaveStatusToast: React.FC<SaveStatusToastProps> = ({ status, onIdle }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // FIX: Replaced NodeJS.Timeout with a browser-compatible timer type.
    let timer: ReturnType<typeof setTimeout>;
    if (status === 'saved' || status === 'error') {
      setVisible(true);
      timer = setTimeout(() => {
        setVisible(false);
        // Allow time for fade-out animation before setting status to idle
        setTimeout(onIdle, 300);
      }, 2000);
    } else if (status === 'idle') {
      setVisible(false);
    }
    return () => clearTimeout(timer);
  }, [status, onIdle]);
  
  if (status === 'idle' && !visible) return null;

  const getToastContent = () => {
    switch (status) {
      case 'saving':
        return { text: 'Kaydediliyor...', bg: 'bg-slate-600', icon: '...' };
      case 'saved':
        return { text: 'Değişiklikler kaydedildi', bg: 'bg-green-600', icon: '✓' };
      case 'error':
        return { text: 'Kaydederken hata oluştu!', bg: 'bg-red-600', icon: '!' };
      default:
        return { text: '', bg: 'bg-slate-800', icon: '' };
    }
  };

  const { text, bg, icon } = getToastContent();

  return (
    <div className={`fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-2 rounded-lg text-white shadow-lg transition-all duration-300 ${bg} ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      <span className="font-bold">{icon}</span>
      <span>{text}</span>
    </div>
  );
};

export default SaveStatusToast;