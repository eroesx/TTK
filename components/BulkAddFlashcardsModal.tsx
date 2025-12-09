import React, { useState } from 'react';
import type { Topic, Flashcard } from '../types';

interface BulkAddFlashcardsModalProps {
  topic: Topic;
  onClose: () => void;
  onSave: (topicId: string, newCards: Array<Omit<Flashcard, 'id'>>) => void;
}

const BulkAddFlashcardsModal: React.FC<BulkAddFlashcardsModalProps> = ({ topic, onClose, onSave }) => {
  const [bulkText, setBulkText] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    setError('');
    if (!bulkText.trim()) {
      setError('Lütfen eklenecek kartları girin.');
      return;
    }

    const cardBlocks = bulkText.trim().split(/\n\s*\n/); // Split by one or more empty lines
    const newCards: Array<Omit<Flashcard, 'id'>> = [];

    for (const block of cardBlocks) {
        if (!block.trim()) continue;

        const firstSemicolonIndex = block.indexOf(';');
        if (firstSemicolonIndex === -1) {
            setError(`Hatalı formatlı kart: "${block.split('\n')[0]}...". Her kart "Soru;Cevap" formatında olmalıdır ve soru ile cevap ';' ile ayrılmalıdır.`);
            return;
        }

        const front = block.substring(0, firstSemicolonIndex).trim();
        const back = block.substring(firstSemicolonIndex + 1).trim();

        if (!front || !back) {
            setError(`Hatalı formatlı kart: "${block.split('\n')[0]}...". Soru ve cevap alanları boş olamaz.`);
            return;
        }

        newCards.push({ front, back });
    }
    
    if (newCards.length > 0) {
      onSave(topic.id, newCards);
      onClose();
    } else {
      setError('Eklenecek geçerli kart bulunamadı. Lütfen formatı kontrol edin.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-0 md:p-4 z-50 animate-fade-in" onClick={onClose}>
      <div className="bg-slate-800 md:rounded-2xl p-6 w-full max-w-3xl shadow-2xl relative h-full md:h-auto md:max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        <h2 className="text-2xl font-bold text-cyan-400 mb-4 shrink-0">Toplu Bilgi Kartı Ekle</h2>
        <p className="text-slate-400 mb-2">Kartları "Soru;Cevap" formatında girin. Cevaplar birden fazla satır içerebilir.</p>
        <p className="text-slate-400 mb-4">Yeni bir karta geçmek için <strong className="text-slate-300">boş bir satır</strong> bırakın.</p>
        
        <div className="text-slate-500 mb-6 text-sm bg-slate-900 p-3 rounded-md overflow-y-auto max-h-40">
            <p className="font-semibold text-slate-400">Format:</p>
            <pre className="mt-2 whitespace-pre-wrap">
{`Soru 1;Cevap 1

Soru 2;Cevap 2 satır 1
Cevap 2 satır 2`}
            </pre>
        </div>
        
        <textarea
          value={bulkText}
          onChange={(e) => setBulkText(e.target.value)}
          rows={10}
          className="w-full bg-slate-900 border border-slate-700 rounded-md p-3 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition font-mono text-sm flex-grow min-h-[150px]"
          placeholder={`Soru;Cevap satırı 1
Cevap satırı 2

Yeni Soru;Yeni Cevap...`}
        />
        {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
        <div className="flex justify-end gap-4 pt-6 shrink-0">
          <button type="button" onClick={onClose} className="px-6 py-2 rounded-md bg-slate-700 hover:bg-slate-600 transition-colors">İptal</button>
          <button type="button" onClick={handleSubmit} className="px-6 py-2 rounded-md bg-cyan-600 hover:bg-cyan-500 font-semibold transition-colors">Kartları Ekle</button>
        </div>
      </div>
    </div>
  );
};

export default BulkAddFlashcardsModal;