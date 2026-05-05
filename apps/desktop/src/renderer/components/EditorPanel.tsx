import React, { useRef, useCallback } from 'react';
import { TipTapEditor } from '@novel-writer/editor';
import { useNovelStore } from '../stores/novelStore.js';
import { useAutoSave } from '../hooks/useAutoSave.js';

interface EditorPanelProps {
  focusMode: boolean;
  readingMode: boolean;
}

export function EditorPanel({ focusMode, readingMode }: EditorPanelProps) {
  const { currentChapter } = useNovelStore();
  const editorRef = useRef<{ getHTML: () => string } | null>(null);

  const getContent = useCallback(() => {
    return editorRef.current?.getHTML() || '';
  }, []);

  useAutoSave(getContent);

  if (!currentChapter) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b6b6b' }}>
        选择章节开始写作
      </div>
    );
  }

  if (readingMode) {
    return <ReadingContentView content={currentChapter.content} title={currentChapter.title} />;
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <TipTapEditor
        content={currentChapter.content}
        onChange={() => {}}
        editorRef={editorRef}
      />
    </div>
  );
}

function ReadingContentView({ content, title }: { content: string; title: string }) {
  const stripHtml = (html: string) => {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || '';
  };

  return (
    <div className="readingMode">
      <h1>{title}</h1>
      {stripHtml(content).split('\n').map((line, i) => (
        line.trim() ? <p key={i}>{line}</p> : <br key={i} />
      ))}
    </div>
  );
}
