import { useState, useEffect, useRef } from "react";
import DisclaimerBanner from "./components/common/DisclaimerBanner.jsx";
import Header from "./components/common/Header.jsx";
import Footer from "./components/common/Footer.jsx";
import ViewerPane from "./components/main/ViewerPane.jsx";
import MainAnalysisPanel from "./components/main/MainAnalysisPanel.jsx";
import RoiDemoPanel from "./components/roi/RoiDemoPanel.jsx";
import ComparisonDemoPanel from "./components/comparison/ComparisonDemoPanel.jsx";
import ReportDemoPanel from "./components/report/ReportDemoPanel.jsx";

/**
 * BoneWise AI — Public Demo
 *
 * Static frontend-only mockup for UI demonstration.
 * - No real API calls, no FastAPI, no model inference, no CUDA.
 * - All results are pre-defined local mockup data.
 * - Images: RSNA 2017 Pediatric Bone Age Challenge public dataset samples.
 * - No real patient data or DICOM files.
 *
 * Demo analysis flow:
 *   demoStatus: "ready" → "analyzing" → "complete"
 *   analysisStep: 0 (idle) | 1–5 (steps completed so far)
 *
 * State is kept here (App) so it persists while the user browses other tabs
 * and returns to Main Analysis.
 */

// Milliseconds from analysis start at which each step is marked complete
const STEP_TIMINGS = [600, 1200, 2200, 3000, 3500];

export default function App() {
  const [activeTab, setActiveTab]     = useState("main");
  const [viewerMode, setViewerMode]   = useState("Original");

  // Demo analysis flow — persisted at App level so tab navigation doesn't reset it
  const [demoStatus,   setDemoStatus]   = useState("ready");   // "ready" | "analyzing" | "complete"
  const [analysisStep, setAnalysisStep] = useState(0);          // 0 = not started; 1–5 = steps done

  const timersRef = useRef([]);

  function clearAllTimers() {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }

  function handleStartAnalysis() {
    if (demoStatus !== "ready") return;
    clearAllTimers();
    setDemoStatus("analyzing");
    setAnalysisStep(0);

    STEP_TIMINGS.forEach((delay, i) => {
      const t = setTimeout(() => {
        setAnalysisStep(i + 1);
        if (i === STEP_TIMINGS.length - 1) {
          // Brief pause after final step before showing complete state
          const done = setTimeout(() => setDemoStatus("complete"), 300);
          timersRef.current.push(done);
        }
      }, delay);
      timersRef.current.push(t);
    });
  }

  function handleRestartDemo() {
    clearAllTimers();
    setDemoStatus("ready");
    setAnalysisStep(0);
    setViewerMode("Original");
  }

  // Cleanup on unmount — also handles React StrictMode double-invoke
  useEffect(() => () => clearAllTimers(), []);

  return (
    <div className="app-root">
      <DisclaimerBanner />
      <Header activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="app-main">
        {activeTab === "main" && (
          <>
            <ViewerPane
              viewerMode={viewerMode}
              onModeChange={setViewerMode}
              demoStatus={demoStatus}
              analysisStep={analysisStep}
            />
            <MainAnalysisPanel
              viewerMode={viewerMode}
              onViewerModeChange={setViewerMode}
              onTabChange={setActiveTab}
              demoStatus={demoStatus}
              analysisStep={analysisStep}
              onStartAnalysis={handleStartAnalysis}
              onRestartDemo={handleRestartDemo}
            />
          </>
        )}
        {activeTab === "roi"        && <RoiDemoPanel />}
        {activeTab === "comparison" && <ComparisonDemoPanel />}
        {activeTab === "report"     && <ReportDemoPanel />}
      </main>

      <Footer />
    </div>
  );
}
