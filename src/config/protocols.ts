/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { REINTEGRACAO_DA_VIDA } from './reintegracaoVida';

// ============================================================================
// ARQUITETURA PARA NOVOS PROTOCOLOS
// ============================================================================
// Mantém conteúdo/configuração desacoplados da interface e NÃO altera
// protocolos existentes.

export interface ProtocolEnergyMatrix {
  stages?: unknown[];
  metadata?: Record<string, unknown>;
}

export interface ProtocolPlayerConfiguration {
  defaultVolume?: number;
  allowSeek?: boolean;
  backgroundMusicType?: string;
  sessionDurationMinutes?: number;
  [key: string]: unknown;
}

export interface ProtocolCompletionRules {
  requireJournal?: boolean;
  minimumListenTimeSeconds?: number;
  allowSkip?: boolean;
  [key: string]: unknown;
}

export interface ProtocolDailyContent {
  dayNumber: number;
  title: string;
  description: string;
  audioUrl?: string;
  durationMinutes?: number;
  mantra?: string;
  [key: string]: unknown;
}

export type ProtocolAccessDuration = 7 | 21;

export interface ProtocolAccessOption {
  durationDays: ProtocolAccessDuration;
  cycles: 1 | 3;
  label: string;
}

export interface TransformationalProtocol {
  id: string;
  name: string;
  description: string;
  durationDays: ProtocolAccessDuration;
  accessOptions?: ProtocolAccessOption[];
  baseCycleDays?: number;
  meditation?: unknown;
  acceptanceText?: string;
  dailyContent?: ProtocolDailyContent[];
  energyMatrix: ProtocolEnergyMatrix;
  playerConfiguration?: ProtocolPlayerConfiguration;
  completionRules?: ProtocolCompletionRules;
}

export function resolveCycleDay(dayOfProtocol: number, baseCycleDays = 7): number {
  if (!Number.isInteger(dayOfProtocol) || dayOfProtocol < 1) throw new Error('dayOfProtocol deve ser um inteiro positivo.');
  if (!Number.isInteger(baseCycleDays) || baseCycleDays < 1) throw new Error('baseCycleDays deve ser um inteiro positivo.');
  return ((dayOfProtocol - 1) % baseCycleDays) + 1;
}

export const CHAKRA_ACCESS_OPTIONS: ProtocolAccessOption[] = [
  { durationDays: 7, cycles: 1, label: 'Jornada de 7 dias' },
  { durationDays: 21, cycles: 3, label: 'Jornada de 21 dias' },
];

export const PROTOCOL_REGISTRY: Record<string, TransformationalProtocol> = {
  [REINTEGRACAO_DA_VIDA.id]: REINTEGRACAO_DA_VIDA,
};
