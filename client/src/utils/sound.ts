/**
 * Ultra-Smooth, Lightweight Tactile Sound Effects Engine.
 * Produces delicate, silky, Apple-style mechanical micro-clicks ("tik / tuk")
 * on Add to Cart, Increment (+), and Decrement (-) across Laptop/Desktop and Mobile.
 *
 * Characteristics:
 * - Pure sine harmonics for zero harshness, zero distortion, zero scary thuds.
 * - Lightweight 18ms micro-transient envelope with soft exponential roll-off.
 * - Elegant, non-intrusive volume (gain ~0.14) that feels luxurious and satisfying.
 * - Seamless AudioContext auto-resume awaiting on laptops.
 * - Lightweight in-memory WAV fallback.
 */

let audioCtx: AudioContext | null = null;
let tikFallbackAudio: HTMLAudioElement | null = null;
let tukFallbackAudio: HTMLAudioElement | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  try {
    if (!audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtxClass) {
        audioCtx = new AudioCtxClass();
      }
    }
    return audioCtx;
  } catch {
    return null;
  }
}

// Active user gesture listeners to keep audio context primed on desktop & mobile
if (typeof window !== 'undefined') {
  const primeAudio = () => {
    try {
      const ctx = getAudioContext();
      if (ctx && ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }
    } catch {}
  };
  window.addEventListener('click', primeAudio, { passive: true });
  window.addEventListener('pointerdown', primeAudio, { passive: true });
  window.addEventListener('keydown', primeAudio, { passive: true });
}

/**
 * Generate a tiny in-memory PCM WAV Base64 URI for lightweight fallback
 */
function generateSoftWavDataUri(isTik: boolean): string {
  try {
    const sampleRate = 22050;
    const duration = 0.024; // 24ms soft micro-pop
    const numSamples = Math.floor(sampleRate * duration);
    const buffer = new ArrayBuffer(44 + numSamples * 2);
    const view = new DataView(buffer);

    // RIFF identifier
    view.setUint32(0, 0x52494646, false); // "RIFF"
    view.setUint32(4, 36 + numSamples * 2, true);
    view.setUint32(8, 0x57415645, false); // "WAVE"
    // format chunk
    view.setUint32(12, 0x666d7420, false); // "fmt "
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true); // PCM
    view.setUint16(22, 1, true); // mono
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    // data chunk
    view.setUint32(36, 0x64617461, false); // "data"
    view.setUint32(40, numSamples * 2, true);

    // Generate a gentle, pure sine micro-pop without any low thumps
    const startFreq = isTik ? 1650 : 1250;
    const endFreq = isTik ? 1050 : 800;
    const peakGain = isTik ? 0.14 : 0.12;

    let offset = 44;
    for (let i = 0; i < numSamples; i++) {
      const t = i / sampleRate;
      const progress = i / numSamples;
      // Smooth exponential envelope
      const env = Math.exp(-progress * 8);
      const currentFreq = startFreq - (startFreq - endFreq) * progress;
      const sample = Math.sin(2 * Math.PI * currentFreq * t) * peakGain * env;

      const s = Math.max(-1, Math.min(1, sample));
      view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
      offset += 2;
    }

    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return `data:audio/wav;base64,${btoa(binary)}`;
  } catch {
    return '';
  }
}

// Pre-create fallback HTML5 Audio elements
if (typeof window !== 'undefined' && typeof Audio !== 'undefined') {
  try {
    const tikUri = generateSoftWavDataUri(true);
    if (tikUri) {
      tikFallbackAudio = new Audio(tikUri);
      tikFallbackAudio.volume = 0.15;
    }
    const tukUri = generateSoftWavDataUri(false);
    if (tukUri) {
      tukFallbackAudio = new Audio(tukUri);
      tukFallbackAudio.volume = 0.13;
    }
  } catch {}
}

function playFallback(isTik: boolean) {
  try {
    const audio = isTik ? tikFallbackAudio : tukFallbackAudio;
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(() => {});
    }
  } catch {}
}

