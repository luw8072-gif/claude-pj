import React, { useState } from 'react';
import { Button, showToast } from '@novel-writer/ui-shared';
import { useNovelStore } from '../stores/novelStore.js';

export function ChapterList() {
  const { volumes, chapters, currentChapterId, selectChapter, createChapter, createVolume, deleteVolume, deleteChapter } = useNovelStore();
  const [newVolTitle, setNewVolTitle] = useState('');
  const [newChapVolId, setNewChapVolId] = useState<string | null>(null);

  const handleAddVolume = async () => {
    const title = newVolTitle.trim() || `卷 ${volumes.length + 1}`;
    await createVolume(title);
    setNewVolTitle('');
    showToast('卷已创建', 'success');
  };

  const handleAddChapter = async (volumeId: string) => {
    const vol = volumes.find(v => v.id === volumeId);
    const chapCount = (chapters[volumeId] || []).length;
    const title = `第${chapCount + 1}章`;
    await createChapter(volumeId, title);
    setNewChapVolId(null);
    showToast('章节已创建', 'success');
  };

  return (
    <div className="sidebarContent">
      {volumes.map(vol => (
        <div key={vol.id} style={{ marginBottom: '4px' }}>
          <div className="treeItem treeVolume" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ flex: 1 }}>{vol.title || '未命名卷'}</span>
            <div style={{ display: 'flex', gap: '2px' }}>
              <button
                style={{ fontSize: '11px', background: 'none', border: 'none', cursor: 'pointer', color: '#6b6b6b', padding: '0 4px' }}
                onClick={(e) => { e.stopPropagation(); setNewChapVolId(vol.id); }}
                title="添加章节"
              >+章</button>
              <button
                style={{ fontSize: '11px', background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', padding: '0 4px' }}
                onClick={(e) => { e.stopPropagation(); if (window.confirm('删除此卷及其所有章节？')) deleteVolume(vol.id); }}
                title="删除卷"
              >×</button>
            </div>
          </div>

          {(chapters[vol.id] || []).map(chap => (
            <div
              key={chap.id}
              className={`treeItem treeChapter ${chap.id === currentChapterId ? 'active' : ''}`}
              onClick={() => selectChapter(chap.id)}
            >
              <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {chap.title}
              </span>
              <button
                style={{ fontSize: '11px', background: 'none', border: 'none', cursor: 'pointer', color: '#6b6b6b', padding: '0 4px', visibility: chap.id === currentChapterId ? 'visible' : 'hidden' }}
                onClick={(e) => { e.stopPropagation(); if (window.confirm('删除此章节？')) deleteChapter(chap.id); }}
                title="删除章节"
              >×</button>
            </div>
          ))}

          {newChapVolId === vol.id && (
            <div style={{ padding: '4px 8px 4px 28px' }}>
              <input
                autoFocus
                placeholder="章节名（可选）"
                onBlur={() => setNewChapVolId(null)}
                onKeyDown={e => {
                  if (e.key === 'Enter') handleAddChapter(vol.id);
                  if (e.key === 'Escape') setNewChapVolId(null);
                }}
                onClick={e => e.stopPropagation()}
                style={{
                  width: '100%', padding: '4px 8px', border: '1px solid #e5e5e5',
                  borderRadius: '4px', fontSize: '12px', outline: 'none',
                }}
              />
            </div>
          )}
        </div>
      ))}

      <div style={{ padding: '8px' }}>
        <Button variant="ghost" size="sm" onClick={handleAddVolume} style={{ width: '100%' }}>
          + 添加卷
        </Button>
      </div>
    </div>
  );
}
