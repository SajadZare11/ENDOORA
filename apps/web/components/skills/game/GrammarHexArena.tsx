"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import styles from "./grammar-hex.module.css";
import type { GameLevel, HexEdgeOption, HexCircuitNode, GrammarCircuitRound } from "../../../data/skills/games/types";
import { getGrammarStageData } from "../../../data/skills/games/grammar-aef-curriculum";
import { recordGrammarHexCompletion, formatStopwatchTime } from "../../../lib/skills/game-storage";
import { soundSynth } from "../../../lib/skills/game-audio";

interface Props {
  level: GameLevel;
  onClose: () => void;
  onNextLevel: () => void;
  onOpenLeaderboard?: () => void;
}

interface HexEdgeGeom {
  index: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  midX: number;
  midY: number;
}

interface CompletedMiniStep {
  stepIndex: number;
  word: string;
  edgeIndex: number;
  cx: number;
  cy: number;
  pointsStr: string;
}

// Preferred slot order for readability: Top, Upper-Right, Lower-Right, Bottom, Lower-Left, Upper-Left
const EDGE_SLOT_ORDER = [4, 5, 0, 1, 2, 3];

// Fisher-Yates array shuffle helper
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const MINI_HEX_RADIUS = 44;

// Mini-Hex single vertical rail along left margin (clean vertical trail with zero overlap)
function getMiniHexCoord(index: number): { cx: number; cy: number } {
  const cx = 68;
  const cy = 60 + index * 94;
  return { cx, cy };
}

// Helper to format text neatly inside mini-hexagons without overflowing
function renderMiniHexText(word: string, cx: number, cy: number) {
  const trimmed = word.trim();
  const spaceIdx = trimmed.indexOf(" ");
  if (spaceIdx !== -1 && trimmed.length > 7) {
    const half = Math.floor(trimmed.length / 2);
    const spaces: number[] = [];
    for (let i = 0; i < trimmed.length; i++) {
      if (trimmed[i] === " ") spaces.push(i);
    }
    const bestSpace = spaces.reduce((prev, curr) => Math.abs(curr - half) < Math.abs(prev - half) ? curr : prev, spaceIdx);
    const line1 = trimmed.slice(0, bestSpace);
    const line2 = trimmed.slice(bestSpace + 1);
    return (
      <>
        <tspan x={cx} dy="-0.55em">{line1}</tspan>
        <tspan x={cx} dy="1.15em">{line2}</tspan>
      </>
    );
  }
  return trimmed;
}

function getMiniHexPoints(cx: number, cy: number, r = MINI_HEX_RADIUS): string {
  const pts: string[] = [];
  for (let k = 0; k < 6; k++) {
    const angle = (k * 60 * Math.PI) / 180;
    pts.push(`${(cx + r * Math.cos(angle)).toFixed(1)},${(cy + r * Math.sin(angle)).toFixed(1)}`);
  }
  return pts.join(" ");
}

function getMiniHexEdge(cx: number, cy: number, edgeIndex: number, r = MINI_HEX_RADIUS) {
  const a1 = (edgeIndex * 60 * Math.PI) / 180;
  const a2 = (((edgeIndex + 1) % 6) * 60 * Math.PI) / 180;
  return {
    x1: Number((cx + r * Math.cos(a1)).toFixed(1)),
    y1: Number((cy + r * Math.sin(a1)).toFixed(1)),
    x2: Number((cx + r * Math.cos(a2)).toFixed(1)),
    y2: Number((cy + r * Math.sin(a2)).toFixed(1)),
  };
}

