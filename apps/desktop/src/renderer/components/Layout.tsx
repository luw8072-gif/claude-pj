import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@novel-writer/ui-shared';
import { ChapterList } from './ChapterList.js';
import { EditorPanel } from './EditorPanel.js';
import { EditorToolbar } from './EditorToolbar.js';
import { StatusBar } from './StatusBar.js';
import { SnapshotPanel } from './SnapshotPanel.js';
import { CharacterPage } from '../pages/CharacterPage.js';
import { WorldPage } from '../pages/WorldPage.js';
import { useNovelStore } from '../stores/novelStore.js';

export function Layout() {
  const navigate = useNavigate();
  const { currentNovel, activeSidebarTab, setActiveSidebarTab } = useNovelStore();
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
        <div className="sidebarTabs">
          <button onClick={() => setActiveSidebarTab('toc')} className={activeSidebarTab === 'toc' ? 'active' : ''}>目录</button>
          <button onClick={() => setActiveSidebarTab('characters')} className={activeSidebarTab === 'characters' ? 'active' : ''}>角色</button>
          <button onClick={() => setActiveSidebarTab('world')} className={activeSidebarTab === 'world' ? 'active' : ''}>世界观</button>
          <button onClick={() => setActiveSidebarTab('snapshots')} className={activeSidebarTab === 'snapshots' ? 'active' : ''}>历史</button>
        </div>
        {activeSidebarTab === 'toc' && <ChapterList />}
        {activeSidebarTab === 'characters' && <CharacterPage />}
        {activeSidebarTab === 'world' && <WorldPage />}
        {activeSidebarTab === 'snapshots' && <SnapshotPanel />}
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
