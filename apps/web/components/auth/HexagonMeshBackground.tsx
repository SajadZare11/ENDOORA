"use client";

import { useEffect, useRef } from "react";
import styles from "./hexagon-mesh.module.css";

// The 8 distinctive section themes from Endoora's header navigation + brand aurora
const SECTION_COLORS = [
  { name: "school",   r: 124, g: 58,  b: 237 }, // #7c3aed Royal Violet (School)
  { name: "teachers", r: 234, g: 88,  b: 12  }, // #ea580c Warm Amber (Teachers)
  { name: "classes",  r: 16,  g: 185, b: 129 }, // #10b981 Energetic Emerald (Classes)
  { name: "skills",   r: 14,  g: 165, b: 233 }, // #0ea5e9 Electric Cyan (Skills)
  { name: "learn",    r: 99,  g: 102, b: 241 }, // #6366f1 Electric Indigo (Learn)
  { name: "ielts",    r: 244, g: 63,  b: 94  }, // #f43f5e Ruby Crimson (IELTS)
  { name: "pricing",  r: 245, g: 158, b: 11  }, // #f59e0b Golden Amber (Pricing)
  { name: "books",    r: 20,  g: 184, b: 166 }, // #14b8a6 Teal Aquamarine (Books)
  { name: "brand",    r: 37,  g: 99,  b: 235 }, // #2563eb Endoora Blue
  { name: "aurora",   r: 139, g: 92,  b: 246 }, // #8b5cf6 Intelligence Purple
] as const;

type ColorRGB = (typeof SECTION_COLORS)[number];

interface HexNode {
  col: number;
  row: number;
  cx: number;
  cy: number;
  color: ColorRGB;
  phase: "birth" | "wander" | "decay";
  progress: number;
  speed: number;
  maxAlpha: number;
  chainRemaining: number;
}

const HEX_RADIUS = 26; // Radius in pixels for fine, elegant hexagons
const HEX_WIDTH = Math.sqrt(3) * HEX_RADIUS; // ~45.03px
const HEX_HEIGHT = 1.5 * HEX_RADIUS; // 39px

// Calculate Pointy-topped hexagon vertices
function getHexVertices(cx: number, cy: number, r: number): Array<[number, number]> {
  const vertices: Array<[number, number]> = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 180) * (60 * i - 30);
    vertices.push([cx + r * Math.cos(angle), cy + r * Math.sin(angle)]);
  }
  return vertices;
}

