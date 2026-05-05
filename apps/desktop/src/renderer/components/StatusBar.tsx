import React from 'react';
import { useNovelStore } from '../stores/novelStore.js';

export function StatusBar() {
  const { currentChapter, currentNovel } = useNovelStore();
  const wordCount = currentChapter?.word_count ?? 0;

  return (
    <div className="statusBar">
      <span>{currentNovel?.title || '未选择作品'}</span>
      <span>|</span>
      <span>{wordCount} 字</span>
      {currentChapter?.status && (
        <>
          <span>|</span>
          <span>状态：{currentChapter.status === 'draft' ? '草稿' : currentChapter.status === 'review' ? '审阅' : '已发布'}</span>
        </>
      )}
    </div>
  );
}
