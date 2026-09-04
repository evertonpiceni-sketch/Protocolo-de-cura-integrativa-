/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

class CalmingAudioEngine {
  private ctx: AudioContext | null = null;
  private primaryOsc: OscillatorNode | null = null;
  private subOsc: OscillatorNode | null = null;
  private noiseNode: AudioWorkletNode | ScriptProcessorNode | null = null;
  private noiseFilter: BiquadFilterNode | null = null;
  private lfo: OscillatorNode | null = null;
  private mainGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private synthType: '396hz' | '528hz' | '432hz' | '639hz' | '741hz' | '852hz' | '963hz' | '417hz' | 'waves' | 'florestazen' | 'chuvaserena' | 'none' = 'none';
  private extraOscs: OscillatorNode[] = []; // List to track additional harmony voices

  private bgAudio: HTMLAudioElement | null = null;
  private currentBGVolume: number = 0.5;
  private mainVolume: number = 1.0;

  // Synthesis engine scheduling state
  private melodyTimerId: any = null;
  private delayNode: DelayNode | null = null;
  private delayFeedback: GainNode | null = null;
  private synthActive: boolean = false;

  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isSpeakingActive: boolean = false;
  private pauseTimeoutId: any = null;

  // ElevenLabs Voice Stream State
  private voiceAudioElement: HTMLAudioElement | null = null;
  private voiceAudioUrl: string | null = null;
  private isElevenLabsPlaying: boolean = false;

  constructor() {
    // Audio context is lazily initialized on user gesture
  }

