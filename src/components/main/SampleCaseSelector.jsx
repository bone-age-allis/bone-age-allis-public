import { listDemoCases } from "../../services/demoService.js";

const CASES = listDemoCases();

export default function SampleCaseSelector({ selectedId, onSelect }) {
  return (
    <div className="card">
      <div className="card-title">
        <span className="card-title-icon">📋</span>
        Select Sample Case
      </div>
      <div className="case-selector-grid">
        {CASES.map((c) => (
          <div
            key={c.id}
            className={`case-card${selectedId === c.id ? " selected" : ""}`}
            onClick={() => onSelect(c.id)}
          >
            <div className="case-card-label">{c.label}</div>
            <div className="case-card-age">{c.chronologicalDisplay}</div>
            <div className="case-card-info">
              {c.sex} · {c.description}
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 10, fontSize: 11, color: "var(--color-text-sub)" }}>
        Upload is disabled in public demo — select a sample case above.
      </div>
    </div>
  );
}
