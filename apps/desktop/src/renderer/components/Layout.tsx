import React from 'react';

export function Layout() {
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ width: '280px', borderRight: '1px solid #e5e5e5', padding: '16px' }}>
        <p style={{ color: '#6b6b6b', textAlign: 'center', padding: '40px 0' }}>
          侧边栏占位
        </p>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b6b6b' }}>
          编辑器占位
        </div>
      </div>
    </div>
  );
}
