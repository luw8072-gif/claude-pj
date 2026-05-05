import React from 'react';
import { Button } from '@novel-writer/ui-shared';

interface EditorToolbarProps {
  onToggleFocus: () => void;
  onToggleReading: () => void;
  focusMode: boolean;
  readingMode: boolean;
}

export function EditorToolbar({ onToggleFocus, onToggleReading, focusMode, readingMode }: EditorToolbarProps) {
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
    </div>
  );
}
