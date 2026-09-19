/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Estúdio de Vídeos do Admin — Reintegração da Vida: 21 Dias para Voltar para Mim
 * Idealizado por Éverton Piceni — Terapias Holísticas e Bem-Estar (@terapiamorevida)
 * 
 * Diretrizes estritas do Briefing Fechado:
 * - A arte do dia é a referência visual definitiva; animar o que já existe sem redesenhar.
 * - Corpo neutro universal vivo (respiração realista, tórax/abdômen, ombros relaxando, microajustes).
 * - Sem círculos ou símbolos de chakras — obedece às regiões corporais do dia.
 * - Logo oficial Everton Piceni discreto, transparente, baixa opacidade (assinatura visual).
 * - Câmera quase parada (push-in ultralento cinematográfico).
 * - Duração-base de 8 a 12 segundos para looping suave.
 * - Regra de código: reprovação automática se violar corpo, textos, logo ou composição.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Video, Play, Pause, Download, Volume2, VolumeX, Sparkles, X,
  RefreshCw, CheckCircle2, AlertTriangle, ShieldCheck, Upload,
  Eye, Check, Film, FileCheck, Layers, Info, RotateCcw,
  Sliders, Lock, Compass, ChevronLeft, ChevronRight
} from 'lucide-react';
import {
  StudioDayRecord,
  ValidationReport,
  INITIAL_STUDIO_21_DAYS,
  OFFICIAL_NEGATIVE_PROMPT,
  STUDIO_STORAGE_KEY_DAYS,
  validateStudioGeneration
} from '../data/reintegrationStudioData';

interface VideoStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDay?: number;
}

type AspectRatio = '9:16' | '16:9' | '1:1';

