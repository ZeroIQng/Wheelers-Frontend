import { ImageResponse } from "next/og";

export const size = {
  width: 64,
  height: 64,
};

export const contentType = "image/png";

export default function Icon() {
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
            width: 54,
            height: 54,
            borderRadius: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#ff5c00",
            border: "4px solid #0d0d0d",
            color: "#ff8f52",
            fontSize: 30,
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
