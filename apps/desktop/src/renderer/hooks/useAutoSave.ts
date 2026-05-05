import { useEffect, useRef, useCallback } from 'react';
import { useNovelStore } from '../stores/novelStore.js';

export function useAutoSave(getContent: () => string) {
  const { currentChapter, updateChapterContent } = useNovelStore();
  const lastSavedRef = useRef('');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const initializedRef = useRef(false);

  const save = useCallback(async () => {
    if (!initializedRef.current) return;
    const content = getContent();
    if (content === '') return; // never save empty content
    if (content === lastSavedRef.current) return;
    if (!currentChapter) return;
    await updateChapterContent(content);
    lastSavedRef.current = content;
  }, [currentChapter, updateChapterContent, getContent]);

  useEffect(() => {
    if (currentChapter) {
      lastSavedRef.current = currentChapter.content;
      initializedRef.current = true;
    }
  }, [currentChapter?.id]);

  useEffect(() => {
    intervalRef.current = setInterval(() => { save(); }, 30000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [save]);

  useEffect(() => {
    const handleBlur = () => { save(); };
    window.addEventListener('blur', handleBlur);
    return () => window.removeEventListener('blur', handleBlur);
  }, [save]);

  return save;
}
