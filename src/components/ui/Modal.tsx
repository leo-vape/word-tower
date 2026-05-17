import { type ReactNode, useEffect } from 'react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
}

export default function Modal({ open, onClose, children, title }: ModalProps) {
  useEffect(() => {
    if (open) {
      // Prevent background page from scrolling while modal is open
      const scrollY = window.scrollY;
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      return () => {
        document.documentElement.style.overflow = '';
        document.body.style.overflow = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 animate-fade-in"
        onClick={onClose}
      />

      {/* Modal panel */}
      <div className="relative bg-surface rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md max-h-[80vh] flex flex-col animate-slide-up shadow-xl z-10">
        {/* Header */}
        {title && (
          <div className="shrink-0 flex items-center justify-between bg-surface border-b border-gray-800 px-5 py-4 rounded-t-2xl">
            <h3 className="text-lg font-bold text-white">{title}</h3>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-bg hover:bg-gray-700 text-gray-400 hover:text-white transition-colors text-base"
              aria-label="关闭"
            >
              ✕
            </button>
          </div>
        )}

        {/* Scrollable body */}
        <div
          className="flex-1 overflow-y-auto overscroll-contain p-5"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
