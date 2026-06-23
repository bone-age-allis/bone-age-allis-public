/**
 * Footer.jsx
 *
 * RSNA data attribution and clinical disclaimer footer.
 * Visible on all screens to satisfy RSNA Terms of Use redistribution requirements.
 *
 * Required per RSNA Pediatric Bone Age Challenge Terms of Use:
 *  1. Link to the RSNA challenge dataset download page.
 *  2. Citation: Halabi SS et al., Radiology 2019;290(2):498-503.
 */

const RSNA_CHALLENGE_URL =
  "https://www.rsna.org/artificial-intelligence/ai-image-challenge/rsna-pediatric-bone-age-challenge-2017";
const ATTRIBUTION_README_URL =
  "https://github.com/bone-age-allis/bone-age-allis-public#data-source-attribution-and-permitted-use";

export default function Footer() {
  return (
    <footer className="app-footer">
      <span className="footer-demo-notice">Demo only — not for clinical use.</span>
      <span className="footer-sep" aria-hidden="true">·</span>
      <span className="footer-attribution">
        Selected de-identified images derived from the{" "}
        <a
          href={RSNA_CHALLENGE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="footer-link"
        >
          RSNA Pediatric Bone Age Challenge
        </a>{" "}
        dataset. Research &amp; education use only. Not for clinical diagnosis or patient management.
      </span>
      <span className="footer-sep" aria-hidden="true">·</span>
      <a
        href={ATTRIBUTION_README_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="footer-link footer-link--cite"
      >
        Data attribution &amp; citation →
      </a>
    </footer>
  );
}
