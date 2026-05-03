"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import {
  cellKey,
  playNoteAudio,
  SEQUENCER_NOTES,
  SEQUENCER_STEPS,
} from "~/features/lib/sequencerNote";

// ── Layout ───────────────────────────────────────────────────────────────────

const Root = styled.div`
  position: fixed;
  inset: 0;
  display: flex;
  flex-direction: column;
  background: #0f172a;
  color: #e2e8f0;
  font-family: "SF Mono", "Fira Code", monospace;
  user-select: none;
  overflow: hidden;
`;

const AppBar = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  background: #1e293b;
  border-bottom: 1px solid #2d4060;
`;

const AppTitle = styled.span`
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: #64748b;
  text-transform: uppercase;
  flex: 1;
`;

const StepCounter = styled.span`
  font-size: 11px;
  color: #38bdf8;
  letter-spacing: 0.06em;
  min-width: 40px;
  text-align: right;
`;

// ── Piano roll ───────────────────────────────────────────────────────────────

const ScrollArea = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
`;

const GridWrap = styled.div`
  display: flex;
`;

const KeysColumn = styled.div`
  flex-shrink: 0;
  width: 44px;
  border-right: 1px solid #2d4060;
`;

const KeyLabel = styled.div<{ $black: boolean }>`
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 6px;
  font-size: 9px;
  color: ${p => (p.$black ? "#475569" : "#94a3b8")};
  background: ${p => (p.$black ? "#0a111e" : "#111e33")};
  border-bottom: 1px solid #0f172a;
  box-sizing: border-box;
  letter-spacing: 0.04em;
`;

const StepsColumn = styled.div`
  flex: 1;
  min-width: 0;
`;

const NoteRow = styled.div<{ $black: boolean }>`
  display: flex;
  height: 28px;
  border-bottom: 1px solid #0f172a;
  background: ${p => (p.$black ? "#0a111e" : "#0e1a2e")};
`;

const Cell = styled.div<{ $on: boolean; $cursor: boolean; $beat: boolean }>`
  flex: 1;
  height: 100%;
  box-sizing: border-box;
  border-right: ${p =>
    p.$beat ? "1px solid #2d4060" : "1px solid #182435"};
  background: ${p =>
    p.$on
      ? "#22d3ee"
      : p.$cursor
      ? "rgba(56, 189, 248, 0.14)"
      : "transparent"};
  transition: background 0.04s;
  cursor: pointer;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;

  &:active {
    filter: brightness(1.4);
  }
`;

// ── Bottom controls ──────────────────────────────────────────────────────────

const BottomBar = styled.div`
  flex-shrink: 0;
  background: #1e293b;
  border-top: 1px solid #2d4060;
  padding: 12px 16px 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const BpmRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ControlLabel = styled.span`
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: #475569;
  text-transform: uppercase;
  flex-shrink: 0;
  width: 30px;
`;

const Slider = styled.input`
  flex: 1;
  height: 4px;
  accent-color: #22d3ee;
  cursor: pointer;
  touch-action: manipulation;
`;

const BpmValue = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: #e2e8f0;
  min-width: 36px;
  text-align: right;
`;

const ActionRow = styled.div`
  display: flex;
  gap: 8px;
`;

const PlayBtn = styled.button<{ $playing: boolean }>`
  flex: 1;
  padding: 13px 0;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 800;
  letter-spacing: 0.06em;
  cursor: pointer;
  touch-action: manipulation;
  background: ${p => (p.$playing ? "#0891b2" : "#22d3ee")};
  color: #0a111e;
  transition: background 0.15s;
  -webkit-tap-highlight-color: transparent;

  &:active {
    opacity: 0.82;
  }
`;

const ClearBtn = styled.button`
  padding: 13px 18px;
  border: 1px solid #2d4060;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  background: transparent;
  color: #64748b;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;

  &:active {
    background: #1e293b;
    color: #94a3b8;
  }
`;

// ── Scheduler constants ───────────────────────────────────────────────────────

const LOOKAHEAD_SEC = 0.1;
const TICK_MS = 25;

// ── Component ────────────────────────────────────────────────────────────────

