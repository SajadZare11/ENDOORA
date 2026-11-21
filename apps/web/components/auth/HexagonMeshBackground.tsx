"use client";

import { useEffect, useRef } from "react";
import styles from "./hexagon-mesh.module.css";

// Uniform Sky Light Blue (#38bdf8 / rgb(56, 189, 248))
const SKY_LIGHT_BLUE = { r: 56, g: 189, b: 248 } as const;

// Refined micro-hexagons (radius 15px, width ~26px)
const HEX_RADIUS = 15;
const HEX_WIDTH = Math.sqrt(3) * HEX_RADIUS; // ~25.98px
const HEX_HEIGHT = 1.5 * HEX_RADIUS; // 22.5px

interface GlowingHexagon {
  col: number;
  row: number;
  cx: number;
  cy: number;
  progress: number; // 0..1
  speed: number;
  maxAlpha: number;
  hasTriggeredNeighbor: boolean;
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

function drawHexagonOutline(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
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

    // Active illuminated hexagons (full 6-sided light blue rings)
    let glowingHexes: GlowingHexagon[] = [];

    // Spatial lookup to prevent overlapping duplicate glowing hexes
    const activeKeySet = new Set<string>();

    // Interactive mouse tracking
    let targetMouseX = -9999;
    let targetMouseY = -9999;
    let currentMouseX = -9999;
    let currentMouseY = -9999;
    let mouseTimeout: number | undefined;

    function getHexCenter(col: number, row: number): [number, number] {
      const cx = (col + 0.5) * HEX_WIDTH + (row % 2 === 1 ? HEX_WIDTH / 2 : 0);
      const cy = (row + 0.7) * HEX_HEIGHT;
      return [cx, cy];
    }

    function getNeighbors(col: number, row: number): Array<[number, number]> {
      const isOdd = row % 2 === 1;
      if (isOdd) {
        return [
          [col + 1, row],
          [col + 1, row - 1],
          [col,     row - 1],
          [col - 1, row],
          [col,     row + 1],
          [col + 1, row + 1],
        ];
      }
      return [
        [col + 1, row],
        [col,     row - 1],
        [col - 1, row - 1],
        [col - 1, row],
        [col - 1, row + 1],
        [col,     row + 1],
      ];
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
          drawHexagonOutline(offCtx, cx, cy, HEX_RADIUS);
          offCtx.stroke();
        }
      }

