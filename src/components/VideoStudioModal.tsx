/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Video, Play, Pause, Download, Volume2, VolumeX, Sparkles, X,
  Layers, Radio, RefreshCw, Eye, CheckCircle2, Sliders, Shield, Heart,
  Flame, Leaf, Crown, Share2, Upload, Music
} from 'lucide-react';

interface VideoStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AspectRatio = '9:16' | '16:9' | '1:1';
type VisualSourceType = 'presenca-reintegracao' | 'human-chakra' | 'custom';

interface PresetVideoTheme {
  id: string;
  name: string;
  category: string;
  visualSource: VisualSourceType;
  chakraIndex: number; // 0 for all, 1 to 7
  title: string;
  subtitle: string;
  affirmation: string;
  frequencyHz: number;
  freqLabel: string;
  durationSeconds: number;
  lightMode: 'heart-pulse' | 'all-chakras-ascend' | 'violet-flame' | 'golden-shield';
  bgTrack: 'forest' | 'silence' | 'rain';
}

const PRESET_THEMES: PresetVideoTheme[] = [
  {
    id: 'reintegracao-presenca',
    name: 'Vinheta 1 • Reintegração da Vida (Jornada de Presença)',
    category: 'Arte Sagrada Oficial',
    visualSource: 'presenca-reintegracao',
    chakraIndex: 4, // Cardíaco / Presença
    title: 'Reintegração da Vida',
    subtitle: 'Jornada de Presença • Éverton Piceni',
    affirmation: 'Eu respiro a vida. Eu acolho minha presença. Eu volto para mim.',
    frequencyHz: 528,
    freqLabel: '528 Hz • Frequência de Transformação & Presença',
    durationSeconds: 20,
    lightMode: 'heart-pulse',
    bgTrack: 'forest',
  },
  {
    id: 'voltar-para-mim',
    name: 'Vinheta 2 • Voltar para Mim (Acolhimento)',
    category: 'Vinheta Curta',
    visualSource: 'presenca-reintegracao',
    chakraIndex: 4, // Cardíaco
    title: 'Voltar para Mim',
    subtitle: 'Um lugar para voltar para si',
    affirmation: 'Como você está, de verdade? Respire e volte para você.',
    frequencyHz: 432,
    freqLabel: '432 Hz • Paz Profunda & Presença',
    durationSeconds: 15,
    lightMode: 'heart-pulse',
    bgTrack: 'forest',
  },
  {
    id: 'reintegracao-21',
    name: 'Vinheta 3 • 21 Dias para Voltar para Mim',
    category: 'Jornada',
    visualSource: 'human-chakra',
    chakraIndex: 0, // Todos os chakras em ascensão
    title: '21 Dias para Voltar para Mim',
    subtitle: 'Reintegração da Vida • Éverton Piceni',
    affirmation: 'Eu acolho meu momento. Eu confio no meu caminho. Eu escolho evoluir.',
    frequencyHz: 528,
    freqLabel: '528 Hz • Frequência de Transformação & Cura',
    durationSeconds: 30,
    lightMode: 'all-chakras-ascend',
    bgTrack: 'forest',
  },
  {
    id: 'protecao-sao-miguel',
    name: 'Vinheta 4 • Proteção e Presença (São Miguel)',
    category: 'Ancoragem',
    visualSource: 'human-chakra',
    chakraIndex: 5, // Laríngeo e Espada
    title: 'Proteção & Presença',
    subtitle: 'Raio Azul Safira • Arcanjo Miguel',
    affirmation: 'Eu libero o que não me pertence. Eu permaneço na minha luz.',
    frequencyHz: 741,
    freqLabel: '741 Hz • Clareza, Limpeza & Desobstrução',
    durationSeconds: 20,
    lightMode: 'golden-shield',
    bgTrack: 'forest',
  },
  {
    id: 'transmutar-chama-violeta',
    name: 'Vinheta 5 • Transmutar e Recomeçar (Chama Violeta)',
    category: 'Transmutação',
    visualSource: 'human-chakra',
    chakraIndex: 6, // Frontal
    title: 'Transmutar e Recomeçar',
    subtitle: 'O Fogo Sagrado da Transformação',
    affirmation: 'O passado é aprendizado. O agora é espaço. Eu me permito renascer.',
    frequencyHz: 396,
    freqLabel: '396 Hz • Liberação de Culpa e Medo',
    durationSeconds: 20,
    lightMode: 'violet-flame',
    bgTrack: 'forest',
  },
  {
    id: 'raio-de-ouro',
    name: 'Vinheta 6 • Raio de Ouro (Arcanjo Rafael)',
    category: 'Regeneração',
    visualSource: 'presenca-reintegracao',
    chakraIndex: 3, // Plexo Solar / Cardíaco
    title: 'Raio de Ouro da Cura',
    subtitle: 'Regeneração e Equilíbrio Sutil',
    affirmation: 'Eu acolho meu corpo. Eu respeito meu tempo. A luz me restaura.',
    frequencyHz: 639,
    freqLabel: '639 Hz • Harmonia Celular e Conexão',
    durationSeconds: 30,
    lightMode: 'all-chakras-ascend',
    bgTrack: 'forest',
  },
];

