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
import './mistico-moderno-hooponopono-audit.css';
import './mistico-moderno-journal-audit.css';
import './mistico-moderno-milestone-audit.css';
import './mistico-moderno-report-certificate-audit.css';
import './mistico-moderno-herbal-baths-audit.css';
import './mistico-moderno-specific-treatment-audit.css';
import './mistico-moderno-promo-audit.css';
import './mistico-moderno-contact-audit.css';
import './mistico-moderno-video-studio-audit.css';
import './mistico-moderno-bottom-nav-audit.css';
import './mistico-moderno-mobile-install-audit.css';
import './mistico-moderno-audio-settings-audit.css';
import './mistico-moderno-arcanjo-audit.css';
import './mistico-moderno-final-palette.css';
import './essencia-luminosa-approved-overrides.css';
import './elegancia-profunda-approved-overrides.css';
import './elegancia-profunda-modal-audit.css';
import './elegancia-profunda-anamnesis-audit.css';
import './elegancia-profunda-prayer-audit.css';
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
import './elegancia-profunda-player-audit.css';
import './essencia-luminosa-final-audit.css';
import './essencia-luminosa-canvas-audit.css';
import './essencia-luminosa-mobile-install-audit.css';
import './essencia-luminosa-numerology-audit.css';
import './essencia-luminosa-header-semantic-audit.css';
import './essencia-luminosa-hooponopono-audit.css';
import './essencia-luminosa-milestone-audit.css';
import './essencia-luminosa-anamnesis-audit.css';
import './essencia-luminosa-promo-audit.css';
import './essencia-luminosa-session-audit.css';
import './essencia-luminosa-bottom-nav-audit.css';
import './essencia-luminosa-daily-diary-semantic-audit.css';
import './essencia-luminosa-daily-tip-audit.css';
import './essencia-luminosa-journal-dashboard-audit.css';
import './lib/authStartupResiliencePatch';
import './lib/startupUiResiliencePatch';
import './lib/audioIntegrityPatch';
import './lib/arcanjoAudioOwnershipPatch';
import './lib/naturalSerenoOfficialVoicePatch';
import './lib/essenciaLuminosaOfficialVoicePatch';
import './lib/misticoModernoOfficialVoicePatch';
import './lib/reintegrationPublicNarrationPatch';
import './lib/backgroundMediaPatch';
import './lib/noDecorativeEmojiPatch';
import './lib/personalCareIntegration';
import './lib/universalAnamnesisDiaryAccessPatch';
import './lib/naturalSerenoHomeApprovedModel';
import './lib/naturalSerenoHomeJourneyStateFix';
import './lib/naturalSerenoPublicCatalogGuard';
// The React LayoutChoiceModal in App.tsx is the single authoritative chooser.
// Do not mount the legacy DOM chooser: it can overlap the React modal.
import './natural-sereno-final-audit.css';
import './natural-sereno-home-latest-approved.css';
import './natural-sereno-milestone-audit.css';
import './natural-sereno-journal-dashboard-audit.css';
import './natural-sereno-contact-audit.css';
import './natural-sereno-home-surface-audit.css';
import './natural-sereno-guides-semantic-audit.css';
import './natural-sereno-legacy-green-audit.css';
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