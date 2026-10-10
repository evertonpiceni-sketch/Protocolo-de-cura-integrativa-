import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './approved-theme.css';
import './natural-sereno.css';
import './natural-sereno-refinement.css';
import './lib/audioIntegrityPatch';
import './lib/reintegrationPublicNarrationPatch';
import './lib/accessRecoveryPatch';
import { ErrorBoundary } from './ErrorBoundary.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);