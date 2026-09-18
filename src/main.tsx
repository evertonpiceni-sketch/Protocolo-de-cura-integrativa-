import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './approved-theme.css';
import { ErrorBoundary } from './ErrorBoundary.tsx';
import { initEvertonTheme } from './theme-choice.ts';

initEvertonTheme();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
