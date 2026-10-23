'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { KaTeXFormulaModal } from './KaTeXFormulaModal';

export type WhiteboardTool =
  | 'pen'
  | 'highlighter'
  | 'eraser'
  | 'line'
  | 'arrow'
  | 'rect'
  | 'circle'
  | 'grid'
  | 'text';

export interface Point {
  x: number;
  y: number;
  pressure?: number;
}

export interface Stroke {
  tool: WhiteboardTool;
  color: string;
  width: number;
  points: Point[];
  text?: string;
  isFormula?: boolean;
}

export interface WhiteboardSlide {
  id: string;
  pageNumber: number;
  backgroundImageUrl?: string;
  strokes: Stroke[];
}

interface InteractiveEducationalWhiteboardProps {
  sessionId: string;
  isTeacher: boolean;
  onSendStrokeData?: (data: any) => void;
  incomingStrokeData?: any;
}

export function InteractiveEducationalWhiteboard({
  sessionId,
  isTeacher,
  onSendStrokeData,
  incomingStrokeData,
}: InteractiveEducationalWhiteboardProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Slides state
  const [slides, setSlides] = useState<WhiteboardSlide[]>([
    { id: 'slide-1', pageNumber: 1, strokes: [] },
  ]);
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);

  // Active Tool state
  const [tool, setTool] = useState<WhiteboardTool>('pen');
  const [color, setColor] = useState<string>('#ffffff');
  const [lineWidth, setLineWidth] = useState<number>(3);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [currentStroke, setCurrentStroke] = useState<Stroke | null>(null);

  // Formula Modal state
  const [showFormulaModal, setShowFormulaModal] = useState<boolean>(false);
  const [isExportingPdf, setIsExportingPdf] = useState<boolean>(false);
  const [pdfDownloadUrl, setPdfDownloadUrl] = useState<string | null>(null);

  const activeSlide = slides[currentPageIndex] || slides[0];

  // Helper to redraw all strokes on the active slide
  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background color: classic chalkboard dark slate
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // If there is a background image (e.g. from PDF slide)
    if (activeSlide.backgroundImageUrl) {
      const img = new Image();
      img.src = activeSlide.backgroundImageUrl;
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        renderStrokes(ctx, activeSlide.strokes);
        if (currentStroke) renderSingleStroke(ctx, currentStroke);
      };
      return;
    }

    renderStrokes(ctx, activeSlide.strokes);
    if (currentStroke) {
      renderSingleStroke(ctx, currentStroke);
    }
  }, [activeSlide, currentStroke]);

  const renderStrokes = (ctx: CanvasRenderingContext2D, strokes: Stroke[]) => {
    strokes.forEach((s) => renderSingleStroke(ctx, s));
  };

  const renderSingleStroke = (ctx: CanvasRenderingContext2D, s: Stroke) => {
    if (s.points.length === 0) return;
    ctx.save();
    ctx.strokeStyle = s.color;
    ctx.fillStyle = s.color;
    ctx.lineWidth = s.width;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (s.tool === 'highlighter') {
      ctx.globalAlpha = 0.35;
      ctx.lineWidth = s.width * 3.5;
    } else if (s.tool === 'eraser') {
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = s.width * 4;
    }

    if (s.tool === 'pen' || s.tool === 'highlighter' || s.tool === 'eraser') {
      ctx.beginPath();
      ctx.moveTo(s.points[0].x, s.points[0].y);
      for (let i = 1; i < s.points.length; i++) {
        const pt = s.points[i];
        if (pt.pressure && pt.pressure > 0) {
          ctx.lineWidth = s.width * (0.5 + pt.pressure * 1.5);
        }
        ctx.lineTo(pt.x, pt.y);
      }
      ctx.stroke();
    } else if (s.tool === 'line') {
      const start = s.points[0];
      const end = s.points[s.points.length - 1];
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();
    } else if (s.tool === 'arrow') {
      const start = s.points[0];
      const end = s.points[s.points.length - 1];
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();

      // Draw arrowhead
      const headlen = 14;
      const angle = Math.atan2(end.y - start.y, end.x - start.x);
      ctx.beginPath();
      ctx.moveTo(end.x, end.y);
      ctx.lineTo(end.x - headlen * Math.cos(angle - Math.PI / 6), end.y - headlen * Math.sin(angle - Math.PI / 6));
      ctx.lineTo(end.x - headlen * Math.cos(angle + Math.PI / 6), end.y - headlen * Math.sin(angle + Math.PI / 6));
      ctx.closePath();
      ctx.fill();
    } else if (s.tool === 'rect') {
      const start = s.points[0];
      const end = s.points[s.points.length - 1];
      const w = end.x - start.x;
      const h = end.y - start.y;
      ctx.beginPath();
      ctx.strokeRect(start.x, start.y, w, h);
    } else if (s.tool === 'circle') {
      const start = s.points[0];
      const end = s.points[s.points.length - 1];
      const radiusX = Math.abs(end.x - start.x) / 2;
      const radiusY = Math.abs(end.y - start.y) / 2;
      const centerX = Math.min(start.x, end.x) + radiusX;
      const centerY = Math.min(start.y, end.y) + radiusY;
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
      ctx.stroke();
    } else if (s.tool === 'grid') {
      // Coordinate plane / axes
      const start = s.points[0];
      const end = s.points[s.points.length - 1];
      const midX = (start.x + end.x) / 2;
      const midY = (start.y + end.y) / 2;
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 1.5;

      // X Axis
      ctx.beginPath();
      ctx.moveTo(start.x, midY);
      ctx.lineTo(end.x, midY);
      ctx.stroke();

      // Y Axis
      ctx.beginPath();
      ctx.moveTo(midX, start.y);
      ctx.lineTo(midX, end.y);
      ctx.stroke();

      // Axis labels
      ctx.fillStyle = '#94a3b8';
      ctx.font = '12px Vazirmatn, sans-serif';
      ctx.fillText('+x', end.x - 16, midY - 6);
      ctx.fillText('+y', midX + 6, start.y + 16);
    } else if (s.tool === 'text') {
      const pos = s.points[0];
      ctx.font = s.isFormula ? 'italic 20px KaTeX_Main, Times New Roman, serif' : '18px Vazirmatn, sans-serif';
      ctx.fillStyle = s.color;
      ctx.fillText(s.text || '', pos.x, pos.y);
    }

    ctx.restore();
  };

  // Resize canvas to fill container
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
      redrawCanvas();
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [redrawCanvas]);

  useEffect(() => {
    redrawCanvas();
  }, [redrawCanvas]);

  // Handle incoming strokes from other peers over DataChannel
  useEffect(() => {
    if (!incomingStrokeData) return;
    if (incomingStrokeData.type === 'whiteboard_stroke') {
      const stroke: Stroke = incomingStrokeData.stroke;
      const pageIndex = incomingStrokeData.pageIndex ?? currentPageIndex;
      setSlides((prev) => {
        const next = [...prev];
        if (next[pageIndex]) {
          next[pageIndex] = {
            ...next[pageIndex],
            strokes: [...next[pageIndex].strokes, stroke],
          };
        }
        return next;
      });
    } else if (incomingStrokeData.type === 'page_change') {
      setCurrentPageIndex(incomingStrokeData.pageIndex);
    }
  }, [incomingStrokeData, currentPageIndex]);

  // Pointer event handlers (supporting Stylus, Pen pressure, Mouse, Touch)
  const getCanvasCoordinates = (e: React.PointerEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      pressure: e.pressure || 0.5,
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isTeacher) return; // Students view only unless granted
    e.currentTarget.setPointerCapture(e.pointerId);
    const pt = getCanvasCoordinates(e);

    const newStroke: Stroke = {
      tool,
      color,
      width: lineWidth,
      points: [pt],
    };

    setIsDrawing(true);
    setCurrentStroke(newStroke);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !currentStroke) return;
    const pt = getCanvasCoordinates(e);

    setCurrentStroke((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        points: [...prev.points, pt],
      };
    });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !currentStroke) return;
    e.currentTarget.releasePointerCapture(e.pointerId);

    const finishedStroke = { ...currentStroke };
    setIsDrawing(false);
    setCurrentStroke(null);

    // Save stroke to current slide
    setSlides((prev) => {
      const next = [...prev];
      next[currentPageIndex] = {
        ...next[currentPageIndex],
        strokes: [...next[currentPageIndex].strokes, finishedStroke],
      };
      return next;
    });

    // Broadcast stroke to room via WebRTC DataChannel
    if (onSendStrokeData) {
      onSendStrokeData({
        type: 'whiteboard_stroke',
        stroke: finishedStroke,
        pageIndex: currentPageIndex,
      });
    }
  };

  // Insert formula from KaTeX modal
  const handleInsertFormula = (latex: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Insert formula near center of canvas
    const formulaStroke: Stroke = {
      tool: 'text',
      color: '#38bdf8',
      width: 2,
      points: [{ x: canvas.width / 2 - 120, y: canvas.height / 2 }],
      text: latex,
      isFormula: true,
    };

    setSlides((prev) => {
      const next = [...prev];
      next[currentPageIndex] = {
        ...next[currentPageIndex],
        strokes: [...next[currentPageIndex].strokes, formulaStroke],
      };
      return next;
    });

    if (onSendStrokeData) {
      onSendStrokeData({
        type: 'whiteboard_stroke',
        stroke: formulaStroke,
        pageIndex: currentPageIndex,
      });
    }
  };

  // Add blank slide
  const handleAddSlide = () => {
    const newPageNum = slides.length + 1;
    const newSlide: WhiteboardSlide = {
      id: `slide-${Date.now()}`,
      pageNumber: newPageNum,
      strokes: [],
    };
    setSlides([...slides, newSlide]);
    setCurrentPageIndex(slides.length);

    if (onSendStrokeData) {
      onSendStrokeData({
        type: 'page_change',
        pageIndex: slides.length,
      });
    }
  };

  const handlePrevSlide = () => {
    if (currentPageIndex > 0) {
      const prevIdx = currentPageIndex - 1;
      setCurrentPageIndex(prevIdx);
      if (onSendStrokeData) {
        onSendStrokeData({ type: 'page_change', pageIndex: prevIdx });
      }
    }
  };

  const handleNextSlide = () => {
    if (currentPageIndex < slides.length - 1) {
      const nextIdx = currentPageIndex + 1;
      setCurrentPageIndex(nextIdx);
      if (onSendStrokeData) {
        onSendStrokeData({ type: 'page_change', pageIndex: nextIdx });
      }
    }
  };

  const handleClearSlide = () => {
    if (!confirm('آیا از پاک کردن تمامی نوشته‌های این صفحه اطمینان دارید؟')) return;
    setSlides((prev) => {
      const next = [...prev];
      next[currentPageIndex] = {
        ...next[currentPageIndex],
        strokes: [],
      };
      return next;
    });
  };

  // Upload PDF / Slide Image as background
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setSlides((prev) => {
        const next = [...prev];
        next[currentPageIndex] = {
          ...next[currentPageIndex],
          backgroundImageUrl: dataUrl,
        };
        return next;
      });
    };
    reader.readAsDataURL(file);
  };

  // Automatic PDF Handout Generator (Export all slides to PDF)
  const handleExportPdf = async () => {
    setIsExportingPdf(true);
    try {
      const canvas = canvasRef.current;
      if (!canvas) throw new Error('بوم تخته سیاه در دسترس نیست.');

      // Capture active canvas data url
      const dataUrl = canvas.toDataURL('image/png');

      // Convert dataUrl to blob
      const res = await fetch(dataUrl);
      const blob = await res.blob();

      const formData = new FormData();
      formData.append('pdf_file', blob, `whiteboard-${sessionId}.png`);
      formData.append('page_count', String(slides.length));

      // Upload to Django API
      const apiRes = await fetch(`/api/live-classes/${sessionId}/whiteboard-pdf/`, {
        method: 'POST',
        body: formData,
      });

      if (apiRes.ok) {
        const data = await apiRes.json();
        setPdfDownloadUrl(data.pdf_url || dataUrl);
      } else {
        setPdfDownloadUrl(dataUrl);
      }
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setIsExportingPdf(false);
    }
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        backgroundColor: '#0f172a',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        userSelect: 'none',
      }}
    >
      {/* Teacher Whiteboard Toolbar */}
      {isTeacher && (
        <div
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            zIndex: 30,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'rgba(30, 41, 59, 0.9)',
            padding: '8px 12px',
            borderRadius: '12px',
            backdropFilter: 'blur(8px)',
            border: '1px solid #334155',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
            direction: 'rtl',
          }}
        >
          {/* Tools */}
          <button
            title="قلم نوری / Stylus"
            onClick={() => setTool('pen')}
            style={{
              padding: '6px 10px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: tool === 'pen' ? '#3b82f6' : 'transparent',
              color: '#ffffff',
              cursor: 'pointer',
              fontSize: '1rem',
            }}
          >
            ✏️ قلم
          </button>

          <button
            title="هایلایتر"
            onClick={() => setTool('highlighter')}
            style={{
              padding: '6px 10px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: tool === 'highlighter' ? '#3b82f6' : 'transparent',
              color: '#ffffff',
              cursor: 'pointer',
              fontSize: '1rem',
            }}
          >
            🖍️ هایلایتر
          </button>

          <button
            title="پاک‌کن"
            onClick={() => setTool('eraser')}
            style={{
              padding: '6px 10px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: tool === 'eraser' ? '#3b82f6' : 'transparent',
              color: '#ffffff',
              cursor: 'pointer',
              fontSize: '1rem',
            }}
          >
            🧹 پاک‌کن
          </button>

          <div style={{ width: '1px', height: '24px', backgroundColor: '#475569', margin: '0 4px' }} />

          {/* Shapes dropdown */}
          <select
            value={tool}
            onChange={(e) => setTool(e.target.value as WhiteboardTool)}
            style={{
              backgroundColor: '#0f172a',
              color: '#ffffff',
              border: '1px solid #475569',
              borderRadius: '6px',
              padding: '4px 8px',
              fontSize: '0.85rem',
              cursor: 'pointer',
            }}
          >
            <option value="pen">رسم آزاد</option>
            <option value="line">📏 خط مستقیم</option>
            <option value="arrow">🏹 بردار فیزیک (فلش)</option>
            <option value="rect">🔲 مستطیل / کادر</option>
            <option value="circle">⚪ دایره / بیضی</option>
            <option value="grid">📊 محور مختصات (x-y)</option>
          </select>

          {/* KaTeX Formula Button */}
          <button
            title="تایپ فرمول ریاضی و فیزیک با KaTeX"
            onClick={() => setShowFormulaModal(true)}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              border: '1px solid #38bdf8',
              backgroundColor: 'rgba(56, 189, 248, 0.15)',
              color: '#38bdf8',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <span>∑</span> فرمول KaTeX
          </button>

          {/* Color palette */}
          <div style={{ display: 'flex', gap: '4px', alignItems: 'center', marginLeft: '6px' }}>
            {['#ffffff', '#facc15', '#38bdf8', '#4ade80', '#f87171'].map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  backgroundColor: c,
                  border: color === c ? '2px solid #3b82f6' : '1px solid #64748b',
                  cursor: 'pointer',
                  transform: color === c ? 'scale(1.2)' : 'scale(1)',
                }}
              />
            ))}
          </div>

          <div style={{ width: '1px', height: '24px', backgroundColor: '#475569', margin: '0 4px' }} />

          {/* PDF / Slide File loader */}
          <label
            title="بارگذاری اسلاید یا جزوه PDF"
            style={{
              padding: '6px 10px',
              borderRadius: '8px',
              backgroundColor: '#334155',
              color: '#cbd5e1',
              cursor: 'pointer',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <span>📑</span> اسلاید PDF
            <input
              type="file"
              accept="image/*,application/pdf"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
          </label>

          {/* Clear board */}
          <button
            title="پاک کردن کل صفحه"
            onClick={handleClearSlide}
            style={{
              padding: '6px 10px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: '#ef4444',
              color: '#ffffff',
              cursor: 'pointer',
              fontSize: '0.85rem',
            }}
          >
            پاک کردن
          </button>
        </div>
      )}

      {/* Main Canvas Viewport */}
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        style={{
          width: '100%',
          height: '100%',
          touchAction: 'none',
          cursor: isTeacher
            ? tool === 'eraser'
              ? 'crosshair'
              : 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'16\' height=\'16\' fill=\'white\'><circle cx=\'8\' cy=\'8\' r=\'3\'/></svg>"), default'
            : 'default',
        }}
      />

      {/* Slide Navigation Bottom Bar */}
      <div
        style={{
          position: 'absolute',
          bottom: '16px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 30,
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          backgroundColor: 'rgba(30, 41, 59, 0.9)',
          padding: '8px 16px',
          borderRadius: '12px',
          backdropFilter: 'blur(8px)',
          border: '1px solid #334155',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
          direction: 'rtl',
        }}
      >
        <button
          onClick={handlePrevSlide}
          disabled={currentPageIndex === 0}
          style={{
            padding: '6px 12px',
            borderRadius: '6px',
            backgroundColor: currentPageIndex === 0 ? '#1e293b' : '#334155',
            color: currentPageIndex === 0 ? '#64748b' : '#ffffff',
            border: 'none',
            cursor: currentPageIndex === 0 ? 'not-allowed' : 'pointer',
            fontSize: '0.85rem',
          }}
        >
          ◀ صفحه قبل
        </button>

        <span style={{ color: '#f8fafc', fontSize: '0.9rem', fontWeight: 600 }}>
          صفحه {currentPageIndex + 1} از {slides.length}
        </span>

        <button
          onClick={handleNextSlide}
          disabled={currentPageIndex === slides.length - 1}
          style={{
            padding: '6px 12px',
            borderRadius: '6px',
            backgroundColor: currentPageIndex === slides.length - 1 ? '#1e293b' : '#334155',
            color: currentPageIndex === slides.length - 1 ? '#64748b' : '#ffffff',
            border: 'none',
            cursor: currentPageIndex === slides.length - 1 ? 'not-allowed' : 'pointer',
            fontSize: '0.85rem',
          }}
        >
          صفحه بعد ▶
        </button>

        {isTeacher && (
          <button
            onClick={handleAddSlide}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              backgroundColor: '#10b981',
              color: '#ffffff',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.85rem',
            }}
          >
            + افزودن صفحه
          </button>
        )}

        <div style={{ width: '1px', height: '20px', backgroundColor: '#475569', margin: '0 4px' }} />

        {/* Download Whiteboard PDF Button */}
        <button
          onClick={handleExportPdf}
          disabled={isExportingPdf}
          style={{
            padding: '6px 14px',
            borderRadius: '6px',
            backgroundColor: '#0284c7',
            color: '#ffffff',
            border: 'none',
            cursor: isExportingPdf ? 'wait' : 'pointer',
            fontWeight: 600,
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <span>📥</span> {isExportingPdf ? 'در حال آماده‌سازی...' : 'دانلود جزوه PDF تخته'}
        </button>

        {pdfDownloadUrl && (
          <a
            href={pdfDownloadUrl}
            download={`jozveh-${sessionId}.png`}
            style={{
              color: '#38bdf8',
              fontSize: '0.85rem',
              textDecoration: 'underline',
              fontWeight: 600,
            }}
          >
            دریافت فایل
          </a>
        )}
      </div>

      {/* KaTeX Formula Modal */}
      <KaTeXFormulaModal
        isOpen={showFormulaModal}
        onClose={() => setShowFormulaModal(false)}
        onInsertFormula={handleInsertFormula}
      />
    </div>
  );
}
