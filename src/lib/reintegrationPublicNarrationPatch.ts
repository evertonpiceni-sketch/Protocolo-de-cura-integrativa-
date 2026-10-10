import { REINTEGRATION_DAYS } from '../data/reintegrationJourneyPublic';

/**
 * The approved Reintegração architecture has two distinct layers:
 * - private energetic programming (systems, symbols, crystals and activations);
 * - public guided meditation (body, breath, sensation, reflection and silence).
 *
 * The source data intentionally retains the private notes for the informational
 * layer, but these cue slots must never be spoken in the public meditation.
 * Silence/music is the approved experience in their place; no substitute text
 * is invented here.
 */
// Filter by private content, never by timestamps: approved public acceptance
// and daily integration passages now use the same historical cue positions.
const PRIVATE_PROGRAMMING_TERMS = /\b(?:Golden Light Source|Original Reiki Platinum|Haku Superluminal|HSZSN|Soul Shakti|Rama|Harth|Shanti|Kriya|Zonar|Halu|Gnosa|Iava)\b/i;
for (const day of REINTEGRATION_DAYS) {
  day.audioCues = day.audioCues.filter(cue => !PRIVATE_PROGRAMMING_TERMS.test(cue.text));
}
