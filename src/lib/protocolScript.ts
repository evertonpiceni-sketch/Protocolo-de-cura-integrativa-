import { ORIGINAL_PROTOCOL_SCRIPTS } from '../data/protocol_scripts';
import { STAGE_AUDIO_TRANSLATIONS, type AppLanguage } from './i18n';

/** The audio and reading panel must select the same approved source. */
export function resolveProtocolScript(stageId: string, language: AppLanguage, userName: string, fallback = '', customDecree = '') {
  const canonical = ORIGINAL_PROTOCOL_SCRIPTS[stageId];
  const translated = language !== 'pt' ? STAGE_AUDIO_TRANSLATIONS[language]?.[stageId]?.text : undefined;
  let audioText = translated || canonical?.ttsScript || canonical?.fullText || fallback;
  audioText = audioText.replace(/\{userName\}|\[NOME\]/g, userName?.trim() || 'Filho da Luz');
  if (stageId === 'ABERTURA' && customDecree) audioText += `\n\nDecreto Pessoal Especial: ${customDecree}`;
  return { audioText, readingText: audioText.replace(/<break\s+[^>]*\/>/g, '\n\n').trim() };
}
