import React from 'react';
import { createRoot } from 'react-dom/client';
import '@novel-writer/ui-shared/globals.css';
import { App } from './App.js';
import './types.js';

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
