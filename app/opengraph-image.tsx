import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Ross Bendillo · Rival Peregrine · AI Engineer & Full-Stack Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const mark = await readFile(join(process.cwd(), "public/brand/rival-peregrine-mark-400.png"));
const markSrc = `data:image/png;base64,${mark.toString("base64")}`;

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          gap: 56,
          padding: "0 88px",
          background: "#0A0B0F",
          backgroundImage:
            "linear-gradient(rgba(0,229,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.08) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          color: "#EDEFF4",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={markSrc} width={300} height={300} alt="" />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 92, fontWeight: 800, letterSpacing: -3, lineHeight: 1 }}>Ross Bendillo</div>
          <div style={{ marginTop: 22, display: "flex", flexDirection: "column", fontSize: 32, color: "#A3A9B8" }}>
            <span>Rival Peregrine</span>
            <span>AI Engineer & Full-Stack Developer</span>
          </div>
          <div
            style={{
              marginTop: 30,
              fontSize: 30,
              color: "#00E5FF",
              fontFamily: "monospace",
              letterSpacing: 2,
            }}
          >
            {"// AI that asks first."}
          </div>
          <div style={{ marginTop: 34, width: 420, height: 4, display: "flex", background: "linear-gradient(90deg, #00E5FF 0%, #00E5FF 62%, #FF2BD6 100%)" }} />
        </div>
      </div>
    ),
    size,
  );
}
