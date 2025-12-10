
import React, { useState, useMemo, useEffect } from 'react';
import type { Topic } from '../types';
import AddIcon from './icons/AddIcon';
import EditIcon from './icons/EditIcon';
import CheckIcon from './icons/CheckIcon'; // Assumed to exist or use SVGs below

interface RestoreSummaryModalProps {
  currentTopics: Topic[];
  restoredData: { topics: Topic[]; version: number };
  onConfirm: (selectedTopics: Topic[]) => void;
  onCancel: () => void;
}

type TopicStatus = 'new' | 'update' | 'same';

interface RestoredTopicItem {
    topic: Topic;
    status: TopicStatus;
    isSelected: boolean;
}

const RestoreSummaryModal: React.FC<RestoreSummaryModalProps> = ({
  currentTopics,
  restoredData,
  onConfirm,
  onCancel,
}) => {
  const [topicItems, setTopicItems] = useState<RestoredTopicItem[]>([]);

  // Initialize list with comparison logic
  useEffect(() => {
    const currentMap = new Map(currentTopics.map(t => [t.id, t] as [string, Topic]));
    
    const items: RestoredTopicItem[] = restoredData.topics.map(restoredTopic => {
        const currentTopic = currentMap.get(restoredTopic.id);
        let status: TopicStatus = 'new';
        
        if (currentTopic) {
            // Simple comparison to check for changes. 
            // In a real app, might want deep equality check or versioning.
            // Here, assume checking name, question count, and modification date (if existed) is enough proxy, 
            // or just stringify comparison for robustness.
            const currentStr = JSON.stringify({ ...currentTopic, isFavorite: false }); // Ignore user-specific flags like favorite for comparison if desired
            const restoredStr = JSON.stringify({ ...restoredTopic, isFavorite: false });
            
            if (currentStr === restoredStr) {
                status = 'same';
            } else {
                status = 'update';
            }
        }

        // Default selection: Select 'new' and 'update', unselect 'same'
        return {
            topic: restoredTopic,
            status,
            isSelected: status !== 'same'
        };
    });
    
    setTopicItems(items);
  }, [currentTopics, restoredData]);

  const handleToggle = (id: string) => {
      setTopicItems(prev => prev.map(item => 
          item.topic.id === id ? { ...item, isSelected: !item.isSelected } : item
      ));
  };

  const handleSelectAll = () => {
      setTopicItems(prev => prev.map(item => ({ ...item, isSelected: true })));
  };

  const handleDeselectAll = () => {
      setTopicItems(prev => prev.map(item => ({ ...item, isSelected: false })));
  };

  const handleConfirm = () => {
      const selectedTopics = topicItems.filter(item => item.isSelected).map(item => item.topic);
      onConfirm(selectedTopics);
  };

  const selectedCount = topicItems.filter(i => i.isSelected).length;

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center p-0 md:p-4 z-50 animate-fade-in"
      onClick={onCancel}
    >
      <div
        className="bg-slate-800 md:rounded-2xl p-6 w-full max-w-3xl shadow-2xl relative h-full md:h-auto md:max-h-[90vh] flex flex-col border border-slate-700"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onCancel} className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        <h2 className="text-2xl font-bold text-cyan-400 mb-2 shrink-0">Yedekten Konu Yükle</h2>
        <p className="text-slate-400 mb-4 text-sm">Yedek dosyasındaki konulardan hangilerini yüklemek istediğinizi seçiniz. Mevcut konular güncellenecek, yeni konular eklenecektir.</p>

        <div className="flex justify-between items-center mb-2 px-2 shrink-0">
            <div className="text-sm text-slate-300">
                <span className="font-bold text-white">{selectedCount}</span> konu seçildi
            </div>
            <div className="flex gap-3 text-sm">
                <button onClick={handleSelectAll} className="text-cyan-400 hover:text-cyan-300 transition-colors">Tümünü Seç</button>
                <button onClick={handleDeselectAll} className="text-slate-400 hover:text-slate-300 transition-colors">Temizle</button>
            </div>
        </div>

        <div className="overflow-y-auto pr-2 -mr-2 flex-grow bg-slate-900/50 rounded-lg border border-slate-700 p-2 space-y-1">
            {topicItems.length > 0 ? (
                topicItems.map((item) => (
                    <div 
                        key={item.topic.id}
                        onClick={() => handleToggle(item.topic.id)}
                        className={`flex items-center justify-between p-3 rounded-md cursor-pointer border transition-all ${
                            item.isSelected 
                                ? 'bg-slate-800 border-cyan-500/50' 
                                : 'bg-transparent border-transparent hover:bg-slate-800/50'
                        }`}
                    >
                        <div className="flex items-center gap-3 overflow-hidden">
                            <div className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-colors ${
                                item.isSelected ? 'bg-cyan-600 border-cyan-600' : 'border-slate-500'
                            }`}>
                                {item.isSelected && (
                                    <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                            </div>
                            <div className="min-w-0">
                                <div className={`font-medium truncate ${item.isSelected ? 'text-white' : 'text-slate-400'}`}>
                                    {item.topic.name}
                                </div>
                                <div className="text-xs text-slate-500 flex gap-2">
                                    <span>{item.topic.questions.length} Soru</span>
                                    <span>•</span>
                                    <span>{item.topic.flashcards.length} Kart</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="shrink-0 ml-2">
                            {item.status === 'new' && (
                                <span className="px-2 py-1 rounded text-xs font-bold bg-green-500/20 text-green-400 border border-green-500/30">
                                    Yeni
                                </span>
                            )}
                            {item.status === 'update' && (
                                <span className="px-2 py-1 rounded text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                                    Değişiklik Var
                                </span>
                            )}
                            {item.status === 'same' && (
                                <span className="px-2 py-1 rounded text-xs font-medium bg-slate-700 text-slate-400">
                                    Aynı
                                </span>
                            )}
                        </div>
                    </div>
                ))
            ) : (
                <div className="text-center py-8 text-slate-500">Yedek dosyasında konu bulunamadı.</div>
            )}
        </div>
        
        <div className="flex justify-end gap-4 pt-6 mt-auto shrink-0">
          <button type="button" onClick={onCancel} className="px-6 py-2 rounded-md bg-slate-700 hover:bg-slate-600 transition-colors text-white">İptal</button>
          <button 
            type="button" 
            onClick={handleConfirm} 
            disabled={selectedCount === 0}
            className="px-6 py-2 rounded-md bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed font-semibold transition-colors text-white"
          >
            Seçilenleri Yükle ({selectedCount})
          </button>
        </div>
      </div>
    </div>
  );
};

export default RestoreSummaryModal;
