import React, { useState } from 'react';

export function ActivatePage() {
  const [key, setKey] = useState('');
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleActivate = async () => {
    if (!key.trim()) return;
    setLoading(true);
    setMessage(null);

    try {
      const result = await window.novelWriter.license.verify(key.trim());
      if (result.valid) {
        await window.novelWriter.license.save(key.trim());
        setMessage({ text: '激活成功！', type: 'success' });
        setTimeout(() => window.location.reload(), 1500);
      } else {
        setMessage({ text: result.message || '激活失败，请检查密钥', type: 'error' });
      }
    } catch (err) {
      setMessage({ text: '激活过程出错，请重试', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      height: '100vh', background: '#f5f5f5',
    }}>
      <div style={{
        background: '#fff', borderRadius: '12px', padding: '40px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)', width: '400px',
        textAlign: 'center',
      }}>
        <h1 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '8px' }}>长篇写作</h1>
        <p style={{ color: '#6b6b6b', marginBottom: '24px', fontSize: '14px' }}>
          请输入您的激活密钥以开始使用
        </p>

        <input
          autoFocus
          placeholder="输入激活密钥（如 NW-XXXX-XXXX-XXXX）"
          value={key}
          onChange={e => setKey(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleActivate()}
          style={{
            width: '100%', padding: '10px 14px', border: '1px solid #e5e5e5',
            borderRadius: '8px', fontSize: '14px', outline: 'none',
            marginBottom: '16px', textAlign: 'center',
            letterSpacing: '1px',
          }}
        />

        <button
          onClick={handleActivate}
          disabled={loading || !key.trim()}
          style={{
            width: '100%', padding: '10px', borderRadius: '8px',
            border: 'none', background: '#2563eb', color: '#fff',
            fontSize: '15px', cursor: loading ? 'wait' : 'pointer',
            opacity: loading || !key.trim() ? 0.6 : 1,
          }}
        >
          {loading ? '验证中...' : '激活'}
        </button>

        {message && (
          <div style={{
            marginTop: '16px', padding: '10px', borderRadius: '8px',
            fontSize: '13px',
            background: message.type === 'success' ? '#dcfce7' : '#fee2e2',
            color: message.type === 'success' ? '#16a34a' : '#dc2626',
          }}>
            {message.text}
          </div>
        )}

        <p style={{ marginTop: '24px', fontSize: '11px', color: '#999' }}>
          购买密钥请访问：novel-writer.example.com
        </p>
      </div>
    </div>
  );
}
