import React from 'react';
import { Button, showToast } from '@novel-writer/ui-shared';

interface EditorToolbarProps {
  onToggleFocus: () => void;
  onToggleReading: () => void;
  focusMode: boolean;
  readingMode: boolean;
}

export function EditorToolbar({ onToggleFocus, onToggleReading, focusMode, readingMode }: EditorToolbarProps) {
  const handleExportTxt = async () => {
    const result = await window.novelWriter.export.txt();
    if (result.success) showToast('TXT 导出成功', 'success');
    else if (result.error !== 'cancelled') showToast('导出失败：' + result.error, 'error');
  };

  const handleExportEpub = async () => {
    const result = await window.novelWriter.export.epub();
    if (result.success) showToast('EPUB 导出成功', 'success');
    else if (result.error !== 'cancelled') showToast('导出失败：' + result.error, 'error');
  };

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '6px 16px', borderBottom: '1px solid #e5e5e5',
      background: '#fff', flexShrink: 0,
    }}>
      <div style={{ display: 'flex', gap: '4px' }}>
        <Button variant="ghost" size="sm" onClick={onToggleFocus}>
          {focusMode ? '退出专注' : '专注模式'}
        </Button>
        <Button variant="ghost" size="sm" onClick={onToggleReading}>
          {readingMode ? '退出阅读' : '阅读模式'}
        </Button>
      </div>
      <div style={{ display: 'flex', gap: '4px' }}>
        <Button variant="ghost" size="sm" onClick={handleExportTxt}>
          导出 TXT
        </Button>
        <Button variant="ghost" size="sm" onClick={handleExportEpub}>
          导出 EPUB
        </Button>
      </div>
    </div>
  );
}
