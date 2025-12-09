import React, { useMemo } from 'react';
import type { Topic } from '../types';
import AddIcon from './icons/AddIcon';
import TrashIcon from './icons/TrashIcon';
import EditIcon from './icons/EditIcon';

interface RestoreSummaryModalProps {
  currentTopics: Topic[];
  restoredData: { topics: Topic[]; version: number };
  onConfirm: () => void;
  onCancel: () => void;
}

interface TopicChanges {
    name?: { from: string; to: string };
    questionCount?: { from: number; to: number };
    flashcardCount?: { from: number; to: number };
    summaryChanged?: boolean;
    styleChanged?: boolean;
    favoriteChanged?: { from: boolean; to: boolean };
}

const RestoreSummaryModal: React.FC<RestoreSummaryModalProps> = ({
  currentTopics,
  restoredData,
  onConfirm,
  onCancel,
}) => {
  const { addedTopics, removedTopics, updatedTopics, hasChanges } = useMemo(() => {
    const restoredTopics = restoredData.topics;
    const currentMap = new Map(currentTopics.map(t => [t.id, t]));
    const restoredMap = new Map(restoredTopics.map(t => [t.id, t]));

    const added: Topic[] = [];
    const removed: Topic[] = [];
    const updated: { topic: Topic; changes: TopicChanges }[] = [];

    // Check for added topics and updated topics
    for (const restoredTopic of restoredTopics) {
      const currentTopic = currentMap.get(restoredTopic.id);
      if (!currentTopic) {
        added.push(restoredTopic);
      } else {
        const changes: TopicChanges = {};
        // FIX: Cast currentTopic to Topic to resolve type inference issue.
        const current = currentTopic as Topic;
        if (current.name !== restoredTopic.name) {
          changes.name = { from: current.name, to: restoredTopic.name };
        }
        if (current.questions.length !== restoredTopic.questions.length) {
          changes.questionCount = { from: current.questions.length, to: restoredTopic.questions.length };
        }
        if (current.flashcards.length !== restoredTopic.flashcards.length) {
          changes.flashcardCount = { from: current.flashcards.length, to: restoredTopic.flashcards.length };
        }
        
        const currentSummaryText = (current.summary || '').trim();
        const restoredSummaryText = (restoredTopic.summary || '').trim();
        const isCurrentEmpty = currentSummaryText === '' || currentSummaryText === '<p><br></p>';
        const isRestoredEmpty = restoredSummaryText === '' || restoredSummaryText === '<p><br></p>';

        if (isCurrentEmpty !== isRestoredEmpty || (!isCurrentEmpty && currentSummaryText !== restoredSummaryText)) {
            changes.summaryChanged = true;
        }
        
        if (current.iconName !== restoredTopic.iconName || current.color !== restoredTopic.color || current.bgColor !== restoredTopic.bgColor) {
            changes.styleChanged = true;
        }
        if (!!current.isFavorite !== !!restoredTopic.isFavorite) {
            changes.favoriteChanged = { from: !!current.isFavorite, to: !!restoredTopic.isFavorite };
        }


        if (Object.keys(changes).length > 0) {
          updated.push({ topic: restoredTopic, changes });
        }
      }
    }

    // Check for removed topics
    for (const currentTopic of currentTopics) {
      if (!restoredMap.has(currentTopic.id)) {
        removed.push(currentTopic);
      }
    }
    
    const hasAnyChanges = added.length > 0 || removed.length > 0 || updated.length > 0;

    return { addedTopics: added, removedTopics: removed, updatedTopics: updated, hasChanges: hasAnyChanges };
  }, [currentTopics, restoredData.topics]);

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center p-0 md:p-4 z-50 animate-fade-in"
      onClick={onCancel}
    >
      <div
        className="bg-slate-800 md:rounded-2xl p-6 w-full max-w-3xl shadow-2xl relative h-full md:h-auto md:max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onCancel} className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        <h2 className="text-2xl font-bold text-cyan-400 mb-4 shrink-0">Geri Yükleme Özeti</h2>
        <p className="text-slate-400 mb-6">Yedek dosyasındaki veriler mevcut verilerinizle karşılaştırıldı. Aşağıdaki değişiklikler uygulanacaktır.</p>

        <div className="overflow-y-auto pr-4 -mr-4 space-y-6 flex-grow">
          {!hasChanges ? (
            <div className="text-center text-slate-300 py-10">
                <p>Değişiklik bulunamadı.</p>
                <p className="text-slate-400 mt-2">Mevcut verileriniz yedek dosyasıyla aynı görünüyor. Yine de geri yüklemek istiyor musunuz?</p>
            </div>
          ) : (
            <>
              {addedTopics.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-green-400 mb-3 flex items-center gap-2">
                    <AddIcon /> Eklenecek Konular ({addedTopics.length})
                  </h3>
                  <ul className="list-disc list-inside text-slate-300 space-y-1 pl-2">
                    {addedTopics.map(t => <li key={t.id}>{t.name}</li>)}
                  </ul>
                </div>
              )}
              {removedTopics.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-red-400 mb-3 flex items-center gap-2">
                    <TrashIcon /> Silinecek Konular ({removedTopics.length})
                  </h3>
                  <ul className="list-disc list-inside text-slate-300 space-y-1 pl-2">
                    {removedTopics.map(t => <li key={t.id}>{t.name}</li>)}
                  </ul>
                </div>
              )}
              {updatedTopics.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-amber-400 mb-3 flex items-center gap-2">
                    <EditIcon /> Güncellenecek Konular ({updatedTopics.length})
                  </h3>
                  <ul className="space-y-3 pl-2">
                    {updatedTopics.map(({ topic, changes }) => (
                      <li key={topic.id} className="text-slate-300">
                        <strong className="text-white">{changes.name ? changes.name.from : topic.name}</strong>
                        <ul className="list-disc list-inside text-sm text-slate-400 pl-4 mt-1">
                          {changes.name && <li>Adı değiştirilecek: "{changes.name.to}"</li>}
                          {changes.questionCount && <li>Soru sayısı: {changes.questionCount.from} → {changes.questionCount.to}</li>}
                          {changes.flashcardCount && <li>Bilgi kartı sayısı: {changes.flashcardCount.from} → {changes.flashcardCount.to}</li>}
                          {changes.summaryChanged && <li>Konu özeti içeriği güncellenecek.</li>}
                          {changes.styleChanged && <li>Görünümü (simge/renk) güncellenecek.</li>}
                          {changes.favoriteChanged && <li>Favori durumu: {changes.favoriteChanged.from ? 'Favori' : 'Normal'} → {changes.favoriteChanged.to ? 'Favori' : 'Normal'}</li>}
                        </ul>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>
        
        <div className="flex justify-end gap-4 pt-6 mt-auto shrink-0">
          <button type="button" onClick={onCancel} className="px-6 py-2 rounded-md bg-slate-700 hover:bg-slate-600 transition-colors">İptal</button>
          <button type="button" onClick={onConfirm} className="px-6 py-2 rounded-md bg-cyan-600 hover:bg-cyan-500 font-semibold transition-colors">
            Onayla ve Geri Yükle
          </button>
        </div>
      </div>
    </div>
  );
};

export default RestoreSummaryModal;