export default function SequencerScene() {
  const [grid, setGrid] = useState<Set<string>>(new Set());
  const [bpm, setBpm] = useState(120);
  const [isPlaying, setIsPlaying] = useState(false);
  const [cursorStep, setCursorStep] = useState(-1);

  // Keep mutable refs so scheduler closure sees latest values without restarts
  const gridRef = useRef(grid);
  gridRef.current = grid;
  const bpmRef = useRef(bpm);
  bpmRef.current = bpm;

  const audioCtxRef = useRef<AudioContext | null>(null);
  const pbRef = useRef({
    startAudioTime: 0,
    lastScheduledStep: -1,
    intervalId: null as ReturnType<typeof setInterval> | null,
  });

  const getCtx = useCallback((): AudioContext => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (
        window.AudioContext ||
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).webkitAudioContext
      )();
    }
    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  const stepSec = useCallback(() => 60 / (bpmRef.current * 4), []);

  const scheduleStep = useCallback(
    (step: number, time: number) => {
      const ctx = audioCtxRef.current!;
      const dur = stepSec() * 0.82;
      SEQUENCER_NOTES.forEach(note => {
        if (gridRef.current.has(cellKey(step, note.midi))) {
          playNoteAudio(ctx, note.freq, time, dur);
        }
      });
    },
    [stepSec],
  );

  const tick = useCallback(() => {
    const ctx = audioCtxRef.current;
    if (!ctx) return;
    const pb = pbRef.current;
    const now = ctx.currentTime;
    const dur = stepSec();

    // Schedule steps within lookahead window
    const upTo = Math.floor(
      (now + LOOKAHEAD_SEC - pb.startAudioTime) / dur,
    );
    for (let s = pb.lastScheduledStep + 1; s <= upTo; s++) {
      const step = ((s % SEQUENCER_STEPS) + SEQUENCER_STEPS) % SEQUENCER_STEPS;
      scheduleStep(step, pb.startAudioTime + s * dur);
    }
    if (upTo > pb.lastScheduledStep) pb.lastScheduledStep = upTo;

    // Visual cursor
    const elapsed = now - pb.startAudioTime;
    const total = Math.floor(elapsed / dur);
    setCursorStep(((total % SEQUENCER_STEPS) + SEQUENCER_STEPS) % SEQUENCER_STEPS);
  }, [stepSec, scheduleStep]);

  const startPlayback = useCallback(() => {
    const ctx = getCtx();
    const pb = pbRef.current;
    pb.startAudioTime = ctx.currentTime + 0.05;
    pb.lastScheduledStep = -1;
    tick();
    pb.intervalId = setInterval(tick, TICK_MS);
  }, [getCtx, tick]);

  const stopPlayback = useCallback(() => {
    const pb = pbRef.current;
    if (pb.intervalId !== null) {
      clearInterval(pb.intervalId);
      pb.intervalId = null;
    }
    setCursorStep(-1);
  }, []);

  const handlePlayToggle = useCallback(() => {
    if (isPlaying) {
      stopPlayback();
      setIsPlaying(false);
    } else {
      startPlayback();
      setIsPlaying(true);
    }
  }, [isPlaying, startPlayback, stopPlayback]);

  useEffect(() => () => stopPlayback(), [stopPlayback]);

  const toggleCell = useCallback((step: number, midi: number) => {
    const key = cellKey(step, midi);
    setGrid(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  return (
    <Root>
      <AppBar>
        <AppTitle>Sequencer</AppTitle>
        <StepCounter>
          {isPlaying && cursorStep >= 0
            ? `${String(cursorStep + 1).padStart(2, "0")} / ${SEQUENCER_STEPS}`
            : ""}
        </StepCounter>
      </AppBar>

      <ScrollArea>
        <GridWrap>
          <KeysColumn>
            {SEQUENCER_NOTES.map(note => (
              <KeyLabel key={note.midi} $black={note.isBlack}>
                {note.label}
              </KeyLabel>
            ))}
          </KeysColumn>

          <StepsColumn>
            {SEQUENCER_NOTES.map(note => (
              <NoteRow key={note.midi} $black={note.isBlack}>
                {Array.from({ length: SEQUENCER_STEPS }, (_, step) => (
                  <Cell
                    key={step}
                    $on={grid.has(cellKey(step, note.midi))}
                    $cursor={cursorStep === step}
                    $beat={step % 4 === 3}
                    onClick={() => toggleCell(step, note.midi)}
                  />
                ))}
              </NoteRow>
            ))}
          </StepsColumn>
        </GridWrap>
      </ScrollArea>

      <BottomBar>
        <BpmRow>
          <ControlLabel>BPM</ControlLabel>
          <Slider
            type="range"
            min={40}
            max={200}
            value={bpm}
            onChange={e => setBpm(Number(e.target.value))}
          />
          <BpmValue>{bpm}</BpmValue>
        </BpmRow>
        <ActionRow>
          <ClearBtn onClick={() => setGrid(new Set())}>Clear</ClearBtn>
          <PlayBtn $playing={isPlaying} onClick={handlePlayToggle}>
            {isPlaying ? "■  STOP" : "▶  PLAY"}
          </PlayBtn>
        </ActionRow>
      </BottomBar>
    </Root>
  );
}
