import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './approved-theme.css';
import './natural-sereno.css';
import './natural-sereno-refinement.css';
import './natural-sereno-mobile-fixes.css';
import './mistico-moderno-approved-overrides.css';
import './mistico-moderno-modal-audit.css';
import './mistico-moderno-dashboard-audit.css';
import './mistico-moderno-header-audit.css';
import './mistico-moderno-guides-audit.css';
import './mistico-moderno-session-audit.css';
import './mistico-moderno-courses-audit.css';
import './mistico-moderno-maps-audit.css';
import './mistico-moderno-achievements-audit.css';
import './mistico-moderno-daily-diary-audit.css';
import './essencia-luminosa-approved-overrides.css';
import './elegancia-profunda-approved-overrides.css';
import './elegancia-profunda-modal-audit.css';
import './elegancia-profunda-contact-audit.css';
import './elegancia-profunda-herbal-baths-audit.css';
import './elegancia-profunda-maps-audit.css';
import './elegancia-profunda-journal-audit.css';
import './elegancia-profunda-daily-diary-audit.css';
import './elegancia-profunda-day-detail-audit.css';
import './elegancia-profunda-hooponopono-audit.css';
import './elegancia-profunda-promo-audit.css';
import './elegancia-profunda-settings-final-audit.css';
import './elegancia-profunda-settings-semantic-audit.css';
import './elegancia-profunda-courses-audit.css';
import './elegancia-profunda-achievements-audit.css';
import './elegancia-profunda-bottom-nav-audit.css';
import './elegancia-profunda-mobile-install-audit.css';
import './elegancia-profunda-header-final-audit.css';
import './elegancia-profunda-dashboard-audit.css';
import './essencia-luminosa-final-audit.css';
import './essencia-luminosa-canvas-audit.css';
import './essencia-luminosa-mobile-install-audit.css';
import './essencia-luminosa-numerology-audit.css';
import './essencia-luminosa-header-semantic-audit.css';
import './lib/authStartupResiliencePatch';
import './lib/startupUiResiliencePatch';
import './lib/audioIntegrityPatch';
import './lib/arcanjoAudioOwnershipPatch';
import './lib/naturalSerenoOfficialVoicePatch';
import './lib/misticoModernoOfficialVoicePatch';
import './lib/reintegrationPublicNarrationPatch';
import './lib/backgroundMediaPatch';
import './lib/noDecorativeEmojiPatch';
import './lib/personalCareIntegration';
import './lib/universalAnamnesisDiaryAccessPatch';
import './lib/naturalSerenoHomeApprovedModel';
import './lib/naturalSerenoHomeJourneyStateFix';
import './lib/naturalSerenoPublicCatalogGuard';
import './lib/requiredLayoutChoiceEntryPatch';
import './lib/layoutSettingsExplicitConfirmationPatch';
import './natural-sereno-final-audit.css';
import './natural-sereno-home-latest-approved.css';
import './natural-sereno-milestone-audit.css';
// Latest approved Natural Sereno decisions must win over every older audit/refinement layer.
// Keep this import last among Natural Sereno theme CSS so discarded green/amber/indigo
// inheritance cannot regain precedence through cascade order.
import './natural-sereno-approved-overrides.css';
import { ErrorBoundary } from './ErrorBoundary.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);