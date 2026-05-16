import { useCallback, useRef } from 'react';
import { useGameStore } from '../store/useGameStore';

export function useGameSound() {
  const ctxRef = useRef<AudioContext | null>(null);
  const soundEnabled = useGameStore(s => s.settings.soundEnabled);

  const getCtx = useCallback(() => {
    if (!soundEnabled) return null;
    if (!ctxRef.current) {
      ctxRef.current = new AudioContext();
    }
    return ctxRef.current;
  }, [soundEnabled]);

  const playTone = useCallback((freq: number, duration: number, type: OscillatorType = 'square') => {
    const ctx = getCtx();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  }, [getCtx]);

  const playCorrect = useCallback(() => {
    playTone(300, 0.08);
    setTimeout(() => playTone(500, 0.1), 60);
  }, [playTone]);

  const playWrong = useCallback(() => {
    playTone(200, 0.15, 'sawtooth');
    setTimeout(() => playTone(120, 0.2, 'sawtooth'), 100);
  }, [playTone]);

  const playCombo = useCallback((combo: number) => {
    const baseFreq = Math.min(400 + combo * 50, 1000);
    playTone(baseFreq, 0.06);
    setTimeout(() => playTone(baseFreq * 1.3, 0.08), 50);
  }, [playTone]);

  const playBossDefeat = useCallback(() => {
    [400, 600, 800].forEach((f, i) => {
      setTimeout(() => playTone(f, 0.15, 'triangle'), i * 80);
    });
  }, [playTone]);

  const playBossStart = useCallback(() => {
    playTone(150, 0.3, 'sawtooth');
    setTimeout(() => playTone(100, 0.4, 'sawtooth'), 200);
  }, [playTone]);

  return { playCorrect, playWrong, playCombo, playBossDefeat, playBossStart };
}
