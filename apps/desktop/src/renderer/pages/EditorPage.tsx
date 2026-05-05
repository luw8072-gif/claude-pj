import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNovelStore } from '../stores/novelStore.js';
import { Layout } from '../components/Layout.js';

export function EditorPage() {
  const { novelId } = useParams<{ novelId: string }>();
  const { selectNovel, currentNovel, loading } = useNovelStore();

  useEffect(() => {
    if (novelId) selectNovel(novelId);
  }, [novelId, selectNovel]);

  if (loading || !currentNovel) {
    return <div style={{ padding: '40px', textAlign: 'center', color: '#6b6b6b' }}>加载中...</div>;
  }

  return <Layout />;
}
