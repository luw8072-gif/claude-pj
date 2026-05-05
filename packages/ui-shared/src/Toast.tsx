import React, { useEffect, useState } from 'react';

export interface ToastMessage {
  id: string;
  text: string;
  type: 'info' | 'success' | 'error';
}

let toastListeners: Array<(msg: ToastMessage) => void> = [];

export function showToast(text: string, type: ToastMessage['type'] = 'info') {
  const msg: ToastMessage = { id: crypto.randomUUID(), text, type };
  toastListeners.forEach(fn => fn(msg));
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const listener = (msg: ToastMessage) => {
      setToasts(prev => [...prev, msg]);
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== msg.id));
      }, 3000);
    };
    toastListeners.push(listener);
    return () => {
      toastListeners = toastListeners.filter(fn => fn !== listener);
    };
  }, []);

  return (
    <div className="toastContainer">
      {toasts.map(t => (
        <div key={t.id} className={`toast toast${t.type.charAt(0).toUpperCase() + t.type.slice(1)}`}>
          {t.text}
        </div>
      ))}
    </div>
  );
}
