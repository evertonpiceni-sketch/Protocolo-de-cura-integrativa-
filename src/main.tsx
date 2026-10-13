import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './approved-theme.css';
import './natural-sereno.css';
import './natural-sereno-refinement.css';
import './natural-sereno-mobile-fixes.css';
import './lib/authStartupResiliencePatch';
import './lib/startupUiResiliencePatch';
import './lib/audioIntegrityPatch';
import './lib/reintegrationPublicNarrationPatch';
import './lib/backgroundMediaPatch';
import './lib/noDecorativeEmojiPatch';
import './lib/personalCareIntegration';
import './lib/universalAnamnesisDiaryAccessPatch';
import './lib/naturalSerenoHomeApprovedModel';
import './lib/naturalSerenoHomeJourneyStateFix';
import './lib/naturalSerenoPublicCatalogGuard';
import './lib/paymentLabelIntegrityPatch';
import './lib/paymentPlanSelectionPatch';
import { ErrorBoundary } from './ErrorBoundary.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);