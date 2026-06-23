import { useState } from "react";
import {
  CURRENT_STUDY,
  ENSEMBLE_MEMBERS,
  REFERENCE_CANDIDATES,
} from "../../data/mockDemoData.js";

/* ─────────────────────────────────────────────────
   Analysis step definitions (matches App.jsx STEP_TIMINGS order)
   ───────────────────────────────────────────────── */
const ANALYSIS_STEPS = [
  { id: 1, label: "Preparing radiograph" },
  { id: 2, label: "Applying preprocessing" },
  { id: 3, label: "Evaluating 4-member ensemble" },
  { id: 4, label: "Matching illustrative references" },
  { id: 5, label: "Preparing report" },
];

/* ─────────────────────────────────────────────────
   Shared: case information rows (always visible)
   ───────────────────────────────────────────────── */
function CaseInfoRows() {
  return (
    <div className="prediction-grid" style={{ marginBottom: 12 }}>
      <div className="prediction-item">
        <div className="prediction-item-label">Case ID</div>
        <div className="prediction-item-value" style={{ fontSize: 13 }}>{CURRENT_STUDY.id}</div>
      </div>
      <div className="prediction-item">
        <div className="prediction-item-label">Sex</div>
        <div className="prediction-item-value" style={{ fontSize: 15 }}>{CURRENT_STUDY.sex}</div>
      </div>
      <div className="prediction-item">
        <div className="prediction-item-label">Chronological Age</div>
        <div className="prediction-item-value" style={{ fontSize: 15 }}>
          {CURRENT_STUDY.chronologicalAgeYears} y / {CURRENT_STUDY.chronologicalAgeMonths} m
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────
   Phase A — Ready state: case info + CTA
   ───────────────────────────────────────────────── */
function ReadySummaryCard({ onStartAnalysis }) {
  return (
    <div className="card">
      <div className="card-title">
        <span className="card-title-icon">🦴</span>
        Analysis Summary
        <span className="simulation-badge" style={{ marginLeft: "auto" }}>Demo · RSNA Public Data</span>
      </div>

      {/* Always-visible case info */}
      <CaseInfoRows />

      {/* Pending result placeholders */}
      <div className="prediction-grid" style={{ marginBottom: 14 }}>
        <div className="prediction-item prediction-item--pending">
          <div className="prediction-item-label">Demo Bone Age</div>
          <div className="prediction-item-value prediction-placeholder">—</div>
        </div>
        <div className="prediction-item prediction-item--pending">
          <div className="prediction-item-label">Difference</div>
          <div className="prediction-item-value prediction-placeholder">—</div>
        </div>
      </div>

      {/* Disclosure notice */}
      <div className="demo-notice-box" style={{ marginBottom: 14 }}>
        <p>Public demonstration workflow.</p>
        <p>
          Results are predefined for this illustrative case and do not represent
          live model inference or clinical decision support.
        </p>
      </div>

      {/* Primary CTA */}
      <button className="btn-demo-analyze btn-run-analysis" onClick={onStartAnalysis}>
        ▶&nbsp; Run Demo Analysis
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────────
   Phase B — Analyzing state: progress steps
   ───────────────────────────────────────────────── */
function AnalyzingSummaryCard({ analysisStep }) {
  return (
    <div className="card">
      <div className="card-title">
        <span className="card-title-icon">🦴</span>
        Analysis Summary
        <span className="simulation-badge" style={{ marginLeft: "auto" }}>Demo · RSNA Public Data</span>
      </div>

      <CaseInfoRows />

      {/* Simulated workflow notice */}
      <div className="analysis-progress-notice">
        Simulated analysis progress for demonstration purposes.
        No live model inference is performed.
      </div>

      {/* Step list */}
      <div className="analysis-steps">
        {ANALYSIS_STEPS.map((step) => {
          const isDone   = analysisStep > step.id;
          const isActive = analysisStep === step.id;
          return (
            <div
              key={step.id}
              className={`analysis-step-item ${isDone ? "done" : isActive ? "active" : "pending"}`}
            >
              <span className="analysis-step-icon">
                {isDone ? "✓" : isActive ? "●" : "○"}
              </span>
              <span className="analysis-step-label">{step.label}</span>
              {isActive && <span className="analysis-step-spinner" />}
            </div>
          );
        })}
      </div>

      {/* Disabled analyzing button */}
      <button className="btn-demo-analyze" disabled>
        <span className="loading-spinner" style={{ width: 13, height: 13 }} />
        Analyzing demonstration case…
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────────
   Phase C — Complete state: all results + secondary CTAs
   ───────────────────────────────────────────────── */
function CompleteSummaryCard({ onRestartDemo, onTabChange }) {
  return (
    <div className="card">
      <div className="card-title">
        <span className="card-title-icon">🦴</span>
        Analysis Summary
        <span className="simulation-badge" style={{ marginLeft: "auto" }}>Demo · RSNA Public Data</span>
      </div>

      <div className="prediction-grid">
        <div className="prediction-item">
          <div className="prediction-item-label">Case ID</div>
          <div className="prediction-item-value" style={{ fontSize: 13 }}>{CURRENT_STUDY.id}</div>
        </div>
        <div className="prediction-item">
          <div className="prediction-item-label">Sex</div>
          <div className="prediction-item-value" style={{ fontSize: 15 }}>{CURRENT_STUDY.sex}</div>
        </div>
        <div className="prediction-item">
          <div className="prediction-item-label">Chronological Age</div>
          <div className="prediction-item-value" style={{ fontSize: 15 }}>
            {CURRENT_STUDY.chronologicalAgeYears} y / {CURRENT_STUDY.chronologicalAgeMonths} m
          </div>
        </div>
        <div className="prediction-item">
          <div className="prediction-item-label">Demo Bone Age</div>
          <div className="prediction-item-value" style={{ fontSize: 15 }}>
            {CURRENT_STUDY.demoBoneAgeYears} y / {CURRENT_STUDY.demoBoneAgeMonths} m
          </div>
        </div>
        <div className="prediction-item">
          <div className="prediction-item-label">Difference</div>
          <div
            className="prediction-item-value"
            style={{ fontSize: 15, color: "var(--color-success)" }}
          >
            {CURRENT_STUDY.differenceMonths} m
          </div>
        </div>
      </div>

      {/* Complete banner */}
      <div className="analysis-complete-banner">
        <span className="analysis-complete-icon">✓</span>
        Analysis Complete
        <span className="analysis-complete-sub">Pre-defined demonstration values</span>
      </div>

      {/* Secondary action buttons */}
      <div className="analysis-secondary-actions">
        <button className="btn-secondary-action" onClick={onRestartDemo}>
          ↺ Restart Demo
        </button>
        <button
          className="btn-secondary-action btn-secondary-action--green"
          onClick={() => onTabChange && onTabChange("report")}
        >
          View Report →
        </button>
        <button
          className="btn-secondary-action btn-secondary-action--purple"
          onClick={() => onTabChange && onTabChange("roi")}
        >
          Explore ROI →
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────
   4-Member Ensemble results card
   ───────────────────────────────────────────────── */
function EnsembleCard({ revealed }) {
  return (
    <div className={`card${revealed ? " result-reveal" : ""}`}>
      <div className="card-title">
        <span className="card-title-icon">🤖</span>
        4-Member Ensemble
      </div>
      <div className="ensemble-grid">
        {ENSEMBLE_MEMBERS.filter((m) => !m.isEnsemble).map((m) => (
          <div key={m.name} className="ensemble-item">
            <span className="ensemble-item-name">{m.name}</span>
            <span className="ensemble-item-value">{m.display}</span>
          </div>
        ))}
      </div>
      {(() => {
        const ens = ENSEMBLE_MEMBERS.find((m) => m.isEnsemble);
        return ens ? (
          <div style={{
            marginTop: 8,
            background: "var(--color-bg-soft-blue)",
            border: "1px solid var(--color-blue-main)",
            borderRadius: "var(--radius-sm)",
            padding: "8px 12px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "var(--color-blue-main)" }}>
              Ensemble (Final)
            </span>
            <span style={{ fontSize: 14, fontWeight: 700, color: "var(--color-blue-main)" }}>
              {ens.display}
            </span>
          </div>
        ) : null;
      })()}
      <div className="sample-notice" style={{ marginTop: 8 }}>
        Pre-defined demonstration values; not live model inference.
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────
   Illustrative reference matching card
   ───────────────────────────────────────────────── */
function ReferenceCandidates({ onGoComparison, revealed }) {
  const [selected, setSelected] = useState("ref-132");
  return (
    <div
      className={`card${revealed ? " result-reveal" : ""}`}
      style={revealed ? { animationDelay: "0.12s" } : {}}
    >
      <div className="card-title">
        <span className="card-title-icon">🔎</span>
        Illustrative Reference Matching
        <span className="simulation-badge" style={{ marginLeft: "auto" }}>No live atlas query</span>
      </div>
      <p style={{ fontSize: 11, color: "var(--color-text-sub)", marginBottom: 10, lineHeight: 1.5 }}>
        Illustrative reference matching only. No live atlas query is performed.
        RSNA public-data mock references — predefined for this demonstration.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 8 }}>
        {REFERENCE_CANDIDATES.map((ref) => (
          <div
            key={ref.id}
            onClick={() => setSelected(ref.id)}
            style={{
              border: `2px solid ${selected === ref.id ? "var(--color-blue-main)" : "var(--color-border)"}`,
              borderRadius: "var(--radius-sm)",
              padding: 6,
              cursor: "pointer",
              background: selected === ref.id ? "var(--color-bg-soft-blue)" : "var(--color-bg-card)",
              position: "relative",
              transition: "all 0.15s",
            }}
          >
            {ref.isBestMatch && (
              <div style={{
                position: "absolute", top: -8, left: "50%", transform: "translateX(-50%)",
                background: "#059669", color: "white", fontSize: 9, fontWeight: 700,
                padding: "2px 7px", borderRadius: 99, whiteSpace: "nowrap",
              }}>
                ★ BEST MATCH
              </div>
            )}
            <img
              src={ref.imageUrl}
              alt={`RSNA demo reference ${ref.label}`}
              style={{
                width: "100%",
                aspectRatio: "3/4",
                objectFit: "contain",
                background: "#0B1F3A",
                borderRadius: 4,
              }}
            />
            <div style={{ marginTop: 4, textAlign: "center" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--color-text-main)" }}>
                {ref.label}
              </div>
              <div style={{ fontSize: 10, color: "var(--color-text-sub)" }}>
                Δ {ref.differenceMonths} m
              </div>
            </div>
          </div>
        ))}
      </div>
      <button
        className="btn-demo-analyze"
        style={{ background: "#059669" }}
        onClick={onGoComparison}
      >
        View Comparison →
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────────
   Skeleton placeholder card (shown before results are ready)
   ───────────────────────────────────────────────── */
function SkeletonCard({ title, icon }) {
  return (
    <div className="card card--skeleton">
      <div className="card-title">
        <span className="card-title-icon">{icon}</span>
        {title}
        <span className="skeleton-pending-badge" style={{ marginLeft: "auto" }}>Pending</span>
      </div>
      <div className="skeleton-content">
        <div className="skeleton-line" style={{ width: "80%" }} />
        <div className="skeleton-line" style={{ width: "55%" }} />
        <div className="skeleton-line" style={{ width: "70%" }} />
      </div>
      <p className="skeleton-hint">Run Demo Analysis to view results.</p>
    </div>
  );
}

/* ─────────────────────────────────────────────────
   Main export — orchestrates the three demo phases
   ───────────────────────────────────────────────── */
export default function MainAnalysisPanel({
  onTabChange,
  demoStatus,
  analysisStep,
  onStartAnalysis,
  onRestartDemo,
}) {
  const goComparison = () => onTabChange && onTabChange("comparison");

  return (
    <div className="right-panel">

      {/* ── Phase A: Ready ────────────────────────── */}
      {demoStatus === "ready" && (
        <>
          <ReadySummaryCard onStartAnalysis={onStartAnalysis} />
          <SkeletonCard title="4-Member Ensemble"               icon="🤖" />
          <SkeletonCard title="Illustrative Reference Matching" icon="🔎" />
        </>
      )}

      {/* ── Phase B: Analyzing ───────────────────── */}
      {demoStatus === "analyzing" && (
        <>
          <AnalyzingSummaryCard analysisStep={analysisStep} />
          {/* Ensemble card reveals at step 3 */}
          {analysisStep < 3
            ? <SkeletonCard title="4-Member Ensemble" icon="🤖" />
            : <EnsembleCard revealed />}
          {/* Reference card reveals at step 4 */}
          {analysisStep < 4
            ? <SkeletonCard title="Illustrative Reference Matching" icon="🔎" />
            : <ReferenceCandidates onGoComparison={goComparison} revealed />}
        </>
      )}

      {/* ── Phase C: Complete ─────────────────────── */}
      {demoStatus === "complete" && (
        <>
          <CompleteSummaryCard onRestartDemo={onRestartDemo} onTabChange={onTabChange} />
          <EnsembleCard revealed />
          <ReferenceCandidates onGoComparison={goComparison} revealed />
        </>
      )}

    </div>
  );
}
