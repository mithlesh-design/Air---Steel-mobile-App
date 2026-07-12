import React, { createContext, useContext, useState } from 'react';

interface ReaderContextType {
  isReaderOpen: boolean;
  currentArticleId: string | null;
  currentVolumeId: string | null;
  currentVolumeOwned: boolean;
  volumeInitialView: 'preview' | 'acquire';
  openReader: (articleId?: string) => void;
  openVolume: (id: string, owned: boolean, initialView?: 'preview' | 'acquire') => void;
  closeReader: () => void;
  toggleReader: () => void;
}

const ReaderContext = createContext<ReaderContextType | undefined>(undefined);

export function ReaderProvider({ children }: { children: React.ReactNode }) {
  const [isReaderOpen, setIsReaderOpen] = useState(false);
  const [currentArticleId, setCurrentArticleId] = useState<string | null>(null);
  const [currentVolumeId, setCurrentVolumeId] = useState<string | null>(null);
  const [currentVolumeOwned, setCurrentVolumeOwned] = useState(false);
  const [volumeInitialView, setVolumeInitialView] = useState<'preview' | 'acquire'>('preview');

  return (
    <ReaderContext.Provider
      value={{
        isReaderOpen,
        currentArticleId,
        currentVolumeId,
        currentVolumeOwned,
        volumeInitialView,
        openReader: (articleId) => {
          setCurrentArticleId(articleId ?? null);
          setCurrentVolumeId(null);
          setIsReaderOpen(true);
        },
        openVolume: (id, owned, initialView = 'preview') => {
          setCurrentVolumeId(id);
          setCurrentVolumeOwned(owned);
          setVolumeInitialView(initialView);
          setCurrentArticleId(null);
          setIsReaderOpen(true);
        },
        closeReader: () => setIsReaderOpen(false),
        toggleReader: () => setIsReaderOpen((p) => !p),
      }}
    >
      {children}
    </ReaderContext.Provider>
  );
}

export function useReader() {
  const ctx = useContext(ReaderContext);
  if (!ctx) throw new Error('useReader must be used within ReaderProvider');
  return ctx;
}
