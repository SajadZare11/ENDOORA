"use client";

import { useEffect, useRef } from "react";
import styles from "./hexagon-mesh.module.css";

// The 8 header section themes from Endoora + brand accents
const SECTION_COLORS = [
  { name: "school",   r: 109, g: 40,  b: 217 }, // #6d28d9 Royal Violet (School)
  { name: "teachers", r: 234, g: 88,  b: 12  }, // #ea580c Warm Amber (Teachers)
  { name: "classes",  r: 5,   g: 150, b: 105 }, // #059669 Emerald (Classes)
  { name: "skills",   r: 2,   g: 132, b: 199 }, // #0284c7 Sky/Cyan (Skills)
  { name: "learn",    r: 79,  g: 70,  b: 229 }, // #4f46e5 Electric Indigo (Learn)
  { name: "ielts",    r: 225, g: 29,  b: 72  }, // #e11d48 Ruby Crimson (IELTS)
  { name: "pricing",  r: 217, g: 119, b: 6   }, // #d97706 Sunset Gold (Pricing)
  { name: "books",    r: 13,  g: 148, b: 136 }, // #0d9488 Teal (Books)
  { name: "brand",    r: 37,  g: 99,  b: 235 }, // #2563eb Endoora Blue
  { name: "aurora",   r: 139, g: 92,  b: 246 }, // #8b5cf6 Purple
] as const;

type ColorRGB = (typeof SECTION_COLORS)[number];

// Fine, delicate micro-hexagons (radius 13px, width ~22.5px)
const HEX_RADIUS = 13;
const HEX_WIDTH = Math.sqrt(3) * HEX_RADIUS; // ~22.52px
const HEX_HEIGHT = 1.5 * HEX_RADIUS; // 19.5px

interface EdgeTracer {
  col: number;
  row: number;
  edgeIndex: number; // 0..5
  direction: 1 | -1;
  color: ColorRGB;
  progress: number; // 0..1
  speed: number;
  alpha: number;
  stepsRemaining: number;
}

// Calculate the 6 vertices of a pointy-topped hexagon
function getHexVertices(cx: number, cy: number, r: number): Array<[number, number]> {
  const vertices: Array<[number, number]> = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 180) * (60 * i - 30);
    vertices.push([cx + r * Math.cos(angle), cy + r * Math.sin(angle)]);
  }
  return vertices;
}

function drawHexagonWireframe(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
  const v = getHexVertices(cx, cy, r);
  ctx.beginPath();
  ctx.moveTo(v[0][0], v[0][1]);
  for (let i = 1; i < 6; i++) {
    ctx.lineTo(v[i][0], v[i][1]);
  }
  ctx.closePath();
}

