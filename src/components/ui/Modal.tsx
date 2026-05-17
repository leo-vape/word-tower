import { type ReactNode, useEffect, useRef } from 'react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  footer?: ReactNode;
}

export default function Modal({ open, onClose, children, title, footer }: ModalProps) {
  const scrollY = useRef(0);

  useEffect(() => {
    if (!open) return;
    scrollY.current = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY.current}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      window.scrollTo(0, scrollY.current);
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/60 animate-fade-in" onClick={onClose} />
      <div className="relative z-10 bg-surface rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md max-h-[85vh] flex flex-col animate-slide-up shadow-xl">
        {title && (
          <div className="shrink-0 flex items-center justify-between px-5 py-4 border-b border-gray-800 rounded-t-2xl">
            <h3 className="text-lg font-bold text-white">{title}</h3>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-bg hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
              aria-label="关闭"
            >
              ✕
            </button>
          </div>
        )}

        {/* Scrollable content area */}
        <div className="flex-1 min-h-0 overflow-y-auto px-5 py-4" style={{ WebkitOverflowScrolling: 'touch' }}>
          {children}
        </div>

        {/* Footer — always visible, never scrolls away */}
        {footer && (
          <div className="shrink-0 px-5 py-4 border-t border-gray-800">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
