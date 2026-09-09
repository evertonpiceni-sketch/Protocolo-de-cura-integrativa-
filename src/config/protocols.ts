/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// ============================================================================
// ARQUITETURA PARA NOVOS PROTOCOLOS
// ============================================================================
// Preparação do sistema para receber novos protocolos (ex: Protocolo da Transformação)
// sem alterar os protocolos existentes.
// Esta camada mantém conteúdo e configuração desacoplados da interface.

export interface ProtocolEnergyMatrix {
  // IMPORTANTE:
  // Esta propriedade existe estruturalmente, mas NÃO preencher
  // automaticamente seu conteúdo.
  // As energias dos novos protocolos estão em fase de catalogação e serão
  // fornecidas posteriormente a partir da Matriz-Mestra aprovada.
  
  // NEVER INVENT:
  // - energias
  // - símbolos
  // - iniciações
  // - sintonizações
  // - sequências
  // - tempos de atuação
  // - atribuições terapêuticas
  
  stages?: unknown[];
  metadata?: Record<string, unknown>;
}

export interface ProtocolPlayerConfiguration {
  defaultVolume?: number;
  allowSeek?: boolean;
  backgroundMusicType?: string;
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

export interface TransformationalProtocol {
  id: string;
  name: string;
  description: string;
  durationDays: number;
  meditation?: unknown;
  acceptanceText?: string;
  dailyContent?: ProtocolDailyContent[];
  energyMatrix: ProtocolEnergyMatrix;
  playerConfiguration?: ProtocolPlayerConfiguration;
  completionRules?: ProtocolCompletionRules;
}

/**
 * Registro unificado de novos protocolos.
 * Futuros protocolos serão adicionados aqui sem impactar a interface dos existentes.
 */
export const PROTOCOL_REGISTRY: Record<string, TransformationalProtocol> = {};
