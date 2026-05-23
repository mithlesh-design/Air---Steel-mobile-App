import { createContext, useContext, useState, ReactNode } from 'react';

interface ReaderContextType {
  isReaderOpen: boolean;
  toggleReader: () => void;
  closeReader: () => void;
  openReader: (articleId?: string) => void;
  currentArticleId: string | null;
}

const ReaderContext = createContext<ReaderContextType | undefined>(undefined);

export function ReaderProvider({ children }: { children: ReactNode }) {
  const [isReaderOpen, setIsReaderOpen] = useState(false);
  const [currentArticleId, setCurrentArticleId] = useState<string | null>(null);

  return (
    <ReaderContext.Provider
      value={{
        isReaderOpen,
        currentArticleId,
        toggleReader: () => setIsReaderOpen(p => !p),
        closeReader: () => setIsReaderOpen(false),
        openReader: (articleId?: string) => {
          setCurrentArticleId(articleId || null);
          setIsReaderOpen(true);
        }
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
