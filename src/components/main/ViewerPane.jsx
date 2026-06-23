import { CURRENT_STUDY } from "../../data/mockDemoData.js";

const MODES = ["Original", "PreProcess", "Attention"];

/**
 * Left-side X-ray viewer.
 *
 * Tab availability per analysis phase:
 *   Original   — always available
 *   PreProcess — unlocks when analysisStep >= 2 (preprocessing step done)
 *   Attention  — unlocks when analysisStep >= 3 (ensemble evaluation done)
 *
 * Attention tab renders a pre-generated JET-colormap heatmap composite image
 * (demo_attention_132m_female.png). No live model inference is performed.
 *
 * Props:
 *   viewerMode    — "Original" | "PreProcess" | "Attention"
 *   onModeChange  — (mode: string) => void
 *   demoStatus    — "ready" | "analyzing" | "complete"
 *   analysisStep  — 0–5
 */
export default function ViewerPane({ viewerMode, onModeChange, demoStatus, analysisStep }) {
  const canPreProcess =
    demoStatus === "complete" ||
    (demoStatus === "analyzing" && analysisStep >= 2);

  const canAttention =
    demoStatus === "complete" ||
    (demoStatus === "analyzing" && analysisStep >= 3);

  function handleModeChange(mode) {
    if (mode === "PreProcess" && !canPreProcess) return;
    if (mode === "Attention"  && !canAttention)  return;
    onModeChange(mode);
  }

  // ── resolve which image src to show ─────────────────────────────────────
  // Attention mode → pre-baked heatmap composite (same dimensions as original)
  // PreProcess    → original X-ray with CSS contrast/brightness/desaturate
  // Original      → raw X-ray
  const isAttentionActive = viewerMode === "Attention" && canAttention;
  const isPreProcessActive = viewerMode === "PreProcess" && canPreProcess;

  const imgSrc = isAttentionActive
    ? CURRENT_STUDY.attentionUrl   // JET heatmap composite PNG
    : CURRENT_STUDY.imageUrl;      // original X-ray (used for both Original & PreProcess)

  const imgStyle = {
    maxWidth: "100%",
    maxHeight: "100%",
    objectFit: "contain",
    userSelect: "none",
    display: "block",
    // PreProcess: apply demo grayscale enhancement filter on top of original X-ray
    ...(isPreProcessActive
      ? { filter: "contrast(1.3) brightness(1.1) saturate(0)" }
      : {}),
  };

  const viewerLabel =
    viewerMode === "Original"   ? "Demonstration radiograph" :
    viewerMode === "PreProcess" ? (canPreProcess ? "Illustrative preprocessing output" : "Run Demo Analysis to unlock") :
    viewerMode === "Attention"  ? (canAttention  ? "Illustrative attention visualization · demo only" : "Run Demo Analysis to unlock") :
    "";

  return (
    <div className="viewer-pane">
      {/* ── Toolbar ── */}
      <div className="viewer-toolbar">
        {MODES.map((mode) => {
          const isAvailable =
            mode === "Original" ||
            (mode === "PreProcess" && canPreProcess) ||
            (mode === "Attention"  && canAttention);
          return (
            <button
              key={mode}
              className={[
                "viewer-mode-btn",
                viewerMode === mode ? "active" : "",
                !isAvailable ? "disabled" : "",
              ].filter(Boolean).join(" ")}
              onClick={() => handleModeChange(mode)}
              title={!isAvailable ? "Run Demo Analysis to unlock this view" : undefined}
            >
              {mode}
              {!isAvailable && <span className="mode-lock-icon">🔒</span>}
            </button>
          );
        })}
        <span style={{
          marginLeft: "auto",
          fontSize: 10,
          color: "rgba(255,255,255,0.35)",
          letterSpacing: "0.3px",
        }}>
          RSNA Public Data
        </span>
      </div>

      {/* ── Canvas ── */}
      <div className="viewer-canvas-area">
        {/*
          Single <img> element; src switches between:
            • original X-ray      (Original / PreProcess modes)
            • attention composite  (Attention mode, unlocked)
          This preserves pan/zoom behaviour and object-fit:contain layout.
          The attention PNG already has the heatmap baked in — no additional
          overlay needed.
        */}
        <img
          key={imgSrc}   /* force re-render on src change to avoid flicker */
          src={imgSrc}
          alt={
            isAttentionActive
              ? "Illustrative JET attention heatmap — demo only, not a diagnostic output"
              : "RSNA public-data demo X-ray — illustrative"
          }
          style={imgStyle}
        />

        {/* Locked overlay — PreProcess */}
        {viewerMode === "PreProcess" && !canPreProcess && (
          <div className="viewer-locked-overlay">
            <div className="viewer-locked-message">
              ⚙️ Preprocessing View
              <p>Run Demo Analysis to view this step.</p>
            </div>
          </div>
        )}

        {/* Locked overlay — Attention */}
        {viewerMode === "Attention" && !canAttention && (
          <div className="viewer-locked-overlay">
            <div className="viewer-locked-message">
              🔆 Attention Visualization
              <p>Run Demo Analysis to view this step.</p>
            </div>
          </div>
        )}

        <div className="viewer-demo-label">{viewerLabel}</div>
      </div>

      {/* ── Footer ── */}
      <div style={{
        padding: "6px 12px",
        fontSize: 10,
        color: "rgba(255,255,255,0.3)",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        lineHeight: 1.4,
      }}>
        RSNA 2017 public-dataset sample · Female · 11.0 y
      </div>
    </div>
  );
}