const CHAKRA_COORDINATES: Record<number, { yRatio: number; color: string; secondary: string; name: string }> = {
  1: { yRatio: 0.78, color: '#e53e3e', secondary: '#feb2b2', name: 'Básico' },
  2: { yRatio: 0.68, color: '#dd6b20', secondary: '#fbd38d', name: 'Sacral' },
  3: { yRatio: 0.58, color: '#d69e2e', secondary: '#faf089', name: 'Plexo Solar' },
  4: { yRatio: 0.47, color: '#38a169', secondary: '#9ae6b4', name: 'Cardíaco' },
  5: { yRatio: 0.36, color: '#3182ce', secondary: '#90cdf4', name: 'Laríngeo' },
  6: { yRatio: 0.25, color: '#4c51bf', secondary: '#b794f4', name: 'Frontal' },
  7: { yRatio: 0.15, color: '#805ad5', secondary: '#e9d8fd', name: 'Coronário' },
};

export default function VideoStudioModal({ isOpen, onClose }: VideoStudioModalProps) {
  const [selectedPreset, setSelectedPreset] = useState<string>('reintegracao-presenca');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('9:16');
  const [selectedVisual, setSelectedVisual] = useState<VisualSourceType>('presenca-reintegracao');
  const [customTitle, setCustomTitle] = useState('Reintegração da Vida');
  const [customSubtitle, setCustomSubtitle] = useState('Jornada de Presença • Éverton Piceni');
  const [customAffirmation, setCustomAffirmation] = useState('Eu respiro a vida. Eu acolho minha presença. Eu volto para mim.');
  const [frequencyHz, setFrequencyHz] = useState<number>(528);
  const [targetChakra, setTargetChakra] = useState<number>(4); // 0 = all, 4 = cardíaco
  const [durationSeconds, setDurationSeconds] = useState<number>(20);
  const [lightMode, setLightMode] = useState<'heart-pulse' | 'all-chakras-ascend' | 'violet-flame' | 'golden-shield'>('heart-pulse');
  const [enableAudio, setEnableAudio] = useState(true);
  const [userVoiceFile, setUserVoiceFile] = useState<File | null>(null);
  const [customImageFile, setCustomImageFile] = useState<File | null>(null);

  // Studio Player & Recording state
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordProgress, setRecordProgress] = useState(0);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState<string | null>(null);

  // Canvas and Animation References
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  // Web Audio Context & Nodes
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const audioDestRef = useRef<MediaStreamAudioDestinationNode | null>(null);
  const userAudioSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const userAudioBufferRef = useRef<AudioBuffer | null>(null);

  // Preloaded Images
  const humanImgRef = useRef<HTMLImageElement | null>(null);
  const reintegracaoImgRef = useRef<HTMLImageElement | null>(null);
  const customImgRef = useRef<HTMLImageElement | null>(null);
  const bgForestImgRef = useRef<HTMLImageElement | null>(null);
  const emblemLogoImgRef = useRef<HTMLImageElement | null>(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  // Load Preset
  const applyPreset = (presetId: string) => {
    const p = PRESET_THEMES.find(t => t.id === presetId);
    if (!p) return;
    setSelectedPreset(presetId);
    setSelectedVisual(p.visualSource);
    setCustomTitle(p.title);
    setCustomSubtitle(p.subtitle);
    setCustomAffirmation(p.affirmation);
    setFrequencyHz(p.frequencyHz);
    setTargetChakra(p.chakraIndex);
    setDurationSeconds(p.durationSeconds);
    setLightMode(p.lightMode);
    setRecordedVideoUrl(null);
  };

  // Preload Images
  useEffect(() => {
    let loadedCount = 0;
    const checkAll = () => {
      loadedCount++;
      if (loadedCount >= 4) {
        setImagesLoaded(true);
      }
    };

    // ChatGPT Artwork (Reintegração da Vida: Jornada de Presença)
    const reintegra = new Image();
    reintegra.crossOrigin = 'anonymous';
    reintegra.src = '/brand/reintegracao-presenca-arte.png';
    reintegra.onload = checkAll;
    reintegra.onerror = checkAll;
    reintegracaoImgRef.current = reintegra;

    // Classic Human Chakra Model
    const human = new Image();
    human.crossOrigin = 'anonymous';
    human.src = '/brand/human-chakra-model.jpg';
    human.onload = checkAll;
    human.onerror = checkAll;
    humanImgRef.current = human;

    // Forest Background
    const forest = new Image();
    forest.crossOrigin = 'anonymous';
    forest.src = '/brand/forest-app-background.png';
    forest.onload = checkAll;
    forest.onerror = checkAll;
    bgForestImgRef.current = forest;

    // Emblem Logo
    const emblem = new Image();
    emblem.crossOrigin = 'anonymous';
    emblem.src = '/app-icon.jpg';
    emblem.onload = checkAll;
    emblem.onerror = checkAll;
    emblemLogoImgRef.current = emblem;
  }, []);

  // Handle custom image upload
  const handleCustomImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCustomImageFile(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        customImgRef.current = img;
        setSelectedVisual('custom');
        setRecordedVideoUrl(null);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Handle custom voice upload
  const handleVoiceUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUserVoiceFile(file);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const tempCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const decoded = await tempCtx.decodeAudioData(arrayBuffer);
      userAudioBufferRef.current = decoded;
    } catch (err) {
      console.error('Erro ao carregar áudio de voz:', err);
    }
  };

  // Dimensions based on aspect ratio
  const getCanvasDimensions = () => {
    switch (aspectRatio) {
      case '9:16':
        return { width: 720, height: 1280 };
      case '16:9':
        return { width: 1280, height: 720 };
      case '1:1':
      default:
        return { width: 1080, height: 1080 };
    }
  };

  // Setup Audio Context & Tone
  const startAudio = () => {
    if (!enableAudio) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // Media stream destination for recording
      if (!audioDestRef.current) {
        audioDestRef.current = ctx.createMediaStreamDestination();
      }

      // Solfeggio Sine Oscillator
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequencyHz, ctx.currentTime);

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 1.5);

      osc.connect(gain);
      gain.connect(ctx.destination);
      gain.connect(audioDestRef.current);

      osc.start();
      oscRef.current = osc;
      gainRef.current = gain;

      // User Voice Buffer (if attached)
      if (userAudioBufferRef.current) {
        const source = ctx.createBufferSource();
        const voiceGain = ctx.createGain();
        source.buffer = userAudioBufferRef.current;
        voiceGain.gain.setValueAtTime(0.85, ctx.currentTime);
        source.connect(voiceGain);
        voiceGain.connect(ctx.destination);
        voiceGain.connect(audioDestRef.current);
        source.start();
        userAudioSourceRef.current = source;
      }
    } catch (e) {
      console.warn('Áudio não iniciado no estúdio:', e);
    }
  };

  const stopAudio = () => {
    try {
      if (gainRef.current && audioCtxRef.current) {
        gainRef.current.gain.exponentialRampToValueAtTime(0.0001, audioCtxRef.current.currentTime + 0.3);
      }
      setTimeout(() => {
        if (oscRef.current) {
          try { oscRef.current.stop(); } catch (_) {}
          oscRef.current.disconnect();
          oscRef.current = null;
        }
        if (userAudioSourceRef.current) {
          try { userAudioSourceRef.current.stop(); } catch (_) {}
          userAudioSourceRef.current.disconnect();
          userAudioSourceRef.current = null;
        }
      }, 350);
    } catch (e) {
      console.warn(e);
    }
  };

  // Main Draw Frame Loop
  const drawFrame = (ctx: CanvasRenderingContext2D, elapsedSec: number) => {
    const { width, height } = getCanvasDimensions();

    // 1. Clear & Background
    ctx.clearRect(0, 0, width, height);

    // Deep Forest background gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
    bgGrad.addColorStop(0, '#02150f');
    bgGrad.addColorStop(0.5, '#031b13');
    bgGrad.addColorStop(1, '#010d09');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Draw Forest texture if loaded
    if (bgForestImgRef.current && bgForestImgRef.current.complete) {
      ctx.save();
      ctx.globalAlpha = 0.45;
      ctx.drawImage(bgForestImgRef.current, 0, 0, width, height);
      ctx.restore();
    }

    // 2. Center Visual (Reintegração da Vida / Human Chakra Model / Custom)
    const breathPhase = Math.sin((elapsedSec * Math.PI) / 3); // 6-second breathing loop
    const breathScale = 1 + breathPhase * 0.12;

    if (selectedVisual === 'presenca-reintegracao' || (selectedVisual === 'custom' && customImgRef.current)) {
      const activeImg = selectedVisual === 'custom' && customImgRef.current ? customImgRef.current : reintegracaoImgRef.current;
      if (activeImg && activeImg.complete) {
        ctx.save();

        // Calculate sizing with subtle breathing scale
        const breathZoom = 1 + Math.sin((elapsedSec * Math.PI) / 3) * 0.025;
        let imgW = width * 0.88;
        let imgH = imgW * (activeImg.height / activeImg.width);

        if (aspectRatio === '16:9') {
          imgH = height * 0.86;
          imgW = imgH * (activeImg.width / activeImg.height);
        } else if (aspectRatio === '1:1') {
          imgW = width * 0.82;
          imgH = imgW * (activeImg.height / activeImg.width);
        }

        const imgX = (width - imgW * breathZoom) / 2;
        const imgY = (height - imgH * breathZoom) / 2 + (aspectRatio === '9:16' ? -10 : 0);

        // Draw image with rounded clip & soft vignette
        ctx.save();
        ctx.beginPath();
        const cornerR = 24;
        ctx.roundRect(imgX, imgY, imgW * breathZoom, imgH * breathZoom, cornerR);
        ctx.clip();
        ctx.globalAlpha = 0.95;
        ctx.drawImage(activeImg, imgX, imgY, imgW * breathZoom, imgH * breathZoom);
        ctx.restore();

        // Subtle soft vignette border around artwork
        const borderGrad = ctx.createRadialGradient(
          width / 2,
          imgY + (imgH * breathZoom) / 2,
          (imgW * breathZoom) * 0.35,
          width / 2,
          imgY + (imgH * breathZoom) / 2,
          (imgW * breathZoom) * 0.58
        );
        borderGrad.addColorStop(0, 'rgba(2, 21, 15, 0)');
        borderGrad.addColorStop(0.8, 'rgba(2, 21, 15, 0.45)');
        borderGrad.addColorStop(1, '#02150f');
        ctx.fillStyle = borderGrad;
        ctx.fillRect(imgX - 10, imgY - 10, imgW * breathZoom + 20, imgH * breathZoom + 20);

        // Dynamic Sacred Light Glow around heart center
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        const heartCX = width / 2;
        const heartCY = imgY + imgH * 0.48;

        // Radiant Golden Pulse
        const auraRad = (width * 0.22) * (1 + breathPhase * 0.15);
        const auraGrad = ctx.createRadialGradient(heartCX, heartCY, 5, heartCX, heartCY, auraRad);
        auraGrad.addColorStop(0, 'rgba(255, 250, 230, 0.85)');
        auraGrad.addColorStop(0.25, 'rgba(232, 211, 143, 0.55)');
        auraGrad.addColorStop(0.65, 'rgba(214, 174, 82, 0.22)');
        auraGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = auraGrad;
        ctx.beginPath();
        ctx.arc(heartCX, heartCY, auraRad, 0, Math.PI * 2);
        ctx.fill();

        // Concentric sacred geometry golden rings
        ctx.strokeStyle = 'rgba(232, 211, 143, 0.35)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 6]);
        ctx.beginPath();
        ctx.arc(heartCX, heartCY, auraRad * 0.65, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = 'rgba(214, 174, 82, 0.25)';
        ctx.setLineDash([2, 8]);
        ctx.beginPath();
        ctx.arc(heartCX, heartCY, auraRad * 1.15, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);

        // Special Light Modes
        if (lightMode === 'violet-flame') {
          const violetGlow = ctx.createRadialGradient(heartCX, heartCY, 10, heartCX, heartCY, width * 0.38);
          violetGlow.addColorStop(0, 'rgba(195, 130, 255, 0.55)');
          violetGlow.addColorStop(0.5, 'rgba(120, 60, 220, 0.25)');
          violetGlow.addColorStop(1, 'transparent');
          ctx.fillStyle = violetGlow;
          ctx.beginPath();
          ctx.arc(heartCX, heartCY, width * 0.38, 0, Math.PI * 2);
          ctx.fill();
        } else if (lightMode === 'golden-shield') {
          const shieldGlow = ctx.createRadialGradient(heartCX, heartCY, 20, heartCX, heartCY, width * 0.44);
          shieldGlow.addColorStop(0, 'rgba(240, 220, 150, 0.45)');
          shieldGlow.addColorStop(0.6, 'rgba(40, 120, 220, 0.25)');
          shieldGlow.addColorStop(1, 'transparent');
          ctx.fillStyle = shieldGlow;
          ctx.beginPath();
          ctx.arc(heartCX, heartCY, width * 0.44, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
        ctx.restore();
      }
    } else if (humanImgRef.current && humanImgRef.current.complete) {
      // Classic Human Chakra Model
      ctx.save();
      let imgW = width * 0.75;
      let imgH = imgW * 1.35;
      if (aspectRatio === '16:9') {
        imgH = height * 0.95;
        imgW = imgH / 1.35;
      }
      const imgX = (width - imgW) / 2;
      const imgY = (height - imgH) / 2 + (aspectRatio === '9:16' ? 20 : 0);

      // Base body layer in subtle deep contrast
      ctx.globalAlpha = 0.88;
      ctx.drawImage(humanImgRef.current, imgX, imgY, imgW, imgH);
      ctx.restore();

      // Dynamic Light Evolution (Golden Sacred Glow & Chakras)
      ctx.save();
      ctx.globalCompositeOperation = 'screen';

      // Spinal column light alignment
      const colGrad = ctx.createLinearGradient(width / 2, imgY + imgH * 0.15, width / 2, imgY + imgH * 0.82);
      colGrad.addColorStop(0, 'rgba(232, 211, 143, 0.45)');
      colGrad.addColorStop(0.5, 'rgba(214, 174, 82, 0.35)');
      colGrad.addColorStop(1, 'rgba(180, 130, 40, 0.25)');
      ctx.strokeStyle = colGrad;
      ctx.lineWidth = 4 + breathPhase * 2;
      ctx.beginPath();
      ctx.moveTo(width / 2, imgY + imgH * 0.15);
      ctx.lineTo(width / 2, imgY + imgH * 0.82);
      ctx.stroke();

      // Render Chakras / Centers
      const chakrasToRender = targetChakra === 0 ? [1, 2, 3, 4, 5, 6, 7] : [targetChakra];

      chakrasToRender.forEach((cNum) => {
        const cData = CHAKRA_COORDINATES[cNum];
        if (!cData) return;

        const cy = imgY + imgH * cData.yRatio;
        const cx = width / 2;

        const isActiveChakra = targetChakra === 0 || targetChakra === cNum;
        const radius = (18 + breathPhase * 6) * (isActiveChakra ? 1.4 : 0.9);

        // Radial gold/chakra aura
        const aura = ctx.createRadialGradient(cx, cy, 2, cx, cy, radius * 3.5 * breathScale);
        aura.addColorStop(0, '#fff9e6');
        aura.addColorStop(0.25, cData.secondary + 'cc');
        aura.addColorStop(0.6, 'rgba(214, 174, 82, 0.4)');
        aura.addColorStop(1, 'transparent');

        ctx.fillStyle = aura;
        ctx.beginPath();
        ctx.arc(cx, cy, radius * 3.5 * breathScale, 0, Math.PI * 2);
        ctx.fill();

        // Core jewel
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(cx, cy, 5 + breathPhase * 1.5, 0, Math.PI * 2);
        ctx.fill();
      });

      // Special Light Mode Effects
      if (lightMode === 'violet-flame') {
        const violetGlow = ctx.createRadialGradient(width / 2, imgY + imgH * 0.35, 10, width / 2, imgY + imgH * 0.35, imgW * 0.55);
        violetGlow.addColorStop(0, 'rgba(175, 110, 255, 0.45)');
        violetGlow.addColorStop(0.5, 'rgba(120, 60, 220, 0.2)');
        violetGlow.addColorStop(1, 'transparent');
        ctx.fillStyle = violetGlow;
        ctx.beginPath();
        ctx.arc(width / 2, imgY + imgH * 0.35, imgW * 0.55, 0, Math.PI * 2);
        ctx.fill();
      } else if (lightMode === 'golden-shield') {
        const shieldGlow = ctx.createRadialGradient(width / 2, height / 2, 40, width / 2, height / 2, width * 0.45);
        shieldGlow.addColorStop(0, 'rgba(232, 211, 143, 0.35)');
        shieldGlow.addColorStop(0.6, 'rgba(40, 110, 200, 0.22)');
        shieldGlow.addColorStop(1, 'transparent');
        ctx.fillStyle = shieldGlow;
        ctx.beginPath();
        ctx.arc(width / 2, height / 2, width * 0.45, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }

    // 4. Subtle Ambient Photons / Starlight Floating
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    for (let i = 0; i < 28; i++) {
      const seed = (i * 9301 + 49297) % 233280;
      const px = ((seed / 233280) * width + Math.sin(elapsedSec * 0.5 + i) * 30) % width;
      const py = (height - ((seed % 1000) / 1000) * height - elapsedSec * 35) % height;
      const yNormalized = py < 0 ? py + height : py;
      const particleAlpha = 0.2 + 0.4 * Math.sin(elapsedSec * 2 + i);

      ctx.fillStyle = `rgba(232, 211, 143, ${particleAlpha})`;
      ctx.beginPath();
      ctx.arc(px, yNormalized, 1.8 + (i % 3) * 0.8, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // 5. Typography & Therapeutic Presentation
    ctx.save();
    ctx.textAlign = 'center';

    // Top Header Badge
    ctx.fillStyle = 'rgba(214, 174, 82, 0.85)';
    ctx.font = '600 13px Inter, sans-serif';
    ctx.letterSpacing = '3px';
    const topBadgeY = aspectRatio === '9:16' ? 95 : 60;
    ctx.fillText('PROTOCOLO DA TRANSFORMAÇÃO', width / 2, topBadgeY);

    // Main Title (Cormorant Garamond Display Style)
    ctx.fillStyle = '#fffdfa';
    ctx.font = `600 ${aspectRatio === '9:16' ? '32px' : '36px'} "Cormorant Garamond", serif`;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.75)';
    ctx.shadowBlur = 12;
    ctx.fillText(customTitle, width / 2, topBadgeY + 44);

    // Subtitle
    ctx.fillStyle = 'rgba(232, 211, 143, 0.9)';
    ctx.font = '400 15px Inter, sans-serif';
    ctx.shadowBlur = 4;
    ctx.fillText(customSubtitle, width / 2, topBadgeY + 74);

    // Frequency Pill Indicator
    const freqY = topBadgeY + 104;
    ctx.fillStyle = 'rgba(2, 24, 16, 0.7)';
    ctx.strokeStyle = 'rgba(214, 174, 82, 0.35)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(width / 2 - 110, freqY - 14, 220, 26, 13);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#e8d38f';
    ctx.font = '500 12px "JetBrains Mono", monospace';
    ctx.fillText(`${frequencyHz} Hz • Frequência Vibracional`, width / 2, freqY + 3);

    // Bottom Affirmation / Decree (Centered, elegant)
    const bottomTextY = height - (aspectRatio === '9:16' ? 140 : 85);
    ctx.fillStyle = 'rgba(255, 248, 230, 0.95)';
    ctx.font = 'italic 500 19px "Cormorant Garamond", serif';
    ctx.shadowBlur = 8;
    ctx.fillText(`"${customAffirmation}"`, width / 2, bottomTextY);

    // Bottom Branding Sign-off (Logo discreto, congelado, sem agressividade)
    const footerY = height - (aspectRatio === '9:16' ? 65 : 35);
    ctx.fillStyle = 'rgba(214, 174, 82, 0.65)';
    ctx.font = '400 12px Inter, sans-serif';
    ctx.fillText('Éverton Rodrigo Piceni • Terapias Holísticas & Bem-Estar', width / 2, footerY);

    ctx.fillStyle = 'rgba(180, 205, 190, 0.55)';
    ctx.font = '400 11px Inter, sans-serif';
    ctx.fillText('@terapiamorevida • Reintegração da Vida', width / 2, footerY + 18);

    // Logo sutil na quina ou centralizado discreto
    if (emblemLogoImgRef.current && emblemLogoImgRef.current.complete) {
      ctx.globalAlpha = 0.22;
      const logoSize = 28;
      ctx.drawImage(emblemLogoImgRef.current, width / 2 - logoSize / 2, footerY - 42, logoSize, logoSize);
    }

    ctx.restore();
  };

  // Preview Render Loop
  useEffect(() => {
    if (!isOpen) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let localElapsed = 0;
    let lastTime = performance.now();

    const loop = (now: number) => {
      const delta = (now - lastTime) / 1000;
      lastTime = now;

      if (isPlaying || isRecording) {
        localElapsed += delta;
      }

      drawFrame(ctx, localElapsed);
      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isOpen, isPlaying, isRecording, aspectRatio, selectedVisual, customTitle, customSubtitle, customAffirmation, frequencyHz, targetChakra, lightMode, imagesLoaded]);

  // Toggle Live Preview
  const handleTogglePreview = () => {
    if (isPlaying) {
      setIsPlaying(false);
      stopAudio();
    } else {
      setIsPlaying(true);
      startAudio();
    }
  };

  // Record & Export Video (.webm / .mp4 compatible)
  const handleStartExport = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsRecording(true);
    setIsPlaying(false);
    setRecordProgress(0);
    setRecordedVideoUrl(null);
    recordedChunksRef.current = [];

    // Initialize audio pipeline for stream
    startAudio();

    const { width, height } = getCanvasDimensions();
    canvas.width = width;
    canvas.height = height;

    const canvasStream = canvas.captureStream(30);

    // Merge Audio Destination Track if available
    let combinedStream: MediaStream = canvasStream;
    if (audioDestRef.current && audioDestRef.current.stream.getAudioTracks().length > 0) {
      combinedStream = new MediaStream([
        ...canvasStream.getVideoTracks(),
        ...audioDestRef.current.stream.getAudioTracks(),
      ]);
    }

    // Supported mime types
    const mimeTypes = [
      'video/mp4;codecs=avc1,mp4a.40.2',
      'video/webm;codecs=vp9,opus',
      'video/webm;codecs=vp8,opus',
      'video/webm'
    ];
    let selectedMime = mimeTypes.find(m => MediaRecorder.isTypeSupported(m)) || 'video/webm';

    try {
      const recorder = new MediaRecorder(combinedStream, {
        mimeType: selectedMime,
        videoBitsPerSecond: 3_500_000,
      });

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          recordedChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: selectedMime });
        const url = URL.createObjectURL(blob);
        setRecordedVideoUrl(url);
        setIsRecording(false);
        stopAudio();
      };

      recorder.start(250);
      mediaRecorderRef.current = recorder;

      // Progress interval
      const totalMs = durationSeconds * 1000;
      const intervalMs = 100;
      let recordedMs = 0;

      const progressInterval = setInterval(() => {
        recordedMs += intervalMs;
        const p = Math.min(100, Math.round((recordedMs / totalMs) * 100));
        setRecordProgress(p);

        if (recordedMs >= totalMs) {
          clearInterval(progressInterval);
          if (recorder.state === 'recording') {
            recorder.stop();
          }
        }
      }, intervalMs);
    } catch (err) {
      console.error('Falha ao iniciar gravação de vídeo:', err);
      setIsRecording(false);
      stopAudio();
    }
  };

  if (!isOpen) return null;

  const canvasDims = getCanvasDimensions();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="relative w-full max-w-5xl rounded-[1.75rem] border border-[#d6ae52]/30 bg-[#031b13] p-5 sm:p-7 shadow-[0_30px_90px_rgba(0,0,0,0.85)] text-slate-100 max-h-[92vh] flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#d6ae52]/20 pb-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#d6ae52]/15 border border-[#d6ae52]/30 text-[#e8d38f]">
              <Video size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#d6ae52] bg-[#d6ae52]/10 border border-[#d6ae52]/25 px-2.5 py-0.5 rounded-full font-bold">
                  Estúdio de Vinhetas & Meditações
                </span>
                <span className="text-[10px] font-mono text-[#c8d8cc]">Base Oficial Aprovada</span>
              </div>
              <h2 className="text-lg sm:text-2xl font-display font-semibold text-[#fffdfa] mt-0.5">
                Gerador de Vídeos em Alta Definição
              </h2>
            </div>
          </div>

          <button
            onClick={() => {
              setIsPlaying(false);
              stopAudio();
              onClose();
            }}
            className="p-2 text-slate-400 hover:text-white bg-slate-900/60 hover:bg-slate-800 rounded-xl transition cursor-pointer border-none"
            aria-label="Fechar estúdio"
          >
            <X size={20} />
          </button>
        </div>

        {/* Studio Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 overflow-y-auto pr-1">
          {/* Left / Center: Live Canvas Preview */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center bg-[#010e09] border border-[#d6ae52]/20 rounded-2xl p-4 relative min-h-[420px]">
            <div
              className="relative shadow-[0_15px_50px_rgba(0,0,0,0.8)] rounded-xl overflow-hidden border border-[#d6ae52]/30 max-h-[440px] flex items-center justify-center"
              style={{
                aspectRatio: aspectRatio === '9:16' ? '9/16' : aspectRatio === '16:9' ? '16/9' : '1/1',
              }}
            >
              <canvas
                ref={canvasRef}
                width={canvasDims.width}
                height={canvasDims.height}
                className="w-full h-full object-contain"
              />

              {isRecording && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center">
                  <div className="w-16 h-16 rounded-full border-4 border-[#d6ae52] border-t-transparent animate-spin mb-4" />
                  <p className="font-display text-xl text-[#fffdfa] font-semibold">Renderizando Vídeo HD...</p>
                  <p className="text-xs text-[#d6ae52] font-mono mt-1">{recordProgress}% concluído</p>
                  <div className="w-48 h-2 bg-black/40 rounded-full mt-3 overflow-hidden border border-[#d6ae52]/30">
                    <div
                      className="h-full bg-gradient-to-r from-[#c8a24a] to-[#e8d38f] transition-all duration-200"
                      style={{ width: `${recordProgress}%` }}
                    />
                  </div>
                  <span className="text-[11px] text-slate-400 mt-3">Gravando vídeo + frequências de cura em tempo real</span>
                </div>
              )}
            </div>

            {/* Live Controls */}
            <div className="flex items-center justify-between w-full mt-4 px-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleTogglePreview}
                  disabled={isRecording}
                  className="px-4 py-2 rounded-xl bg-[#d6ae52]/15 hover:bg-[#d6ae52]/25 border border-[#d6ae52]/40 text-[#fffdfa] text-xs font-semibold flex items-center gap-2 transition cursor-pointer"
                >
                  {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                  <span>{isPlaying ? 'Pausar Visualização' : 'Testar Animação Ao Vivo'}</span>
                </button>

                <button
                  onClick={() => setEnableAudio(!enableAudio)}
                  className={`p-2 rounded-xl border text-xs transition cursor-pointer ${
                    enableAudio
                      ? 'bg-[#052a1e] border-[#d6ae52]/40 text-[#e8d38f]'
                      : 'bg-slate-900 border-slate-700 text-slate-400'
                  }`}
                  title="Ativar/Desativar Frequência de Áudio"
                >
                  {enableAudio ? <Volume2 size={16} /> : <VolumeX size={16} />}
                </button>
              </div>

              {/* Record / Download Button */}
              {recordedVideoUrl ? (
                <a
                  href={recordedVideoUrl}
                  download={`vinheta-${selectedPreset}-${aspectRatio.replace(':', '-')}.webm`}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#c8a24a] to-[#e8d38f] text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-[#d6ae52]/20 hover:scale-102 transition"
                >
                  <Download size={16} />
                  <span>Baixar Vídeo Concluído</span>
                </a>
              ) : (
                <button
                  onClick={handleStartExport}
                  disabled={isRecording}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#c8a24a] to-[#d6ae52] hover:from-[#e8d38f] hover:to-[#c8a24a] text-slate-950 font-bold text-xs tracking-wide uppercase flex items-center gap-2 transition cursor-pointer shadow-md shadow-[#d6ae52]/15"
                >
                  <Sparkles size={16} />
                  <span>Gerar e Exportar Vídeo</span>
                </button>
              )}
            </div>
          </div>

          {/* Right: Customization & Presets Sidebar */}
          <div className="lg:col-span-5 space-y-4">
            {/* Format Picker */}
            <div className="p-4 rounded-2xl bg-[#02150f] border border-[#d6ae52]/20 space-y-2">
              <label className="text-[11px] font-mono text-[#d6ae52] uppercase tracking-wider block">
                Formato / Proporção do Vídeo
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: '9:16', label: 'Vertical (9:16)', desc: 'Reels / Stories' },
                  { id: '16:9', label: 'Horizontal (16:9)', desc: 'YouTube' },
                  { id: '1:1', label: 'Quadrado (1:1)', desc: 'Feed' },
                ].map((fmt) => (
                  <button
                    key={fmt.id}
                    onClick={() => {
                      setAspectRatio(fmt.id as AspectRatio);
                      setRecordedVideoUrl(null);
                    }}
                    className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                      aspectRatio === fmt.id
                        ? 'border-[#d6ae52] bg-[#d6ae52]/15 text-[#fffdfa]'
                        : 'border-[#d6ae52]/15 bg-[#031b13] text-[#c8d8cc] hover:border-[#d6ae52]/30'
                    }`}
                  >
                    <div className="text-xs font-semibold">{fmt.label}</div>
                    <div className="text-[10px] text-[#d6ae52]/80 mt-0.5">{fmt.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Visual Artwork Selector */}
            <div className="p-4 rounded-2xl bg-[#02150f] border border-[#d6ae52]/20 space-y-2.5">
              <label className="text-[11px] font-mono text-[#d6ae52] uppercase tracking-wider block">
                Arte & Imagem Central da Vinheta
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedVisual('presenca-reintegracao');
                    setRecordedVideoUrl(null);
                  }}
                  className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition cursor-pointer ${
                    selectedVisual === 'presenca-reintegracao'
                      ? 'border-[#d6ae52] bg-[#d6ae52]/15 text-[#fffdfa]'
                      : 'border-[#d6ae52]/15 bg-[#031b13] text-[#c8d8cc] hover:border-[#d6ae52]/30'
                  }`}
                >
                  <img
                    src="/brand/reintegracao-presenca-arte.png"
                    alt="Reintegração da Vida"
                    className="w-10 h-10 rounded-lg object-cover border border-[#d6ae52]/30 shrink-0"
                  />
                  <div className="overflow-hidden">
                    <div className="text-xs font-semibold truncate">Reintegração da Vida</div>
                    <div className="text-[10px] text-[#d6ae52]/80 truncate">Jornada de Presença</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedVisual('human-chakra');
                    setRecordedVideoUrl(null);
                  }}
                  className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition cursor-pointer ${
                    selectedVisual === 'human-chakra'
                      ? 'border-[#d6ae52] bg-[#d6ae52]/15 text-[#fffdfa]'
                      : 'border-[#d6ae52]/15 bg-[#031b13] text-[#c8d8cc] hover:border-[#d6ae52]/30'
                  }`}
                >
                  <img
                    src="/brand/human-chakra-model.jpg"
                    alt="Modelo Chakras"
                    className="w-10 h-10 rounded-lg object-cover border border-[#d6ae52]/30 shrink-0"
                  />
                  <div className="overflow-hidden">
                    <div className="text-xs font-semibold truncate">Modelo Anatômico</div>
                    <div className="text-[10px] text-[#d6ae52]/80 truncate">Chakras & Linha de Luz</div>
                  </div>
                </button>
              </div>

              {/* Upload Custom Image option */}
              <div className="pt-2 border-t border-[#d6ae52]/15 flex items-center justify-between gap-2">
                <label className="text-[10px] font-mono text-[#c8d8cc] flex items-center gap-1.5 cursor-pointer">
                  <Upload size={12} className="text-[#d6ae52]" />
                  <span>Carregar Outra Imagem:</span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCustomImageUpload}
                  className="text-[10px] text-slate-400 file:mr-2 file:py-0.5 file:px-2 file:rounded-md file:border-0 file:text-[10px] file:font-semibold file:bg-[#d6ae52]/20 file:text-[#e8d38f] cursor-pointer"
                />
              </div>
            </div>

            {/* Presets Selector */}
            <div className="p-4 rounded-2xl bg-[#02150f] border border-[#d6ae52]/20 space-y-2">
              <label className="text-[11px] font-mono text-[#d6ae52] uppercase tracking-wider block">
                Temas & Meditações Predefinidas
              </label>
              <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                {PRESET_THEMES.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => applyPreset(theme.id)}
                    className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition cursor-pointer ${
                      selectedPreset === theme.id
                        ? 'border-[#d6ae52] bg-[#d6ae52]/15 text-[#fffdfa]'
                        : 'border-[#d6ae52]/10 bg-[#031b13] text-[#c8d8cc] hover:border-[#d6ae52]/25'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-medium">{theme.name}</div>
                      <div className="text-[10px] text-[#d6ae52]">{theme.freqLabel} • {theme.durationSeconds}s</div>
                    </div>
                    {selectedPreset === theme.id && <CheckCircle2 size={16} className="text-[#d6ae52]" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Texts & Parameters */}
            <div className="p-4 rounded-2xl bg-[#02150f] border border-[#d6ae52]/20 space-y-3">
              <label className="text-[11px] font-mono text-[#d6ae52] uppercase tracking-wider block">
                Personalização da Arte & Frequência
              </label>

              <div className="space-y-1">
                <span className="text-[10px] font-mono text-[#c8d8cc] block">Título em Destaque</span>
                <input
                  type="text"
                  value={customTitle}
                  onChange={(e) => { setCustomTitle(e.target.value); setRecordedVideoUrl(null); }}
                  className="w-full bg-[#031b13] border border-[#d6ae52]/25 rounded-xl px-3 py-1.5 text-xs text-slate-100 focus:border-[#d6ae52] outline-none"
                />
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-mono text-[#c8d8cc] block">Subtítulo / Intenção</span>
                <input
                  type="text"
                  value={customSubtitle}
                  onChange={(e) => { setCustomSubtitle(e.target.value); setRecordedVideoUrl(null); }}
                  className="w-full bg-[#031b13] border border-[#d6ae52]/25 rounded-xl px-3 py-1.5 text-xs text-slate-100 focus:border-[#d6ae52] outline-none"
                />
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-mono text-[#c8d8cc] block">Afirmação / Decreto</span>
                <textarea
                  rows={2}
                  value={customAffirmation}
                  onChange={(e) => { setCustomAffirmation(e.target.value); setRecordedVideoUrl(null); }}
                  className="w-full bg-[#031b13] border border-[#d6ae52]/25 rounded-xl px-3 py-1.5 text-xs text-slate-100 focus:border-[#d6ae52] outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-[#c8d8cc] block">Frequência (Hz)</span>
                  <select
                    value={frequencyHz}
                    onChange={(e) => { setFrequencyHz(Number(e.target.value)); setRecordedVideoUrl(null); }}
                    className="w-full bg-[#031b13] border border-[#d6ae52]/25 rounded-xl px-2.5 py-1.5 text-xs text-slate-100 focus:border-[#d6ae52] outline-none font-mono"
                  >
                    <option value={432}>432 Hz (Paz e Mente)</option>
                    <option value={528}>528 Hz (Transformação)</option>
                    <option value={639}>639 Hz (Harmonia)</option>
                    <option value={741}>741 Hz (Clareza e Limpeza)</option>
                    <option value={396}>396 Hz (Liberação de Medo)</option>
                    <option value={852}>852 Hz (Intuição Pura)</option>
                    <option value={963}>963 Hz (Conexão Superior)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-[#c8d8cc] block">Duração do Clipe</span>
                  <select
                    value={durationSeconds}
                    onChange={(e) => { setDurationSeconds(Number(e.target.value)); setRecordedVideoUrl(null); }}
                    className="w-full bg-[#031b13] border border-[#d6ae52]/25 rounded-xl px-2.5 py-1.5 text-xs text-slate-100 focus:border-[#d6ae52] outline-none font-mono"
                  >
                    <option value={10}>10 segundos (Vinheta Ultra Curta)</option>
                    <option value={15}>15 segundos (Stories / Reels)</option>
                    <option value={30}>30 segundos (Meditação Express)</option>
                    <option value={60}>60 segundos (1 Minuto de Presença)</option>
                  </select>
                </div>
              </div>

              {/* Upload Voice File Option */}
              <div className="pt-2 border-t border-[#d6ae52]/15">
                <label className="flex items-center justify-between text-[11px] font-mono text-[#c8d8cc] mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <Upload size={13} className="text-[#d6ae52]" />
                    Áudio de Voz / Narração (Opcional)
                  </span>
                  {userVoiceFile && <span className="text-emerald-400 text-[10px]">Carregado</span>}
                </label>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleVoiceUpload}
                  className="w-full text-xs text-slate-400 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-[11px] file:font-semibold file:bg-[#d6ae52]/20 file:text-[#e8d38f] hover:file:bg-[#d6ae52]/30 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
