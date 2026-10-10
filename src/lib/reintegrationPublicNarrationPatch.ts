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
const PRIVATE_PROGRAMMING_CUE_TIMES = new Set([200, 900, 1080, 1170]);

for (const day of REINTEGRATION_DAYS) {
  day.audioCues = day.audioCues.filter(cue => !PRIVATE_PROGRAMMING_CUE_TIMES.has(cue.at));
}
