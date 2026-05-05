import React, { useState, useEffect } from 'react';
import { useNovelStore } from '../stores/novelStore.js';
import { Button, showToast } from '@novel-writer/ui-shared';

const CATEGORIES = ['全部', '地点', '物品', '组织', '种族', '魔法', '事件', '其他'];

export function WorldPage() {
  const { worldEntries, currentNovel, loadWorldEntries, createWorldEntry, updateWorldEntry, deleteWorldEntry } = useNovelStore();
  const [activeCategory, setActiveCategory] = useState('全部');
  const [selectedEntry, setSelectedEntry] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState('地点');

  useEffect(() => {
    if (currentNovel) loadWorldEntries(currentNovel.id);
  }, [currentNovel]);

  const filtered = activeCategory === '全部'
    ? worldEntries
    : worldEntries.filter(e => e.category === activeCategory);

  const selected = worldEntries.find(e => e.id === selectedEntry);

  const handleCreate = async () => {
    if (!newName.trim()) return;
    await createWorldEntry(newName.trim(), newCategory);
    setNewName('');
    showToast('条目已创建', 'success');
  };

  return (
    <div className="sidebarContent">
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', padding: '8px' }}>
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)}
            style={{
              padding: '2px 8px', fontSize: '11px', border: '1px solid #e5e5e5', borderRadius: '4px',
              background: activeCategory === cat ? '#e0e7ff' : '#fff', cursor: 'pointer', color: activeCategory === cat ? '#2563eb' : '#555',
            }}>
            {cat}
          </button>
        ))}
      </div>
      {filtered.map(entry => (
        <div key={entry.id} className={`treeItem ${entry.id === selectedEntry ? 'active' : ''}`}
          onClick={() => setSelectedEntry(entry.id)}>
          {entry.name}
          <span style={{ fontSize: '10px', color: '#999', marginLeft: '4px' }}>{entry.category}</span>
        </div>
      ))}
      <div style={{ padding: '8px', display: 'flex', gap: '4px' }}>
        <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="条目名"
          style={{ flex: 1, padding: '4px 8px', border: '1px solid #e5e5e5', borderRadius: '4px', fontSize: '12px' }}
          onKeyDown={e => e.key === 'Enter' && handleCreate()} />
        <select value={newCategory} onChange={e => setNewCategory(e.target.value)}
          style={{ padding: '4px', border: '1px solid #e5e5e5', borderRadius: '4px', fontSize: '12px' }}>
          {CATEGORIES.filter(c => c !== '全部').map(c => <option key={c}>{c}</option>)}
        </select>
        <Button variant="ghost" size="sm" onClick={handleCreate}>+</Button>
      </div>
      {selected && (
        <div style={{ padding: '8px', borderTop: '1px solid #e5e5e5' }}>
          <div style={{ display: 'flex', gap: '4px', marginBottom: '8px' }}>
            <input value={selected.name} onChange={e => updateWorldEntry(selected.id, { name: e.target.value })}
              style={{ flex: 1, padding: '4px 8px', border: '1px solid #e5e5e5', borderRadius: '4px', fontSize: '13px' }} />
            <Button variant="ghost" size="sm" onClick={() => { if (window.confirm('删除此条目？')) deleteWorldEntry(selected.id); }}
              style={{ color: '#dc2626' }}>×</Button>
          </div>
          <textarea value={selected.content} onChange={e => updateWorldEntry(selected.id, { content: e.target.value })}
            placeholder="条目内容" style={{ width: '100%', padding: '4px 8px', border: '1px solid #e5e5e5', borderRadius: '4px', fontSize: '12px', minHeight: '120px', resize: 'vertical', fontFamily: 'inherit' }} />
        </div>
      )}
      {filtered.length === 0 && (
        <div style={{ padding: '16px', textAlign: 'center', color: '#6b6b6b', fontSize: '13px' }}>
          暂无条目，输入名称添加
        </div>
      )}
    </div>
  );
}
