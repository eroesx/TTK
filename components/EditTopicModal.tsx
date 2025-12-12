
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import type { Topic, Flashcard } from '../types';
import BrainIcon from './icons/BrainIcon';

interface EditTopicModalProps {
  topic: Topic;
  onClose: () => void;
  onSave: (updatedTopic: Topic) => void;
  availableIcons: { name: string, component: React.ReactNode }[];
  availableColorPalettes: { name: string, color: string, bgColor: string }[];
}

const EditTopicModal: React.FC<EditTopicModalProps> = ({ topic, onClose, onSave, availableIcons, availableColorPalettes }) => {
  const [editedName, setEditedName] = useState(topic.name);
  const [editedDescription, setEditedDescription] = useState(topic.description || '');
  const [selectedIconIndex, setSelectedIconIndex] = useState(() => 
    availableIcons.findIndex(icon => icon.name === topic.iconName)
  );
  const [selectedColorIndex, setSelectedColorIndex] = useState(() => 
    availableColorPalettes.findIndex(palette => palette.color === topic.color && palette.bgColor === topic.bgColor)
  );
  
  // State to hold flashcards locally within the modal before saving
  const [currentFlashcards, setCurrentFlashcards] = useState<Flashcard[]>(topic.flashcards || []);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationMessage, setGenerationMessage] = useState('');
  const [error, setError] = useState('');

  const isAdding = !topic.name;

  useEffect(() => {
    setEditedName(topic.name);
    setEditedDescription(topic.description || '');
    setSelectedIconIndex(
      availableIcons.findIndex(icon => icon.name === topic.iconName)
    );
    setSelectedColorIndex(
      availableColorPalettes.findIndex(palette => palette.color === topic.color && palette.bgColor === topic.bgColor)
    );
    setCurrentFlashcards(topic.flashcards || []);
    setError('');
    setGenerationMessage('');
  }, [topic, availableIcons, availableColorPalettes]);

  const handleGenerateAiFlashcards = async () => {
    if (!process.env.API_KEY) {
        setError("API anahtarı bulunamadı.");
        return;
    }
    if (!editedName.trim()) {
        setError("AI üretimi için lütfen önce bir konu adı girin.");
        return;
    }

    setIsGenerating(true);
    setGenerationMessage('İçerik analiz ediliyor ve kartlar oluşturuluyor...');
    setError('');

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = `
          Sen uzman bir eğitmen ve sınav hazırlayıcısısın.
          Konu: "${editedName}"
          ${editedDescription ? `Detay/Bağlam: "${editedDescription}"` : ''}

          Bu konuyla ilgili sınavlarda çıkması muhtemel, öğrenilmesi gereken en kritik bilgileri içeren 10 adet bilgi kartı (flashcard) hazırla.
          
          Kurallar:
          1. Çıktı SADECE geçerli bir JSON dizisi (array) olsun.
          2. Her nesne "front" (soru veya kavram) ve "back" (cevap veya açıklama) özelliklerine sahip olsun.
          3. "front" kısmı kısa ve net bir soru ya da terim olsun.
          4. "back" kısmı açıklayıcı, öğretici ve akılda kalıcı olsun.
          5. Cevaplar Türkçe olsun.
          
          Örnek JSON formatı:
          [
            {"front": "Soru 1", "back": "Cevap 1"},
            {"front": "Kavram A", "back": "Açıklaması"}
          ]
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json"
            }
        });

        if (response.text) {
            const newCardsData = JSON.parse(response.text);
            if (Array.isArray(newCardsData)) {
                // Map to Flashcard type (add IDs)
                const newFlashcards: Flashcard[] = newCardsData.map((item: any, index: number) => ({
                    id: Date.now() + index,
                    front: item.front,
                    back: item.back
                }));

                setCurrentFlashcards(prev => [...prev, ...newFlashcards]);
                setGenerationMessage(`${newFlashcards.length} yeni bilgi kartı başarıyla eklendi! (Kaydetmeyi unutmayın)`);
            } else {
                throw new Error("AI yanıtı beklenen formatta değil.");
            }
        }
    } catch (err) {
        console.error("AI Error:", err);
        setError("Kartlar oluşturulurken bir hata meydana geldi. Lütfen tekrar deneyin.");
        setGenerationMessage('');
    } finally {
        setIsGenerating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editedName.trim()) {
      setError('Konu adı boş olamaz.');
      return;
    }

    const selectedIcon = availableIcons[selectedIconIndex === -1 ? 0 : selectedIconIndex];
    const selectedColor = availableColorPalettes[selectedColorIndex === -1 ? 0 : selectedColorIndex];

    const updatedTopic: Topic = {
      ...topic,
      name: editedName.trim(),
      description: editedDescription.trim(),
      iconName: selectedIcon.name,
      color: selectedColor.color,
      bgColor: selectedColor.bgColor,
      flashcards: currentFlashcards, // Save the potentially updated flashcards
    };

    onSave(updatedTopic);
  };

  return (
    <div 
        className="fixed inset-0 bg-black/70 flex items-center justify-center p-0 md:p-4 z-50 animate-fade-in"
        onClick={onClose}
    >
      <div 
        className="bg-slate-800 md:rounded-2xl p-6 w-full max-w-2xl shadow-2xl relative h-full md:h-auto md:max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        <h2 className="text-2xl font-bold text-cyan-400 mb-6 shrink-0">
          {isAdding ? "Yeni Konu Ekle" : (
            <>
              <span className="text-slate-400 font-normal">Konuyu Düzenle:</span> {topic.name}
            </>
          )}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6 flex-grow overflow-y-auto pr-2">
          <div>
            <label htmlFor="topicName" className="block text-sm font-medium text-slate-300 mb-2">Konu Adı</label>
            <input
              id="topicName"
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-md p-2 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition"
              placeholder="Konu adını girin..."
            />
          </div>

          <div>
            <label htmlFor="topicDescription" className="block text-sm font-bold text-amber-400 mb-2">Konu Açıklaması / Not (İsteğe Bağlı)</label>
            <textarea
              id="topicDescription"
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              rows={2}
              className="w-full bg-slate-900 border border-slate-700 rounded-md p-2 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition"
              placeholder="Bu konuyla ilgili kısa bir not ekleyebilirsiniz..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Simge Seç</label>
            <div className="grid grid-cols-5 gap-3">
              {availableIcons.map((icon, index) => (
                <button
                  key={icon.name}
                  type="button"
                  onClick={() => setSelectedIconIndex(index)}
                  className={`p-3 rounded-lg flex items-center justify-center border-2 transition-all duration-200 
                    ${selectedIconIndex === index ? 'border-cyan-400 ring-2 ring-cyan-500/50 bg-slate-700' : 'border-slate-700 hover:border-slate-500 bg-slate-900'}
                  `}
                  aria-label={`Select ${icon.name} icon`}
                >
                  {icon.component}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Renk Paleti Seç</label>
            <div className="grid grid-cols-3 gap-3">
              {availableColorPalettes.map((palette, index) => (
                <button
                  key={palette.name}
                  type="button"
                  onClick={() => setSelectedColorIndex(index)}
                  className={`p-2 rounded-lg flex items-center justify-center transition-all duration-200 
                    ${palette.bgColor} border-2 
                    ${selectedColorIndex === index ? 'border-cyan-400 ring-2 ring-cyan-500/50' : 'border-slate-700 hover:border-slate-500'}
                  `}
                  aria-label={`Select ${palette.name} color palette`}
                >
                  <div className={`w-8 h-8 rounded-full ${palette.color.replace('/20', '/50')} flex items-center justify-center`}>
                    <span className="text-xs font-semibold text-white/80">{palette.name[0]}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* AI Generator Section */}
          <div className="bg-slate-900/50 p-4 rounded-lg border border-indigo-500/30">
            <div className="flex items-center gap-2 mb-3">
                <BrainIcon className="h-5 w-5 text-indigo-400" />
                <h3 className="font-semibold text-indigo-300">AI İçerik Oluşturucu</h3>
            </div>
            <p className="text-sm text-slate-400 mb-3">
                Konu başlığı ve varsa açıklamayı kullanarak, bu konu için otomatik olarak 10 adet bilgi kartı (Soru/Cevap) oluşturup listeye ekler.
            </p>
            <div className="flex flex-col gap-2">
                <button
                    type="button"
                    onClick={handleGenerateAiFlashcards}
                    disabled={isGenerating || !editedName}
                    className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-md font-semibold text-white transition-all
                        ${isGenerating 
                            ? 'bg-slate-700 cursor-wait' 
                            : 'bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-900/20'
                        }
                    `}
                >
                    {isGenerating ? (
                        <>
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Oluşturuluyor...
                        </>
                    ) : (
                        <>
                            <BrainIcon className="h-5 w-5" />
                            AI ile Bilgi Kartı Üret / Güncelle
                        </>
                    )}
                </button>
                {generationMessage && (
                    <p className="text-center text-sm font-medium text-green-400 animate-pulse mt-1">
                        {generationMessage}
                    </p>
                )}
            </div>
            <div className="mt-2 text-xs text-slate-500 text-center">
                Mevcut Kart Sayısı: <span className="text-white font-bold">{currentFlashcards.length}</span>
            </div>
          </div>

          {error && <p className="text-red-400 text-sm mt-4 text-center bg-red-900/20 p-2 rounded">{error}</p>}

          <div className="flex justify-end gap-4 pt-4 pb-4 shrink-0 border-t border-slate-700 mt-2">
            <button type="button" onClick={onClose} className="px-6 py-2 rounded-md bg-slate-700 hover:bg-slate-600 transition-colors">İptal</button>
            <button type="submit" className="px-6 py-2 rounded-md bg-cyan-600 hover:bg-cyan-500 font-semibold transition-colors shadow-lg shadow-cyan-900/20">Kaydet</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTopicModal;