export function HexagonMeshBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let offscreenCanvas: HTMLCanvasElement | null = null;
    let cols = 0;
    let rows = 0;

    // Active edge tracers
    let tracers: EdgeTracer[] = [];
    let colorCounter = 0;

    // Mouse tracking for reactive spark ripples
    let lastMouseCol = -1;
    let lastMouseRow = -1;

    function getHexCenter(col: number, row: number): [number, number] {
      const cx = (col + 0.5) * HEX_WIDTH + (row % 2 === 1 ? HEX_WIDTH / 2 : 0);
      const cy = (row + 0.7) * HEX_HEIGHT;
      return [cx, cy];
    }

    function createOffscreenGrid(w: number, h: number, pixelRatio: number) {
      const off = document.createElement("canvas");
      off.width = w * pixelRatio;
      off.height = h * pixelRatio;
      const offCtx = off.getContext("2d");
      if (!offCtx) return null;

      offCtx.scale(pixelRatio, pixelRatio);

      // Clean silvery gray lattice lines on pure white
      offCtx.strokeStyle = "rgba(226, 232, 240, 0.75)";
      offCtx.lineWidth = 0.85;

      for (let r = -1; r <= rows + 1; r++) {
        for (let c = -1; c <= cols + 1; c++) {
          const [cx, cy] = getHexCenter(c, r);
          drawHexagonWireframe(offCtx, cx, cy, HEX_RADIUS);
          offCtx.stroke();
        }
      }

      return off;
    }

    function spawnTracer(startCol?: number, startRow?: number, forcedColor?: ColorRGB) {
      if (cols <= 0 || rows <= 0) return;
      const col = startCol ?? Math.floor(Math.random() * cols);
      const row = startRow ?? Math.floor(Math.random() * rows);
      const edgeIndex = Math.floor(Math.random() * 6);
      const direction: 1 | -1 = Math.random() > 0.5 ? 1 : -1;

      const color = forcedColor ?? SECTION_COLORS[colorCounter % SECTION_COLORS.length];
      colorCounter++;

      tracers.push({
        col,
        row,
        edgeIndex,
        direction,
        color,
        progress: 0,
        speed: 0.016 + Math.random() * 0.018,
        alpha: 0.75 + Math.random() * 0.25,
        stepsRemaining: 2 + Math.floor(Math.random() * 4), // 2 to 5 consecutive edge hops
      });
    }

    function resize() {
      if (!canvas) return;
      const parent = canvas.parentElement;
      width = parent?.clientWidth || window.innerWidth;
      height = parent?.clientHeight || window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      cols = Math.ceil(width / HEX_WIDTH) + 1;
      rows = Math.ceil(height / HEX_HEIGHT) + 1;

      offscreenCanvas = createOffscreenGrid(width, height, dpr);

      // Seed initial tracers
      const targetCount = Math.max(20, Math.min(50, Math.floor((cols * rows) / 45)));
      tracers = [];
      for (let i = 0; i < targetCount; i++) {
        spawnTracer();
        if (tracers[i]) {
          tracers[i].progress = Math.random() * 0.9;
        }
      }
    }

    function handlePointerMove(e: PointerEvent) {
      const rect = canvas?.getBoundingClientRect();
      if (!rect) return;
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      const col = Math.floor(mx / HEX_WIDTH);
      const row = Math.floor(my / HEX_HEIGHT);

      if (col !== lastMouseCol || row !== lastMouseRow) {
        lastMouseCol = col;
        lastMouseRow = row;

        if (col >= 0 && col < cols && row >= 0 && row < rows) {
          // Spawn 1-2 reactive tracers at cursor position
          if (tracers.length < 65) {
            spawnTracer(col, row);
          }
        }
      }
    }

    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    let animationFrameId: number;
    let isRunning = true;

    function renderStaticGrid() {
      if (!ctx || !offscreenCanvas) return;
      ctx.clearRect(0, 0, width * dpr, height * dpr);
      ctx.drawImage(offscreenCanvas, 0, 0);

      // Render a few static decorative edge accents
      ctx.save();
      ctx.scale(dpr, dpr);
      const sampleCount = Math.min(15, tracers.length);
      for (let i = 0; i < sampleCount; i++) {
        const t = tracers[i];
        const [cx, cy] = getHexCenter(t.col, t.row);
        const v = getHexVertices(cx, cy, HEX_RADIUS);
        const v1 = v[t.edgeIndex];
        const v2 = v[(t.edgeIndex + 1) % 6];

        ctx.strokeStyle = `rgba(${t.color.r}, ${t.color.g}, ${t.color.b}, 0.8)`;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(v1[0], v1[1]);
        ctx.lineTo(v2[0], v2[1]);
        ctx.stroke();
      }
      ctx.restore();
    }

    function tick() {
      if (!isRunning || !ctx) return;

      ctx.clearRect(0, 0, width * dpr, height * dpr);

      // 1. Draw cached silvery wireframe lattice
      if (offscreenCanvas) {
        ctx.drawImage(offscreenCanvas, 0, 0);
      }

      ctx.save();
      ctx.scale(dpr, dpr);

      // 2. Animate and draw edge tracers
      const targetCount = Math.max(22, Math.min(48, Math.floor((cols * rows) / 45)));

      for (let i = tracers.length - 1; i >= 0; i--) {
        const t = tracers[i];
        t.progress += t.speed;

        const [cx, cy] = getHexCenter(t.col, t.row);
        const v = getHexVertices(cx, cy, HEX_RADIUS);
        const startVertex = t.direction === 1 ? v[t.edgeIndex] : v[(t.edgeIndex + 1) % 6];
        const endVertex = t.direction === 1 ? v[(t.edgeIndex + 1) % 6] : v[t.edgeIndex];

        const p = Math.min(1, t.progress);
        const currentX = startVertex[0] + (endVertex[0] - startVertex[0]) * p;
        const currentY = startVertex[1] + (endVertex[1] - startVertex[1]) * p;

        // Tail calculation (trailing light beam along the edge)
        const tailProgress = Math.max(0, p - 0.45);
        const tailX = startVertex[0] + (endVertex[0] - startVertex[0]) * tailProgress;
        const tailY = startVertex[1] + (endVertex[1] - startVertex[1]) * tailProgress;

        // Calculate opacity envelope (fade in and fade out)
        let drawAlpha = t.alpha;
        if (p < 0.2) {
          drawAlpha *= p / 0.2;
        } else if (p > 0.8) {
          drawAlpha *= (1 - p) / 0.2;
        }

        if (drawAlpha > 0.01) {
          // Soft glowing aura along the edge
          ctx.strokeStyle = `rgba(${t.color.r}, ${t.color.g}, ${t.color.b}, ${drawAlpha * 0.35})`;
          ctx.lineWidth = 3.2;
          ctx.beginPath();
          ctx.moveTo(tailX, tailY);
          ctx.lineTo(currentX, currentY);
          ctx.stroke();

          // Crisp sharp center laser line
          ctx.strokeStyle = `rgba(${t.color.r}, ${t.color.g}, ${t.color.b}, ${drawAlpha * 0.95})`;
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.moveTo(tailX, tailY);
          ctx.lineTo(currentX, currentY);
          ctx.stroke();

          // Sparkling head spark
          ctx.fillStyle = `rgba(${t.color.r}, ${t.color.g}, ${t.color.b}, ${drawAlpha})`;
          ctx.beginPath();
          ctx.arc(currentX, currentY, 1.4, 0, Math.PI * 2);
          ctx.fill();
        }

        // When tracer reaches the end of the current edge
        if (t.progress >= 1) {
          if (t.stepsRemaining > 0) {
            // Hop to an adjacent edge (next edge on this hex or an adjacent cell)
            t.edgeIndex = (t.edgeIndex + (t.direction === 1 ? 1 : 5)) % 6;
            t.progress = 0;
            t.stepsRemaining -= 1;
            // 35% chance to drift to a neighboring hexagon
            if (Math.random() < 0.35) {
              const dCol = (Math.random() > 0.5 ? 1 : -1);
              const dRow = (Math.random() > 0.5 ? 1 : -1);
              const nextC = t.col + dCol;
              const nextR = t.row + dRow;
              if (nextC >= 0 && nextC < cols && nextR >= 0 && nextR < rows) {
                t.col = nextC;
                t.row = nextR;
              }
            }
          } else {
            tracers.splice(i, 1);
          }
        }
      }

      ctx.restore();

      // Maintain balanced pool count
      if (tracers.length < targetCount && Math.random() < 0.12) {
        spawnTracer();
      }

      animationFrameId = requestAnimationFrame(tick);
    }

    function handleVisibilityChange() {
      if (document.hidden) {
        isRunning = false;
        cancelAnimationFrame(animationFrameId);
      } else {
        if (!isRunning) {
          isRunning = true;
          if (!prefersReducedMotion) {
            animationFrameId = requestAnimationFrame(tick);
          }
        }
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);

    resize();
    window.addEventListener("resize", resize, { passive: true });

    if (prefersReducedMotion) {
      renderStaticGrid();
    } else {
      animationFrameId = requestAnimationFrame(tick);
    }

    return () => {
      isRunning = false;
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <div className={styles.canvasContainer} aria-hidden="true">
      <canvas ref={canvasRef} className={styles.canvas} />
    </div>
  );
}
