import { createContext, useContext, useState, ReactNode } from 'react';

interface ReaderContextType {
  isReaderOpen: boolean;
  toggleReader: () => void;
  closeReader: () => void;
  openReader: (articleId?: string) => void;
  currentArticleId: string | null;
  currentVolumeId: string | null;
  currentVolumeOwned: boolean;
  volumeInitialView: "preview" | "acquire";
  openVolume: (id: string, owned: boolean, initialView?: "preview" | "acquire") => void;
}

const ReaderContext = createContext<ReaderContextType | undefined>(undefined);

export function ReaderProvider({ children }: { children: ReactNode }) {
  const [isReaderOpen, setIsReaderOpen] = useState(false);
  const [currentArticleId, setCurrentArticleId] = useState<string | null>(null);
  const [currentVolumeId, setCurrentVolumeId] = useState<string | null>(null);
  const [currentVolumeOwned, setCurrentVolumeOwned] = useState(false);
  const [volumeInitialView, setVolumeInitialView] = useState<"preview" | "acquire">("preview");

  return (
    <ReaderContext.Provider
      value={{
        isReaderOpen,
        currentArticleId,
        currentVolumeId,
        currentVolumeOwned,
        volumeInitialView,
        toggleReader: () => setIsReaderOpen(p => !p),
        closeReader: () => setIsReaderOpen(false),
        openReader: (articleId?: string) => {
          setCurrentArticleId(articleId || null);
          setCurrentVolumeId(null);
          setIsReaderOpen(true);
        },
        openVolume: (id: string, owned: boolean, initialView: "preview" | "acquire" = "preview") => {
          setCurrentVolumeId(id);
          setCurrentVolumeOwned(owned);
          setVolumeInitialView(initialView);
          setCurrentArticleId(null);
          setIsReaderOpen(true);
        },
      }}
    >
      {children}
    </ReaderContext.Provider>
  );
}

export function useReader() {
  const context = useContext(ReaderContext);
  if (!context) throw new Error('useReader must be used within ReaderProvider');
  return context;
}
