'use client';

import React, { useState } from 'react';

interface KaTeXFormulaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertFormula: (latex: string) => void;
}

interface FormulaPreset {
  label: string;
  category: 'math' | 'physics';
  latex: string;
}

const PRESETS: FormulaPreset[] = [
  // Math presets
  { label: 'کسر', category: 'math', latex: '\\frac{a}{b}' },
  { label: 'رادیکال', category: 'math', latex: '\\sqrt{x}' },
  { label: 'توان', category: 'math', latex: 'x^{2}' },
  { label: 'انتگرال معین', category: 'math', latex: '\\int_{a}^{b} f(x) \\, dx' },
  { label: 'سیگما', category: 'math', latex: '\\sum_{i=1}^{n} x_i' },
  { label: 'حد تابع', category: 'math', latex: '\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1' },
  { label: 'معادله درجه دو', category: 'math', latex: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}' },
  { label: 'ماتریس ۲×۲', category: 'math', latex: '\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}' },

  // Physics presets
  { label: 'قانون دوم نیوتون', category: 'physics', latex: '\\vec{F}_{net} = m \\cdot \\vec{a}' },
  { label: 'معادله سرعت-زمان', category: 'physics', latex: 'v = v_0 + a t' },
  { label: 'معادله مستقل از زمان', category: 'physics', latex: 'v^2 - v_0^2 = 2 a \\Delta x' },
  { label: 'انرژی جنبشی', category: 'physics', latex: 'K = \\frac{1}{2} m v^2' },
  { label: 'قانون اهم', category: 'physics', latex: 'V = I \\cdot R' },
  { label: 'معادله اینشتین', category: 'physics', latex: 'E = m c^2' },
  { label: 'قانون کولن', category: 'physics', latex: 'F = k \\frac{|q_1 q_2|}{r^2}' },
  { label: 'معادله موج', category: 'physics', latex: 'v = \\lambda \\cdot f' },
];

export function KaTeXFormulaModal({
  isOpen,
  onClose,
  onInsertFormula,
}: KaTeXFormulaModalProps) {
  const [latexInput, setLatexInput] = useState('\\vec{F} = m \\cdot \\vec{a}');
  const [activeTab, setActiveTab] = useState<'math' | 'physics'>('math');

  if (!isOpen) return null;

  const handlePresetClick = (latex: string) => {
    setLatexInput(latex);
  };

  const handleInsert = () => {
    if (!latexInput.trim()) return;
    onInsertFormula(latexInput.trim());
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        backdropFilter: 'blur(4px)',
        direction: 'rtl',
      }}
    >
      <div
        style={{
          backgroundColor: '#1e293b',
          color: '#f8fafc',
          borderRadius: '16px',
          width: '90%',
          maxWidth: '680px',
          padding: '24px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          border: '1px solid #334155',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>📐</span> تایپ و درج فرمول ریاضی و فیزیک (KaTeX)
          </h3>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              fontSize: '1.5rem',
              cursor: 'pointer',
              lineHeight: 1,
            }}
          >
            ✕
          </button>
        </div>

        {/* Tab switch */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', borderBottom: '1px solid #334155', paddingBottom: '8px' }}>
          <button
            onClick={() => setActiveTab('math')}
            style={{
              padding: '6px 16px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.9rem',
              backgroundColor: activeTab === 'math' ? '#3b82f6' : '#334155',
              color: '#ffffff',
            }}
          >
            فرمول‌های ریاضی
          </button>
          <button
            onClick={() => setActiveTab('physics')}
            style={{
              padding: '6px 16px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.9rem',
              backgroundColor: activeTab === 'physics' ? '#3b82f6' : '#334155',
              color: '#ffffff',
            }}
          >
            فرمول‌های فیزیک
          </button>
        </div>

        {/* Presets Grid */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '8px' }}>الگوهای آماده سریع:</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {PRESETS.filter((p) => p.category === activeTab).map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handlePresetClick(p.latex)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  backgroundColor: '#0f172a',
                  border: '1px solid #475569',
                  color: '#cbd5e1',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* LaTeX Code Input */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '6px' }}>
            کد LaTeX فرمول:
          </label>
          <textarea
            value={latexInput}
            onChange={(e) => setLatexInput(e.target.value)}
            rows={3}
            dir="ltr"
            style={{
              width: '100%',
              backgroundColor: '#0f172a',
              border: '1px solid #475569',
              borderRadius: '8px',
              padding: '10px 12px',
              color: '#38bdf8',
              fontFamily: 'Consolas, monospace',
              fontSize: '0.95rem',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Formula Preview Box */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '6px' }}>پیش‌نمایش فرمول:</div>
          <div
            style={{
              minHeight: '70px',
              backgroundColor: '#020617',
              borderRadius: '8px',
              border: '1px dashed #38bdf8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px',
              fontSize: '1.4rem',
              color: '#f8fafc',
              direction: 'ltr',
              fontFamily: 'KaTeX_Main, Times New Roman, serif',
            }}
          >
            {latexInput || 'فرمول را وارد کنید...'}
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '8px 20px',
              borderRadius: '8px',
              backgroundColor: '#334155',
              border: 'none',
              color: '#cbd5e1',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            انصراف
          </button>
          <button
            type="button"
            onClick={handleInsert}
            style={{
              padding: '8px 24px',
              borderRadius: '8px',
              backgroundColor: '#10b981',
              border: 'none',
              color: '#ffffff',
              cursor: 'pointer',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>✓</span> درج روی تخته
          </button>
        </div>
      </div>
    </div>
  );
}
