import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './approved-theme.css';
import './natural-sereno.css';
import './natural-sereno-refinement.css';
import './natural-sereno-mobile-fixes.css';
import './lib/authLegacyStorageGuard';
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
import { ErrorBoundary } from './ErrorBoundary.tsx';

const LEGACY_AUTH_KEYS = [
  'cura_integrada_logged_in_user_v1',
  'cura_integrada_accounts_v1',
  'cura_integrada_login',
  'cura_accounts'
];

async function startApp() {
  try {
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'same-origin',
      cache: 'no-store'
    });
  } catch (error) {
    console.warn('Não foi possível confirmar o encerramento da sessão anterior.', error);
  }

  try {
    LEGACY_AUTH_KEYS.forEach((key) => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });
  } catch (error) {
    console.warn('Limpeza do estado local antigo não concluída.', error);
  }

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </StrictMode>,
  );
}

void startApp();
