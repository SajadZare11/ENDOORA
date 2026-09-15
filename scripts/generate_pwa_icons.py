"""Generate pure PNG and SVG icons for Endoora PWA without external dependencies."""
import os
import struct
import zlib

def make_png(width: int, height: int, bg_color=(15, 23, 42), fg_color=(13, 148, 136), accent_color=(6, 182, 212)) -> bytes:
    """Generate RGBA PNG bytes with stylized Endoora portal/door emblem."""
    raw_rows = []
    cx, cy = width / 2.0, height / 2.0
    r_outer = min(width, height) * 0.42
    r_inner = r_outer * 0.65

    for y in range(height):
        row = bytearray([0])  # filter byte: 0 (None)
        for x in range(width):
            dx = x - cx
            dy = y - cy
            dist = (dx * dx + dy * dy) ** 0.5

            # Default to background
            r, g, b, a = bg_color[0], bg_color[1], bg_color[2], 255

            # Check if within outer circle ring
            if dist <= r_outer:
                # Gradient factor from top to bottom
                t = (y / height)
                cr = int(accent_color[0] * (1 - t) + fg_color[0] * t)
                cg = int(accent_color[1] * (1 - t) + fg_color[1] * t)
                cb = int(accent_color[2] * (1 - t) + fg_color[2] * t)
                
                # Arch doorway cutout: arch top + rectangle bottom
                is_doorway = False
                door_w = r_inner * 0.7
                door_h = r_inner * 1.1
                arch_cy = cy - (door_h * 0.2)

                # Upper arch
                if dy <= -(door_h * 0.2):
                    arch_dist = (dx * dx + (y - arch_cy) ** 2) ** 0.5
                    if arch_dist <= door_w:
                        is_doorway = True
                # Lower door rectangle
                elif abs(dx) <= door_w and (y - arch_cy) <= door_h:
                    is_doorway = True

                if is_doorway:
                    # Door interior: glowing teal/white
                    glow = max(0.0, 1.0 - (dist / r_inner))
                    r = int(cr * (1 - glow * 0.4) + 255 * glow * 0.4)
                    g = int(cg * (1 - glow * 0.4) + 255 * glow * 0.4)
                    b = int(cb * (1 - glow * 0.4) + 255 * glow * 0.4)
                else:
                    # Outer emblem frame
                    r, g, b = cr, cg, cb

            row.extend([r, g, b, a])
        raw_rows.append(bytes(row))

    raw_data = b"".join(raw_rows)
    compressed = zlib.compress(raw_data, 9)

    # PNG signature
    png = b"\x89PNG\r\n\x1a\n"

    # IHDR
    ihdr_data = struct.pack(">IIBBBBB", width, height, 8, 6, 0, 0, 0)
    ihdr_crc = zlib.crc32(b"IHDR" + ihdr_data)
    png += struct.pack(">I", len(ihdr_data)) + b"IHDR" + ihdr_data + struct.pack(">I", ihdr_crc)

    # IDAT
    idat_crc = zlib.crc32(b"IDAT" + compressed)
    png += struct.pack(">I", len(compressed)) + b"IDAT" + compressed + struct.pack(">I", idat_crc)

    # IEND
    iend_crc = zlib.crc32(b"IEND")
    png += struct.pack(">I", 0) + b"IEND" + struct.pack(">I", iend_crc)

    return png

def make_svg(width=512, height=512) -> str:
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}" width="{width}" height="{height}">
  <defs>
    <linearGradient id="endooraGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#06B6D4" />
      <stop offset="100%" stop-color="#0D9488" />
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>
  <rect width="100%" height="100%" fill="#0F172A" rx="112" />
  <circle cx="256" cy="256" r="190" fill="none" stroke="url(#endooraGrad)" stroke-width="24" filter="url(#glow)" />
  <path d="M 180 340 L 180 230 A 76 76 0 0 1 332 230 L 332 340 Z" fill="url(#endooraGrad)" />
  <circle cx="296" cy="285" r="10" fill="#0F172A" />
</svg>'''

def main():
    target_dir = os.path.join(os.path.dirname(__file__), "..", "apps", "web", "public", "icons")
    os.makedirs(target_dir, exist_ok=True)

    with open(os.path.join(target_dir, "icon-192.png"), "wb") as f:
        f.write(make_png(192, 192))

    with open(os.path.join(target_dir, "icon-512.png"), "wb") as f:
        f.write(make_png(512, 512))

    with open(os.path.join(target_dir, "icon-maskable.png"), "wb") as f:
        f.write(make_png(512, 512, bg_color=(11, 15, 25)))

    with open(os.path.join(target_dir, "icon.svg"), "w", encoding="utf-8") as f:
        f.write(make_svg(512, 512))

    print(f"Generated icons in {target_dir}")

if __name__ == "__main__":
    main()
