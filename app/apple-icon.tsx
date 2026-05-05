import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#fff7f0",
        }}
      >
        <div
          style={{
            width: 150,
            height: 150,
            borderRadius: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#ff5c00",
            border: "10px solid #0d0d0d",
            color: "#ff8f52",
            fontSize: 86,
            fontWeight: 800,
            fontFamily: "Arial",
            lineHeight: 1,
          }}
        >
          W
        </div>
      </div>
    ),
    size,
  );
}
