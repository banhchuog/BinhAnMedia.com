import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0A0A0A",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 4,
          borderRadius: "40px",
        }}
      >
        <span
          style={{
            color: "#C9972A",
            fontSize: 72,
            fontWeight: 900,
            letterSpacing: "-0.05em",
            lineHeight: 1,
          }}
        >
          BA
        </span>
        <span
          style={{
            color: "#C9972A",
            opacity: 0.55,
            fontSize: 18,
            fontWeight: 600,
            letterSpacing: "0.08em",
          }}
        >
          MEDIA
        </span>
      </div>
    ),
    { ...size }
  );
}