/**
 * Play smooth, lightweight, delicate mechanical "Tik" (Add / +)
 * Subtle, satisfying Apple-style tactile pop.
 */
export function playTikSound(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) {
      playFallback(true);
      return;
    }

    // Ensure audio driver is active on laptop before scheduling
    if (ctx.state === 'suspended') {
      ctx.resume().then(() => {
        executeSoftTik(ctx);
      }).catch(() => {
        playFallback(true);
      });
      return;
    }

    executeSoftTik(ctx);
  } catch {
    playFallback(true);
  }
}

function executeSoftTik(ctx: AudioContext): void {
  try {
    const t = ctx.currentTime + 0.002;

    // 1. Subtle, delicate micro-click transient (2200Hz -> 1400Hz, 8ms)
    const snapOsc = ctx.createOscillator();
    const snapGain = ctx.createGain();
    snapOsc.type = 'sine';
    snapOsc.frequency.setValueAtTime(2200, t);
    snapOsc.frequency.exponentialRampToValueAtTime(1400, t + 0.008);

    snapGain.gain.setValueAtTime(0.04, t);
    snapGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.008);

    snapOsc.connect(snapGain);
    snapGain.connect(ctx.destination);
    snapOsc.start(t);
    snapOsc.stop(t + 0.009);

    // 2. Pure, warm tactile pop body (1650Hz -> 1100Hz, 18ms, gain 0.14)
    const bodyOsc = ctx.createOscillator();
    const bodyGain = ctx.createGain();
    bodyOsc.type = 'sine';
    bodyOsc.frequency.setValueAtTime(1650, t);
    bodyOsc.frequency.exponentialRampToValueAtTime(1100, t + 0.016);

    bodyGain.gain.setValueAtTime(0.14, t);
    bodyGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.018);

    bodyOsc.connect(bodyGain);
    bodyGain.connect(ctx.destination);
    bodyOsc.start(t);
    bodyOsc.stop(t + 0.019);
  } catch {
    playFallback(true);
  }
}

/**
 * Play soft, muted, gentle mechanical "Tuk" (Remove / -)
 * Discrete, relaxing release pop.
 */
export function playTukSound(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) {
      playFallback(false);
      return;
    }

    if (ctx.state === 'suspended') {
      ctx.resume().then(() => {
        executeSoftTuk(ctx);
      }).catch(() => {
        playFallback(false);
      });
      return;
    }

    executeSoftTuk(ctx);
  } catch {
    playFallback(false);
  }
}

function executeSoftTuk(ctx: AudioContext): void {
  try {
    const t = ctx.currentTime + 0.002;

    // 1. Soft click transient (1700Hz -> 1100Hz, 8ms)
    const snapOsc = ctx.createOscillator();
    const snapGain = ctx.createGain();
    snapOsc.type = 'sine';
    snapOsc.frequency.setValueAtTime(1700, t);
    snapOsc.frequency.exponentialRampToValueAtTime(1100, t + 0.008);

    snapGain.gain.setValueAtTime(0.03, t);
    snapGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.008);

    snapOsc.connect(snapGain);
    snapGain.connect(ctx.destination);
    snapOsc.start(t);
    snapOsc.stop(t + 0.009);

    // 2. Gentle muted pop body (1250Hz -> 820Hz, 18ms, gain 0.12)
    const bodyOsc = ctx.createOscillator();
    const bodyGain = ctx.createGain();
    bodyOsc.type = 'sine';
    bodyOsc.frequency.setValueAtTime(1250, t);
    bodyOsc.frequency.exponentialRampToValueAtTime(820, t + 0.016);

    bodyGain.gain.setValueAtTime(0.12, t);
    bodyGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.018);

    bodyOsc.connect(bodyGain);
    bodyGain.connect(ctx.destination);
    bodyOsc.start(t);
    bodyOsc.stop(t + 0.019);
  } catch {
    playFallback(false);
  }
}