export default function VideoStudioModal({ isOpen, onClose, initialDay = 1 }: VideoStudioModalProps) {
  // 21 Days Collection State
  const [days, setDays] = useState<StudioDayRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STUDIO_STORAGE_KEY_DAYS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === 21) {
          // Upgrade saved entries to ensure they point to the 21 official day artworks and possess all stages
          return INITIAL_STUDIO_21_DAYS.map(initDay => {
            const item = parsed.find((p: any) => p.day === initDay.day);
            if (!item) return initDay;
            const artUrl = (!item.artUrl || item.artUrl === '/brand/reintegracao-presenca-arte.png' || !item.artUrl.startsWith('/brand/days/'))
              ? initDay.artUrl
              : item.artUrl;
            return {
              ...initDay,
              ...item,
              artUrl,
              stages: initDay.stages,
              mainAffirmation: initDay.mainAffirmation,
              subPhrase: initDay.subPhrase,
            };
          });
        }
      }
    } catch (e) {
      console.error('Failed to load saved studio days', e);
    }
    return INITIAL_STUDIO_21_DAYS;
  });

  const [selectedDayNum, setSelectedDayNum] = useState<number>(initialDay);
  const currentRecord = days.find(d => d.day === selectedDayNum) || days[0];

  // Selected stage focus (null = full continuous progression)
  const [selectedStageStep, setSelectedStageStep] = useState<number | null>(null);

  // Aspect ratio
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('9:16');

  // Preview & Engine state
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRenderingVideo, setIsRenderingVideo] = useState(false);
  const [renderProgress, setRenderProgress] = useState(0);
  const [currentTimeSec, setCurrentTimeSec] = useState(0);
  const [enableAmbientTone, setEnableAmbientTone] = useState(false);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState<string | null>(currentRecord.videoBlobUrl || null);
  const [validationModalReport, setValidationModalReport] = useState<ValidationReport | null>(null);

  // Canvas & Media Refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  // Loaded Assets Refs
  const currentArtImgRef = useRef<HTMLImageElement | null>(null);
  const officialLogoImgRef = useRef<HTMLImageElement | null>(null);
  const [imagesReady, setImagesReady] = useState(false);

  // Audio Synth Ref (ambient 528Hz / 432Hz sine tone)
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  // Save changes to localStorage whenever days state updates
  const saveDaysState = (newDays: StudioDayRecord[]) => {
    setDays(newDays);
    try {
      localStorage.setItem(STUDIO_STORAGE_KEY_DAYS, JSON.stringify(newDays));
    } catch (e) {
      console.error('Failed to persist studio state', e);
    }
  };

  // Preload Image Assets
  useEffect(() => {
    let artLoaded = false;
    let logoLoaded = false;

    const checkReady = () => {
      if (artLoaded && logoLoaded) {
        setImagesReady(true);
      }
    };

    // Day Artwork
    const artImg = new Image();
    artImg.crossOrigin = 'anonymous';
    artImg.src = currentRecord.artUrl;
    artImg.onload = () => {
      artLoaded = true;
      checkReady();
    };
    artImg.onerror = () => {
      artLoaded = true;
      checkReady();
    };
    currentArtImgRef.current = artImg;

    // Official Everton Piceni Logo / Emblem
    const logoImg = new Image();
    logoImg.crossOrigin = 'anonymous';
    logoImg.src = '/app-icon.jpg';
    logoImg.onload = () => {
      logoLoaded = true;
      checkReady();
    };
    logoImg.onerror = () => {
      logoLoaded = true;
      checkReady();
    };
    officialLogoImgRef.current = logoImg;

    setRecordedVideoUrl(currentRecord.videoBlobUrl || null);
  }, [selectedDayNum, currentRecord.artUrl]);

  // Audio tone management
  const startAudioTone = () => {
    try {
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioContextClass();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      if (!oscRef.current) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        // 528Hz Solfeggio / Transformação & Presença
        osc.type = 'sine';
        osc.frequency.setValueAtTime(528, ctx.currentTime);

        gain.gain.setValueAtTime(0.001, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.04, ctx.currentTime + 1.5);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();

        oscRef.current = osc;
        gainRef.current = gain;
      }
    } catch (e) {
      console.warn('Audio tone init error', e);
    }
  };

  const stopAudioTone = () => {
    if (gainRef.current && audioCtxRef.current) {
      const ctx = audioCtxRef.current;
      gainRef.current.gain.setValueAtTime(gainRef.current.gain.value, ctx.currentTime);
      gainRef.current.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4);
      setTimeout(() => {
        if (oscRef.current) {
          try {
            oscRef.current.stop();
            oscRef.current.disconnect();
          } catch {
            // ignore
          }
          oscRef.current = null;
        }
        gainRef.current = null;
      }, 450);
    }
  };

  useEffect(() => {
    return () => {
      stopAudioTone();
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // Update current record field
  const updateCurrentRecord = (field: keyof StudioDayRecord, value: unknown) => {
    const updated = days.map(d => {
      if (d.day === selectedDayNum) {
        return { ...d, [field]: value };
      }
      return d;
    });
    saveDaysState(updated);
    setRecordedVideoUrl(null);
  };

  // Custom Image Upload for the current day
  const handleArtUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const img = new Image();
      img.onload = () => {
        currentArtImgRef.current = img;
        updateCurrentRecord('artUrl', dataUrl);
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  /**
   * CANVA RENDER LOOP — REALISMO CINEMATOGRÁFICO MEDITATIVO:
   * 1. Arte aprovada preservada sem redesenho
   * 2. Respiração viva orgânica (tórax/abdômen expandindo + ombros relaxando na expiração)
   * 3. Luz volumétrica profunda e progressão lenta (conforme a região do dia, SEM círculos de chakras!)
   * 4. Câmera quase parada: push-in ultralento (1.000 a 1.025)
   * 5. Logo oficial Everton Piceni discreto como marca d'água elegante em baixa opacidade
   */
  const renderFrame = useCallback((timestamp: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (!startTimeRef.current) startTimeRef.current = timestamp;
    const elapsedSec = (timestamp - startTimeRef.current) / 1000;
    const duration = currentRecord.durationSeconds || 10;
    
    // Normalized time (0.0 to 1.0)
    let normalizedTime = (elapsedSec % duration) / duration;
    
    // Se o admin clicou numa etapa específica, fixa a evolução no momento exato dessa etapa
    if (selectedStageStep !== null) {
      if (selectedStageStep === 1) normalizedTime = 0.10;
      else if (selectedStageStep === 2) normalizedTime = 0.30;
      else if (selectedStageStep === 3) normalizedTime = 0.52;
      else if (selectedStageStep === 4) normalizedTime = 0.74;
      else if (selectedStageStep === 5) normalizedTime = 0.95;
    }

    setCurrentTimeSec(normalizedTime * duration);

    const width = canvas.width;
    const height = canvas.height;

    // Fundo profundo sagrado aprovado (verde noturno esmeralda florestal)
    ctx.fillStyle = '#02150f';
    ctx.fillRect(0, 0, width, height);

    // 1. CÂMERA CINEMATOGRÁFICA (Push-in ultralento suave)
    ctx.save();
    const cameraZoom = currentRecord.cameraMovement === 'push_in_ultralento'
      ? 1.00 + normalizedTime * 0.022
      : 1.00;

    ctx.translate(width / 2, height / 2);
    ctx.scale(cameraZoom, cameraZoom);
    ctx.translate(-width / 2, -height / 2);

    // Fundo com atmosfera de santuário & luz ambiente
    const bgAura = ctx.createRadialGradient(
      width / 2, height * 0.52, 40,
      width / 2, height * 0.52, width * 0.65
    );
    bgAura.addColorStop(0, 'rgba(14, 62, 45, 0.45)');
    bgAura.addColorStop(0.55, 'rgba(5, 36, 26, 0.28)');
    bgAura.addColorStop(1, 'rgba(2, 21, 15, 0)');
    ctx.fillStyle = bgAura;
    ctx.fillRect(0, 0, width, height);

    // Partículas sutis de prana dourado subindo suavemente
    ctx.save();
    ctx.fillStyle = 'rgba(232, 211, 143, 0.35)';
    for (let i = 0; i < 28; i++) {
      const px = ((i * 137.5 + elapsedSec * 12) % width);
      const py = ((height - ((i * 93.7 + elapsedSec * (18 + (i % 8) * 4)) % height)));
      const pSize = 1.0 + (i % 3) * 0.8;
      const pAlpha = 0.15 + Math.sin(elapsedSec * 1.5 + i) * 0.12;
      ctx.globalAlpha = Math.max(0.05, pAlpha);
      ctx.beginPath();
      ctx.arc(px, py, pSize, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // 2. RESPIRAÇÃO FISIOLÓGICA REALISTA DO CORPO
    // Inalação (4s) -> Retenção (1s) -> Exalação (5s)
    const breathCycle = Math.sin((elapsedSec * Math.PI * 2) / 6.0); // -1 a +1
    const isExhaling = Math.cos((elapsedSec * Math.PI * 2) / 6.0) < 0;
    const chestExpansionX = 1 + breathCycle * 0.014;
    const chestExpansionY = 1 + breathCycle * 0.018;
    const shoulderDropY = isExhaling ? Math.abs(breathCycle) * 2.4 : 0;
    const microSwayX = Math.sin(elapsedSec * 0.4) * 0.8;
    const microSwayY = Math.cos(elapsedSec * 0.3) * 0.6 + shoulderDropY;

    // Coordenadas base do corpo em meditação (viewBox 800 x 1000)
    let bodyScale = (width * 0.88) / 800;
    if (aspectRatio === '16:9') {
      bodyScale = (height * 0.84) / 1000;
    } else if (aspectRatio === '1:1') {
      bodyScale = (width * 0.80) / 800;
    }

    const bodyW = 800 * bodyScale;
    const bodyH = 1000 * bodyScale;
    const bodyOriginX = (width - bodyW) / 2;
    const bodyOriginY = (height - bodyH) / 2 + (aspectRatio === '9:16' ? 25 : 15);

    ctx.save();
    // Ponto de ancoragem na pelve/base para a respiração fisiológica
    const breathAnchorX = width / 2;
    const breathAnchorY = bodyOriginY + bodyH * 0.68;

    ctx.translate(breathAnchorX + microSwayX, breathAnchorY + microSwayY);
    ctx.scale(chestExpansionX, chestExpansionY);
    ctx.translate(-breathAnchorX, -breathAnchorY);

    ctx.translate(bodyOriginX, bodyOriginY);
    ctx.scale(bodyScale, bodyScale);

    // Vetores da anatomia sagrada do corpo em meditação (Cabeça, Tronco, Braços, Pernas em Lótus)
    const headPath = new Path2D();
    headPath.arc(400, 235, 82, 0, Math.PI * 2);

    const torsoPath = new Path2D();
    torsoPath.moveTo(320, 305);
    torsoPath.bezierCurveTo(290, 380, 278, 515, 300, 655);
    torsoPath.bezierCurveTo(325, 705, 475, 705, 500, 655);
    torsoPath.bezierCurveTo(522, 515, 510, 380, 480, 305);
    torsoPath.bezierCurveTo(438, 337, 362, 337, 320, 305);
    torsoPath.closePath();

    const armsPath = new Path2D();
    // Braço esquerdo
    armsPath.moveTo(315, 350);
    armsPath.bezierCurveTo(245, 375, 194, 500, 145, 645);
    armsPath.bezierCurveTo(134, 678, 177, 697, 194, 664);
    armsPath.lineTo(322, 457);
    armsPath.closePath();
    // Braço direito
    armsPath.moveTo(485, 350);
    armsPath.bezierCurveTo(555, 375, 606, 500, 655, 645);
    armsPath.bezierCurveTo(666, 678, 623, 697, 606, 664);
    armsPath.lineTo(478, 457);
    armsPath.closePath();

    const legsPath = new Path2D();
    // Coxa/joelho esquerdo
    legsPath.moveTo(300, 640);
    legsPath.bezierCurveTo(230, 690, 145, 741, 77, 822);
    legsPath.bezierCurveTo(53, 851, 78, 885, 116, 873);
    legsPath.lineTo(403, 779);
    legsPath.closePath();
    // Coxa/joelho direito
    legsPath.moveTo(500, 640);
    legsPath.bezierCurveTo(570, 690, 655, 741, 723, 822);
    legsPath.bezierCurveTo(747, 851, 722, 885, 684, 873);
    legsPath.lineTo(397, 779);
    legsPath.closePath();
    // Base cruzada de lótus
    legsPath.moveTo(103, 870);
    legsPath.bezierCurveTo(207, 882, 304, 864, 400, 779);
    legsPath.bezierCurveTo(496, 864, 593, 882, 697, 870);
    legsPath.bezierCurveTo(634, 949, 505, 970, 400, 907);
    legsPath.bezierCurveTo(295, 970, 166, 949, 103, 870);
    legsPath.closePath();

    // Sombra sutil de apoio sob o corpo
    const floorShadow = ctx.createRadialGradient(400, 920, 20, 400, 920, 320);
    floorShadow.addColorStop(0, 'rgba(1, 14, 10, 0.85)');
    floorShadow.addColorStop(1, 'transparent');
    ctx.fillStyle = floorShadow;
    ctx.beginPath();
    ctx.ellipse(400, 920, 310, 50, 0, 0, Math.PI * 2);
    ctx.fill();

    // BASE DO CORPO: Silhueta Serena Natural (sempre presente e digna)
    ctx.fillStyle = '#041f17';
    ctx.fill(headPath);
    ctx.fill(torsoPath);
    ctx.fill(armsPath);
    ctx.fill(legsPath);

    // Contorno dourado sutil refinado
    ctx.strokeStyle = 'rgba(214, 174, 82, 0.32)';
    ctx.lineWidth = 1.8;
    ctx.stroke(headPath);
    ctx.stroke(torsoPath);
    ctx.stroke(armsPath);
    ctx.stroke(legsPath);

    // =========================================================================
    // AS 5 ETAPAS DA ILUMINAÇÃO DINÂMICA (A LUZ VIVA DO CORPO)
    // Conforme o áudio toca, a luz entra, desce, enraíza e integra o corpo todo!
    // =========================================================================
    ctx.save();
    ctx.globalCompositeOperation = 'screen';

    // Intensidades calculadas suavemente (sem saltos bruscos)
    // Etapa 1: Estado Inicial (0.00 a 0.20)
    // Etapa 2: A Luz Chega (0.20 a 0.40)
    // Etapa 3: A Energia Desce (0.40 a 0.65)
    // Etapa 4: Enraizamento (0.65 a 0.85)
    // Etapa 5: Integração (0.85 a 1.00)
    const stage2Power = Math.max(0, Math.min(1, (normalizedTime - 0.18) / 0.16));
    const stage3Power = Math.max(0, Math.min(1, (normalizedTime - 0.38) / 0.18));
    const stage4Power = Math.max(0, Math.min(1, (normalizedTime - 0.62) / 0.16));
    const stage5Power = Math.max(0, Math.min(1, (normalizedTime - 0.82) / 0.15));

    // -------------------------------------------------------------------------
    // ETAPA 2+: A LUZ CHEGA (Feixe celestial descendo do cosmos até a coroa/cabeça)
    // -------------------------------------------------------------------------
    if (stage2Power > 0.01) {
      const beamAlpha = stage2Power;
      const beamPulse = 1 + Math.sin(elapsedSec * 2.5) * 0.08;

      // Coluna de luz dourada translúcida descendo do infinito
      const beamGrad = ctx.createLinearGradient(400, -200, 400, 240);
      beamGrad.addColorStop(0, `rgba(255, 252, 242, ${0.85 * beamAlpha})`);
      beamGrad.addColorStop(0.4, `rgba(232, 211, 143, ${0.65 * beamAlpha})`);
      beamGrad.addColorStop(0.85, `rgba(214, 174, 82, ${0.35 * beamAlpha})`);
      beamGrad.addColorStop(1, `rgba(214, 174, 82, ${0.05 * beamAlpha})`);

      ctx.fillStyle = beamGrad;
      ctx.beginPath();
      ctx.moveTo(400 - 32 * beamPulse, -200);
      ctx.lineTo(400 + 32 * beamPulse, -200);
      ctx.lineTo(400 + 65 * beamPulse, 240);
      ctx.lineTo(400 - 65 * beamPulse, 240);
      ctx.closePath();
      ctx.fill();

      // Iluminação radiante da Cabeça e Coronário
      const headLight = ctx.createRadialGradient(400, 235, 10, 400, 235, 125 * beamPulse);
      headLight.addColorStop(0, `rgba(255, 252, 240, ${0.95 * beamAlpha})`);
      headLight.addColorStop(0.35, `rgba(232, 211, 143, ${0.75 * beamAlpha})`);
      headLight.addColorStop(0.75, `rgba(214, 174, 82, ${0.30 * beamAlpha})`);
      headLight.addColorStop(1, 'transparent');
      ctx.fillStyle = headLight;
      ctx.beginPath();
      ctx.arc(400, 235, 125 * beamPulse, 0, Math.PI * 2);
      ctx.fill();

      // Halo sagrado ao redor da coroa
      ctx.strokeStyle = `rgba(232, 211, 143, ${0.45 * beamAlpha})`;
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.ellipse(400, 150, 75 * beamPulse, 24 * beamPulse, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    // -------------------------------------------------------------------------
    // ETAPA 3+: A ENERGIA DESCE (Peito, coração, plexo e braços se iluminando)
    // -------------------------------------------------------------------------
    if (stage3Power > 0.01) {
      const chestAlpha = stage3Power;
      const chestPulse = 1 + breathCycle * 0.12;

      // Luz fluindo pelo canal central (garganta e tórax)
      const centralFlow = ctx.createLinearGradient(400, 250, 400, 660);
      centralFlow.addColorStop(0, `rgba(255, 250, 230, ${0.90 * chestAlpha})`);
      centralFlow.addColorStop(0.35, `rgba(232, 211, 143, ${0.80 * chestAlpha})`);
      centralFlow.addColorStop(0.75, `rgba(214, 174, 82, ${0.45 * chestAlpha})`);
      centralFlow.addColorStop(1, 'transparent');

      ctx.fillStyle = centralFlow;
      ctx.beginPath();
      ctx.ellipse(400, 460, 95 * chestPulse, 180 * chestPulse, 0, 0, Math.PI * 2);
      ctx.fill();

      // Brilho dourado caloroso no centro do peito (Coração / Cardíaco)
      const heartGlow = ctx.createRadialGradient(400, 430, 15, 400, 430, 190 * chestPulse);
      heartGlow.addColorStop(0, `rgba(255, 250, 235, ${0.95 * chestAlpha})`);
      heartGlow.addColorStop(0.35, `rgba(232, 211, 143, ${0.72 * chestAlpha})`);
      heartGlow.addColorStop(0.70, `rgba(214, 174, 82, ${0.32 * chestAlpha})`);
      heartGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = heartGlow;
      ctx.beginPath();
      ctx.arc(400, 430, 190 * chestPulse, 0, Math.PI * 2);
      ctx.fill();

      // Luz percorrendo os braços até as mãos e dedos
      const leftArmGlow = ctx.createRadialGradient(230, 520, 15, 230, 520, 130 * chestPulse);
      leftArmGlow.addColorStop(0, `rgba(232, 211, 143, ${0.75 * chestAlpha})`);
      leftArmGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = leftArmGlow;
      ctx.beginPath();
      ctx.arc(230, 520, 130 * chestPulse, 0, Math.PI * 2);
      ctx.fill();

      const rightArmGlow = ctx.createRadialGradient(570, 520, 15, 570, 520, 130 * chestPulse);
      rightArmGlow.addColorStop(0, `rgba(232, 211, 143, ${0.75 * chestAlpha})`);
      rightArmGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = rightArmGlow;
      ctx.beginPath();
      ctx.arc(570, 520, 130 * chestPulse, 0, Math.PI * 2);
      ctx.fill();

      // Ondulações sutis de geometria sagrada no peito
      ctx.strokeStyle = `rgba(232, 211, 143, ${0.35 * chestAlpha})`;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(400, 430, 70 * chestPulse, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(400, 430, 120 * chestPulse, 0, Math.PI * 2);
      ctx.stroke();
    }

    // -------------------------------------------------------------------------
    // ETAPA 4+: ENRAIZAMENTO (Pernas, pés e raízes luminosas crescendo na terra)
    // -------------------------------------------------------------------------
    if (stage4Power > 0.01) {
      const rootAlpha = stage4Power;
      const basePulse = 1 + Math.sin(elapsedSec * 2.0) * 0.06;

      // Luz dourada densa nas pernas e na base de lótus
      const baseLight = ctx.createRadialGradient(400, 820, 30, 400, 820, 270 * basePulse);
      baseLight.addColorStop(0, `rgba(255, 245, 215, ${0.90 * rootAlpha})`);
      baseLight.addColorStop(0.4, `rgba(232, 211, 143, ${0.70 * rootAlpha})`);
      baseLight.addColorStop(0.8, `rgba(214, 174, 82, ${0.35 * rootAlpha})`);
      baseLight.addColorStop(1, 'transparent');
      ctx.fillStyle = baseLight;
      ctx.beginPath();
      ctx.arc(400, 820, 270 * basePulse, 0, Math.PI * 2);
      ctx.fill();

      // Raízes de luz dourada se estendendo e ancorando na terra
      ctx.strokeStyle = `rgba(232, 211, 143, ${0.85 * rootAlpha})`;
      ctx.lineWidth = 2.4;
      const rootFilaments = [
        [[400, 910], [385, 960], [350, 1020], [320, 1090]],
        [[400, 910], [415, 960], [450, 1020], [480, 1090]],
        [[270, 880], [230, 940], [180, 1000], [140, 1070]],
        [[530, 880], [570, 940], [620, 1000], [660, 1070]],
        [[400, 920], [400, 990], [390, 1040], [400, 1110]],
        [[180, 860], [140, 910], [100, 970]],
        [[620, 860], [660, 910], [700, 970]]
      ];
      rootFilaments.forEach((r) => {
        ctx.beginPath();
        ctx.moveTo(r[0][0], r[0][1]);
        for (let i = 1; i < r.length; i++) {
          ctx.lineTo(r[i][0], r[i][1]);
        }
        ctx.stroke();
      });

      // Brilho do chão ancorando a presença
      const groundAnchor = ctx.createRadialGradient(400, 930, 10, 400, 930, 360);
      groundAnchor.addColorStop(0, `rgba(214, 174, 82, ${0.45 * rootAlpha})`);
      groundAnchor.addColorStop(1, 'transparent');
      ctx.fillStyle = groundAnchor;
      ctx.beginPath();
      ctx.ellipse(400, 930, 340, 65, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // -------------------------------------------------------------------------
    // ETAPA 5: INTEGRAÇÃO TOTAL (Corpo inteiro plenamente iluminado e radiante)
    // -------------------------------------------------------------------------
    if (stage5Power > 0.01) {
      const fullAlpha = stage5Power;
      const fullPulse = 1 + breathCycle * 0.16;

      // Aura cósmica dourada completa envolvendo todo o corpo
      const fullBodyAura = ctx.createRadialGradient(400, 520, 60, 400, 520, 520 * fullPulse);
      fullBodyAura.addColorStop(0, `rgba(255, 252, 240, ${0.60 * fullAlpha})`);
      fullBodyAura.addColorStop(0.35, `rgba(232, 211, 143, ${0.42 * fullAlpha})`);
      fullBodyAura.addColorStop(0.70, `rgba(214, 174, 82, ${0.18 * fullAlpha})`);
      fullBodyAura.addColorStop(1, 'transparent');

      ctx.fillStyle = fullBodyAura;
      ctx.beginPath();
      ctx.arc(400, 520, 520 * fullPulse, 0, Math.PI * 2);
      ctx.fill();

      // Círculo sagrado de expansão de presença
      ctx.strokeStyle = `rgba(232, 211, 143, ${0.30 * fullAlpha})`;
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 8]);
      ctx.beginPath();
      ctx.arc(400, 520, 360 * fullPulse, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    ctx.restore(); // Fim do bloco de iluminação
    ctx.restore(); // Fim do bloco do corpo com escala
    ctx.restore(); // Fim do bloco da câmera

    // =========================================================================
    // 3. IDENTIDADE TIPOGRÁFICA SAGRADA (Elegante, cinematográfica e sem poluição)
    // =========================================================================
    const activeStageIndex = Math.min(4, Math.floor(normalizedTime * 5));
    const currentStage = currentRecord.stages[activeStageIndex] || currentRecord.stages[0];
    const stageTitle = currentStage?.name || currentStage?.title || `ETAPA ${activeStageIndex + 1}`;
    const stageDesc = currentStage?.description || '';

    // HEADER SUPERIOR (Número do Dia e Título Oficial)
    ctx.save();
    ctx.textAlign = 'center';
    const topHeaderY = aspectRatio === '9:16' ? 140 : 80;

    // Número do Dia
    ctx.font = 'bold 18px Cinzel, serif';
    ctx.fillStyle = '#e5c158';
    ctx.letterSpacing = '6px';
    ctx.fillText(`DIA ${currentRecord.day.toString().padStart(2, '0')}`, width / 2, topHeaderY);

    // Título Principal
    ctx.font = 'bold 28px Cinzel, serif';
    ctx.fillStyle = '#ffffff';
    ctx.letterSpacing = '3px';
    ctx.fillText(currentRecord.title.toUpperCase(), width / 2, topHeaderY + 36);

    // SUBTÍTULO DINÂMICO DA ETAPA ATIVA (Atualiza em tempo real conforme o corpo ilumina!)
    const stageBadgeY = topHeaderY + 84;
    
    // Pill da etapa
    ctx.font = 'bold 14px sans-serif';
    ctx.fillStyle = 'rgba(214, 174, 82, 0.95)';
    ctx.letterSpacing = '2.5px';
    ctx.fillText(`ETAPA ${activeStageIndex + 1}/5 • ${stageTitle.toUpperCase()}`, width / 2, stageBadgeY);

    // Descrição da etapa
    ctx.font = '400 16px sans-serif';
    ctx.fillStyle = '#cbd5e1';
    ctx.letterSpacing = '1px';
    ctx.fillText(stageDesc, width / 2, stageBadgeY + 26);
    ctx.restore();

    // CARD INFERIOR DE AFIRMAÇÃO (Card de vidro flutuante e sereno)
    ctx.save();
    const cardW = Math.min(width * 0.86, 780);
    const cardH = aspectRatio === '9:16' ? 140 : 110;
    const cardX = (width - cardW) / 2;
    const cardY = height - (aspectRatio === '9:16' ? 240 : 150);

    ctx.fillStyle = 'rgba(3, 27, 19, 0.88)';
    ctx.strokeStyle = 'rgba(214, 174, 82, 0.38)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.roundRect(cardX, cardY, cardW, cardH, 18);
    ctx.fill();
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.font = 'bold 20px Cinzel, serif';
    ctx.fillStyle = '#ffffff';
    ctx.letterSpacing = '2.5px';
    ctx.fillText(currentRecord.mainAffirmation || 'AQUI COMEÇA A SUA REINTEGRAÇÃO.', width / 2, cardY + (aspectRatio === '9:16' ? 52 : 44));

    if (currentRecord.subPhrase) {
      ctx.font = 'italic 14px sans-serif';
      ctx.fillStyle = '#e8d38f';
      ctx.letterSpacing = '0.8px';
      ctx.fillText(currentRecord.subPhrase, width / 2, cardY + (aspectRatio === '9:16' ? 90 : 76));
    }
    ctx.restore();

    // 4. LOGO OFICIAL EVERTON PICENI COMO MARCA D'ÁGUA SAGRADA
    if (officialLogoImgRef.current && officialLogoImgRef.current.complete) {
      ctx.save();
      const logoSize = Math.round(width * 0.048);
      const logoX = width / 2 - logoSize / 2;
      const logoY = height - (aspectRatio === '9:16' ? 74 : 50);

      ctx.globalAlpha = 0.32;
      ctx.drawImage(officialLogoImgRef.current, logoX, logoY, logoSize, logoSize);

      ctx.font = '500 10px sans-serif';
      ctx.fillStyle = 'rgba(232, 211, 143, 0.55)';
      ctx.textAlign = 'center';
      ctx.letterSpacing = '2px';
      ctx.fillText('ÉVERTON PICENI', width / 2, logoY + logoSize + 13);
      ctx.restore();
    }

    ctx.restore(); // Fim do bloco da câmera

    // Loop de animação se estiver tocando ou gravando
    if (isPlaying || isRenderingVideo) {
      animFrameRef.current = requestAnimationFrame(renderFrame);
    }
  }, [aspectRatio, currentRecord, isPlaying, isRenderingVideo]);

  // Inicializa o Canvas com a resolução correta
  useEffect(() => {
    if (!isOpen) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (aspectRatio === '9:16') {
      canvas.width = 1080;
      canvas.height = 1920;
    } else if (aspectRatio === '16:9') {
      canvas.width = 1920;
      canvas.height = 1080;
    } else {
      canvas.width = 1080;
      canvas.height = 1080;
    }

    startTimeRef.current = null;
    requestAnimationFrame(renderFrame);
  }, [isOpen, aspectRatio, renderFrame]);

  // Play / Pause Preview
  const handleTogglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      stopAudioTone();
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    } else {
      setIsPlaying(true);
      startTimeRef.current = null;
      if (enableAmbientTone) startAudioTone();
      animFrameRef.current = requestAnimationFrame(renderFrame);
    }
  };

  /**
   * GERAR VÍDEO DO DIA:
   * Grava em tempo real quadro a quadro com o MediaRecorder (8s, 10s ou 12s)
   * Produz um arquivo de vídeo .webm / .mp4 executável
   */
  const handleGenerateVideo = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsRenderingVideo(true);
    setIsPlaying(true);
    setRenderProgress(0);
    recordedChunksRef.current = [];
    startTimeRef.current = null;

    if (enableAmbientTone) startAudioTone();

    // Inicia MediaRecorder
    try {
      const stream = canvas.captureStream(30); // 30 FPS estáveis
      const options: MediaRecorderOptions = {
        mimeType: MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
          ? 'video/webm;codecs=vp9'
          : 'video/webm'
      };

      const recorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          recordedChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setRecordedVideoUrl(url);
        updateCurrentRecord('videoBlobUrl', url);
        setIsRenderingVideo(false);
        setIsPlaying(false);
        stopAudioTone();
      };

      recorder.start();

      // Duração configurada
      const targetDurationSec = currentRecord.durationSeconds || 10;
      const startTime = performance.now();

      const progressInterval = setInterval(() => {
        const elapsed = (performance.now() - startTime) / 1000;
        const pct = Math.min(100, Math.round((elapsed / targetDurationSec) * 100));
        setRenderProgress(pct);

        if (elapsed >= targetDurationSec) {
          clearInterval(progressInterval);
          if (recorder.state === 'recording') {
            recorder.stop();
          }
        }
      }, 100);

    } catch (err) {
      console.error('MediaRecorder error', err);
      setIsRenderingVideo(false);
      setIsPlaying(false);
      stopAudioTone();
    }
  };

  /**
   * REPROVAÇÃO / APROVAÇÃO AUTOMÁTICA PELO CÓDIGO DO ESTÚDIO:
   * "se o gerador tentar alterar corpo, textos, logo ou composição,
   * o resultado deve voltar como REPROVADO automaticamente, e não entrar na jornada."
   */
  const handleValidateAndApprove = () => {
    const report = validateStudioGeneration(currentRecord);
    setValidationModalReport(report);

    if (report.verdict === 'APROVADO') {
      const updated = days.map(d => {
        if (d.day === selectedDayNum) {
          return {
            ...d,
            status: 'aprovado' as const,
            approvedAt: new Date().toISOString(),
            validationReport: report,
            rejectionReason: undefined
          };
        }
        return d;
      });
      saveDaysState(updated);
    } else {
      // REPROVADO AUTOMATICAMENTE
      const updated = days.map(d => {
        if (d.day === selectedDayNum) {
          return {
            ...d,
            status: 'reprovado_automaticamente' as const,
            rejectionReason: report.reason,
            validationReport: report
          };
        }
        return d;
      });
      saveDaysState(updated);
    }
  };

  // Reset / Refazer parâmetros do dia
  const handleResetCurrentDay = () => {
    const defaultData = INITIAL_STUDIO_21_DAYS.find(d => d.day === selectedDayNum);
    if (!defaultData) return;

    const updated = days.map(d => {
      if (d.day === selectedDayNum) {
        return { ...defaultData };
      }
      return d;
    });
    saveDaysState(updated);
    setRecordedVideoUrl(null);
  };

  // Download video file
  const handleDownloadVideo = () => {
    if (!recordedVideoUrl) return;
    const a = document.createElement('a');
    a.href = recordedVideoUrl;
    a.download = `reintegracao-vida-dia-${currentRecord.day}-${currentRecord.title.toLowerCase().replace(/\s+/g, '-')}.webm`;
    a.click();
  };

  // Exportar imagem estática em alta resolução da etapa atual (PNG HD)
  const handleExportCurrentFrame = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `reintegracao-dia-${currentRecord.day}-etapa-${selectedStageStep || 'preview'}.png`;
    a.click();
  };

  // Contagem de aprovados
  const approvedCount = days.filter(d => d.status === 'aprovado').length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-[#02150f]/95 backdrop-blur-xl overflow-y-auto" id="video-studio-modal">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        className="w-full max-w-7xl bg-[#031b13] border border-[#d6ae52]/30 rounded-3xl p-4 sm:p-6 shadow-2xl shadow-black/80 space-y-5 relative my-2 max-h-[96vh] flex flex-col"
      >
        {/* Top Atmosphere Accent */}
        <div className="absolute top-0 right-1/4 w-96 h-32 bg-[#d6ae52]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#d6ae52]/20 pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#052a1e] border border-[#d6ae52]/40 text-[#e8d38f] flex items-center justify-center shrink-0 shadow-lg shadow-[#d6ae52]/10">
              <Film size={22} className="text-[#d6ae52]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#d6ae52] bg-[#d6ae52]/15 border border-[#d6ae52]/30 px-2.5 py-0.5 rounded-full font-bold">
                  Estúdio de Vídeos do Admin
                </span>
                <span className="text-[10px] font-mono text-[#b9cdbf]">
                  Reintegração da Vida • 21 Dias para Voltar para Mim
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-serif text-[#fff8e7] mt-0.5 flex items-center gap-2">
                <span>Animação Cinematográfica das Artes Aprovadas</span>
                <span className="text-xs font-mono font-normal text-[#d6ae52] bg-[#052a1e] px-2 py-0.5 rounded-md border border-[#d6ae52]/25">
                  {approvedCount} de 21 Aprovados
                </span>
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Aspect Ratio Selector */}
            <div className="flex items-center gap-1 bg-[#02150f] p-1 rounded-xl border border-[#d6ae52]/20">
              {(['9:16', '16:9', '1:1'] as AspectRatio[]).map(ratio => (
                <button
                  key={ratio}
                  type="button"
                  onClick={() => setAspectRatio(ratio)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono transition cursor-pointer ${
                    aspectRatio === ratio
                      ? 'bg-[#d6ae52] text-[#031b13] font-bold shadow'
                      : 'text-[#b9cdbf] hover:text-[#fff8e7]'
                  }`}
                >
                  {ratio === '9:16' ? 'Vertical 9:16 (Reels/Shorts)' : ratio === '16:9' ? 'Horizontal 16:9 (YouTube)' : 'Quadrado 1:1'}
                </button>
              ))}
            </div>

            <button
              onClick={onClose}
              className="p-2 text-[#b9cdbf] hover:text-[#fff8e7] bg-[#052a1e] hover:bg-[#073426] border border-[#d6ae52]/20 rounded-xl transition cursor-pointer"
              title="Fechar estúdio"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* 21 DAYS CAROUSEL / SELECTOR BAR */}
        <div className="border border-[#d6ae52]/20 rounded-2xl bg-[#02150f]/80 p-2.5 shrink-0 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono text-[#d6ae52]">
            <span className="flex items-center gap-1.5 uppercase tracking-wider font-semibold">
              <Compass size={13} />
              Selecione o Dia da Jornada (1 a 21)
            </span>
            <span className="text-[#b9cdbf]">
              Dia {selectedDayNum}: <strong className="text-[#fff8e7]">{currentRecord.title}</strong> ({currentRecord.cycle})
            </span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
            {days.map(d => {
              const isSelected = d.day === selectedDayNum;
              const isApproved = d.status === 'aprovado';
              const isRejected = d.status === 'reprovado_automaticamente';

              return (
                <button
                  key={d.day}
                  type="button"
                  onClick={() => {
                    setSelectedDayNum(d.day);
                    setSelectedStageStep(null);
                    setIsPlaying(false);
                    stopAudioTone();
                  }}
                  className={`p-2 rounded-xl text-left border transition shrink-0 cursor-pointer flex items-center gap-2.5 min-w-[170px] ${
                    isSelected
                      ? 'bg-[#d6ae52]/25 border-[#d6ae52] text-[#fff8e7] shadow-md shadow-[#d6ae52]/10 ring-1 ring-[#d6ae52]'
                      : isApproved
                      ? 'bg-[#052a1e] border-emerald-500/40 text-[#c8d8cc] hover:border-emerald-400'
                      : isRejected
                      ? 'bg-rose-950/40 border-rose-500/40 text-rose-200'
                      : 'bg-[#031b13] border-[#d6ae52]/15 text-[#b9cdbf] hover:border-[#d6ae52]/30'
                  }`}
                >
                  <img
                    src={d.artUrl}
                    alt={`Dia ${d.day}`}
                    className="w-10 h-10 rounded-lg object-cover border border-[#d6ae52]/30 shrink-0 bg-black/40"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between w-full">
                      <span className="text-[10px] font-mono font-bold text-[#d6ae52]">
                        DIA {d.day.toString().padStart(2, '0')}
                      </span>
                      {isApproved && (
                        <span className="text-[9px] font-mono text-emerald-400 flex items-center gap-0.5">
                          <Check size={10} /> OK
                        </span>
                      )}
                      {isRejected && (
                        <span className="text-[9px] font-mono text-rose-400 flex items-center gap-0.5">
                          <AlertTriangle size={10} /> REPR.
                        </span>
                      )}
                    </div>
                    <div className="text-xs font-serif truncate text-[#fff8e7]">
                      {d.title}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* WORKSPACE: LEFT PREVIEW + RIGHT CONTROLS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 overflow-y-auto flex-1 pr-1">
          
          {/* LEFT COLUMN: LIVE CANVAS PREVIEW & EXPORT (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center p-4 rounded-2xl bg-[#02150f] border border-[#d6ae52]/25 space-y-4">
            
            {/* Viewport Frame */}
            <div className="relative w-full flex items-center justify-center overflow-hidden rounded-2xl border border-[#d6ae52]/30 bg-black/60 p-2 shadow-inner">
              <canvas
                ref={canvasRef}
                className="max-h-[460px] max-w-full rounded-xl object-contain shadow-2xl border border-[#d6ae52]/20"
                style={{
                  aspectRatio: aspectRatio === '9:16' ? '9/16' : aspectRatio === '16:9' ? '16/9' : '1/1'
                }}
              />

              {/* Status Overlay Badge */}
              <div className="absolute top-4 left-4 flex flex-col gap-1.5 pointer-events-none">
                <span className="text-[10px] font-mono bg-[#031b13]/90 backdrop-blur-md border border-[#d6ae52]/40 text-[#e8d38f] px-2.5 py-1 rounded-full shadow flex items-center gap-1.5">
                  <Film size={11} className="text-[#d6ae52]" />
                  Dia {currentRecord.day}: {currentRecord.title}
                </span>

                {currentRecord.status === 'aprovado' && (
                  <span className="text-[10px] font-mono bg-emerald-950/90 border border-emerald-500/50 text-emerald-200 px-2.5 py-1 rounded-full shadow flex items-center gap-1">
                    <ShieldCheck size={12} className="text-emerald-400" />
                    VÍDEO APROVADO PARA A JORNADA
                  </span>
                )}

                {currentRecord.status === 'reprovado_automaticamente' && (
                  <span className="text-[10px] font-mono bg-rose-950/90 border border-rose-500/60 text-rose-200 px-2.5 py-1 rounded-full shadow flex items-center gap-1">
                    <AlertTriangle size={12} className="text-rose-400" />
                    REPROVADO AUTOMATICAMENTE
                  </span>
                )}
              </div>

              {/* Progress bar during generation */}
              {isRenderingVideo && (
                <div className="absolute inset-0 bg-[#02150f]/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 space-y-3 z-20">
                  <div className="w-12 h-12 rounded-full border-2 border-[#d6ae52]/30 border-t-[#d6ae52] animate-spin" />
                  <p className="text-sm font-serif text-[#fff8e7]">
                    Renderizando Animação Cinematográfica...
                  </p>
                  <p className="text-xs font-mono text-[#d6ae52]">
                    {renderProgress}% concluído • Gravando a 30 FPS
                  </p>
                  <div className="w-48 h-2 bg-[#052a1e] rounded-full overflow-hidden border border-[#d6ae52]/30">
                    <div
                      className="h-full bg-gradient-to-r from-[#d6ae52] to-[#e8d38f] transition-all duration-150"
                      style={{ width: `${renderProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Timeline Scrubber & Progressive Illumination Control */}
            <div className="w-full space-y-2 px-1 pt-1">
              <div className="flex items-center justify-between text-[11px] font-mono text-[#d6ae52]">
                <span className="flex items-center gap-1.5 font-bold">
                  <Sparkles size={12} className="text-[#e5c158]" />
                  <span>Evolução do Corpo:</span>
                  <strong className="text-[#fff8e7]">
                    {selectedStageStep !== null
                      ? `Etapa ${selectedStageStep} Fixada`
                      : `Ciclo Vivo (${Math.round((currentTimeSec / (currentRecord.durationSeconds || 10)) * 100)}%)`}
                  </strong>
                </span>
                <span className="text-[#b9cdbf]">
                  {currentTimeSec.toFixed(1)}s / {currentRecord.durationSeconds || 10}s
                </span>
              </div>

              {/* Slider de scrub em tempo real */}
              <input
                type="range"
                min={0}
                max={currentRecord.durationSeconds || 10}
                step={0.1}
                value={currentTimeSec}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setIsPlaying(false);
                  stopAudioTone();
                  setSelectedStageStep(null);
                  setCurrentTimeSec(val);
                  const duration = currentRecord.durationSeconds || 10;
                  startTimeRef.current = performance.now() - val * 1000;
                  requestAnimationFrame(renderFrame);
                }}
                className="w-full accent-[#d6ae52] bg-[#052a1e] h-2 rounded-lg cursor-pointer border border-[#d6ae52]/30"
                title="Arraste para ver a evolução da iluminação do corpo em qualquer segundo"
              />

              {/* 5 Botões de Salto Imediato das Etapas de Iluminação */}
              <div className="grid grid-cols-5 gap-1 pt-0.5">
                {[
                  { step: 1, label: '1. Inicial' },
                  { step: 2, label: '2. Luz Chega' },
                  { step: 3, label: '3. Desce' },
                  { step: 4, label: '4. Enraíza' },
                  { step: 5, label: '5. Integra' }
                ].map((s) => {
                  const isCurrent = selectedStageStep === s.step;
                  return (
                    <button
                      key={s.step}
                      type="button"
                      onClick={() => {
                        setIsPlaying(false);
                        stopAudioTone();
                        setSelectedStageStep(s.step);
                        const duration = currentRecord.durationSeconds || 10;
                        let tNorm = 0.10;
                        if (s.step === 2) tNorm = 0.30;
                        else if (s.step === 3) tNorm = 0.52;
                        else if (s.step === 4) tNorm = 0.74;
                        else if (s.step === 5) tNorm = 0.95;
                        setCurrentTimeSec(tNorm * duration);
                        startTimeRef.current = performance.now() - tNorm * duration * 1000;
                        requestAnimationFrame(renderFrame);
                      }}
                      className={`py-1 px-1 rounded-lg text-[10px] font-mono transition text-center cursor-pointer border truncate ${
                        isCurrent
                          ? 'bg-[#d6ae52] text-[#02150f] font-bold border-[#d6ae52] shadow-sm shadow-[#d6ae52]/30'
                          : 'bg-[#052a1e] text-[#b9cdbf] hover:text-[#fff8e7] border-[#d6ae52]/20'
                      }`}
                      title={`Ver a etapa ${s.step}: ${s.label}`}
                    >
                      {s.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Playback Controls & Indicators */}
            <div className="w-full flex items-center justify-between gap-2 px-1 pt-1 border-t border-[#d6ae52]/15">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedStageStep(null);
                    handleTogglePlay();
                  }}
                  disabled={isRenderingVideo}
                  className="px-3.5 py-2 rounded-xl bg-[#052a1e] hover:bg-[#073426] border border-[#d6ae52]/40 text-[#e8d38f] text-xs font-mono font-semibold flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50"
                  title="Reproduzir o ciclo completo da iluminação corporal ao longo do tempo"
                >
                  {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                  <span>{isPlaying ? 'Pausar' : 'Ciclo Contínuo'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setEnableAmbientTone(!enableAmbientTone);
                    if (!enableAmbientTone && isPlaying) startAudioTone();
                    else stopAudioTone();
                  }}
                  className={`p-2 rounded-xl border text-xs transition cursor-pointer ${
                    enableAmbientTone
                      ? 'bg-[#d6ae52]/20 border-[#d6ae52] text-[#e8d38f]'
                      : 'bg-[#052a1e] border-[#d6ae52]/20 text-[#b9cdbf] hover:text-[#fff8e7]'
                  }`}
                  title="Tom harmônico de 528Hz durante prévia"
                >
                  {enableAmbientTone ? <Volume2 size={15} /> : <VolumeX size={15} />}
                </button>
              </div>

              <button
                type="button"
                onClick={handleExportCurrentFrame}
                className="px-2.5 py-1.5 rounded-xl bg-[#052a1e] hover:bg-[#073426] border border-[#d6ae52]/25 text-[#cbd5e1] hover:text-[#fff8e7] text-[11px] font-mono flex items-center gap-1.5 transition cursor-pointer"
                title="Salvar a foto da etapa atual em alta definição (PNG)"
              >
                <Download size={12} className="text-[#d6ae52]" />
                <span>Foto (PNG)</span>
              </button>
            </div>

            {/* Actions: Gerar Vídeo / Download */}
            <div className="w-full grid grid-cols-2 gap-2 pt-2 border-t border-[#d6ae52]/15">
              <button
                type="button"
                onClick={handleGenerateVideo}
                disabled={isRenderingVideo}
                className="w-full bg-gradient-to-r from-[#d6ae52] to-[#c8a24a] hover:from-[#e8d38f] hover:to-[#d6ae52] text-[#02150f] font-bold py-2.5 px-3 rounded-xl text-xs font-mono flex items-center justify-center gap-2 transition cursor-pointer shadow-lg shadow-[#d6ae52]/15 disabled:opacity-50"
              >
                <Video size={15} />
                <span>{isRenderingVideo ? 'Gerando...' : 'Gravar Vídeo do Dia'}</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadVideo}
                disabled={!recordedVideoUrl}
                className="w-full bg-[#052a1e] hover:bg-[#073426] border border-[#d6ae52]/40 text-[#e8d38f] font-semibold py-2.5 px-3 rounded-xl text-xs font-mono flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Download size={14} />
                <span>Baixar Vídeo (.webm)</span>
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: BRIEFING FIELDS & AUTOMATIC REJECTION AUDITOR (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Header of the Day */}
            <div className="p-4 rounded-2xl bg-[#02150f] border border-[#d6ae52]/25 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-[#d6ae52] font-semibold">
                  Dia {currentRecord.day} • {currentRecord.cycle}
                </span>
                <span className="text-[11px] font-mono text-[#b9cdbf]">
                  Regra Principal: Animar sem redesenhar
                </span>
              </div>
              <h3 className="text-lg font-serif text-[#fff8e7]">
                {currentRecord.title}
              </h3>
              <p className="text-xs text-[#c8d8cc] leading-relaxed">
                <strong>Intenção:</strong> {currentRecord.intention}
              </p>
              <div className="pt-1.5 border-t border-[#d6ae52]/15 flex items-center gap-2 text-xs font-mono text-[#e8d38f]">
                <Layers size={13} className="text-[#d6ae52] shrink-0" />
                <span><strong>Região Corporal:</strong> {currentRecord.bodyRegionFocus}</span>
              </div>
            </div>

            {/* Imagem Aprovada do Dia + Upload opcional */}
            <div className="p-3.5 rounded-2xl bg-[#02150f] border border-[#d6ae52]/20 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-mono text-[#d6ae52] uppercase tracking-wider block font-semibold">
                  Imagem Aprovada do Dia (Referência Visual Definitiva)
                </label>
                <label className="text-[10px] font-mono text-[#e8d38f] hover:underline flex items-center gap-1 cursor-pointer">
                  <Upload size={11} />
                  <span>Carregar Nova Arte</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleArtUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="flex items-center gap-3">
                <img
                  src={currentRecord.artUrl}
                  alt={currentRecord.title}
                  className="w-16 h-16 rounded-xl object-cover border border-[#d6ae52]/40 shrink-0 shadow"
                />
                <div className="text-xs text-[#c8d8cc] leading-relaxed flex-1">
                  <p className="font-semibold text-[#fff8e7]">Arte Sagrada Oficial do Dia {currentRecord.day.toString().padStart(2, '0')}</p>
                  <p className="text-[11px] text-[#b9cdbf]">
                    Corpo neutro universal, composição e logo Everton Piceni mantidos intactos.
                  </p>
                  {currentRecord.mainAffirmation && (
                    <div className="mt-1.5 p-2 rounded-lg bg-[#052a1e] border border-[#d6ae52]/20 text-[11px]">
                      <span className="text-[#d6ae52] font-semibold block">{currentRecord.mainAffirmation}</span>
                      {currentRecord.subPhrase && (
                        <span className="text-[#c8d8cc] italic text-[10px] block mt-0.5">"{currentRecord.subPhrase}"</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* As 5 Etapas da Animação do Dia */}
            {currentRecord.stages && currentRecord.stages.length > 0 && (
              <div className="p-3.5 rounded-2xl bg-[#02150f] border border-[#d6ae52]/20 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-mono text-[#d6ae52] uppercase tracking-wider font-semibold flex items-center gap-1.5">
                    <Sparkles size={12} />
                    As 5 Etapas Energéticas da Arte (Progressão Contínua)
                  </label>
                  <span className="text-[10px] font-mono text-[#b9cdbf]">
                    {selectedStageStep !== null ? `Etapa ${selectedStageStep} Selecionada` : 'Ciclo Completo (1 a 5)'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-5 gap-1.5">
                  {currentRecord.stages.map((stage) => {
                    const isStepActive = selectedStageStep === stage.step;
                    return (
                      <button
                        key={stage.step}
                        type="button"
                        onClick={() => setSelectedStageStep(isStepActive ? null : stage.step)}
                        className={`p-2 rounded-xl text-left border transition cursor-pointer flex flex-col justify-between ${
                          isStepActive
                            ? 'bg-[#d6ae52]/20 border-[#d6ae52] text-[#fff8e7] ring-1 ring-[#d6ae52]'
                            : 'bg-[#031b13] border-[#d6ae52]/15 text-[#b9cdbf] hover:border-[#d6ae52]/30'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="text-[9px] font-mono font-bold text-[#d6ae52]">
                            ETAPA {stage.step}
                          </span>
                        </div>
                        <div className="text-[11px] font-semibold text-[#fff8e7] truncate mt-1">
                          {stage.title}
                        </div>
                        <div className="text-[10px] text-[#a4b8ab] line-clamp-2 mt-0.5 leading-tight">
                          {stage.description}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {selectedStageStep !== null && (
                  <div className="p-2.5 rounded-xl bg-[#052a1e] border border-[#d6ae52]/30 flex items-center justify-between text-xs">
                    <span className="text-[#e8d38f]">
                      Focando <strong>Etapa {selectedStageStep}: {currentRecord.stages[selectedStageStep - 1]?.title}</strong> — {currentRecord.stages[selectedStageStep - 1]?.description}
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedStageStep(null)}
                      className="text-[10px] font-mono text-[#b9cdbf] hover:text-[#fff8e7] underline ml-2 shrink-0 cursor-pointer"
                    >
                      Voltar ao Ciclo Completo
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Prompt de Animação do Briefing */}
            <div className="p-3.5 rounded-2xl bg-[#02150f] border border-[#d6ae52]/20 space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-mono text-[#d6ae52] uppercase tracking-wider font-semibold">
                  Prompt de Animação (Respiração, Luz Volumétrica & Câmera)
                </label>
                <span className="text-[10px] font-mono text-[#b9cdbf]">
                  Foco corporal do Dia {currentRecord.day}
                </span>
              </div>
              <textarea
                value={currentRecord.animationPrompt}
                onChange={(e) => updateCurrentRecord('animationPrompt', e.target.value)}
                rows={3}
                className="w-full bg-[#031b13] border border-[#d6ae52]/20 rounded-xl p-2.5 text-xs text-[#fff8e7] focus:border-[#d6ae52] outline-none font-sans leading-relaxed"
              />
            </div>

            {/* Negative Prompt Padrão Obrigatório */}
            <div className="p-3.5 rounded-2xl bg-[#02150f] border border-[#d6ae52]/20 space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-mono text-amber-400 uppercase tracking-wider font-semibold flex items-center gap-1.5">
                  <Lock size={12} />
                  Negative Prompt Padrão do Briefing (Escudo de Fidelidade)
                </label>
                <span className="text-[10px] font-mono text-slate-400">Imutável</span>
              </div>
              <textarea
                value={currentRecord.negativePrompt}
                onChange={(e) => updateCurrentRecord('negativePrompt', e.target.value)}
                rows={3}
                className="w-full bg-[#031b13]/60 border border-slate-800 rounded-xl p-2.5 text-[11px] text-slate-300 focus:border-amber-500 outline-none font-mono leading-relaxed"
              />
            </div>

            {/* Parâmetros do Briefing (Duração, Intensidade, Preservação, Câmera) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {/* Duração 8 a 12s */}
              <div className="p-2.5 rounded-xl bg-[#02150f] border border-[#d6ae52]/20 space-y-1">
                <label className="text-[10px] font-mono text-[#d6ae52] uppercase block">Duração Base</label>
                <select
                  value={currentRecord.durationSeconds}
                  onChange={(e) => updateCurrentRecord('durationSeconds', Number(e.target.value))}
                  className="w-full bg-[#031b13] border border-[#d6ae52]/25 rounded-lg px-2 py-1 text-xs text-[#fff8e7] outline-none"
                >
                  <option value={8}>8 Segundos</option>
                  <option value={10}>10 Segundos (Padrão)</option>
                  <option value={12}>12 Segundos</option>
                </select>
              </div>

              {/* Intensidade de Movimento */}
              <div className="p-2.5 rounded-xl bg-[#02150f] border border-[#d6ae52]/20 space-y-1">
                <label className="text-[10px] font-mono text-[#d6ae52] uppercase block">Intensidade Mov.</label>
                <select
                  value={currentRecord.motionStrength}
                  onChange={(e) => updateCurrentRecord('motionStrength', e.target.value as 'baixa' | 'media')}
                  className="w-full bg-[#031b13] border border-[#d6ae52]/25 rounded-lg px-2 py-1 text-xs text-[#fff8e7] outline-none"
                >
                  <option value="baixa">Baixa (Recomendada)</option>
                  <option value="media">Média</option>
                </select>
              </div>

              {/* Preservação da Imagem */}
              <div className="p-2.5 rounded-xl bg-[#02150f] border border-[#d6ae52]/20 space-y-1">
                <label className="text-[10px] font-mono text-[#d6ae52] uppercase block">Aderência Imagem</label>
                <select
                  value={currentRecord.imageAdherence}
                  onChange={(e) => updateCurrentRecord('imageAdherence', e.target.value as 'alta' | 'maxima')}
                  className="w-full bg-[#031b13] border border-[#d6ae52]/25 rounded-lg px-2 py-1 text-xs text-[#fff8e7] outline-none"
                >
                  <option value="maxima">Máxima</option>
                  <option value="alta">Alta</option>
                </select>
              </div>

              {/* Câmera */}
              <div className="p-2.5 rounded-xl bg-[#02150f] border border-[#d6ae52]/20 space-y-1">
                <label className="text-[10px] font-mono text-[#d6ae52] uppercase block">Movimento Câmera</label>
                <select
                  value={currentRecord.cameraMovement}
                  onChange={(e) => updateCurrentRecord('cameraMovement', e.target.value as 'push_in_ultralento' | 'estatica_cinematografica')}
                  className="w-full bg-[#031b13] border border-[#d6ae52]/25 rounded-lg px-2 py-1 text-xs text-[#fff8e7] outline-none"
                >
                  <option value="push_in_ultralento">Push-in Ultralento</option>
                  <option value="estatica_cinematografica">Estática Quase Parada</option>
                </select>
              </div>
            </div>

            {/* BOTÕES DE APROVAÇÃO, REFAZER E AUDITORIA DO BRIEFING */}
            <div className="p-4 rounded-2xl bg-[#02150f] border border-[#d6ae52]/30 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-mono font-bold text-[#fff8e7] uppercase flex items-center gap-1.5">
                    <ShieldCheck size={14} className="text-[#d6ae52]" />
                    Auditoria de Conformidade com o Briefing
                  </h4>
                  <p className="text-[11px] text-[#b9cdbf] mt-0.5">
                    Se houver tentativa de alterar corpo, textos, logo ou adicionar chakras, o vídeo é <strong>REPROVADO AUTOMATICAMENTE</strong>.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleResetCurrentDay}
                  className="px-2.5 py-1.5 rounded-lg border border-[#d6ae52]/20 text-[11px] font-mono text-[#b9cdbf] hover:text-[#fff8e7] bg-[#052a1e] flex items-center gap-1 cursor-pointer"
                  title="Restaurar parâmetros padrão do briefing para este dia"
                >
                  <RotateCcw size={11} />
                  <span>Refazer</span>
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleValidateAndApprove}
                  className={`flex-1 py-3 px-4 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-2 transition cursor-pointer shadow-lg ${
                    currentRecord.status === 'aprovado'
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/20'
                      : 'bg-gradient-to-r from-[#d6ae52] to-[#c8a24a] hover:from-[#e8d38f] hover:to-[#d6ae52] text-[#02150f] shadow-[#d6ae52]/20'
                  }`}
                >
                  <CheckCircle2 size={16} />
                  <span>
                    {currentRecord.status === 'aprovado'
                      ? 'Vídeo Aprovado no Briefing (Reavaliar)'
                      : 'Validar e Aprovar Vídeo para a Jornada'}
                  </span>
                </button>
              </div>

              {/* Status Banner */}
              {currentRecord.status === 'reprovado_automaticamente' && (
                <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/60 text-rose-200 text-xs space-y-1.5">
                  <div className="font-bold flex items-center gap-1.5 text-rose-300">
                    <AlertTriangle size={14} />
                    REPROVADO AUTOMATICAMENTE PELO CÓDIGO DO ESTÚDIO:
                  </div>
                  <p className="text-[11px] leading-relaxed text-rose-200">
                    {currentRecord.rejectionReason}
                  </p>
                  <p className="text-[10px] font-mono text-rose-300/80">
                    O vídeo violou os princípios do briefing e NÃO entrará na Jornada de 21 Dias.
                  </p>
                </div>
              )}

              {currentRecord.status === 'aprovado' && (
                <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-200 text-xs space-y-1">
                  <div className="font-bold flex items-center gap-1.5 text-emerald-300">
                    <ShieldCheck size={14} />
                    VÍDEO APROVADO COM SUCESSO:
                  </div>
                  <p className="text-[11px] text-emerald-200/90 leading-relaxed">
                    Corpo neutro preservado, sem chakras, logo oficial como assinatura discreta e movimento cinematográfico suave. Pronto para a Jornada.
                  </p>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-[#d6ae52]/20 text-[11px] font-mono text-[#b9cdbf] shrink-0">
          <div className="flex items-center gap-2">
            <span>Éverton Piceni — Terapias Holísticas e Bem-Estar</span>
            <span>•</span>
            <span className="text-[#d6ae52]">@terapiamorevida</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={selectedDayNum <= 1}
              onClick={() => setSelectedDayNum(prev => Math.max(1, prev - 1))}
              className="px-2.5 py-1 rounded-lg bg-[#052a1e] border border-[#d6ae52]/20 text-[#fff8e7] disabled:opacity-40 flex items-center gap-1 cursor-pointer"
            >
              <ChevronLeft size={13} /> Dia Anterior
            </button>

            <span className="text-[#e8d38f] font-bold">
              {selectedDayNum} / 21
            </span>

            <button
              type="button"
              disabled={selectedDayNum >= 21}
              onClick={() => setSelectedDayNum(prev => Math.min(21, prev + 1))}
              className="px-2.5 py-1 rounded-lg bg-[#052a1e] border border-[#d6ae52]/20 text-[#fff8e7] disabled:opacity-40 flex items-center gap-1 cursor-pointer"
            >
              Próximo Dia <ChevronRight size={13} />
            </button>
          </div>
        </div>

      </motion.div>
    </div>
  );
}
