import { useState, useEffect, useCallback } from 'react';

export interface ToastData {
  id: string;
  message: string;
  duration?: number;
}

let toastListeners: ((data: ToastData) => void)[] = [];

export function showToast(message: string, duration = 2000) {
  const toast: ToastData = { id: `t_${Date.now()}`, message, duration };
  toastListeners.forEach(fn => fn(toast));
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const addToast = useCallback((t: ToastData) => {
    setToasts(prev => [...prev, t]);
    setTimeout(() => {
      setToasts(prev => prev.filter(x => x.id !== t.id));
    }, t.duration ?? 2000);
  }, []);

  useEffect(() => {
    toastListeners.push(addToast);
    return () => {
      toastListeners = toastListeners.filter(fn => fn !== addToast);
    };
  }, [addToast]);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map(t => (
        <div
          key={t.id}
          className="bg-surface/90 backdrop-blur text-white px-4 py-2 rounded-full text-sm shadow-lg animate-bounce-in pointer-events-auto"
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}
