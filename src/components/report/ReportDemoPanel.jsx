import {
  CURRENT_STUDY,
  ENSEMBLE_MEMBERS,
  ROI_CURRENT,
  REFERENCE_CANDIDATES,
} from "../../data/mockDemoData.js";

function Row({ label, value }) {
  return (
    <div className="report-summary-row">
      <span className="report-summary-label">{label}</span>
      <span className="report-summary-value">{value}</span>
    </div>
  );
}

export default function ReportDemoPanel() {
  const bestMatch = REFERENCE_CANDIDATES.find((r) => r.isBestMatch);

  return (
    <div className="fullwidth-panel">
      <div className="fullwidth-panel-inner" style={{ maxWidth: 860 }}>

        {/* Header */}
        <div className="card">
          <div className="card-title">
            <span className="card-title-icon">📄</span>
            Report Preview — {CURRENT_STUDY.id}
            <span className="simulation-badge" style={{ marginLeft: "auto" }}>Demo · Not a clinical report</span>
          </div>
          <div className="sample-notice">
            This is a UI demonstration report preview. All values are pre-defined demo data.
            No real patient data, no server storage, no PDF generation, no external transmission.
          </div>
        </div>

        {/* Patient / Study Info */}
        <div className="card">
          <div className="card-title">
            <span className="card-title-icon">📋</span>
            Study Information
          </div>
          <Row label="Case ID" value={CURRENT_STUDY.id} />
          <Row label="Sex" value={CURRENT_STUDY.sex} />
          <Row label="Study Type" value="Demo current study" />
          <Row label="Chronological Age" value={`${CURRENT_STUDY.chronologicalAgeYears} y / ${CURRENT_STUDY.chronologicalAgeMonths} m`} />
          <Row label="Demo Bone Age" value={`${CURRENT_STUDY.demoBoneAgeYears} y / ${CURRENT_STUDY.demoBoneAgeMonths} m`} />
          <Row label="Difference" value={`${CURRENT_STUDY.differenceMonths} m`} />
        </div>

        {/* X-ray thumbnail + ensemble */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div className="card">
            <div className="card-title" style={{ marginBottom: 8 }}>
              <span className="card-title-icon">🖼</span>
              X-ray Thumbnail
            </div>
            <div style={{ background: "#050F1A", borderRadius: "var(--radius-sm)", overflow: "hidden" }}>
              <img
                src={CURRENT_STUDY.imageUrl}
                alt="RSNA demo current X-ray thumbnail"
                style={{ width: "100%", maxHeight: 240, objectFit: "contain", display: "block" }}
              />
            </div>
            <div style={{ fontSize: 10, color: "var(--color-text-sub)", marginTop: 6, textAlign: "center" }}>
              RSNA 2017 public-dataset sample · Female · 11.0 y
            </div>
          </div>

          <div className="card">
            <div className="card-title">
              <span className="card-title-icon">🤖</span>
              Ensemble Summary
            </div>
            {ENSEMBLE_MEMBERS.map((m) => (
              <div
                key={m.name}
                className={m.isEnsemble ? undefined : "report-summary-row"}
                style={m.isEnsemble ? {
                  marginTop: 8,
                  padding: "8px 10px",
                  background: "var(--color-bg-soft-blue)",
                  border: "1px solid var(--color-blue-main)",
                  borderRadius: "var(--radius-sm)",
                  display: "flex",
                  justifyContent: "space-between",
                } : {}}
              >
                <span className={m.isEnsemble ? undefined : "report-summary-label"}
                  style={m.isEnsemble ? { fontSize: 12, fontWeight: 700, color: "var(--color-blue-main)" } : {}}>
                  {m.name}
                </span>
                <span className={m.isEnsemble ? undefined : "report-summary-value"}
                  style={m.isEnsemble ? { fontSize: 13, fontWeight: 700, color: "var(--color-blue-main)" } : {}}>
                  {m.display}
                </span>
              </div>
            ))}
            <div className="sample-notice" style={{ marginTop: 8, fontSize: 10 }}>
              Pre-defined demonstration values; not live model inference.
            </div>
          </div>
        </div>

        {/* ROI summary */}
        <div className="card">
          <div className="card-title">
            <span className="card-title-icon">🔍</span>
            ROI Summary
          </div>
          <div className="roi-grid">
            {["hand", "carpal", "rus", "combined"].map((k) => {
              const v = ROI_CURRENT[k];
              return (
                <div key={k} className="roi-item">
                  <div className="roi-item-region">{v.label}</div>
                  <div className="roi-item-value">{v.display}</div>
                  <div className="roi-item-unit">{v.years}</div>
                </div>
              );
            })}
          </div>
          <div className="sample-notice">
            Illustrative ROI layout based on demo data. No real ROI detection performed.
          </div>
        </div>

        {/* Best Match summary */}
        <div className="card">
          <div className="card-title">
            <span className="card-title-icon">🔎</span>
            Reference Matching Summary
          </div>
          <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
            {bestMatch && (
              <div style={{ flexShrink: 0, width: 120 }}>
                <div style={{ background: "#050F1A", borderRadius: "var(--radius-sm)", overflow: "hidden", position: "relative" }}>
                  <img
                    src={bestMatch.imageUrl}
                    alt="Best match RSNA demo reference"
                    style={{ width: "100%", aspectRatio: "3/4", objectFit: "contain", display: "block" }}
                  />
                  <div style={{
                    position: "absolute", top: 6, left: "50%", transform: "translateX(-50%)",
                    background: "#059669", color: "white", fontSize: 9, fontWeight: 700,
                    padding: "2px 8px", borderRadius: 99, whiteSpace: "nowrap",
                  }}>★ BEST MATCH</div>
                </div>
                <div style={{ textAlign: "center", marginTop: 4, fontSize: 11, fontWeight: 700 }}>{bestMatch.label}</div>
              </div>
            )}
            <div style={{ flex: 1 }}>
              <Row label="Best Match Age" value={bestMatch ? bestMatch.label : "—"} />
              <Row label="Difference from Demo Bone Age" value={bestMatch ? `${bestMatch.differenceMonths} m` : "—"} />
              <Row label="Matching Method" value="Mock matching based on demo age values" />
              <div style={{ marginTop: 8 }} className="sample-notice">
                RSNA public-data demo references · Illustrative reference matching ·
                No live atlas database query is performed.
              </div>
              <div style={{ marginTop: 8, fontSize: 11, color: "var(--color-text-sub)" }}>
                For full longitudinal comparison → <strong>Comparison tab</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Export disabled */}
        <div className="card">
          <div className="card-title">
            <span className="card-title-icon">📥</span>
            Export
          </div>
          <button className="btn-report-disabled" disabled>
            Download PDF Report — Report preview only; PDF export is not enabled in the public demo.
          </button>
          <div style={{ marginTop: 8, fontSize: 11, color: "var(--color-text-sub)", textAlign: "center" }}>
            No personal data is stored or transmitted. This is a frontend-only demonstration.
          </div>
        </div>

      </div>
    </div>
  );
}
