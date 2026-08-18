import { ImageResponse } from "next/og";

export const alt = "Endoora — A new door to your English";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: 88, background: "#0F172A", color: "white" }}>
      <div style={{ fontSize: 92, fontWeight: 800, letterSpacing: -3 }}>Endoora</div>
      <div style={{ marginTop: 18, fontSize: 42, color: "#5EEAD4" }}>A new door to your English</div>
      <div style={{ marginTop: 46, fontSize: 30, color: "#CBD5E1" }}>Persian-first · RTL · Built for Iranian English learners</div>
    </div>,
    size,
  );
}
