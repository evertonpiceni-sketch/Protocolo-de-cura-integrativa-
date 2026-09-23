import React from 'react';
import { ProtocolStage } from '../../types';

interface StageAtmosphereOverlayProps {
  stageId: ProtocolStage | string;
}

export const StageAtmosphereOverlay: React.FC<StageAtmosphereOverlayProps> = ({ stageId }) => {
  // Atmospheric ambient glow presets
  const getAtmosphereConfig = () => {
    switch (stageId) {
      case ProtocolStage.ABERTURA:
        return {
          gradient: 'radial-gradient(ellipse at 50% 30%, rgba(212, 175, 55, 0.12) 0%, rgba(6, 20, 16, 0.95) 75%)',
          accent: 'rgba(230, 202, 101, 0.08)'
        };
      case ProtocolStage.ATERRAMENTO:
        return {
          gradient: 'radial-gradient(ellipse at 50% 60%, rgba(140, 168, 154, 0.14) 0%, rgba(6, 20, 16, 0.96) 80%)',
          accent: 'rgba(11, 31, 24, 0.12)'
        };
      case ProtocolStage.VITALIDADE:
        return {
          gradient: 'radial-gradient(ellipse at 50% 40%, rgba(245, 158, 11, 0.12) 0%, rgba(6, 20, 16, 0.95) 75%)',
          accent: 'rgba(147, 197, 253, 0.08)'
        };
      case ProtocolStage.TRANSMUTACAO:
        return {
          gradient: 'radial-gradient(ellipse at 50% 35%, rgba(168, 85, 247, 0.14) 0%, rgba(6, 20, 16, 0.96) 80%)',
          accent: 'rgba(59, 130, 246, 0.1)'
        };
      case ProtocolStage.BALSAMO:
        return {
          gradient: 'radial-gradient(ellipse at 50% 35%, rgba(244, 114, 182, 0.14) 0%, rgba(6, 20, 16, 0.95) 75%)',
          accent: 'rgba(52, 211, 153, 0.09)'
        };
      case ProtocolStage.SELAMENTO:
        return {
          gradient: 'radial-gradient(ellipse at 50% 40%, rgba(230, 202, 101, 0.15) 0%, rgba(6, 20, 16, 0.95) 75%)',
          accent: 'rgba(212, 175, 55, 0.1)'
        };
      default:
        return {
          gradient: 'radial-gradient(ellipse at 50% 30%, rgba(212, 175, 55, 0.1) 0%, rgba(6, 20, 16, 0.95) 75%)',
          accent: 'rgba(140, 168, 154, 0.08)'
        };
    }
  };

  const { gradient, accent } = getAtmosphereConfig();

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden transition-all duration-1000">
      {/* Background Gradient Mesh */}
      <div
        className="absolute inset-0 transition-opacity duration-1000"
        style={{ background: gradient }}
      />
      {/* Subtle Secondary Light Orb */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[550px] h-[550px] rounded-full blur-3xl opacity-40 transition-colors duration-1000"
        style={{ backgroundColor: accent }}
      />
      {/* Ambient Grain / Noise Texture Filter */}
      <div className="absolute inset-0 opacity-[0.035] mix-blend-overlay bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
    </div>
  );
};
