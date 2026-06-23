const TABS = [
  { id: "main", label: "Main Analysis" },
  { id: "roi", label: "ROI Analysis" },
  { id: "comparison", label: "Comparison" },
  { id: "report", label: "Report" },
  // Atlas tab intentionally excluded — see README for copyright notice
];

export default function Header({ activeTab, onTabChange }) {
  return (
    <header className="header">
      <div className="header-logo">
        <div className="header-logo-icon">B</div>
        <span className="header-logo-text">BoneWise AI</span>
      </div>
      <span className="header-demo-badge">Public Demo</span>
      <nav className="header-tabs">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`header-tab${activeTab === tab.id ? " active" : ""}`}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </header>
  );
}