export function GrammarHexArena({ level, onClose, onNextLevel, onOpenLeaderboard }: Props) {
  const stageData = getGrammarStageData(level.cefr, level.levelNumber);

  // Stage Time Limit (50s for A1/A2, 60s for B1/B2, 85s for C1/C2)
  const stageTimeLimit =
    level.cefr === "A1" || level.cefr === "A2" ? 50 : level.cefr === "C1" || level.cefr === "C2" ? 85 : 60;

  const [roundIndex, setRoundIndex] = useState(0);
  const [restartKey, setRestartKey] = useState(0);
  const [sessionOffset] = useState(() => Math.floor(Math.random() * 20));

  const activeCircuit: GrammarCircuitRound | null = useMemo(() => {
    if (!stageData?.circuits?.length) return null;
    const pool = stageData.circuits;
    const idx = (roundIndex + restartKey + sessionOffset) % pool.length;
    return pool[idx] || pool[0];
  }, [stageData, roundIndex, restartKey, sessionOffset]);

  const [currentNodeId, setCurrentNodeId] = useState<string>("n0");
  const [accumulatedWords, setAccumulatedWords] = useState<string[]>([]);
  const [completedSteps, setCompletedSteps] = useState<CompletedMiniStep[]>([]);

  // Transition & Laser States
  const [isWarping, setIsWarping] = useState(false);
  const [energizedEdge, setEnergizedEdge] = useState<{
    geom: HexEdgeGeom;
    option: HexEdgeOption;
    isCorrect: boolean;
  } | null>(null);
  const [isAtGoalTerminal, setIsAtGoalTerminal] = useState(false);

  // Electrical Short Circuit Freeze
  const [isFrozen, setIsFrozen] = useState(false);
  const [freezeSeconds, setFreezeSeconds] = useState(0);

  // Streak & Scoring
  const [cleanStreak, setCleanStreak] = useState(0);
  const [maxCleanStreak, setMaxCleanStreak] = useState(0);
  const [score, setScore] = useState(0);
  const [comboMultiplier, setComboMultiplier] = useState(1.0);

  // Countdown Timer & Energy Bar
  const [timeLeft, setTimeLeft] = useState(stageTimeLimit);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Results & Stage Completion (Vocabulary-style Modal)
  const [isGameOver, setIsGameOver] = useState(false);
  const [stagePassed, setStagePassed] = useState(false);
  const [honoraryTitle, setHonoraryTitle] = useState("معمار سازه نحو");

  const activeNode: HexCircuitNode | undefined = activeCircuit?.nodes.find((n) => n.id === currentNodeId);

  // Randomize edge assignment order on each node entry to prevent position memorization
  const randomizedOptions = useMemo<HexEdgeOption[]>(() => {
    if (!activeNode?.options) return [];
    return shuffleArray(activeNode.options);
  }, [activeNode?.id, roundIndex, restartKey]);

  // --------------------------------------------------------------------------
  // Main Active Hexagon Geometry:
  // Center (cx, cy) = (620, 310), Radius R = 195px
  // Perfectly positioned to give breathing room to the left Mini-Hex Trail
  // --------------------------------------------------------------------------
  const hexConfig = useMemo(() => {
    const viewWidth = 1080;
    const viewHeight = 620;
    const cx = 690;
    const cy = 295;
    const R = 195;
    const innerR = 180;

    // 6 Vertices at 0°, 60°, 120°, 180°, 240°, 300°
    const vertices: { x: number; y: number }[] = [];
    const innerVertices: { x: number; y: number }[] = [];
    for (let k = 0; k < 6; k++) {
      const angle = (k * 60 * Math.PI) / 180;
      vertices.push({
        x: Number((cx + R * Math.cos(angle)).toFixed(1)),
        y: Number((cy + R * Math.sin(angle)).toFixed(1)),
      });
      innerVertices.push({
        x: Number((cx + innerR * Math.cos(angle)).toFixed(1)),
        y: Number((cy + innerR * Math.sin(angle)).toFixed(1)),
      });
    }

    const pointsStr = vertices.map((v) => `${v.x},${v.y}`).join(" ");
    const innerPointsStr = innerVertices.map((v) => `${v.x},${v.y}`).join(" ");

    // 6 Physical Edges
    const edges: HexEdgeGeom[] = vertices.map((v, k) => {
      const nextV = vertices[(k + 1) % 6];
      const midX = Number(((v.x + nextV.x) / 2).toFixed(1));
      const midY = Number(((v.y + nextV.y) / 2).toFixed(1));

      return {
        index: k,
        x1: v.x,
        y1: v.y,
        x2: nextV.x,
        y2: nextV.y,
        midX,
        midY,
      };
    });

    return {
      viewWidth,
      viewHeight,
      cx,
      cy,
      R,
      vertices,
      pointsStr,
      innerPointsStr,
      edges,
    };
  }, []);

  // Initialize round state
  useEffect(() => {
    if (activeCircuit) {
      setCurrentNodeId("n0");
      setAccumulatedWords([activeCircuit.startingPrompt]);

      // Seed step 0 (prompt node) into the left mini-trail
      const startCoord = getMiniHexCoord(0);
      setCompletedSteps([
        {
          stepIndex: 0,
          word: activeCircuit.startingPrompt,
          edgeIndex: -1,
          cx: startCoord.cx,
          cy: startCoord.cy,
          pointsStr: getMiniHexPoints(startCoord.cx, startCoord.cy),
        },
      ]);

      setIsAtGoalTerminal(false);
      setEnergizedEdge(null);
      setIsWarping(false);
    }
  }, [roundIndex, activeCircuit, restartKey]);

  // Reset game & modal state when level advances
  useEffect(() => {
    setIsGameOver(false);
    setIsAtGoalTerminal(false);
    setIsTimerRunning(true);
    setRoundIndex(0);
    setScore(0);
    setCleanStreak(0);
    setMaxCleanStreak(0);
    setElapsedSeconds(0);
    setTimeLeft(stageTimeLimit);
    setIsFrozen(false);
    setFreezeSeconds(0);
  }, [level.cefr, level.levelNumber, stageTimeLimit]);

  // Main Countdown Timer & Elapsed Stopwatch
  useEffect(() => {
    if (!isTimerRunning || isGameOver || isAtGoalTerminal) return;
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => Number((prev + 0.1).toFixed(1)));
      setTimeLeft((prev) => {
        if (prev <= 0.1) {
          handleTimeExpired();
          return 0;
        }
        return Number((prev - 0.1).toFixed(1));
      });
    }, 100);
    return () => clearInterval(interval);
  }, [isTimerRunning, isGameOver, isAtGoalTerminal]);

  // Freeze countdown timer
  useEffect(() => {
    if (!isFrozen) return;
    const interval = setInterval(() => {
      setFreezeSeconds((prev) => {
        if (prev <= 0.1) {
          setIsFrozen(false);
          return 0;
        }
        return Number((prev - 0.1).toFixed(1));
      });
    }, 100);
    return () => clearInterval(interval);
  }, [isFrozen]);

  // Time ran out handler
  const handleTimeExpired = () => {
    if (isAtGoalTerminal || isGameOver) return;
    setIsTimerRunning(false);
    setIsGameOver(true);
    setStagePassed(false);
    soundSynth.playWrong();
  };

  // Handle Edge Click: Animate laser line directly along the edge
  const handleEdgeClick = (edgeGeom: HexEdgeGeom, option: HexEdgeOption) => {
    if (isFrozen || isGameOver || energizedEdge || isWarping || isAtGoalTerminal) return;

    if (option.isCorrect) {
      soundSynth.playCorrect();
      setEnergizedEdge({ geom: edgeGeom, option, isCorrect: true });

      const newStreak = cleanStreak + 1;
      setCleanStreak(newStreak);
      if (newStreak > maxCleanStreak) setMaxCleanStreak(newStreak);

      // Multiplier logic
      let nextMultiplier = 1.0;
      if (option.isBranchingClause) {
        nextMultiplier = option.comboBoost || 2.0;
      } else if (newStreak >= 8) {
        nextMultiplier = 2.5;
      } else if (newStreak >= 5) {
        nextMultiplier = 2.0;
      } else if (newStreak >= 3) {
        nextMultiplier = 1.5;
      }
      setComboMultiplier(nextMultiplier);

      const earnedPoints = Math.round((140 + (option.isBranchingClause ? 200 : 0)) * nextMultiplier);
      setScore((prev) => prev + earnedPoints);

      const nextNode = activeCircuit?.nodes.find((n) => n.id === option.nextNodeId);
      const isGoalStep = nextNode?.isGoal || !option.nextNodeId || nextNode?.options.length === 0;

      // Stop timer immediately on goal step so countdown never depletes while viewing final laser
      if (isGoalStep) {
        setIsTimerRunning(false);
      }

      // 1. Let the green laser complete its transit on the edge (420ms)
      setTimeout(() => {
        // Record completed step into the left mini-trail
        const stepNum = completedSteps.length;
        const miniCoord = getMiniHexCoord(stepNum);
        setCompletedSteps((prev) => [
          ...prev,
          {
            stepIndex: stepNum,
            word: option.text,
            edgeIndex: edgeGeom.index,
            cx: miniCoord.cx,
            cy: miniCoord.cy,
            pointsStr: getMiniHexPoints(miniCoord.cx, miniCoord.cy),
          },
        ]);

        // 2. Start the 3D forward warp transition
        setIsWarping(true);

        setTimeout(() => {
          setAccumulatedWords((prev) => [...prev, option.text]);
          setEnergizedEdge(null);

          if (isGoalStep) {
            // Reached Goal Terminal!
            setIsTimerRunning(false);
            setIsAtGoalTerminal(true);
            setIsWarping(false);
            soundSynth.playFanfare();
          } else {
            // Spawn next hexagon
            if (option.nextNodeId) {
              setCurrentNodeId(option.nextNodeId);
            }
            setIsWarping(false);
          }
        }, 320);
      }, 420);
    } else {
      // Short Circuit Shock & Freeze
      soundSynth.playWrong();
      setEnergizedEdge({ geom: edgeGeom, option, isCorrect: false });
      setCleanStreak(0);
      setComboMultiplier(1.0);
      setIsFrozen(true);
      setFreezeSeconds(2.0);

      setTimeout(() => {
        setEnergizedEdge(null);
      }, 500);
    }
  };

  // When user clicks Next Level from Goal Terminal or Victory Modal
  const handleGoToNextLevel = () => {
    setIsGameOver(false);
    setIsAtGoalTerminal(false);

    recordGrammarHexCompletion(
      level.cefr,
      level.levelNumber,
      {
        finalScore: score + 500,
        cleanStreak: maxCleanStreak,
        speedrunSeconds: elapsedSeconds,
        trapsDisarmed: 0,
        wonDualRace: true,
        accuracy: Math.min(100, Math.round((maxCleanStreak / Math.max(1, maxCleanStreak + (isFrozen ? 2 : 0))) * 100)),
        stars: maxCleanStreak >= 6 ? 3 : maxCleanStreak >= 3 ? 2 : 1,
      },
      level.xpReward || 150
    );

    soundSynth.playFanfare();

    if (onNextLevel) {
      onNextLevel();
    }
  };


  const handleStageVictory = () => {
    setIsTimerRunning(false);
    setIsGameOver(true);
    setStagePassed(true);
    soundSynth.playFanfare();

    let title = "معمار سازه نحو";
    if (maxCleanStreak >= 8) {
      title = "استاد اعظم سیم‌کشی جملات ⚡";
    } else if (maxCleanStreak >= 5) {
      title = "مهندس ارشد مدار گرامری 🚀";
    }
    setHonoraryTitle(title);

    // Save result to persistent storage & leaderboard
    recordGrammarHexCompletion(
      level.cefr,
      level.levelNumber,
      {
        finalScore: score + 500,
        cleanStreak: maxCleanStreak,
        speedrunSeconds: elapsedSeconds,
        trapsDisarmed: 0,
        wonDualRace: true,
        accuracy: Math.min(100, Math.round((maxCleanStreak / Math.max(1, maxCleanStreak + (isFrozen ? 2 : 0))) * 100)),
        stars: maxCleanStreak >= 6 ? 3 : maxCleanStreak >= 3 ? 2 : 1,
      },
      level.xpReward || 150
    );
  };

  const handleRestart = () => {
    setRestartKey((prev) => prev + 1);
    setRoundIndex(0);
    setTimeLeft(stageTimeLimit);
    setElapsedSeconds(0);
    setScore(0);
    setCleanStreak(0);
    setMaxCleanStreak(0);
    setComboMultiplier(1.0);
    setIsGameOver(false);
    setStagePassed(false);
    setIsTimerRunning(true);
    setIsFrozen(false);
    setFreezeSeconds(0);
    setIsAtGoalTerminal(false);
    setEnergizedEdge(null);
    setIsWarping(false);
  };

  const energyPercent = Math.max(0, Math.min(100, (timeLeft / stageTimeLimit) * 100));
  const isDangerTime = timeLeft <= 15;

  return (
    <div className={styles.overlay}>
      <div className={styles.arenaCard}>
        {/* HUD Top Bar */}
        <div className={styles.hudBar}>
          <div className={styles.stageMeta}>
            <span className={styles.cefrPill}>{level.cefr}</span>
            <div>
              <h2 className={styles.stageTitle}>
                {stageData?.titleFa || level.titleFa} (مرحله {level.levelNumber})
              </h2>
              <span className={styles.aefBadge}>
                {stageData?.aefUnit || "American English File 3rd Edition"}
              </span>
            </div>
          </div>

          <div className={styles.hudMetrics}>
            <div
              className={`${styles.metricBadge} ${styles.stopwatch}`}
              style={{ color: isDangerTime ? "#ef4444" : undefined }}
            >
              ⏳ {Math.ceil(timeLeft)}s
            </div>
            <div className={`${styles.metricBadge} ${styles.streakFire}`}>
              🔥 {cleanStreak}x استریک {comboMultiplier > 1 && `(${comboMultiplier}x)`}
            </div>
            <div className={`${styles.metricBadge} ${styles.scoreGlow}`}>
              ⚡ {score.toLocaleString("fa-IR")} pts
            </div>
            <button className={styles.closeBtn} onClick={onClose} title="بستن بازی" type="button">
              ✕
            </button>
          </div>
        </div>

        {/* Energy & Countdown Bar */}
        <div className={styles.energyTrack}>
          <div
            className={`${styles.energyFill} ${isDangerTime ? styles.energyFillDanger : ""}`}
            style={{ width: `${energyPercent}%` }}
          />
        </div>

        {/* Prompt Banner */}
        <div className={styles.circuitPromptBanner}>
          <div className={styles.accumulatedSentence}>
            {accumulatedWords.map((word, idx) => (
              <span key={idx} className={styles.sentenceFragment}>
                {word}
              </span>
            ))}
            {!isAtGoalTerminal && <span className={styles.activeTargetSlot}>[ انتخاب ضلع بعدی ]</span>}
          </div>
          {activeCircuit && (
            <div className={styles.sentenceTranslation}>
              معنی مقصد: «{activeCircuit.translationFa}»
            </div>
          )}
        </div>

        {/* ================================================================
            Main Progressive Arena Canvas (Mini-Trail on Left, Active Hex on Right)
            ================================================================ */}
        <div className={styles.circuitCanvas}>
          <div className={styles.singleHexWrapper}>
            <svg
              className={styles.singleHexSvg}
              viewBox={`0 0 ${hexConfig.viewWidth} ${hexConfig.viewHeight}`}
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                {/* Neon Glow Filters */}
                <filter id="neonGlowGreen" x="-30%" y="-30%" width="160%" height="160%">
                  <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#10b981" floodOpacity="0.9" />
                  <feDropShadow dx="0" dy="0" stdDeviation="14" floodColor="#34d399" floodOpacity="0.6" />
                </filter>
                <filter id="neonGlowRed" x="-30%" y="-30%" width="160%" height="160%">
                  <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#ef4444" floodOpacity="0.9" />
                  <feDropShadow dx="0" dy="0" stdDeviation="14" floodColor="#f87171" floodOpacity="0.6" />
                </filter>

                {/* Cyber Radar Gradient */}
                <radialGradient id="radarCoreGradient" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#0284c7" stopOpacity="0.25" />
                  <stop offset="65%" stopColor="#4f46e5" stopOpacity="0.1" />
                  <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* ============================================================
                  LEFT SIDE: Mini-Hex Trail with Flowing Electric Currents
                  ============================================================ */}
              {/* Electric Wires connecting completed mini-hex steps */}
              {completedSteps.map((step, idx) => {
                if (idx === 0) return null;
                const prev = completedSteps[idx - 1];
                return (
                  <line
                    key={`mini-wire-${idx}`}
                    x1={prev.cx}
                    y1={prev.cy}
                    x2={step.cx}
                    y2={step.cy}
                    className={styles.electricCurrentWire}
                  />
                );
              })}

              {/* Electric Feeder Line connecting latest Mini-Hex to Main Active Hex */}
              {completedSteps.length > 0 && !isAtGoalTerminal && (
                <line
                  x1={completedSteps[completedSteps.length - 1].cx + MINI_HEX_RADIUS}
                  y1={completedSteps[completedSteps.length - 1].cy}
                  x2={hexConfig.cx - hexConfig.R}
                  y2={hexConfig.cy}
                  className={styles.electricFeederLine}
                />
              )}

              {/* Render Completed Mini-Hexagons in Left Trail */}
              {completedSteps.map((step, idx) => {
                const activeMiniEdge =
                  step.edgeIndex >= 0 ? getMiniHexEdge(step.cx, step.cy, step.edgeIndex, MINI_HEX_RADIUS) : null;

                return (
                  <g key={`mini-hex-${idx}`} className={styles.miniHexGroup}>
                    {/* Glowing Green Hexagon Base */}
                    <polygon points={step.pointsStr} className={styles.miniHexPolygon} />

                    {/* Active Green Answer Edge Wire on the Mini-Hex */}
                    {activeMiniEdge && (
                      <line
                        x1={activeMiniEdge.x1}
                        y1={activeMiniEdge.y1}
                        x2={activeMiniEdge.x2}
                        y2={activeMiniEdge.y2}
                        className={styles.miniHexActiveEdge}
                      />
                    )}

                    {/* Glowing Green Answer Word in Mini-Hex */}
                    <text x={step.cx} y={step.cy} className={styles.miniHexLabel}>
                      {renderMiniHexText(step.word, step.cx, step.cy)}
                    </text>
                  </g>
                );
              })}

              {/* ============================================================
                  RIGHT SIDE: Main Active Hexagon with Radar & Animated Laser
                  ============================================================ */}
              <g className={isWarping ? styles.warpingOut : styles.warpingIn}>
                {/* Central Radar Rings */}
                <circle cx={hexConfig.cx} cy={hexConfig.cy} r={55} className={styles.radarRingSmall} />
                <circle cx={hexConfig.cx} cy={hexConfig.cy} r={100} className={styles.radarRingMed} />
                <circle cx={hexConfig.cx} cy={hexConfig.cy} r={145} className={styles.radarRingLarge} />
                <circle cx={hexConfig.cx} cy={hexConfig.cy} r={165} fill="url(#radarCoreGradient)" />

                {/* Radar Rotating Sweep Line */}
                <g
                  className={styles.radarScannerGroup}
                  style={{ transformOrigin: `${hexConfig.cx}px ${hexConfig.cy}px` }}
                >
                  <line
                    x1={hexConfig.cx}
                    y1={hexConfig.cy}
                    x2={hexConfig.cx + 145}
                    y2={hexConfig.cy}
                    className={styles.radarSweepLine}
                  />
                </g>

                {/* Main Hexagon Contour */}
                <polygon
                  points={hexConfig.pointsStr}
                  className={isAtGoalTerminal ? styles.mainHexGoalPolygon : styles.mainHexPolygon}
                />

                {/* Inner Hexagon Cyber Trim */}
                <polygon points={hexConfig.innerPointsStr} className={styles.innerHexTrim} />

                {/* 6 Physical Edge Base Wires */}
                {hexConfig.edges.map((edge) => (
                  <line
                    key={`base-wire-${edge.index}`}
                    x1={edge.x1}
                    y1={edge.y1}
                    x2={edge.x2}
                    y2={edge.y2}
                    className={styles.edgeBaseWire}
                  />
                ))}

                {/* Running Animated Laser Current along Selected Edge */}
                {energizedEdge && (
                  <g key={`laser-run-${energizedEdge.geom.index}`}>
                    <line
                      x1={energizedEdge.geom.x1}
                      y1={energizedEdge.geom.y1}
                      x2={energizedEdge.geom.x2}
                      y2={energizedEdge.geom.y2}
                      className={energizedEdge.isCorrect ? styles.edgeLaserRunning : styles.edgeShockRunning}
                      filter={energizedEdge.isCorrect ? "url(#neonGlowGreen)" : "url(#neonGlowRed)"}
                    />
                    {/* Energy Spark Head */}
                    <circle
                      cx={energizedEdge.geom.x2}
                      cy={energizedEdge.geom.y2}
                      r={8}
                      className={energizedEdge.isCorrect ? styles.vertexSparkCorrect : styles.vertexSparkWrong}
                    />
                  </g>
                )}

                {/* 6 Corner Vertex Dots */}
                {hexConfig.vertices.map((v, vIdx) => (
                  <circle
                    key={`vertex-${vIdx}`}
                    cx={v.x}
                    cy={v.y}
                    r={5.5}
                    className={isAtGoalTerminal ? styles.vertexDotGoal : styles.vertexDot}
                  />
                ))}

                {/* Central Core Indicator Badge */}
                {!isAtGoalTerminal && (
                  <g>
                    <text x={hexConfig.cx} y={hexConfig.cy} className={styles.coreCurrentPrompt}>
                      {accumulatedWords[accumulatedWords.length - 1] || activeCircuit?.startingPrompt}
                    </text>
                  </g>
                )}
              </g>
            </svg>

            {/* ================================================================
                6 Edge Capsule Buttons Situated Directly ON the Hexagon Edges
                ================================================================ */}
            {!isAtGoalTerminal && (
              <div className={`${styles.edgePillsOverlay} ${isWarping ? styles.warpingOut : styles.warpingIn}`}>
                {hexConfig.edges.map((edgeGeom) => {
                  const optionIdx = EDGE_SLOT_ORDER.indexOf(edgeGeom.index);
                  const option = optionIdx !== -1 ? randomizedOptions[optionIdx] : undefined;
                  if (!option) return null;

                  const isEnergizedThisEdge = energizedEdge?.geom.index === edgeGeom.index;
                  const isThisCorrect = isEnergizedThisEdge && energizedEdge?.isCorrect;
                  const isThisWrong = isEnergizedThisEdge && !energizedEdge?.isCorrect;

                  let pillClass = styles.edgePillButton;
                  if (isThisCorrect) pillClass += ` ${styles.correct}`;
                  if (isThisWrong) pillClass += ` ${styles.wrong}`;

                  return (
                    <button
                      key={option.id}
                      className={pillClass}
                      style={{
                        left: `${(edgeGeom.midX / hexConfig.viewWidth) * 100}%`,
                        top: `${(edgeGeom.midY / hexConfig.viewHeight) * 100}%`,
                      }}
                      disabled={isFrozen || isWarping}
                      onClick={() => handleEdgeClick(edgeGeom, option)}
                      type="button"
                    >
                      <span>{option.text}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* ================================================================
                Glorious Goal Hexagon Terminal Card (When Sentence is Complete)
                ================================================================ */}
            {isAtGoalTerminal && (
              <div className={styles.goalTerminalCard}>
                <div className={styles.goalTerminalIcon}>🏁 ⚡ 🎉</div>
                <h3 className={styles.goalTerminalTitle}>پایانه مدار با موفقیت متصل شد!</h3>
                <div className={styles.goalCompletedSentence}>
                  "{accumulatedWords.join(" ")}"
                </div>
                {activeCircuit && (
                  <div className={styles.goalTranslation}>
                    «{activeCircuit.translationFa}»
                  </div>
                )}
                <div className={styles.goalBadgeRewards}>
                  <span className={styles.goalRewardPill}>⚡ +140 امتیاز مدار</span>
                  {comboMultiplier > 1 && (
                    <span className={styles.goalRewardPillBonus}>🔥 {comboMultiplier}x ضریب کامبو</span>
                  )}
                  <span className={styles.goalRewardPill}>⭐ استریک {cleanStreak}x</span>
                </div>
                {/* Primary Action Buttons: Go to Next Level above View Scorecard */}
                {level.levelNumber < 10 ? (
                  <>
                    <button
                      className={styles.goalNextLevelBtn}
                      onClick={handleGoToNextLevel}
                      type="button"
                    >
                      🚀 رفتن به مرحله بعد (مرحله {level.levelNumber + 1})
                    </button>
                    <button
                      className={styles.goalContinueBtn}
                      onClick={handleStageVictory}
                      type="button"
                    >
                      🏆 مشاهده کارنامه
                    </button>
                  </>
                ) : (
                  <button
                    className={styles.goalNextLevelBtn}
                    onClick={handleStageVictory}
                    type="button"
                  >
                    🏆 مشاهده کارنامه و پایان سطح
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Frozen Short-Circuit Notice */}
          {isFrozen && (
            <div className={styles.freezeBanner}>
              ❄️ اتصال کوتاه قرمز! مدار برای {freezeSeconds} ثانیه قفل است...
            </div>
          )}
        </div>

        {/* ================================================================
            Vocabulary-Style Victory & Game Over Modal
            ================================================================ */}
        {isGameOver && (
          <div className={styles.victoryOverlay}>
            <div className={styles.victoryCard}>
              {/* Stars */}
              <div className={styles.victoryStars}>
                {stagePassed ? (maxCleanStreak >= 6 ? "⭐⭐⭐" : maxCleanStreak >= 3 ? "⭐⭐" : "⭐") : "💔"}
              </div>

              {/* Title & Desc */}
              <h2 className={styles.victoryTitle}>
                {stagePassed
                  ? "آفرین رفیق! مدار گرامری این مرحله با موفقیت کامل شد 🎉"
                  : "زمان مدار تمام شد! نیاز به سرعت و تمرکز بیشتر داری 💪"}
              </h2>

              <p className={styles.victoryDesc}>
                {stagePassed
                  ? `تبریک! توانستی تمامی گره‌های گرامری سطح ${level.cefr} را با تسلط بالا سیم‌کشی کنی.`
                  : "برای عبور از این مرحله دوباره تلاش کن و مسیر درست رو با دقت سیم‌کشی کن!"}
              </p>

              {stagePassed && (
                <div className={styles.victoryHonorBadge}>
                  {honoraryTitle}
                </div>
              )}

              {/* Stats Row */}
              <div className={styles.victoryStatsRow}>
                <div className={styles.victoryStatItem}>
                  <span className={styles.victoryStatVal}>{score.toLocaleString("fa-IR")}</span>
                  <span className={styles.victoryStatLbl}>امتیاز نهایی</span>
                </div>
                <div className={styles.victoryStatItem}>
                  <span className={styles.victoryStatVal}>🔥 {maxCleanStreak}x</span>
                  <span className={styles.victoryStatLbl}>بزرگترین استریک</span>
                </div>
                <div className={styles.victoryStatItem}>
                  <span className={styles.victoryStatVal}>⏱️ {formatStopwatchTime(elapsedSeconds)}</span>
                  <span className={styles.victoryStatLbl}>زمان ثبت‌شده</span>
                </div>
                <div className={styles.victoryStatItem}>
                  <span className={styles.victoryStatVal}>+{stagePassed ? 150 : 30}</span>
                  <span className={styles.victoryStatLbl}>XP کسب‌شده</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className={styles.victoryActions}>
                {stagePassed && level.levelNumber < 10 && (
                  <button className={styles.primaryBtn} onClick={handleGoToNextLevel} type="button">
                    🚀 رفتن به مرحله بعد
                  </button>
                )}
                <button className={styles.primaryBtn} onClick={handleRestart} type="button">
                  🔄 بازی مجدد با جمله جدید
                </button>
                {onOpenLeaderboard && (
                  <button className={styles.tabBtn} onClick={onOpenLeaderboard} type="button">
                    🏆 مشاهده لیدربرد
                  </button>
                )}
                <button className={styles.secondaryBtn} onClick={onClose} type="button">
                  بازگشت به نقشه
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
