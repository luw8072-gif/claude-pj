import React, { useEffect, useState } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from '@novel-writer/ui-shared';
import { NovelListPage } from './pages/NovelListPage.js';
import { EditorPage } from './pages/EditorPage.js';
import { ActivatePage } from './pages/ActivatePage.js';

export function App() {
  const [activated, setActivated] = useState<boolean | null>(null);

  useEffect(() => {
    window.novelWriter.license.isActivated().then(setActivated);
  }, []);

  if (activated === null) {
    return <div style={{ padding: '40px', textAlign: 'center', color: '#6b6b6b' }}>加载中...</div>;
  }

  if (!activated) {
    return (
      <>
        <ActivatePage />
        <ToastContainer />
      </>
    );
  }

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<NovelListPage />} />
        <Route path="/novel/:novelId" element={<EditorPage />} />
      </Routes>
      <ToastContainer />
    </HashRouter>
  );
}
