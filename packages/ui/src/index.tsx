import type { CSSProperties } from "react";

const containerStyle: CSSProperties = {
  display: "inline-flex",
  flexDirection: "column",
  gap: 4,
};

const nameStyle: CSSProperties = {
  fontSize: 36,
  lineHeight: 1.1,
  fontWeight: 800,
  letterSpacing: "-0.03em",
};

const mottoStyle: CSSProperties = {
  fontSize: 16,
  lineHeight: 1.5,
};

export function EndooraWordmark() {
  return (
    <div style={containerStyle} aria-label="Endoora — A new door to your English">
      <span style={nameStyle}>Endoora</span>
      <span style={mottoStyle}>A new door to your English</span>
    </div>
  );
}
