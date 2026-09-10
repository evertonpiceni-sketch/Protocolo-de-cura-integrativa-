/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// ============================================================================
// ARQUITETURA PARA NOVOS PROTOCOLOS
// ============================================================================
// Mantém conteúdo/configuração desacoplados da interface e NÃO altera
// protocolos existentes. A Matriz-Mestra energética permanece vazia até
// aprovação explícita do conteúdo catalogado.

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
  /** Modalidade selecionada pelo usuário. Não duplica o protocolo. */
  durationDays: ProtocolAccessDuration;
  /** As duas modalidades comerciais disponíveis para o mesmo conteúdo-base. */
  accessOptions?: ProtocolAccessOption[];
  /** Número de centros/dias que formam um ciclo-base. */
  baseCycleDays?: number;
  meditation?: unknown;
  acceptanceText?: string;
  dailyContent?: ProtocolDailyContent[];
  energyMatrix: ProtocolEnergyMatrix;
  playerConfiguration?: ProtocolPlayerConfiguration;
  completionRules?: ProtocolCompletionRules;
}

/**
 * Resolve qual dia do ciclo-base deve ser apresentado em uma jornada maior.
 * Ex.: dias 1, 8 e 15 de uma jornada de 21 dias usam o primeiro chakra.
 */
export function resolveCycleDay(dayOfProtocol: number, baseCycleDays = 7): number {
  if (!Number.isInteger(dayOfProtocol) || dayOfProtocol < 1) {
    throw new Error('dayOfProtocol deve ser um inteiro positivo.');
  }
  if (!Number.isInteger(baseCycleDays) || baseCycleDays < 1) {
    throw new Error('baseCycleDays deve ser um inteiro positivo.');
  }
  return ((dayOfProtocol - 1) % baseCycleDays) + 1;
}

export const CHAKRA_ACCESS_OPTIONS: ProtocolAccessOption[] = [
  { durationDays: 7, cycles: 1, label: 'Jornada de 7 dias' },
  { durationDays: 21, cycles: 3, label: 'Jornada de 21 dias' },
];

/**
 * Registro unificado de novos protocolos.
 * IMPORTANTE: energyMatrix não deve ser preenchida automaticamente.
 */
export const PROTOCOL_REGISTRY: Record<string, TransformationalProtocol> = {};
