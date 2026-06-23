/**
 * demoService.js
 *
 * Public demo service — zero network calls, zero API connections.
 * All results are returned from local mockup data in src/data/.
 *
 * PROHIBITED: fetch(), axios, XMLHttpRequest, WebSocket, EventSource,
 *             FormData POST, import.meta.env, VITE_API_BASE_URL,
 *             localhost, 127.0.0.1, any real backend reference.
 */

import { getPublicDemoCase, PUBLIC_DEMO_CASES } from "../data/publicDemoCases.js";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Simulate running demo analysis for a given case ID.
 * Returns local mockup data after a short artificial delay.
 */
export async function runDemoAnalysis(caseId) {
  await delay(700);
  const result = getPublicDemoCase(caseId);
  if (!result) throw new Error(`Demo case not found: ${caseId}`);
  return result;
}

/**
 * Load comparison data for Previous / Current demo cases.
 */
export async function loadDemoComparison() {
  await delay(200);
  return {
    previous: getPublicDemoCase("demo_female_126m"),
    current: getPublicDemoCase("demo_female_132m"),
  };
}

/**
 * Return the list of all available demo cases.
 */
export function listDemoCases() {
  return PUBLIC_DEMO_CASES;
}
