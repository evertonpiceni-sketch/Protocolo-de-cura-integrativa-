const ALLOWED_SOLFEGGIO = new Set([396, 417, 432, 528, 639, 741, 852, 963]);

class ExactSolfeggioTone {
  private context: AudioContext | null = null;
  private oscillator: OscillatorNode | null = null;
  private gain: GainNode | null = null;
  private activeFrequency: number | null = null;
  private targetVolume = 0.035;

  private ensureContext() {
    if (typeof window === 'undefined') return null;
    if (!this.context) {
      const AudioContextCtor = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextCtor) return null;
      this.context = new AudioContextCtor();
    }
    if (this.context.state === 'suspended') void this.context.resume().catch(() => {});
    return this.context;
  }

  public setVolume(volume: number) {
    this.targetVolume = Math.max(0, Math.min(0.08, Number.isFinite(volume) ? volume : 0.035));
    const ctx = this.ensureContext();
    if (ctx && this.gain) {
      this.gain.gain.cancelScheduledValues(ctx.currentTime);
      this.gain.gain.setTargetAtTime(this.targetVolume, ctx.currentTime, 0.08);
    }
  }

  public start(frequency: number, volume = this.targetVolume) {
    if (!ALLOWED_SOLFEGGIO.has(frequency)) {
      console.warn(`Solfeggio não suportado: ${frequency} Hz`);
      return;
    }
    this.targetVolume = Math.max(0, Math.min(0.08, volume));
    if (this.oscillator && this.activeFrequency === frequency) {
      this.setVolume(this.targetVolume);
      return;
    }

    this.stop();
    const ctx = this.ensureContext();
    if (!ctx) return;

    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(this.targetVolume, ctx.currentTime + 0.8);
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    oscillator.start();

    this.oscillator = oscillator;
    this.gain = gain;
    this.activeFrequency = frequency;
  }

  public stop() {
    const ctx = this.context;
    const oscillator = this.oscillator;
    const gain = this.gain;
    this.oscillator = null;
    this.gain = null;
    this.activeFrequency = null;
    if (!oscillator) return;
    try {
      if (ctx && gain) {
        gain.gain.cancelScheduledValues(ctx.currentTime);
        gain.gain.setValueAtTime(gain.gain.value, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.18);
        oscillator.stop(ctx.currentTime + 0.2);
      } else {
        oscillator.stop();
      }
    } catch {}
  }

  public getFrequency() {
    return this.activeFrequency;
  }
}

export const solfeggioTone = new ExactSolfeggioTone();
