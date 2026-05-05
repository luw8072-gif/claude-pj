import React, { useEffect, useRef } from 'react';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Modal({ open, onClose, title, children }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="modalOverlay" ref={overlayRef} onClick={(e) => {
      if (e.target === overlayRef.current) onClose();
    }}>
      <div className="modalContent">
        <div className="modalHeader">
          <h2 className="modalTitle">{title}</h2>
          <button className="modalClose" onClick={onClose}>&times;</button>
        </div>
        <div className="modalBody">{children}</div>
      </div>
    </div>
  );
}