  private initCtx() {
    try {
      this.initKeepAlive();
      if (!this.ctx) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          this.ctx = new AudioContextClass();
          this.mainGain = this.ctx.createGain();
          this.musicGain = this.ctx.createGain();
          this.mainGain.connect(this.ctx.destination);
          this.musicGain.connect(this.mainGain);
          this.mainGain.gain.setValueAtTime(0.8, this.ctx.currentTime);
          this.musicGain.gain.setValueAtTime(this.currentBGVolume * 0.4, this.ctx.currentTime);

          // Setup a gorgeous, long ambient delay feedback line to enrich the melodies with a cathedral-like space
          this.delayNode = this.ctx.createDelay(2.0);
          this.delayFeedback = this.ctx.createGain();
          this.delayNode.delayTime.setValueAtTime(0.8, this.ctx.currentTime);
          this.delayFeedback.gain.setValueAtTime(0.35, this.ctx.currentTime);
          
          this.delayNode.connect(this.delayFeedback);
          this.delayFeedback.connect(this.delayNode);
          this.delayNode.connect(this.musicGain);
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(err => {
          console.warn("Could not resume AudioContext:", err);
        });
      }
    } catch (e) {
      console.warn("AudioContext initialization or resume was blocked or failed:", e);
    }
  }

  public setBGVolume(volume: number) {
    this.currentBGVolume = volume;
    this.initCtx();
    if (this.musicGain && this.ctx) {
      try {
        this.musicGain.gain.linearRampToValueAtTime(
          volume * 0.4,
          this.ctx.currentTime + 0.5
        );
      } catch (e) {
        console.warn("Failed to ramp music gain:", e);
      }
    }
  }

  public setMainVolume(volume: number) {
    this.mainVolume = volume;
    this.initCtx();
    if (this.mainGain && this.ctx) {
      try {
        this.mainGain.gain.linearRampToValueAtTime(volume, this.ctx.currentTime + 0.5);
      } catch (e) {
        console.warn("Failed to ramp main gain:", e);
      }
    }
  }

  public unlock() {
    this.initCtx();
    this.initKeepAlive();
  }

  private initKeepAlive() {
    if (!this.bgAudio && typeof window !== 'undefined') {
      try {
        this.bgAudio = new Audio();
        // Silent MP3 loop to keep the AudioContext alive on mobile when screen locks
        this.bgAudio.src = 'data:audio/mpeg;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU5LjE2LjEwMAAAAAAAAAAAAAAA//tQxAAAAANIAAAAAExBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//tQxAAAAANIAAAAAExBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq';
        this.bgAudio.loop = true;
        this.bgAudio.volume = 0.01;
        this.bgAudio.play().catch(() => {});
        
        if ('mediaSession' in navigator) {
          navigator.mediaSession.metadata = new MediaMetadata({
            title: 'Protocolo Éverton Piceni',
            artist: 'Frequência de Cura',
            album: 'Terapia Integrada'
          });
          
          navigator.mediaSession.setActionHandler('play', () => {
            this.resumeSpeech();
            this.bgAudio?.play().catch(()=>{});
            if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
          });
          navigator.mediaSession.setActionHandler('pause', () => {
            this.pauseSpeech();
            this.bgAudio?.pause();
          });
        }
      } catch (err) {
        console.warn('Silent audio init failed', err);
      }
    } else if (this.bgAudio && this.bgAudio.paused) {
      this.bgAudio.play().catch(() => {});
    }
  }

  private startSynthesizedBG(type: '396hz' | '528hz' | '432hz' | '639hz' | '741hz' | '852hz' | '963hz' | '417hz' | 'waves' | 'florestazen' | 'chuvaserena') {
    this.initCtx();
    if (!this.ctx) return;

    this.stopSynthesizedBG();
    this.synthActive = true;

    try {
      const now = this.ctx.currentTime;

      // Setup a subtle drone or gentle background pad that stays active for deep relaxation
      if (type === '396hz' || type === '528hz' || type === '432hz' || type === '639hz' || type === '741hz' || type === '852hz' || type === '963hz' || type === '417hz') {
        let baseFreq = 264; // default
        let cutoffMult = 1.5;
        let padLevel = 0.08;

        if (type === '396hz') {
          baseFreq = 198.0; // 396 / 2 (Libertação de Medo, Culpa e Ancoramento Raiz)
          cutoffMult = 1.25;
          padLevel = 0.085;
        } else if (type === '528hz') baseFreq = 264; // 528 / 2
        else if (type === '432hz') baseFreq = 216; // 432 / 2
        else if (type === '639hz') {
          baseFreq = 319.5; // 639 / 2 (Harmonia do Coração e Conexões)
          cutoffMult = 1.4;
          padLevel = 0.07;
        } else if (type === '741hz') {
          baseFreq = 370.5; // 741 / 2 (Despertar da Intuição e Limpeza)
          cutoffMult = 1.6;
          padLevel = 0.07;
        } else if (type === '852hz') {
          baseFreq = 426.0; // 852 / 2 (Despertar Espiritual e Iluminação)
          cutoffMult = 1.8;
          padLevel = 0.06;
        } else if (type === '963hz') {
          baseFreq = 481.5; // 963 / 2 (Harmonic Celestial Pineal)
          cutoffMult = 2.0;
          padLevel = 0.05; // ethereal shimmer
        } else if (type === '417hz') {
          baseFreq = 208.5; // 417 / 2 (Dissolução de Bloqueios e Renovação)
          cutoffMult = 1.3;
          padLevel = 0.08;
        }

        const padFilter = this.ctx.createBiquadFilter();
        padFilter.type = 'lowpass';
        padFilter.frequency.setValueAtTime(baseFreq * cutoffMult, now);
        padFilter.Q.setValueAtTime(0.7, now);

        const osc1 = this.ctx.createOscillator();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(baseFreq, now);

        const osc2 = this.ctx.createOscillator();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(baseFreq * 1.5, now); // perfect fifth

        const padGain = this.ctx.createGain();
        padGain.gain.setValueAtTime(padLevel, now); // soft, soothing back drone

        osc1.connect(padFilter);
        osc2.connect(padFilter);

        if (this.musicGain) {
          padFilter.connect(padGain);
          padGain.connect(this.musicGain);
        }

        osc1.start(now);
        osc2.start(now);

        this.primaryOsc = osc1;
        this.subOsc = osc2;

        // Custom Binaural Beats Engine
        let beatFreq = 0;
        let centerFreq = 0;
        let binauralVol = padLevel * 1.8; // Emphasize the binaural beat

        if (type === '528hz') {
          beatFreq = 12; // Alpha-Beta waves for Burnout/Vitality (12Hz)
          centerFreq = 528;
        } else if (type === '432hz') {
          beatFreq = 5; // Theta waves for Deep Trance/Trauma release (5Hz)
          centerFreq = 432;
        } else if (type === '639hz') {
          beatFreq = 7.83; // Ressonância Cardíaca / Schumann Alpha (7.83Hz - Harmonia, compreensão e tolerância)
          centerFreq = 639;
        }

        if (beatFreq > 0) {
          const leftPanner = this.ctx.createStereoPanner();
          leftPanner.pan.setValueAtTime(-1, now);
          
          const rightPanner = this.ctx.createStereoPanner();
          rightPanner.pan.setValueAtTime(1, now);

          const binauralGain = this.ctx.createGain();
          binauralGain.gain.setValueAtTime(binauralVol, now);

          const leftOsc = this.ctx.createOscillator();
          leftOsc.type = 'sine';
          leftOsc.frequency.setValueAtTime(centerFreq - (beatFreq / 2), now);
          leftOsc.connect(leftPanner);

          const rightOsc = this.ctx.createOscillator();
          rightOsc.type = 'sine';
          rightOsc.frequency.setValueAtTime(centerFreq + (beatFreq / 2), now);
          rightOsc.connect(rightPanner);

          leftPanner.connect(binauralGain);
          rightPanner.connect(binauralGain);

          if (this.musicGain) {
            binauralGain.connect(this.musicGain);
          }

          leftOsc.start(now);
          rightOsc.start(now);
          this.extraOscs.push(leftOsc, rightOsc);
        }
      } else if (type === 'waves' || type === 'florestazen' || type === 'chuvaserena') {
        // Organic Nature Sound Generator (Warm waves, forest breeze, or gentle rainfall)
        const bufferSize = 4 * this.ctx.sampleRate;
        const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let lastOut = 0.0;
        
        const noiseMix = type === 'chuvaserena' ? 0.03 : 0.015;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          output[i] = (lastOut + (noiseMix * white)) / (1 + noiseMix);
          lastOut = output[i];
          output[i] *= type === 'chuvaserena' ? 0.18 : 0.12;
        }

        const bufferSource = this.ctx.createBufferSource();
        bufferSource.buffer = noiseBuffer;
        bufferSource.loop = true;

        this.noiseFilter = this.ctx.createBiquadFilter();
        this.noiseFilter.type = 'lowpass';
        const filterFreq = type === 'chuvaserena' ? 280 : type === 'florestazen' ? 180 : 100;
        this.noiseFilter.frequency.setValueAtTime(filterFreq, now);
        this.noiseFilter.Q.setValueAtTime(0.8, now);

        this.lfo = this.ctx.createOscillator();
        this.lfo.type = 'sine';
        const sweepSpeed = type === 'florestazen' ? 0.03 : type === 'chuvaserena' ? 0.08 : 0.05;
        this.lfo.frequency.setValueAtTime(sweepSpeed, now);

        const lfoFilterGain = this.ctx.createGain();
        lfoFilterGain.gain.setValueAtTime(type === 'chuvaserena' ? 60 : 40, now);

        const waveGain = this.ctx.createGain();
        waveGain.gain.setValueAtTime(0.06, now);

        this.lfo.connect(lfoFilterGain);
        lfoFilterGain.connect(this.noiseFilter.frequency);

        if (this.musicGain) {
          bufferSource.connect(this.noiseFilter);
          this.noiseFilter.connect(waveGain);
          waveGain.connect(this.musicGain);
        }

        bufferSource.start(now);
        this.lfo.start(now);

        this.noiseNode = bufferSource as any;
      }

      // Start the beautiful melody sequence!
      this.playNextMelodyNote(type);

    } catch (e) {
      console.warn("Failed to start synthesized background audio:", e);
    }
  }

  private playNextMelodyNote(type: '396hz' | '528hz' | '432hz' | '639hz' | '741hz' | '852hz' | '963hz' | '417hz' | 'waves' | 'florestazen' | 'chuvaserena') {
    if (!this.ctx || !this.synthActive) return;

    const now = this.ctx.currentTime;

    // Pick scale based on type
    let scale: number[] = [];
    let oscType: OscillatorType = 'sine';
    let filterCutoff = 800;
    let noteVolume = 0.08;

    if (type === '396hz') {
      // 396Hz Root Chakra & Fear/Guilt Dissolution (Warm resonant harmonics)
      scale = [198.0, 264.0, 297.0, 396.0, 440.0, 528.0, 594.0, 792.0];
      oscType = 'sine';
      filterCutoff = 480;
      noteVolume = 0.08;
    } else if (type === '528hz') {
      // 528Hz aligned celestial scale (Cura & DNA)
      scale = [264.0, 396.0, 440.0, 528.0, 594.0, 792.0, 880.0, 1056.0];
      oscType = 'sine';
      filterCutoff = 800;
      noteVolume = 0.07;
    } else if (type === '432hz') {
      // 432Hz aligned warm wooden/Rhodes scale (Pythagorean)
      scale = [216.0, 243.0, 270.0, 324.0, 360.0, 432.0, 486.0, 540.0, 648.0];
      oscType = 'triangle';
      filterCutoff = 380;
      noteVolume = 0.08;
    } else if (type === '639hz') {
      // 639Hz Heart Harmonization scale (Warm soft harp)
      scale = [319.5, 384.0, 426.0, 512.0, 639.0, 768.0, 852.0];
      oscType = 'triangle';
      filterCutoff = 600;
      noteVolume = 0.07;
    } else if (type === '741hz') {
      // 741Hz Cellular Detox scale (deep harmonic quartz)
      scale = [370.5, 444.6, 555.75, 741.0, 833.6, 926.25, 1111.5];
      oscType = 'sine';
      filterCutoff = 650;
      noteVolume = 0.07;
    } else if (type === '852hz') {
      // 852Hz Third Eye & Spiritual Awakening (Ethereal crystal chimes)
      scale = [426.0, 532.5, 639.0, 852.0, 1065.0, 1278.0];
      oscType = 'sine';
      filterCutoff = 1100;
      noteVolume = 0.06;
    } else if (type === '963hz') {
      // 963Hz Crown Divine scale (crystal bells, angelic harmonics)
      scale = [481.5, 642.0, 722.25, 963.0, 1083.3, 1284.0, 1444.5];
      oscType = 'sine';
      filterCutoff = 1400;
      noteVolume = 0.05;
    } else if (type === '417hz') {
      // 417Hz Transmutation of Energy (Warm calming tone)
      scale = [208.5, 260.6, 312.75, 417.0, 521.25, 625.5];
      oscType = 'sine';
      filterCutoff = 500;
      noteVolume = 0.08;
    } else if (type === 'florestazen') {
      // Forest Zen (Gentle soft bamboo bell tones)
      scale = [220.0, 277.18, 329.63, 440.0, 554.37, 659.25];
      oscType = 'sine';
      filterCutoff = 750;
      noteVolume = 0.05;
    } else if (type === 'chuvaserena') {
      // Calming Rain (Warm ambient piano drops)
      scale = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99];
      oscType = 'sine';
      filterCutoff = 550;
      noteVolume = 0.06;
    } else { // 'waves'
      // Starry bell windchime scale
      scale = [293.66, 329.63, 392.00, 440.00, 587.33, 659.25, 880.00, 987.77];
      oscType = 'sine';
      filterCutoff = 1200;
      noteVolume = 0.05; // sparkling bells, very soft
    }

    // Sometimes play a beautiful single note, sometimes a beautiful harmony dyad (30% chance)
    const numNotes = Math.random() > 0.7 ? 2 : 1;
    const chosenNotes: number[] = [];
    for (let i = 0; i < numNotes; i++) {
      const note = scale[Math.floor(Math.random() * scale.length)];
      if (!chosenNotes.includes(note)) {
        chosenNotes.push(note);
      }
    }

    chosenNotes.forEach(freq => {
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      osc.type = oscType;
      osc.frequency.setValueAtTime(freq, now);

      // Add a tiny detune to enrich the spatial chorus feel
      osc.detune.setValueAtTime((Math.random() * 6) - 3, now);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(filterCutoff, now);

      const gainNode = this.ctx.createGain();
      gainNode.gain.setValueAtTime(0, now);

      // Smooth envelope parameters to eliminate click transients
      const attack = 1.0 + Math.random() * 0.8;
      const sustain = 0.3 + Math.random() * 0.3;
      const decay = 1.5 + Math.random() * 1.0;
      const release = 2.0 + Math.random() * 1.5;

      const peakVolume = noteVolume / numNotes;

      gainNode.gain.linearRampToValueAtTime(peakVolume, now + attack);
      gainNode.gain.exponentialRampToValueAtTime(peakVolume * sustain, now + attack + decay);

      const duration = attack + decay + 0.5;
      gainNode.gain.setValueAtTime(peakVolume * sustain, now + duration);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration + release);

      osc.connect(filter);
      filter.connect(gainNode);

      if (this.musicGain) {
        gainNode.connect(this.musicGain);
      }
      if (this.delayNode) {
        gainNode.connect(this.delayNode);
      }

      osc.start(now);
      const stopTime = now + duration + release + 0.2;
      osc.stop(stopTime);

      this.extraOscs.push(osc);

      // Automatic garbage collection for used nodes
      setTimeout(() => {
        const idx = this.extraOscs.indexOf(osc);
        if (idx !== -1) {
          this.extraOscs.splice(idx, 1);
        }
        try {
          osc.disconnect();
          filter.disconnect();
          gainNode.disconnect();
        } catch (e) {}
      }, (duration + release + 1) * 1000);
    });

    // Plan next note in a natural breathing cycle
    const nextInterval = 2000 + Math.random() * 2000;
    this.melodyTimerId = setTimeout(() => {
      this.playNextMelodyNote(type);
    }, nextInterval);
  }

  private stopSynthesizedBG() {
    this.synthActive = false;
    if (this.melodyTimerId) {
      clearTimeout(this.melodyTimerId);
      this.melodyTimerId = null;
    }

    try {
      if (this.primaryOsc) {
        this.primaryOsc.stop();
        this.primaryOsc.disconnect();
        this.primaryOsc = null;
      }
      if (this.subOsc) {
        this.subOsc.stop();
        this.subOsc.disconnect();
        this.subOsc = null;
      }
      if (this.noiseNode) {
        try {
          (this.noiseNode as any).stop();
        } catch (e) {}
        this.noiseNode.disconnect();
        this.noiseNode = null;
      }
      if (this.noiseFilter) {
        this.noiseFilter.disconnect();
        this.noiseFilter = null;
      }
      if (this.lfo) {
        this.lfo.stop();
        this.lfo.disconnect();
        this.lfo = null;
      }
      this.extraOscs.forEach(osc => {
        try {
          osc.stop();
        } catch (e) {}
        osc.disconnect();
      });
      this.extraOscs = [];
    } catch (e) {
      console.warn("Error stopping synthesized background audio:", e);
    }
  }

  public startBG(type: '396hz' | '528hz' | '432hz' | '639hz' | '741hz' | '852hz' | '963hz' | '417hz' | 'waves' | 'florestazen' | 'chuvaserena' | 'none') {
    this.initCtx();
    
    if (this.synthType === type) {
      return;
    }

    this.stopBG();
    this.synthType = type;

    if (type === 'none') {
      return;
    }

    this.startSynthesizedBG(type);
  }

  public stopBG() {
    this.stopSynthesizedBG();
    this.synthType = 'none';
    if (this.bgAudio) {
      this.bgAudio.pause();
    }
  }

  public getCurrentSynthType(): string {
    return this.synthType;
  }

  public isBackgroundActive(): boolean {
    return this.synthActive;
  }

  /**
   * Subtle celestial micro-chime tuned to the 639Hz heart chakra note when selecting answers
   */
  public playHeartSelectionChime() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(639, now);
      osc.frequency.exponentialRampToValueAtTime(1278, now + 0.16);

      gain.gain.setValueAtTime(0.045, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.32);

      osc.connect(gain);
      if (this.mainGain) {
        gain.connect(this.mainGain);
      } else {
        gain.connect(this.ctx.destination);
      }

      osc.start(now);
      osc.stop(now + 0.33);
    } catch {
      // AudioContext might be uninitialized before interaction
    }
  }

  /**
   * Retrieves available voices from browser, enriched with friendly Portuguese / Neural descriptions
   */
  public getAvailableVoices(): { id: string; name: string; lang: string; qualityTag: string; isNeural: boolean }[] {
    if (!('speechSynthesis' in window)) return [];
    const voices = window.speechSynthesis.getVoices();
    
    const ptVoices = voices.filter(v => v.lang.toLowerCase().startsWith('pt'));
    const otherVoices = voices.filter(v => !v.lang.toLowerCase().startsWith('pt'));
    const candidateVoices = ptVoices.length > 0 ? [...ptVoices, ...otherVoices.slice(0, 5)] : voices;

    const mapped = candidateVoices.map(v => {
      const nameLower = v.name.toLowerCase();
      let tag = 'Voz Padrão do Sistema';
      let isNeural = false;

      if (nameLower.includes('neural') || nameLower.includes('natural') || nameLower.includes('online')) {
        tag = '⭐ Voz Ultra-Natural (Recomendada)';
        isNeural = true;
      } else if (nameLower.includes('google') && (v.lang.includes('pt') || v.lang.includes('BR'))) {
        tag = '⭐ Google Alta Fidelidade (Brasil)';
        isNeural = true;
      } else if (nameLower.includes('francisca') || nameLower.includes('luciana') || nameLower.includes('maria') || nameLower.includes('leticia') || nameLower.includes('camila') || nameLower.includes('vitoria') || nameLower.includes('helena')) {
        tag = 'Suave & Acolhedora (Feminina)';
        isNeural = true;
      } else if (nameLower.includes('antonio') || nameLower.includes('daniel') || nameLower.includes('jorge') || nameLower.includes('felipe')) {
        tag = 'Profunda & Serena (Masculina)';
        isNeural = true;
      } else if (nameLower.includes('google')) {
        tag = 'Google Narração Fluida';
      }

      return {
        id: v.name,
        name: v.name,
        lang: v.lang,
        qualityTag: tag,
        isNeural
      };
    });

    // Sort so neural and Portuguese voices are at the very top
    return mapped.sort((a, b) => {
      if (a.isNeural && !b.isNeural) return -1;
      if (!a.isNeural && b.isNeural) return 1;
      const aIsPt = a.lang.toLowerCase().startsWith('pt');
      const bIsPt = b.lang.toLowerCase().startsWith('pt');
      if (aIsPt && !bIsPt) return -1;
      if (!aIsPt && bIsPt) return 1;
      return a.name.localeCompare(b.name);
    });
  }

  /**
   * Previews a voice with a soothing sample sentence
   */
  public previewVoice(
    options?: {
      voiceId?: string;
      rate?: number;
      pitch?: number;
      volume?: number;
      text?: string;
      onEnd?: () => void;
    }
  ) {
    this.stopSpeech();
    if (!('speechSynthesis' in window)) return;

    const sampleText = options?.text || "Respire profundamente. Sinta a paz e a presença da cura neste momento.";
    const utterance = new SpeechSynthesisUtterance(sampleText);
    utterance.lang = 'pt-BR';
    utterance.volume = options?.volume !== undefined ? options.volume : 0.90;
    utterance.rate = options?.rate || 0.84;
    utterance.pitch = options?.pitch || 0.98;

    const voices = window.speechSynthesis.getVoices();
    if (options?.voiceId) {
      const selected = voices.find(v => v.name === options.voiceId);
      if (selected) utterance.voice = selected;
    }

    if (!utterance.voice) {
      const ptVoice = this.pickBestPortugueseVoice(voices);
      if (ptVoice) utterance.voice = ptVoice;
    }

    if (options?.onEnd) {
      utterance.onend = () => options.onEnd?.();
      utterance.onerror = () => options.onEnd?.();
    }

    this.currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  }

  public pickBestVoiceForLang(voices: SpeechSynthesisVoice[], langCode: string = 'pt-BR'): SpeechSynthesisVoice | null {
    if (!voices || voices.length === 0) return null;

    const targetPrefix = langCode.split('-')[0].toLowerCase();
    const matchingVoices = voices.filter(v => v.lang.toLowerCase().startsWith(targetPrefix));
    
    // Priority order for ultra-warm, soothing and humanized voices
    const priorityKeywords = [
      'natural', 'neural', 'google português do brasil', 'google português',
      'francisca', 'antonio', 'luciana', 'maria', 'leticia', 'camila',
      'vitoria', 'helena', 'siri', 'samantha', 'karen', 'victoria',
      'heloisa', 'monica', 'paulina', 'jorge', 'aurélie', 'thomas', 'alice', 'federica',
      'google', 'female'
    ];

    for (const keyword of priorityKeywords) {
      const match = matchingVoices.find(v => v.name.toLowerCase().includes(keyword));
      if (match) return match;
    }

    return matchingVoices.find(v => v.lang.toLowerCase() === langCode.toLowerCase()) ||
           matchingVoices[0] ||
           voices.find(v => v.lang.toLowerCase().startsWith('en')) ||
           voices[0] ||
           null;
  }

  private pickBestPortugueseVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
    return this.pickBestVoiceForLang(voices, 'pt-BR');
  }

  public speak(
    text: string,
    voiceVolume: number,
    onStart: () => void,
    onEnd: () => void,
    onPause?: () => void,
    onResume?: () => void,
    options?: {
      voiceId?: string;
      rate?: number;
      pitch?: number;
      lang?: string;
    }
  ) {
    this.stopSpeech();

    if (!('speechSynthesis' in window)) {
      onEnd();
      return;
    }

    this.isSpeakingActive = true;

    // Clean text and placeholders
    let cleanText = text;
    if (options && (options as any).userName) {
      cleanText = cleanText.replace(/\[NOME\]/g, (options as any).userName);
    }
    cleanText = cleanText
      .replace(/\[NOME\]/g, "")
      .replace(/\.{3,}/g, "...")
      .trim();

    // Humanized chunking: Split text by periods, ellipses, commas (if sentence is long), exclamation/questions, or newlines
    // This allows gentle, breath-like micro pauses that feel deeply human and non-robotic
    const rawSentences = cleanText.split(/(?<=[.!?…])\s+|\n+/).filter(s => s.trim().length > 0);
    const parts: string[] = [];

    rawSentences.forEach(sentence => {
      const trimmed = sentence.trim();
      if (trimmed.includes('...')) {
        const subParts = trimmed.split(/(?<=\.\.\.)\s+/);
        subParts.forEach(sp => {
          if (sp.trim()) parts.push(sp.trim());
        });
      } else if (trimmed.length > 100 && trimmed.includes(',')) {
        // Split long compound phrases on comma for natural respiratory rhythm
        const subParts = trimmed.split(/(?<=,)\s+/);
        subParts.forEach(sp => {
          if (sp.trim()) parts.push(sp.trim());
        });
      } else {
        parts.push(trimmed);
      }
    });

    if (parts.length === 0) {
      this.isSpeakingActive = false;
      onEnd();
      return;
    }

    let partIndex = 0;
    const targetLang = options?.lang || 'pt-BR';

    const speakNextPart = () => {
      if (!this.isSpeakingActive) return;

      if (partIndex >= parts.length) {
        this.isSpeakingActive = false;
        onEnd();
        return;
      }

      const segment = parts[partIndex];
      const utterance = new SpeechSynthesisUtterance(segment);
      this.currentUtterance = utterance;

      const voices = window.speechSynthesis.getVoices();
      
      // Select voice based on user preference or automatic best match for the language
      if (options?.voiceId) {
        const customVoice = voices.find(v => v.name === options.voiceId);
        if (customVoice) {
          utterance.voice = customVoice;
        }
      }

      if (!utterance.voice) {
        const bestVoice = this.pickBestVoiceForLang(voices, targetLang);
        if (bestVoice) {
          utterance.voice = bestVoice;
        }
      }

      utterance.lang = targetLang;
      utterance.volume = Math.max(0, Math.min(1, voiceVolume));
      // Highly comforting, slow-paced meditative cadence
      utterance.rate = options?.rate || 0.82;
      utterance.pitch = options?.pitch || 1.0;

      utterance.onstart = () => {
        if (!this.isSpeakingActive) return;
        if (partIndex === 0) onStart();
      };

      utterance.onend = () => {
        if (!this.isSpeakingActive) return;
        partIndex++;

        // Determine pause length: shorter after a comma (400ms), deeper after a full stop (1400ms)
        const isCommaClause = segment.endsWith(',');
        const pauseDuration = isCommaClause ? 450 : 1400;

        this.pauseTimeoutId = setTimeout(() => {
          speakNextPart();
        }, pauseDuration);
      };

      utterance.onerror = (e) => {
        if (!this.isSpeakingActive) return;
        if (e.error === 'interrupted' || e.error === 'canceled') {
          return;
        }
        console.error("Speech Synthesis Error:", e);
        partIndex++;
        this.pauseTimeoutId = setTimeout(speakNextPart, 500);
      };

      window.speechSynthesis.speak(utterance);
    };

    speakNextPart();
  }

  /**
   * Generates or streams voice audio via ElevenLabs backend with therapeutic stability (0.45)
   * and automatic breathing pauses. Falls back to Web Speech API if API key is not configured or fails.
   */
  public async speakWithElevenLabsOrFallback(
    text: string,
    voiceVolume: number,
    onStart: () => void,
    onEnd: () => void,
    onPause?: () => void,
    onResume?: () => void,
    options?: {
      voiceId?: string;
      stability?: number;
      similarityBoost?: number;
      userName?: string;
      enableBreathingPauses?: boolean;
      preferElevenLabs?: boolean;
      rate?: number;
      pitch?: number;
      lang?: string;
    }
  ) {
    this.stopSpeech();

    const preferElevenLabs = options?.preferElevenLabs !== false;

    if (preferElevenLabs && typeof window !== 'undefined') {
      try {
        let cleanText = text;
        if (options?.userName) {
          cleanText = cleanText.replace(/\[NOME\]/g, options.userName);
        }
        cleanText = cleanText.replace(/\[NOME\]/g, "").trim();

        const response = await fetch('/api/elevenlabs/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: cleanText,
            voiceId: options?.voiceId || 'Marcus',
            stability: options?.stability ?? 0.45,
            similarityBoost: options?.similarityBoost ?? 0.75,
            enableBreathingPauses: options?.enableBreathingPauses ?? true
          })
        });

        if (response.ok && response.headers.get('content-type')?.includes('audio')) {
          const blob = await response.blob();
          const audioUrl = URL.createObjectURL(blob);
          this.voiceAudioUrl = audioUrl;

          const audio = new Audio(audioUrl);
          this.voiceAudioElement = audio;
          audio.volume = Math.max(0, Math.min(1, voiceVolume));

          audio.onplay = () => {
            this.isElevenLabsPlaying = true;
            this.isSpeakingActive = true;
            onStart();
          };

          audio.onended = () => {
            this.isElevenLabsPlaying = false;
            this.isSpeakingActive = false;
            if (this.voiceAudioUrl) {
              URL.revokeObjectURL(this.voiceAudioUrl);
              this.voiceAudioUrl = null;
            }
            onEnd();
          };

          audio.onpause = () => {
            if (onPause) onPause();
          };

          audio.onerror = (e) => {
            console.warn("ElevenLabs audio playback failed, falling back to Web Speech API:", e);
            this.isElevenLabsPlaying = false;
            this.speak(text, voiceVolume, onStart, onEnd, onPause, onResume, options);
          };

          await audio.play();
          return;
        } else {
          // Server returned fallback or error status (e.g. 503 API key not set)
          const errData = await response.json().catch(() => ({}));
          console.info("ElevenLabs TTS info / fallback:", errData.message || errData.error || response.statusText);
        }
      } catch (err) {
        console.warn("Could not connect to ElevenLabs TTS route, using native fallback:", err);
      }
    }

    // Fallback to Web Speech API
    this.speak(text, voiceVolume, onStart, onEnd, onPause, onResume, options);
  }

  public async fetchElevenLabsVoices(): Promise<{ voice_id: string; name: string; category: string; description: string; preview_url: string }[]> {
    try {
      const res = await fetch('/api/elevenlabs/voices');
      if (res.ok) {
        const data = await res.json();
        return data.voices || [];
      }
    } catch (e) {
      console.warn("Failed to fetch ElevenLabs voices:", e);
    }
    return [
      {
        voice_id: "Marcus",
        name: "Marcus (Éverton Piceni Style)",
        category: "curated",
        description: "Voz masculina profunda, acolhedora, serena e terapêutica.",
        preview_url: ""
      },
      {
        voice_id: "Rachel",
        name: "Rachel (Acolhimento & Paz)",
        category: "premade",
        description: "Voz feminina suave, doce e maternal.",
        preview_url: ""
      }
    ];
  }

  public async checkElevenLabsStatus(): Promise<{ configured: boolean; defaultVoice: string }> {
    try {
      const res = await fetch('/api/elevenlabs/status');
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn("Failed to check ElevenLabs status:", e);
    }
    return { configured: false, defaultVoice: 'Marcus' };
  }

  public stopSpeech() {
    this.isSpeakingActive = false;
    if (this.pauseTimeoutId) {
      clearTimeout(this.pauseTimeoutId);
      this.pauseTimeoutId = null;
    }
    if (this.voiceAudioElement) {
      this.voiceAudioElement.pause();
      this.voiceAudioElement.currentTime = 0;
      this.voiceAudioElement = null;
    }
    if (this.voiceAudioUrl) {
      URL.revokeObjectURL(this.voiceAudioUrl);
      this.voiceAudioUrl = null;
    }
    this.isElevenLabsPlaying = false;

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.currentUtterance = null;
  }

  public pauseSpeech() {
    if (this.voiceAudioElement && !this.voiceAudioElement.paused) {
      this.voiceAudioElement.pause();
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.pause();
    }
  }

  public resumeSpeech() {
    if (this.voiceAudioElement && this.voiceAudioElement.paused) {
      this.voiceAudioElement.play().catch(() => {});
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.resume();
    }
  }

  public isSpeaking(): boolean {
    if (this.voiceAudioElement && !this.voiceAudioElement.paused) {
      return true;
    }
    if ('speechSynthesis' in window) {
      return window.speechSynthesis.speaking || window.speechSynthesis.pending || window.speechSynthesis.paused;
    }
    return false;
  }
}

export const audioEngine = new CalmingAudioEngine();

