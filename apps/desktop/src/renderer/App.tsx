import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from '@novel-writer/ui-shared';
import { NovelListPage } from './pages/NovelListPage.js';
import { EditorPage } from './pages/EditorPage.js';

export function App() {
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
