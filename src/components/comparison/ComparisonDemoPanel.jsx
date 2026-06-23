import { useState } from "react";
import {
  CURRENT_STUDY,
  PREVIOUS_STUDY,
  ROI_CURRENT,
  ROI_PREVIOUS,
  REFERENCE_CANDIDATES,
  COMPARISON_SUMMARY,
  ATLAS_COMPARISON,
} from "../../data/mockDemoData.js";

function StudyViewer({ study, label }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{
        fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px",
        color: "var(--color-text-sub)", textAlign: "center",
      }}>{label}</div>
      <div style={{ background: "#050F1A", borderRadius: "var(--radius-sm)", overflow: "hidden", position: "relative" }}>
        <img
          src={study.imageUrl}
          alt={`RSNA demo ${label} X-ray`}
          style={{ width: "100%", maxHeight: 360, objectFit: "contain", display: "block" }}
        />
        <div style={{
          position: "absolute", bottom: 8, left: 8,
          background: "rgba(5,15,26,0.85)", color: "rgba(255,255,255,0.55)",
          fontSize: 9, padding: "3px 8px", borderRadius: 4,
        }}>RSNA Public Data</div>
      </div>
      <div style={{
        border: "1px solid var(--color-border)", borderRadius: "var(--radius-sm)",
        padding: "10px 12px", background: "var(--color-bg-card)",
      }}>
        <div style={{ fontSize: 11, color: "var(--color-text-sub)", marginBottom: 4 }}>{study.sex} · {study.description}</div>
        <div style={{ display: "flex", gap: 16 }}>
          <div>
            <div style={{ fontSize: 10, color: "var(--color-text-sub)", fontWeight: 600, textTransform: "uppercase" }}>Chronological</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "var(--color-text-main)" }}>
              {study.chronologicalAgeYears} y / {study.chronologicalAgeMonths} m
            </div>
          </div>
          <div>
            <div style={{ fontSize: 10, color: "var(--color-text-sub)", fontWeight: 600, textTransform: "uppercase" }}>Demo Bone Age</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "var(--color-blue-main)" }}>
              {study.demoBoneAgeYears} y / {study.demoBoneAgeMonths} m
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ComparisonDemoPanel() {
  const [selectedRef, setSelectedRef] = useState("ref-132");

  return (
    <div className="fullwidth-panel">
      <div className="fullwidth-panel-inner" style={{ maxWidth: 1100 }}>

        {/* Header */}
        <div className="card">
          <div className="card-title">
            <span className="card-title-icon">📅</span>
            Longitudinal Comparison — Previous vs. Current
            <span className="simulation-badge" style={{ marginLeft: "auto" }}>Simulation · Not real longitudinal AI analysis</span>
          </div>
          <p style={{ fontSize: 11, color: "var(--color-text-sub)", lineHeight: 1.5 }}>
            Simulation comparison; not a real longitudinal AI analysis. RSNA public-data demo references.
          </p>
        </div>

        {/* Side-by-side viewer */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <StudyViewer study={PREVIOUS_STUDY} label="← Previous Study" />
          <StudyViewer study={CURRENT_STUDY} label="Current Study →" />
        </div>

        {/* Progression summary */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div className="comparison-delta">
            <div className="comparison-delta-value">Interval: {COMPARISON_SUMMARY.intervalMonths} months</div>
            <div className="comparison-delta-label">Time between examinations</div>
          </div>
          <div className="comparison-delta">
            <div className="comparison-delta-value">+{COMPARISON_SUMMARY.boneAgeProgressionMonths} months</div>
            <div className="comparison-delta-label">Demo bone-age progression</div>
          </div>
        </div>

        {/* ROI comparison table */}
        <div className="card">
          <div className="card-title">
            <span className="card-title-icon">📊</span>
            ROI Comparison — Previous vs. Current
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8, textAlign: "center" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--color-text-sub)", padding: "6px 0" }}>Region</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--color-text-sub)", padding: "6px 0" }}>Previous</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--color-text-sub)", padding: "6px 0" }}>Current</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--color-text-sub)", padding: "6px 0" }}>Change</div>
            {["hand", "carpal", "rus"].map((r) => {
              const prev = ROI_PREVIOUS[r];
              const curr = ROI_CURRENT[r];
              const delta = (curr.months - prev.months).toFixed(1);
              return [
                <div key={r+"-n"} style={{ background: "var(--color-bg-soft-blue)", borderRadius: 4, padding: "8px 4px", fontWeight: 700, fontSize: 12 }}>{r.toUpperCase()}</div>,
                <div key={r+"-p"} style={{ background: "var(--color-bg-soft-blue)", borderRadius: 4, padding: "8px 4px", fontSize: 13, color: "var(--color-text-sub)" }}>{prev.display}</div>,
                <div key={r+"-c"} style={{ background: "var(--color-bg-soft-blue)", borderRadius: 4, padding: "8px 4px", fontSize: 13, color: "var(--color-blue-main)", fontWeight: 700 }}>{curr.display}</div>,
                <div key={r+"-d"} style={{ background: "#F0FDF4", borderRadius: 4, padding: "8px 4px", fontSize: 13, color: "var(--color-success)", fontWeight: 700 }}>+{delta} m</div>,
              ];
            })}
          </div>
          <div className="sample-notice" style={{ marginTop: 10 }}>
            Demo display only — ROI values are pre-defined mockup data, not real inference results.
          </div>
        </div>

        {/* Reference candidate strip */}
        <div className="card">
          <div className="card-title">
            <span className="card-title-icon">🔎</span>
            Illustrative Reference Matching
            <span className="simulation-badge" style={{ marginLeft: "auto" }}>No live atlas database query</span>
          </div>
          <p style={{ fontSize: 11, color: "var(--color-text-sub)", marginBottom: 10, lineHeight: 1.5 }}>
            RSNA public-data demo references · Mock matching based on demo age values
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            {REFERENCE_CANDIDATES.map((ref) => {
              const isSelected = selectedRef === ref.id;
              return (
                <div
                  key={ref.id}
                  onClick={() => setSelectedRef(ref.id)}
                  style={{
                    border: `2px solid ${isSelected ? "var(--color-blue-main)" : ref.isBestMatch ? "#059669" : "var(--color-border)"}`,
                    borderRadius: "var(--radius-sm)",
                    padding: 8,
                    cursor: "pointer",
                    background: isSelected ? "var(--color-bg-soft-blue)" : "var(--color-bg-card)",
                    position: "relative",
                    transition: "all 0.15s",
                  }}
                >
                  {ref.isBestMatch && (
                    <div style={{
                      position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)",
                      background: "#059669", color: "white", fontSize: 9, fontWeight: 700,
                      padding: "2px 8px", borderRadius: 99, whiteSpace: "nowrap", zIndex: 1,
                    }}>★ BEST MATCH</div>
                  )}
                  <img
                    src={ref.imageUrl}
                    alt={`RSNA demo reference ${ref.label}`}
                    style={{ width: "100%", aspectRatio: "3/4", objectFit: "contain", background: "#0B1F3A", borderRadius: 4 }}
                  />
                  <div style={{ marginTop: 6, textAlign: "center" }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "var(--color-text-main)" }}>{ref.label}</div>
                    <div style={{ fontSize: 10, color: "var(--color-text-sub)" }}>Δ {ref.differenceMonths} m</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Atlas Comparison — 2-panel layout ──────────────────── */}
        <div style={{
          border: "1.5px solid var(--color-border)",
          borderRadius: "var(--radius-card)",
          overflow: "hidden",
          background: "var(--color-bg-card)",
          boxShadow: "var(--shadow-card)",
        }}>
          {/* Section header */}
          <div style={{
            padding: "12px 16px",
            borderBottom: "1px solid var(--color-border)",
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "var(--color-bg-main)",
          }}>
            <span style={{ fontSize: 15 }}>🔬</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--color-text-main)" }}>
              Atlas Comparison
            </span>
            <span style={{
              marginLeft: "auto",
              fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px",
              color: "#78350F", background: "#FEF3C7", border: "1px solid #FDE68A",
              padding: "2px 8px", borderRadius: 99,
            }}>Static Mock · No real Atlas DB</span>
          </div>

          {/* Gender badge row */}
          <div style={{ padding: "8px 16px", borderBottom: "1px solid var(--color-border)", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{
              fontSize: 11, fontWeight: 700, color: "#BE185D",
              background: "#FDF2F8", border: "1px solid #FBCFE8",
              padding: "2px 10px", borderRadius: 99,
            }}>♀ Female</span>
            <span style={{ fontSize: 11, color: "var(--color-text-sub)" }}>Demo patient · 11.0 y · 132 m</span>
          </div>

          {/* Two-panel image area */}
          <div className="atlas-comparison-grid" style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 0,
          }}>
            {/* LEFT — Current Patient X-ray */}
            <div style={{ borderRight: "1px solid var(--color-border)", display: "flex", flexDirection: "column" }}>
              {/* Panel header */}
              <div style={{
                background: "rgba(37,99,235,0.07)",
                borderBottom: "2px solid #3B82F6",
                padding: "8px 14px",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}>
                <span style={{ fontSize: 11 }}>👤</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#1E40AF" }}>
                  Current Patient X-ray
                </span>
              </div>
              {/* Image */}
              <div style={{
                background: "#050F1A",
                flex: 1,
                minHeight: 340,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                overflow: "hidden",
              }}>
                <img
                  src={ATLAS_COMPARISON.patient.imageUrl}
                  alt="RSNA demo current patient X-ray (11461)"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    display: "block",
                  }}
                />
                <div style={{
                  position: "absolute", bottom: 8, left: 8,
                  background: "rgba(5,15,26,0.82)", color: "rgba(255,255,255,0.5)",
                  fontSize: 9, padding: "2px 7px", borderRadius: 4,
                }}>RSNA Public Data · ID 11461</div>
              </div>
              {/* Info bar */}
              <div style={{
                padding: "8px 14px",
                borderTop: "1px solid var(--color-border)",
                background: "rgba(37,99,235,0.04)",
                fontSize: 11,
                color: "var(--color-text-sub)",
              }}>
                {ATLAS_COMPARISON.patient.sex} · {ATLAS_COMPARISON.patient.ageYears} y · {ATLAS_COMPARISON.patient.ageMonths} m
              </div>
            </div>

            {/* RIGHT — Best Match Reference Atlas */}
            <div style={{ display: "flex", flexDirection: "column" }}>
              {/* Panel header */}
              <div style={{
                background: "rgba(5,150,105,0.07)",
                borderBottom: "2px solid #059669",
                padding: "8px 14px",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}>
                <span style={{ fontSize: 11 }}>📋</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#065F46" }}>
                  Best Match Reference Atlas
                </span>
                <span style={{
                  marginLeft: "auto",
                  background: "#059669", color: "white",
                  fontSize: 9, fontWeight: 700,
                  padding: "2px 8px", borderRadius: 99,
                  whiteSpace: "nowrap",
                }}>★ BEST MATCH</span>
              </div>
              {/* Image */}
              <div style={{
                background: "#050F1A",
                flex: 1,
                minHeight: 340,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                overflow: "hidden",
              }}>
                <img
                  src={ATLAS_COMPARISON.bestMatch.imageUrl}
                  alt="RSNA demo best match reference atlas (11461)"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    display: "block",
                  }}
                />
                {/* Reference overlay label */}
                <div style={{
                  position: "absolute", top: 10, left: 10,
                  background: "rgba(5,150,105,0.88)", color: "white",
                  fontSize: 11, fontWeight: 700,
                  padding: "4px 10px", borderRadius: 5,
                  letterSpacing: "0.3px",
                }}>11 y ♀</div>
                <div style={{
                  position: "absolute", bottom: 8, right: 8,
                  background: "rgba(5,15,26,0.82)", color: "rgba(255,255,255,0.5)",
                  fontSize: 9, padding: "2px 7px", borderRadius: 4,
                }}>RSNA Public Data · Ref Match</div>
              </div>
              {/* Info bar */}
              <div style={{
                padding: "8px 14px",
                borderTop: "1px solid var(--color-border)",
                background: "rgba(5,150,105,0.04)",
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontSize: 11,
                color: "var(--color-text-sub)",
              }}>
                <span>{ATLAS_COMPARISON.bestMatch.refCode}</span>
                <span style={{
                  marginLeft: "auto",
                  color: "#059669", fontWeight: 700, fontSize: 11,
                }}>Match {ATLAS_COMPARISON.bestMatch.matchScore}%</span>
              </div>
            </div>
          </div>

          {/* Bottom notice */}
          <div className="sample-notice" style={{ margin: "0", borderRadius: 0, borderTop: "1px solid var(--color-border)", borderBottomLeftRadius: "var(--radius-card)", borderBottomRightRadius: "var(--radius-card)" }}>
            Atlas Comparison is a static mock demonstration. No real Greulich–Pyle Atlas images or live database query used. RSNA public-data images only.
          </div>
        </div>

      </div>
    </div>
  );
}
