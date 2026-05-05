import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChapterList } from './ChapterList.js';
import { useNovelStore } from '../stores/novelStore.js';

export function Sidebar() {
  const navigate = useNavigate();
  const { currentNovel } = useNovelStore();

  return (
    <div className="sidebar">
      <div className="sidebarHeader">
        <span style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
          {currentNovel?.title || '长篇写作'}
        </span>
      </div>
      <ChapterList />
    </div>
  );
}
