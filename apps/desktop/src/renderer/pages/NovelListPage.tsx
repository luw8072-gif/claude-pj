import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Modal } from '@novel-writer/ui-shared';
import { useNovelStore } from '../stores/novelStore.js';

export function NovelListPage() {
  const navigate = useNavigate();
  const { novels, loadNovels, createNovel } = useNovelStore();
  const [showCreate, setShowCreate] = useState(false);
  const [title, setTitle] = useState('');

  useEffect(() => { loadNovels(); }, [loadNovels]);

  const handleCreate = async () => {
    if (!title.trim()) return;
    const novel = await createNovel(title.trim());
    setTitle('');
    setShowCreate(false);
    navigate(`/novel/${novel.id}`);
  };

  return (
    <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 700 }}>我的作品</h1>
        <Button onClick={() => setShowCreate(true)}>新建作品</Button>
      </div>

      {novels.length === 0 && (
        <p style={{ color: '#6b6b6b', textAlign: 'center', padding: '60px 0' }}>
          还没有作品，点击"新建作品"开始写作
        </p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {novels.map(novel => (
          <div
            key={novel.id}
            onClick={() => navigate(`/novel/${novel.id}`)}
            style={{
              padding: '14px 16px', border: '1px solid #e5e5e5', borderRadius: '8px',
              cursor: 'pointer', background: '#fff', transition: 'box-shadow 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.08)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
          >
            <div style={{ fontWeight: 600, marginBottom: '2px' }}>{novel.title}</div>
            <div style={{ fontSize: '12px', color: '#6b6b6b' }}>
              {novel.author || '未设置作者'} · 更新于 {new Date(novel.updated_at).toLocaleDateString('zh-CN')}
            </div>
          </div>
        ))}
      </div>

      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="新建作品">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <input
            autoFocus
            placeholder="输入作品名称"
            value={title}
            onChange={e => setTitle(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleCreate()}
            style={{
              width: '100%', padding: '8px 12px', border: '1px solid #e5e5e5',
              borderRadius: '6px', fontSize: '14px', outline: 'none',
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <Button variant="secondary" onClick={() => setShowCreate(false)}>取消</Button>
            <Button onClick={handleCreate} disabled={!title.trim()}>创建</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