function drawHexagonPath(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
  const vertices = getHexVertices(cx, cy, r);
  ctx.beginPath();
  ctx.moveTo(vertices[0][0], vertices[0][1]);
  for (let i = 1; i < 6; i++) {
    ctx.lineTo(vertices[i][0], vertices[i][1]);
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

    // Check reduced motion preference
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let offscreenCanvas: HTMLCanvasElement | null = null;
    let cols = 0;
    let rows = 0;

    // Active illuminated hexagons
    let activeNodes: HexNode[] = [];
    let colorIndexCounter = 0;

    // Interactive mouse tracking
    let mouseX = -9999;
    let mouseY = -9999;
    let targetMouseX = -9999;
    let targetMouseY = -9999;
    let mouseActive = false;
    let mouseIdleTimeout: number | undefined;

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

      // Draw faint baseline lattice
      offCtx.strokeStyle = "rgba(148, 163, 184, 0.05)";
      offCtx.lineWidth = 0.9;

      for (let r = -1; r <= rows + 1; r++) {
        for (let c = -1; c <= cols + 1; c++) {
          const [cx, cy] = getHexCenter(c, r);
          drawHexagonPath(offCtx, cx, cy, HEX_RADIUS);
          offCtx.stroke();
        }
      }

      return off;
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

      // Re-seed active nodes uniformly across the visible grid
      const targetCount = Math.max(12, Math.min(32, Math.floor((cols * rows) / 45)));
      activeNodes = [];
      for (let i = 0; i < targetCount; i++) {
        spawnRandomNode(Math.random() * 0.9);
      }
    }

    function spawnRandomNode(initialProgress = 0) {
      if (cols <= 0 || rows <= 0) return;
      const c = Math.floor(Math.random() * cols);
      const r = Math.floor(Math.random() * rows);
      const [cx, cy] = getHexCenter(c, r);

      // Cycle through all section colors sequentially with jitter to ensure even representation
      const color = SECTION_COLORS[colorIndexCounter % SECTION_COLORS.length];
      colorIndexCounter++;

      const node: HexNode = {
        col: c,
        row: r,
        cx,
        cy,
        color,
        phase: "birth",
        progress: initialProgress,
        speed: 0.003 + Math.random() * 0.004, // Smooth, slow breathing
        maxAlpha: 0.42 + Math.random() * 0.32, // Soft, non-glaring luminosity
        chainRemaining: Math.floor(Math.random() * 2), // Can jump to 1-2 neighbors
      };

      activeNodes.push(node);
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

    function handlePointerMove(e: PointerEvent) {
      const rect = canvas?.getBoundingClientRect();
      if (!rect) return;
      targetMouseX = e.clientX - rect.left;
      targetMouseY = e.clientY - rect.top;
      mouseActive = true;

      window.clearTimeout(mouseIdleTimeout);
      mouseIdleTimeout = window.setTimeout(() => {
        mouseActive = false;
      }, 1400);
    }

    function handlePointerLeave() {
      mouseActive = false;
      targetMouseX = -9999;
      targetMouseY = -9999;
    }

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerleave", handlePointerLeave, { passive: true });

    let animationFrameId: number;
    let isRunning = true;

    function renderStaticGrid() {
      if (!ctx || !offscreenCanvas) return;
      ctx.clearRect(0, 0, width * dpr, height * dpr);
      ctx.drawImage(offscreenCanvas, 0, 0);

      // Render a subtle static arrangement of glowing hexes
      const previewCount = Math.min(18, activeNodes.length);
      for (let i = 0; i < previewCount; i++) {
        const node = activeNodes[i];
        renderHexCell(ctx, node.cx, node.cy, node.color, 0.45 * node.maxAlpha, dpr);
      }
    }

    function renderHexCell(
      c: CanvasRenderingContext2D,
      cx: number,
      cy: number,
      color: ColorRGB,
      alpha: number,
      pixelRatio: number,
      glowRadiusMultiplier = 2.4,
    ) {
      c.save();
      c.scale(pixelRatio, pixelRatio);

      // 1. Soft radial aura
      const aura = c.createRadialGradient(cx, cy, 0, cx, cy, HEX_RADIUS * glowRadiusMultiplier);
      aura.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha * 0.48})`);
      aura.addColorStop(0.45, `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha * 0.16})`);
      aura.addColorStop(1, `rgba(${color.r}, ${color.g}, ${color.b}, 0)`);

      c.fillStyle = aura;
      c.beginPath();
      c.arc(cx, cy, HEX_RADIUS * glowRadiusMultiplier, 0, Math.PI * 2);
      c.fill();

      // 2. Translucent glass fill inside hex
      drawHexagonPath(c, cx, cy, HEX_RADIUS);
      c.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha * 0.22})`;
      c.fill();

      // 3. Crisp luminous border
      c.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha * 0.95})`;
      c.lineWidth = 1.35;
      c.stroke();

      // 4. Center micro-spark
      c.fillStyle = `rgba(255, 255, 255, ${alpha * 0.65})`;
      c.beginPath();
      c.arc(cx, cy, 1.8, 0, Math.PI * 2);
      c.fill();

      c.restore();
    }

    function tick() {
      if (!isRunning || !ctx) return;

      // Smooth mouse easing
      mouseX += (targetMouseX - mouseX) * 0.12;
      mouseY += (targetMouseY - mouseY) * 0.12;

      ctx.clearRect(0, 0, width * dpr, height * dpr);

      // Draw cached base grid
      if (offscreenCanvas) {
        ctx.drawImage(offscreenCanvas, 0, 0);
      }

      // Update and draw active nodes
      const targetCount = Math.max(12, Math.min(32, Math.floor((cols * rows) / 45)));

      for (let i = activeNodes.length - 1; i >= 0; i--) {
        const node = activeNodes[i];
        node.progress += node.speed;

        let alpha = 0;
        if (node.progress < 0.35) {
          // Fade in
          alpha = (node.progress / 0.35) * node.maxAlpha;
        } else if (node.progress < 0.7) {
          // Sustain breathing
          const wave = Math.sin(((node.progress - 0.35) / 0.35) * Math.PI);
          alpha = node.maxAlpha * (0.85 + 0.15 * wave);
        } else if (node.progress < 1) {
          // Fade out
          alpha = (1 - (node.progress - 0.7) / 0.3) * node.maxAlpha;
        } else {
          // Finished lifecycle - optionally jump to an adjacent cell
          if (node.chainRemaining > 0) {
            const neighbors = getNeighbors(node.col, node.row).filter(
              ([nc, nr]) => nc >= 0 && nc < cols && nr >= 0 && nr < rows,
            );
            if (neighbors.length > 0) {
              const [nc, nr] = neighbors[Math.floor(Math.random() * neighbors.length)];
              const [nx, ny] = getHexCenter(nc, nr);
              node.col = nc;
              node.row = nr;
              node.cx = nx;
              node.cy = ny;
              node.progress = 0;
              node.chainRemaining -= 1;
              alpha = 0;
              continue;
            }
          }
          activeNodes.splice(i, 1);
          continue;
        }

        renderHexCell(ctx, node.cx, node.cy, node.color, alpha, dpr);
      }

      // Maintain balanced pool count
      if (activeNodes.length < targetCount && Math.random() < 0.08) {
        spawnRandomNode(0);
      }

      // Interactive mouse proximity effect
      if (mouseActive && mouseX > -100 && mouseY > -100) {
        const hoverRadius = 140;
        // Check grid coordinates around mouse
        const approxRow = Math.floor(mouseY / HEX_HEIGHT);
        const approxCol = Math.floor(mouseX / HEX_WIDTH);

        for (let r = approxRow - 3; r <= approxRow + 3; r++) {
          for (let c = approxCol - 3; c <= approxCol + 3; c++) {
            if (c < 0 || c >= cols || r < 0 || r >= rows) continue;
            const [cx, cy] = getHexCenter(c, r);
            const dist = Math.hypot(cx - mouseX, cy - mouseY);
            if (dist < hoverRadius) {
              const intensity = (1 - dist / hoverRadius) * 0.55;
              const hoverColor = SECTION_COLORS[(c + r * 3) % SECTION_COLORS.length];
              renderHexCell(ctx, cx, cy, hoverColor, intensity, dpr, 1.8);
            }
          }
        }
      }

      animationFrameId = requestAnimationFrame(tick);
    }

    // Page visibility handling to save resources when tab is backgrounded
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

    // Initial setup and resize listener
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
      window.removeEventListener("pointerleave", handlePointerLeave);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.clearTimeout(mouseIdleTimeout);
    };
  }, []);

  return (
    <div className={styles.canvasContainer} aria-hidden="true">
      <canvas ref={canvasRef} className={styles.canvas} />
      <div className={styles.vignetteOverlay} />
    </div>
  );
}
