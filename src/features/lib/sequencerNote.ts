export const SEQUENCER_STEPS = 16;

const NOTE_LABELS = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];
const BLACK_SEMITONES = new Set([1, 3, 6, 8, 10]);

export interface NoteInfo {
  midi: number;
  label: string;
  isBlack: boolean;
  freq: number;
}

function midiToFreq(midi: number): number {
  return 440 * 2 ** ((midi - 69) / 12);
}

// C5 (72) down to C3 (48): 25 notes, displayed high → low
export const SEQUENCER_NOTES: NoteInfo[] = Array.from({ length: 25 }, (_, i) => {
  const midi = 72 - i;
  const semitone = midi % 12;
  const octave = Math.floor(midi / 12) - 1;
  return {
    midi,
    label: `${NOTE_LABELS[semitone]}${octave}`,
    isBlack: BLACK_SEMITONES.has(semitone),
    freq: midiToFreq(midi),
  };
});

export function cellKey(step: number, midi: number): string {
  return `${step}:${midi}`;
}

export function playNoteAudio(
  ctx: AudioContext,
  freq: number,
  startTime: number,
  duration: number,
): void {
  const master = ctx.createGain();
  master.connect(ctx.destination);

  // Sine fundamental + quieter 2nd harmonic → vibraphone/marimba timbre
  const freqs = [freq, freq * 2];
  const vols  = [0.7, 0.3];
  freqs.forEach((f, i) => {
    const osc = ctx.createOscillator();
    const g   = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = f;
    g.gain.value = vols[i];
    osc.connect(g);
    g.connect(master);
    osc.start(startTime);
    osc.stop(startTime + duration + 0.06);
  });

  const d = Math.max(duration, 0.08);
  master.gain.setValueAtTime(0, startTime);
  master.gain.linearRampToValueAtTime(0.42, startTime + 0.004);
  master.gain.exponentialRampToValueAtTime(0.001, startTime + d);
}
