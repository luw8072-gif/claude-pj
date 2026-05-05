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
  return (
    <div className="readingMode">
      <h1>{title}</h1>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
}