      return off;
    }

    function spawnHexagon(col?: number, row?: number, initialProgress = 0) {
      if (cols <= 0 || rows <= 0) return;
      const c = col ?? Math.floor(Math.random() * cols);
      const r = row ?? Math.floor(Math.random() * rows);

      const key = `${c}_${r}`;
      if (activeKeySet.has(key)) return;

      const [cx, cy] = getHexCenter(c, r);

      activeKeySet.add(key);
      glowingHexes.push({
        col: c,
        row: r,
        cx,
        cy,
        progress: initialProgress,
        speed: 0.007 + Math.random() * 0.008, // Smooth breathing cadence
        maxAlpha: 0.75 + Math.random() * 0.2, // Vibrant light blue visibility on white
        hasTriggeredNeighbor: false,
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

      // Populate a balanced spread of glowing light blue hexagons across the screen
      glowingHexes = [];
      activeKeySet.clear();

      const targetCount = Math.max(30, Math.min(65, Math.floor((cols * rows) / 28)));
      for (let i = 0; i < targetCount; i++) {
        spawnHexagon(undefined, undefined, Math.random() * 0.85);
      }
    }

    function handlePointerMove(e: PointerEvent) {
      const rect = canvas?.getBoundingClientRect();
      if (!rect) return;
      targetMouseX = e.clientX - rect.left;
      targetMouseY = e.clientY - rect.top;

      window.clearTimeout(mouseTimeout);
      mouseTimeout = window.setTimeout(() => {
        targetMouseX = -9999;
        targetMouseY = -9999;
      }, 1200);

      // Light up nearby hexagons around cursor in light blue
      const approxCol = Math.floor(targetMouseX / HEX_WIDTH);
      const approxRow = Math.floor(targetMouseY / HEX_HEIGHT);

      for (let dr = -2; dr <= 2; dr++) {
        for (let dc = -2; dc <= 2; dc++) {
          const nc = approxCol + dc;
          const nr = approxRow + dr;
          if (nc >= 0 && nc < cols && nr >= 0 && nr < rows) {
            const [cx, cy] = getHexCenter(nc, nr);
            const dist = Math.hypot(cx - targetMouseX, cy - targetMouseY);
            if (dist < 95 && Math.random() < 0.45) {
              spawnHexagon(nc, nr, 0.1);
            }
          }
        }
      }
    }

    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    let animationFrameId: number;
    let isRunning = true;

    function renderHexRing(c: CanvasRenderingContext2D, cx: number, cy: number, alpha: number) {
      const { r, g, b } = SKY_LIGHT_BLUE;

      // 1. Soft glowing outer neon aura along all 6 edges
      c.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha * 0.35})`;
      c.lineWidth = 4.0;
      drawHexagonOutline(c, cx, cy, HEX_RADIUS);
      c.stroke();

      // 2. Crisp, vibrant light blue edge outline
      c.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha * 0.95})`;
      c.lineWidth = 1.7;
      drawHexagonOutline(c, cx, cy, HEX_RADIUS);
      c.stroke();

      // 3. Glowing corner gems at the 6 vertices
      c.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha * 0.9})`;
      const vertices = getHexVertices(cx, cy, HEX_RADIUS);
      for (let j = 0; j < 6; j++) {
        c.beginPath();
        c.arc(vertices[j][0], vertices[j][1], 1.25, 0, Math.PI * 2);
        c.fill();
      }
      // NO FILL INSIDE: strictly hollow, preserving clean white interior
    }

    function renderStaticGrid() {
      if (!ctx || !offscreenCanvas) return;
      ctx.clearRect(0, 0, width * dpr, height * dpr);
      ctx.drawImage(offscreenCanvas, 0, 0);

      ctx.save();
      ctx.scale(dpr, dpr);

      // Render static decorative light blue rings
      const sampleCount = Math.min(40, glowingHexes.length);
      for (let i = 0; i < sampleCount; i++) {
        const h = glowingHexes[i];
        renderHexRing(ctx, h.cx, h.cy, 0.8);
      }
      ctx.restore();
    }

    function tick() {
      if (!isRunning || !ctx) return;

      // Smooth mouse easing
      currentMouseX += (targetMouseX - currentMouseX) * 0.12;
      currentMouseY += (targetMouseY - currentMouseY) * 0.12;

      ctx.clearRect(0, 0, width * dpr, height * dpr);

      // 1. Draw cached wireframe grid
      if (offscreenCanvas) {
        ctx.drawImage(offscreenCanvas, 0, 0);
      }

      ctx.save();
      ctx.scale(dpr, dpr);

      // 2. Animate and draw glowing light blue hexagon rings
      const targetCount = Math.max(30, Math.min(65, Math.floor((cols * rows) / 28)));

      for (let i = glowingHexes.length - 1; i >= 0; i--) {
        const hex = glowingHexes[i];
        hex.progress += hex.speed;

        // Sine wave envelope for ultra-smooth breathing
        const sineEnvelope = Math.sin(Math.min(1, hex.progress) * Math.PI);
        const currentAlpha = hex.maxAlpha * Math.pow(sineEnvelope, 0.85);

        if (currentAlpha > 0.02) {
          renderHexRing(ctx, hex.cx, hex.cy, currentAlpha);
        }

        // Mid-life neighbor propagation (gentle ripple in light blue)
        if (!hex.hasTriggeredNeighbor && hex.progress > 0.45 && hex.progress < 0.65) {
          hex.hasTriggeredNeighbor = true;
          if (Math.random() < 0.42 && glowingHexes.length < targetCount + 10) {
            const neighbors = getNeighbors(hex.col, hex.row).filter(
              ([nc, nr]) => nc >= 0 && nc < cols && nr >= 0 && nr < rows,
            );
            if (neighbors.length > 0) {
              const [nc, nr] = neighbors[Math.floor(Math.random() * neighbors.length)];
              spawnHexagon(nc, nr, 0);
            }
          }
        }

        // End of lifecycle
        if (hex.progress >= 1) {
          activeKeySet.delete(`${hex.col}_${hex.row}`);
          glowingHexes.splice(i, 1);
        }
      }

      // 3. Maintain continuous count of light blue hexagons across the canvas
      if (glowingHexes.length < targetCount && Math.random() < 0.2) {
        spawnHexagon();
      }

      ctx.restore();
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
      window.clearTimeout(mouseTimeout);
    };
  }, []);

  return (
    <div className={styles.canvasContainer} aria-hidden="true">
      <canvas ref={canvasRef} className={styles.canvas} />
    </div>
  );
}
