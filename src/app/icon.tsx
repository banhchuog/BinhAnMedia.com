import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0A0A0A",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "7px",
        }}
      >
        <span
          style={{
            color: "#C9972A",
            fontSize: 19,
            fontWeight: 900,
            letterSpacing: "-0.05em",
            lineHeight: 1,
          }}
        >
          BA
        </span>
      </div>
    ),
    { ...size }
  );
}
