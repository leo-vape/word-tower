import { useRef, useCallback } from 'react';
import { toPng } from 'html-to-image';

export function useShareImage() {
  const ref = useRef<HTMLDivElement>(null);

  const generate = useCallback(async (): Promise<Blob | null> => {
    if (!ref.current) return null;
    try {
      const dataUrl = await toPng(ref.current, {
        quality: 0.95,
        pixelRatio: 2,
        backgroundColor: '#1a1a2e',
      });
      const response = await fetch(dataUrl);
      return response.blob();
    } catch {
      return null;
    }
  }, []);

  return { ref, generate };
}
