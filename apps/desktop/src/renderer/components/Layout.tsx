import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@novel-writer/ui-shared';
import { ChapterList } from './ChapterList.js';
import { EditorPanel } from './EditorPanel.js';
import { EditorToolbar } from './EditorToolbar.js';
import { StatusBar } from './StatusBar.js';
import { useNovelStore } from '../stores/novelStore.js';

export function Layout() {
  const navigate = useNavigate();
  const { currentNovel } = useNovelStore();
  const [focusMode, setFocusMode] = useState(false);
  const [readingMode, setReadingMode] = useState(false);

  if (focusMode) {
    return (
      <div className="focusMode" style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 16px', borderBottom: '1px solid #e5e5e5' }}>
          <span style={{ fontSize: '13px', color: '#6b6b6b' }}>专注模式</span>
          <Button variant="ghost" size="sm" onClick={() => setFocusMode(false)}>退出</Button>
        </div>
        <EditorPanel focusMode readingMode={false} />
      </div>
    );
  }

  return (
    <div className="layout">
      <div className="sidebar">
        <div className="sidebarHeader">
          <span style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
            {currentNovel?.title || '长篇写作'}
          </span>
        </div>
        <ChapterList />
      </div>
      <div className="mainArea">
        <EditorToolbar
          onToggleFocus={() => setFocusMode(prev => !prev)}
          onToggleReading={() => setReadingMode(prev => !prev)}
          focusMode={focusMode}
          readingMode={readingMode}
        />
        <EditorPanel focusMode={false} readingMode={readingMode} />
        <StatusBar />
      </div>
    </div>
  );
}
