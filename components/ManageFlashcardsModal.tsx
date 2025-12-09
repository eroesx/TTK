import React, { useState, useMemo, useRef } from 'react';
import type { Topic, Flashcard } from '../types';
import SearchIcon from './icons/SearchIcon';
import EditIcon from './icons/EditIcon';
import TrashIcon from './icons/TrashIcon';
import EditFlashcardModal from './EditFlashcardModal';
import DownloadIcon from './icons/DownloadIcon';
import UploadIcon from './icons/UploadIcon';
import AddIcon from './icons/AddIcon';

interface ManageFlashcardsModalProps {
  topic: Topic;
  onClose: () => void;
  onEditFlashcard: (cardId: number, updatedCard: Omit<Flashcard, 'id'>) => void;
  onDeleteFlashcard: (cardId: number) => void;
  onAddFlashcard: (newCardData: Omit<Flashcard, 'id'>) => void;
  onAddBulkFlashcards: (topicId: string, newCards: Array<Omit<Flashcard, 'id'>>) => void;
}

const ManageFlashcardsModal: React.FC<ManageFlashcardsModalProps> = ({
  topic,
  onClose,
  onEditFlashcard,
  onDeleteFlashcard,
  onAddFlashcard,
  onAddBulkFlashcards,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [cardToEdit, setCardToEdit] = useState<Flashcard | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredCards = useMemo(() => {
    if (!searchTerm) {
      return topic.flashcards;
    }
    const term = searchTerm.toLowerCase();
    const stripHtml = (html: string) => {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || "";
    }
    
    return topic.flashcards.filter(
      card =>
        stripHtml(card.front).toLowerCase().includes(term) ||
        stripHtml(card.back).toLowerCase().includes(term)
    );
  }, [topic.flashcards, searchTerm]);

  const handleDelete = (cardId: number) => {
    if (window.confirm("Bu bilgi kartını silmek istediğinizden emin misiniz?")) {
      onDeleteFlashcard(cardId);
    }
  };
  
  const handleSaveEdit = (updatedCard: Omit<Flashcard, 'id'>) => {
    if (cardToEdit) {
      if(cardToEdit.id === -1) { // -1 is my signal for a new card
        onAddFlashcard(updatedCard);
      } else {
        onEditFlashcard(cardToEdit.id, updatedCard);
      }
      setCardToEdit(null);
    }
  };

  const handleExport = () => {
    const cardsTemplate = topic.flashcards.map(({ front, back }) => ({ front, back }));
    const jsonString = JSON.stringify(cardsTemplate, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const fileName = `${topic.name.replace(/\s+/g, '_').toLowerCase()}_bilgikartlari.json`;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportTrigger = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      if (event.target) event.target.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result;
        if (typeof content !== 'string') throw new Error("Dosya içeriği okunamadı.");
        const parsedData = JSON.parse(content);
        if (!Array.isArray(parsedData)) throw new Error("JSON dosyası bir dizi (array) olmalıdır.");
        const newCards: Array<Omit<Flashcard, 'id'>> = [];
        for (let i = 0; i < parsedData.length; i++) {
          const item = parsedData[i];
          if (typeof item.front !== 'string' || !item.front.trim() || typeof item.back !== 'string' || !item.back.trim()) {
            throw new Error(`Dosyadaki ${i + 1}. sıradaki kart formatı geçersiz. Lütfen 'front' ve 'back' alanlarını kontrol edin.`);
          }
          newCards.push({ front: item.front, back: item.back });
        }
        if (newCards.length === 0) {
            alert("Dosyada eklenecek geçerli kart bulunamadı.");
            return;
        }
        if (window.confirm(`${newCards.length} adet bilgi kartı bu konuya eklenecek. Onaylıyor musunuz?`)) {
          onAddBulkFlashcards(topic.id, newCards);
          alert(`${newCards.length} kart başarıyla eklendi.`);
        }
      } catch (error) {
        if (error instanceof Error) {
            alert(`Dosya işlenirken hata oluştu: ${error.message}`);
        } else {
            alert("Bilinmeyen bir hata oluştu.");
        }
      } finally {
        if (event.target) event.target.value = '';
      }
    };
    reader.onerror = () => {
        alert("Dosya okunurken bir hata oluştu.");
        if (event.target) event.target.value = '';
    };
    reader.readAsText(file);
  };


  return (
    <>
      <div
        className="fixed inset-0 bg-black/70 flex items-center justify-center p-0 md:p-4 z-50 animate-fade-in"
        onClick={onClose}
      >
        <div
          className="bg-slate-800 md:rounded-2xl p-6 w-full max-w-4xl shadow-2xl relative h-full md:h-auto md:max-h-[90vh] flex flex-col"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex justify-between items-start p-2 pb-2 shrink-0">
            <h2 className="text-xl md:text-2xl font-bold text-cyan-400 pt-1 pr-16 truncate">
              <span className="text-slate-400 font-normal hidden md:inline">Kartları Yönet:</span> {topic.name}
            </h2>
            <div className="absolute top-4 right-4 flex items-center gap-1 md:gap-2">
                <button onClick={handleImportTrigger} title="Kartları Şablondan Yükle" className="p-2 rounded-full text-slate-400 hover:bg-slate-700 hover:text-white transition-colors">
                    <UploadIcon className="h-6 w-6" />
                </button>
                <button onClick={handleExport} title="Kartları Şablon Olarak İndir" className="p-2 rounded-full text-slate-400 hover:bg-slate-700 hover:text-white transition-colors">
                    <DownloadIcon className="h-6 w-6" />
                </button>
                <button onClick={onClose} className="p-2 text-slate-400 hover:text-white transition-colors ml-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>
          </div>
          <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="application/json" className="hidden"/>
          
          <div className="relative mb-4 shrink-0 px-2">
            <div className="absolute inset-y-0 left-2 md:left-2 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Kartlarda ara (ön veya arka yüz)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-md py-3 pl-10 pr-4 text-white placeholder-slate-400 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition"
              aria-label="Bilgi kartlarını filtrele"
            />
          </div>

          <div className="overflow-y-auto px-2 pb-20 md:pb-6 flex-grow">
            {filteredCards.length > 0 ? (
              <ul className="space-y-4">
                {filteredCards.map((card) => (
                  <li key={card.id} className="bg-slate-900/50 p-4 rounded-lg border border-slate-700 flex justify-between items-start gap-4 group">
                    <div className="flex-grow min-w-0">
                      <div className="font-semibold text-white mb-2 prose-dark" dangerouslySetInnerHTML={{ __html: card.front }} />
                      <div className="text-slate-300 text-sm prose-dark" dangerouslySetInnerHTML={{ __html: card.back }} />
                    </div>
                    <div className="flex items-center gap-2 shrink-0 opacity-100 md:opacity-50 md:group-hover:opacity-100 transition-opacity">
                      <button onClick={() => setCardToEdit(card)} title="Kartı Düzenle" className="p-1.5 rounded-full bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white">
                        <EditIcon />
                      </button>
                      <button onClick={() => handleDelete(card.id)} title="Kartı Sil" className="p-1.5 rounded-full bg-slate-700 text-slate-300 hover:bg-red-500 hover:text-white">
                        <TrashIcon />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-slate-400 py-8">
                {topic.flashcards.length > 0 ? `"${searchTerm}" ile eşleşen kart bulunamadı.` : 'Bu konu için henüz bilgi kartı eklenmemiş.'}
              </p>
            )}
          </div>
           <button
                onClick={() => setCardToEdit({ id: -1, front: '', back: '' })}
                title="Yeni Kart Ekle"
                aria-label="Yeni Bilgi Kartı Ekle"
                className="absolute bottom-6 right-6 md:bottom-8 md:right-8 bg-cyan-600 hover:bg-cyan-500 text-white rounded-full p-4 shadow-lg transition-transform transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-cyan-500/50 z-10"
            >
                <AddIcon className="h-8 w-8" />
            </button>
        </div>
      </div>
      {cardToEdit && (
        <EditFlashcardModal
          card={cardToEdit}
          onClose={() => setCardToEdit(null)}
          onSave={handleSaveEdit}
        />
      )}
    </>
  );
};

export default ManageFlashcardsModal;