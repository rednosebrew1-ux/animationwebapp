"use client";

import { useState } from "react";
import { Player } from "@remotion/player";
import { MyComponent } from "../src/Composition";

const DURATION_IN_FRAMES = 60;
const FPS = 30;

export default function Home() {
  const [titleText, setTitleText] = useState("Hello World");
  const [backgroundColor, setBackgroundColor] = useState("#0a0a0a");
  const [status, setStatus] = useState<"idle" | "rendering" | "done" | "error">("idle");
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  async function handleRender() {
    setStatus("rendering");
    setVideoUrl(null);

    const res = await fetch("/api/render", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ titleText, backgroundColor }),
    });

    const data = await res.json();

    if (res.ok) {
      setStatus("done");
      setVideoUrl(data.videoUrl ?? null);
    } else {
      setStatus("error");
    }
  }

  return (
    <main style={{ padding: "2rem", maxWidth: 900, margin: "0 auto" }}>
      <h1 style={{ marginBottom: "1.5rem", fontSize: "1.5rem" }}>
        Animation Web App
      </h1>

      <Player
        component={MyComponent}
        durationInFrames={DURATION_IN_FRAMES}
        fps={FPS}
        compositionWidth={1280}
        compositionHeight={720}
        style={{ width: "100%", borderRadius: 8 }}
        controls
        inputProps={{ titleText, backgroundColor }}
      />

      <div style={{ marginTop: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
        <label>
          Title Text
          <input
            type="text"
            value={titleText}
            onChange={(e) => setTitleText(e.target.value)}
            style={{ marginLeft: "1rem", padding: "0.25rem 0.5rem", background: "#1a1a1a", color: "#fff", border: "1px solid #333", borderRadius: 4 }}
          />
        </label>

        <label>
          Background Color
          <input
            type="color"
            value={backgroundColor}
            onChange={(e) => setBackgroundColor(e.target.value)}
            style={{ marginLeft: "1rem" }}
          />
        </label>

        <button
          onClick={handleRender}
          disabled={status === "rendering"}
          style={{ padding: "0.6rem 1.5rem", background: "#2563eb", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", width: "fit-content" }}
        >
          {status === "rendering" ? "Rendering… (check back in ~1 min)" : "Render MP4"}
        </button>

        {status === "done" && videoUrl && (
          <a href={videoUrl} download style={{ color: "#60a5fa" }}>
            ⬇ Download your MP4
          </a>
        )}
        {status === "done" && !videoUrl && (
          <p style={{ color: "#86efac" }}>✓ Render queued! Video will be committed to the &apos;renders&apos; branch shortly.</p>
        )}
        {status === "error" && (
          <p style={{ color: "#f87171" }}>✗ Something went wrong. Check GitHub Actions for details.</p>
        )}
      </div>
    </main>
  );
}
