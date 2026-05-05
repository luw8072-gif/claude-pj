import React, { useState, useEffect } from 'react';
import { useNovelStore } from '../stores/novelStore.js';
import { Button, showToast } from '@novel-writer/ui-shared';

export function CharacterPage() {
  const { characters, currentNovel, loadCharacters, createCharacter, updateCharacter, deleteCharacter } = useNovelStore();
  const [selectedChar, setSelectedChar] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  useEffect(() => {
    if (currentNovel) loadCharacters(currentNovel.id);
  }, [currentNovel]);

  const handleCreate = async () => {
    if (!editName.trim()) return;
    await createCharacter(editName.trim());
    setEditName('');
    showToast('角色已创建', 'success');
  };

  const selected = characters.find(c => c.id === selectedChar);

  return (
    <div className="sidebarContent">
      {characters.map(char => (
        <div key={char.id} className={`treeItem ${char.id === selectedChar ? 'active' : ''}`}
          onClick={() => setSelectedChar(char.id)}>
          {char.name || '未命名角色'}
        </div>
      ))}
      <div style={{ padding: '8px', display: 'flex', gap: '4px' }}>
        <input value={editName} onChange={e => setEditName(e.target.value)}
          placeholder="角色名" style={{ flex: 1, padding: '4px 8px', border: '1px solid #e5e5e5', borderRadius: '4px', fontSize: '12px' }}
          onKeyDown={e => e.key === 'Enter' && handleCreate()} />
        <Button variant="ghost" size="sm" onClick={handleCreate}>+</Button>
      </div>
      {selected && (
        <div style={{ padding: '8px', borderTop: '1px solid #e5e5e5', marginTop: '8px' }}>
          <input value={selected.name} onChange={e => updateCharacter(selected.id, { name: e.target.value })}
            style={{ width: '100%', padding: '4px 8px', border: '1px solid #e5e5e5', borderRadius: '4px', fontSize: '13px', marginBottom: '8px' }} />
          <textarea value={selected.bio} onChange={e => updateCharacter(selected.id, { bio: e.target.value })}
            placeholder="角色简介"
            style={{ width: '100%', padding: '4px 8px', border: '1px solid #e5e5e5', borderRadius: '4px', fontSize: '12px', minHeight: '80px', resize: 'vertical', fontFamily: 'inherit' }} />
          <Button variant="ghost" size="sm" onClick={() => { if (window.confirm('删除此角色？')) deleteCharacter(selected.id); }}
            style={{ color: '#dc2626', marginTop: '8px' }}>删除角色</Button>
        </div>
      )}
      {characters.length === 0 && (
        <div style={{ padding: '16px', textAlign: 'center', color: '#6b6b6b', fontSize: '13px' }}>
          暂无角色，输入名称添加
        </div>
      )}
    </div>
  );
}
