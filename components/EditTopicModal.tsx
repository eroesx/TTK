import React, { useState, useEffect } from 'react';
import type { Topic } from '../types';

interface EditTopicModalProps {
  topic: Topic;
  onClose: () => void;
  onSave: (updatedTopic: Topic) => void;
  availableIcons: { name: string, component: React.ReactNode }[];
  availableColorPalettes: { name: string, color: string, bgColor: string }[];
}

const EditTopicModal: React.FC<EditTopicModalProps> = ({ topic, onClose, onSave, availableIcons, availableColorPalettes }) => {
  const [editedName, setEditedName] = useState(topic.name);
  const [selectedIconIndex, setSelectedIconIndex] = useState(() => 
    availableIcons.findIndex(icon => icon.name === topic.iconName)
  );
  const [selectedColorIndex, setSelectedColorIndex] = useState(() => 
    availableColorPalettes.findIndex(palette => palette.color === topic.color && palette.bgColor === topic.bgColor)
  );
  const [error, setError] = useState('');

  const isAdding = !topic.name;

  useEffect(() => {
    setEditedName(topic.name);
    setSelectedIconIndex(
      availableIcons.findIndex(icon => icon.name === topic.iconName)
    );
    setSelectedColorIndex(
      availableColorPalettes.findIndex(palette => palette.color === topic.color && palette.bgColor === topic.bgColor)
    );
    setError('');
  }, [topic, availableIcons, availableColorPalettes]);

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
      iconName: selectedIcon.name,
      color: selectedColor.color,
      bgColor: selectedColor.bgColor,
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

          {error && <p className="text-red-400 text-sm mt-4">{error}</p>}

          <div className="flex justify-end gap-4 pt-4 pb-4 shrink-0">
            <button type="button" onClick={onClose} className="px-6 py-2 rounded-md bg-slate-700 hover:bg-slate-600 transition-colors">İptal</button>
            <button type="submit" className="px-6 py-2 rounded-md bg-cyan-600 hover:bg-cyan-500 font-semibold transition-colors">Kaydet</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTopicModal;