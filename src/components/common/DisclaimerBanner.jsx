import { DISCLAIMER_BANNER } from "../../data/publicDemoDisclosure.js";

export default function DisclaimerBanner() {
  return (
    <div className="disclaimer-banner">
      <strong>⚠ Public Demo Notice: </strong>
      {DISCLAIMER_BANNER}
    </div>
  );
}
