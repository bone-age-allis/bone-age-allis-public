import { useState } from "react";
import { CURRENT_STUDY, ROI_CURRENT } from "../../data/mockDemoData.js";

const ROI_REGIONS = [
  {
    key: "hand",
    color: "#3B82F6",
    label: "Hand",
    anatomy: "Phalanges & metacarpals",
    // SVG overlay rect (x, y, w, h) in viewBox 0 0 400 520
    // 2026-06-21: pixel-analysis calibrated — little finger @ vb_x=70, thumb tip @ vb_x=365.5, fingertips @ vb_y=44
    //   x: 80→55 (-25), y: 60→35 (-25), w: 240→320 (+80), h: 320→365 (+45)
    overlay: { x: 55, y: 35, w: 320, h: 365 },
  },
  {
    key: "carpal",
    color: "#F59E0B",
    label: "Carpal",
    anatomy: "Carpal ossification region",
    overlay: { x: 100, y: 330, w: 200, h: 110 },
  },
  {
    key: "rus",
    color: "#EF4444",
    label: "RUS",
    anatomy: "Radius / Ulna / Short bones",
    // Production RUS crop: 890×1382 of original 1172×1536 (76%×90%)
    // Covers short bones (phalanges + metacarpals) + carpals + distal R/U
    // SVG: x_margin=12%, y_start=10% (fingertips excluded) → bottom of image
    overlay: { x: 75, y: 70, w: 250, h: 410 },
  },
];

function XrayWithROI({ activeKey }) {
  return (
    <div style={{ position: "relative", background: "#050F1A", borderRadius: "var(--radius-sm)", overflow: "hidden" }}>
      <img
        src={CURRENT_STUDY.imageUrl}
        alt="RSNA public-data demo X-ray with ROI overlay"
        style={{ width: "100%", maxHeight: 480, objectFit: "contain", display: "block" }}
      />
      <svg
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
        viewBox="0 0 400 520"
        preserveAspectRatio="xMidYMid meet"
      >
        {ROI_REGIONS.map((r) => {
          const active = activeKey === null || activeKey === r.key;
          return (
            <rect
              key={r.key}
              x={r.overlay.x} y={r.overlay.y}
              width={r.overlay.w} height={r.overlay.h}
              rx={6}
              fill={r.color}
              fillOpacity={activeKey === r.key ? 0.22 : activeKey === null ? 0.10 : 0.04}
              stroke={r.color}
              strokeOpacity={active ? 0.9 : 0.25}
              strokeWidth={activeKey === r.key ? 2.5 : 1.5}
              strokeDasharray={r.key !== "hand" ? "6 3" : undefined}
            />
          );
        })}
        {ROI_REGIONS.map((r) => {
          const show = activeKey === null || activeKey === r.key;
          if (!show) return null;
          return (
            <text
              key={r.key + "-lbl"}
              x={r.overlay.x + 5}
              y={r.overlay.y + 16}
              fill={r.color}
              fontSize={12}
              fontWeight={700}
              opacity={0.9}
            >{r.label}</text>
          );
        })}
      </svg>
      <div style={{
        position: "absolute", bottom: 8, left: 8,
        background: "rgba(5,15,26,0.85)", color: "rgba(255,255,255,0.55)",
        fontSize: 9, padding: "3px 8px", borderRadius: 4, letterSpacing: "0.4px",
      }}>
        Illustrative ROI layout based on demo data
      </div>
    </div>
  );
}

export default function RoiDemoPanel() {
  const [activeKey, setActiveKey] = useState(null);

  return (
    <div className="fullwidth-panel">
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

        {/* Left: X-ray with ROI overlay */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div className="card" style={{ padding: "10px 12px" }}>
            <div className="card-title" style={{ marginBottom: 6 }}>
              <span className="card-title-icon">🔍</span>
              ROI Analysis — {CURRENT_STUDY.id}
              <span className="simulation-badge" style={{ marginLeft: "auto" }}>Demo · RSNA Public Data</span>
            </div>
            <div style={{ fontSize: 11, color: "var(--color-text-sub)", marginBottom: 8 }}>
              Female · 11.0 y / 132 m · Click a region card to highlight
            </div>
          </div>
          <XrayWithROI activeKey={activeKey} />
          <div className="sample-notice" style={{ fontSize: 10 }}>
            Demo display only — not a clinical interpretation. No real ROI detection is performed.
          </div>
        </div>

        {/* Right: ROI result cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {ROI_REGIONS.map((region) => {
            const val = ROI_CURRENT[region.key];
            const isActive = activeKey === region.key;
            return (
              <div
                key={region.key}
                onClick={() => setActiveKey(isActive ? null : region.key)}
                style={{
                  border: `2px solid ${isActive ? region.color : "var(--color-border)"}`,
                  borderRadius: "var(--radius-card)",
                  padding: "14px 16px",
                  cursor: "pointer",
                  background: isActive ? "#F0F7FF" : "var(--color-bg-card)",
                  transition: "all 0.15s",
                  boxShadow: isActive ? `0 0 0 3px ${region.color}22` : "none",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <div style={{ width: 12, height: 12, borderRadius: 3, background: region.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 13, fontWeight: 700, color: "var(--color-text-main)" }}>{region.label}</span>
                  <span style={{ fontSize: 11, color: "var(--color-text-sub)", marginLeft: 4 }}>{region.anatomy}</span>
                </div>
                <div style={{ display: "flex", gap: 16 }}>
                  <div>
                    <div style={{ fontSize: 10, color: "var(--color-text-sub)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.4px" }}>Demo Bone Age</div>
                    <div style={{ fontSize: 22, fontWeight: 700, color: region.color }}>{val.display}</div>
                    <div style={{ fontSize: 11, color: "var(--color-text-sub)" }}>{val.years}</div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Combined estimate */}
          <div style={{
            border: "2px solid var(--color-blue-main)",
            borderRadius: "var(--radius-card)",
            padding: "14px 16px",
            background: "var(--color-bg-soft-blue)",
          }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--color-blue-main)", marginBottom: 4 }}>
              Combined Estimate
            </div>
            <div style={{ fontSize: 24, fontWeight: 700, color: "var(--color-blue-main)" }}>
              {ROI_CURRENT.combined.display}
            </div>
            <div style={{ fontSize: 11, color: "var(--color-text-sub)" }}>{ROI_CURRENT.combined.years}</div>
          </div>

          <div className="sample-notice">
            Illustrative ROI layout based on demo data · RSNA public-data demo references ·
            No live atlas database query is performed.
          </div>
        </div>
      </div>
    </div>
  );
}
