import React, { useEffect, useRef } from 'react';
import { ProtocolStage } from '../../types';

interface SacredEnergyCanvasProps {
  stageId: ProtocolStage | string;
  isPlaying: boolean;
  breathePhase?: 'inhale' | 'hold' | 'exhale';
  colorTheme?: {
    glow?: string;
    accent?: string;
  };
}

export const SacredEnergyCanvas: React.FC<SacredEnergyCanvasProps> = ({
  stageId,
  isPlaying,
  breathePhase = 'inhale'
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Resize handling with DPR for crisp rendering
    const handleResize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Dynamic particles for current stage
    const particlesCount = stageId === ProtocolStage.TRANSMUTACAO ? 40 : 25;
    const particles = Array.from({ length: particlesCount }, (_, i) => ({
      x: (Math.random() - 0.5) * 200,
      y: (Math.random() - 0.5) * 200,
      radius: Math.random() * 2 + 1,
      speed: Math.random() * 0.4 + 0.2,
      angle: (i / particlesCount) * Math.PI * 2,
      alpha: Math.random() * 0.7 + 0.3
    }));

    const render = () => {
      if (!ctx || !canvas) return;
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      const cx = width / 2;
      const cy = height / 2;

      ctx.clearRect(0, 0, width, height);

      time += prefersReducedMotion ? 0 : (isPlaying ? 0.015 : 0.005);

      // Render stage-specific sacred geometry & atmosphere
      switch (stageId) {
        case ProtocolStage.ABERTURA: {
          // Soft gold expanding rings & sacred presence
          const pulse = Math.sin(time * 1.5) * 12 + 65;
          
          // Outer subtle glow
          const grad = ctx.createRadialGradient(cx, cy, 10, cx, cy, pulse + 50);
          grad.addColorStop(0, 'rgba(212, 175, 55, 0.35)');
          grad.addColorStop(0.6, 'rgba(197, 160, 89, 0.12)');
          grad.addColorStop(1, 'rgba(6, 20, 16, 0)');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(cx, cy, pulse + 50, 0, Math.PI * 2);
          ctx.fill();

          // Concentric geometric circles
          ctx.strokeStyle = 'rgba(212, 175, 55, 0.45)';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.arc(cx, cy, pulse, 0, Math.PI * 2);
          ctx.stroke();

          ctx.strokeStyle = 'rgba(230, 202, 101, 0.25)';
          ctx.beginPath();
          ctx.arc(cx, cy, pulse * 0.65, 0, Math.PI * 2);
          ctx.stroke();

          // 8-petal subtle golden flower of light
          ctx.strokeStyle = 'rgba(212, 175, 55, 0.3)';
          for (let p = 0; p < 8; p++) {
            const rot = (p * Math.PI / 4) + time * 0.15;
            ctx.beginPath();
            ctx.arc(
              cx + Math.cos(rot) * (pulse * 0.4),
              cy + Math.sin(rot) * (pulse * 0.4),
              pulse * 0.38,
              0,
              Math.PI * 2
            );
            ctx.stroke();
          }

          // Center core
          ctx.fillStyle = '#f4f1ea';
          ctx.shadowColor = '#d4af37';
          ctx.shadowBlur = 15;
          ctx.beginPath();
          ctx.arc(cx, cy, 4, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
          break;
        }

        case ProtocolStage.ATERRAMENTO: {
          // Luminous Roots, Sage Green aura, descending anchor
          const basePulse = Math.sin(time) * 6 + 70;

          // Sage green radial glow
          const grad = ctx.createRadialGradient(cx, cy, 20, cx, cy, 140);
          grad.addColorStop(0, 'rgba(140, 168, 154, 0.28)');
          grad.addColorStop(0.5, 'rgba(11, 31, 24, 0.15)');
          grad.addColorStop(1, 'rgba(6, 20, 16, 0)');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(cx, cy, 140, 0, Math.PI * 2);
          ctx.fill();

          // Descending roots of light
          ctx.strokeStyle = 'rgba(140, 168, 154, 0.5)';
          ctx.lineWidth = 1.5;
          for (let i = 0; i < 7; i++) {
            const spread = (i - 3) * 16;
            const sway = Math.sin(time + i) * 6;
            ctx.beginPath();
            ctx.moveTo(cx + spread * 0.4, cy + 20);
            ctx.quadraticCurveTo(
              cx + spread + sway,
              cy + 60,
              cx + spread * 1.5 + sway * 1.2,
              cy + 105 + Math.abs(spread) * 0.5
            );
            ctx.stroke();
          }

          // Grounding ring
          ctx.strokeStyle = 'rgba(197, 160, 89, 0.35)';
          ctx.beginPath();
          ctx.arc(cx, cy, basePulse * 0.8, 0, Math.PI * 2);
          ctx.stroke();
          break;
        }

        case ProtocolStage.VITALIDADE: {
          // Ascending Kundalini spinal column & quantum light needles
          const spineHeight = 130;
          const startY = cy + spineHeight / 2;

          // Ascending luminous channel
          const spineGrad = ctx.createLinearGradient(cx, startY, cx, startY - spineHeight);
          spineGrad.addColorStop(0, 'rgba(234, 179, 8, 0.15)');
          spineGrad.addColorStop(0.5, 'rgba(245, 158, 11, 0.4)');
          spineGrad.addColorStop(1, 'rgba(147, 197, 253, 0.7)');

          ctx.strokeStyle = spineGrad;
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(cx, startY);
          ctx.lineTo(cx, startY - spineHeight);
          ctx.stroke();

          // Kundalini double-helix waveforms
          ctx.lineWidth = 1.2;
          for (let side = -1; side <= 1; side += 2) {
            ctx.strokeStyle = side === 1 ? 'rgba(245, 158, 11, 0.5)' : 'rgba(147, 197, 253, 0.5)';
            ctx.beginPath();
            for (let y = 0; y <= spineHeight; y += 4) {
              const curY = startY - y;
              const angle = (y * 0.08) - (time * 2.2);
              const curX = cx + Math.sin(angle) * 18 * side;
              if (y === 0) ctx.moveTo(curX, curY);
              else ctx.lineTo(curX, curY);
            }
            ctx.stroke();
          }

          // Light crystal points along the centers
          for (let node = 1; node <= 5; node++) {
            const ny = startY - (node * (spineHeight / 6));
            ctx.fillStyle = node > 3 ? '#93c5fd' : '#fde68a';
            ctx.shadowColor = node > 3 ? '#3b82f6' : '#d4af37';
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.arc(cx, ny, 3.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
          }
          break;
        }

        case ProtocolStage.TRANSMUTACAO: {
          // Sapphire protective dome + Violet Flame transmutation
          const domeRadius = 78;

          // Sapphire outer dome
          ctx.strokeStyle = 'rgba(59, 130, 246, 0.6)';
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          ctx.arc(cx, cy + 15, domeRadius, Math.PI * 0.9, Math.PI * 2.1);
          ctx.stroke();

          // Soft violet inner glow
          const grad = ctx.createRadialGradient(cx, cy, 10, cx, cy, 75);
          grad.addColorStop(0, 'rgba(168, 85, 247, 0.45)');
          grad.addColorStop(0.6, 'rgba(139, 92, 246, 0.2)');
          grad.addColorStop(1, 'rgba(6, 20, 16, 0)');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(cx, cy, 75, 0, Math.PI * 2);
          ctx.fill();

          // Transmuting flame particles swirling upwards
          particles.forEach((p, idx) => {
            const flameAngle = p.angle + time * p.speed;
            const dist = 30 + (idx % 4) * 12;
            const px = cx + Math.cos(flameAngle) * dist;
            const py = cy + Math.sin(flameAngle) * (dist * 0.7) - ((time * 25 + idx * 10) % 65);

            ctx.fillStyle = idx % 2 === 0 ? 'rgba(192, 132, 252, 0.75)' : 'rgba(96, 165, 250, 0.75)';
            ctx.beginPath();
            ctx.arc(px, py, p.radius, 0, Math.PI * 2);
            ctx.fill();
          });
          break;
        }

        case ProtocolStage.BALSAMO: {
          // Rose Quartz Heart expansion & Golden Light Source cascade
          const heartPulse = Math.sin(time * 1.8) * 8 + 68;

          // Rose soft bloom
          const roseGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, heartPulse + 40);
          roseGrad.addColorStop(0, 'rgba(244, 114, 182, 0.35)');
          roseGrad.addColorStop(0.5, 'rgba(251, 113, 133, 0.15)');
          roseGrad.addColorStop(1, 'rgba(6, 20, 16, 0)');
          ctx.fillStyle = roseGrad;
          ctx.beginPath();
          ctx.arc(cx, cy, heartPulse + 40, 0, Math.PI * 2);
          ctx.fill();

          // Golden liquid light cascade from top
          ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
          ctx.lineWidth = 1.2;
          for (let i = -3; i <= 3; i++) {
            const lineX = cx + i * 14;
            const streamY = (time * 30 + Math.abs(i) * 15) % 90;
            ctx.beginPath();
            ctx.moveTo(lineX, cy - 90);
            ctx.lineTo(lineX, cy - 90 + streamY);
            ctx.stroke();
          }

          // Concentric rose rings
          ctx.strokeStyle = 'rgba(244, 114, 182, 0.45)';
          ctx.beginPath();
          ctx.arc(cx, cy, heartPulse, 0, Math.PI * 2);
          ctx.stroke();

          // São Rafael Emerald subtle cross of light
          ctx.strokeStyle = 'rgba(52, 211, 153, 0.35)';
          ctx.beginPath();
          ctx.moveTo(cx - 25, cy);
          ctx.lineTo(cx + 25, cy);
          ctx.moveTo(cx, cy - 25);
          ctx.lineTo(cx, cy + 25);
          ctx.stroke();
          break;
        }

        case ProtocolStage.SELAMENTO: {
          // Ganesha Empoderamento: Stable geometric mandala & path-opening rays
          const sealRadius = 70;

          // Warm golden protective aura
          const grad = ctx.createRadialGradient(cx, cy, 15, cx, cy, sealRadius + 45);
          grad.addColorStop(0, 'rgba(230, 202, 101, 0.35)');
          grad.addColorStop(0.6, 'rgba(197, 160, 89, 0.15)');
          grad.addColorStop(1, 'rgba(6, 20, 16, 0)');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(cx, cy, sealRadius + 45, 0, Math.PI * 2);
          ctx.fill();

          // Octagram / 8-pointed star of stability
          ctx.strokeStyle = 'rgba(212, 175, 55, 0.6)';
          ctx.lineWidth = 1.5;
          const rotOffset = time * 0.1;
          for (let s = 0; s < 2; s++) {
            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate(rotOffset + (s * Math.PI / 4));
            const sz = sealRadius * 0.72;
            ctx.strokeRect(-sz, -sz, sz * 2, sz * 2);
            ctx.restore();
          }

          // Outer circle of final sealing
          ctx.strokeStyle = 'rgba(230, 202, 101, 0.5)';
          ctx.beginPath();
          ctx.arc(cx, cy, sealRadius, 0, Math.PI * 2);
          ctx.stroke();

          // Central Throne Point
          ctx.fillStyle = '#ffffff';
          ctx.shadowColor = '#e6ca65';
          ctx.shadowBlur = 18;
          ctx.beginPath();
          ctx.arc(cx, cy, 5, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
          break;
        }

        default:
          break;
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, [stageId, isPlaying, breathePhase]);

  return (
    <div className="relative w-full max-w-[320px] aspect-square mx-auto flex items-center justify-center">
      <canvas
        ref={canvasRef}
        className="w-full h-full block touch-none"
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};
