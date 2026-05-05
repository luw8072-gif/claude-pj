import React, { useEffect, useState } from 'react';
import { useNovelStore } from '../stores/novelStore.js';

export function SnapshotPanel() {
  const { currentChapter, snapshots, loadSnapshots } = useNovelStore();
  const [selectedSnapshot, setSelectedSnapshot] = useState<string | null>(null);

  useEffect(() => {
    if (currentChapter) loadSnapshots(currentChapter.id);
  }, [currentChapter]);

  return (
    <div className="sidebarContent">
      {!currentChapter ? (
        <div style={{ padding: '16px', textAlign: 'center', color: '#6b6b6b', fontSize: '13px' }}>选择章节查看历史</div>
      ) : snapshots.length === 0 ? (
        <div style={{ padding: '16px', textAlign: 'center', color: '#6b6b6b', fontSize: '13px' }}>暂无版本历史</div>
      ) : (
        <>
          {snapshots.slice(0, 50).map((snap, i) => (
            <div key={snap.id}
              className={`treeItem ${snap.id === selectedSnapshot ? 'active' : ''}`}
              onClick={() => setSelectedSnapshot(snap.id)}
              style={{ fontSize: '12px', flexDirection: 'column', alignItems: 'flex-start', padding: '6px 8px' }}>
              <div>#{snapshots.length - i} {new Date(snap.created_at).toLocaleString('zh-CN')}</div>
              <div style={{ color: '#6b6b6b', fontSize: '11px' }}>{snap.word_count} 字</div>
            </div>
          ))}
          {selectedSnapshot && (
            <div style={{ padding: '8px', borderTop: '1px solid #e5e5e5', fontSize: '12px', maxHeight: '200px', overflow: 'auto' }}>
              <div style={{ fontWeight: 600, marginBottom: '4px' }}>快照内容预览：</div>
              <div style={{ color: '#555', whiteSpace: 'pre-wrap' }}>
                {snapshots.find(s => s.id === selectedSnapshot)?.content.replace(/<[^>]+>/g, '').slice(0, 500)}
                {(snapshots.find(s => s.id === selectedSnapshot)?.content.length ?? 0) > 500 ? '...' : ''}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
