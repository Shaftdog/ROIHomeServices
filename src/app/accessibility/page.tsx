
export default function AccessibilityStatementPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold">Accessibility Statement</h1>
        <p className="text-sm text-muted-foreground">Last updated: August 20, 2025</p>
      </header>
      <div className="prose dark:prose-invert max-w-none">
        <p>
          ROI Home Services is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards.
        </p>

        <h2>Conformance Status</h2>
        <p>
          The Web Content Accessibility Guidelines (WCAG) define requirements for designers and developers to improve accessibility for people with disabilities. WCAG defines three levels of conformance: Level A, Level AA, and Level AAA. ROI Home Services aims to conform with WCAG 2.2 Level AA.
        </p>
        <p>
          We conduct periodic audits and improvements to maintain and enhance conformance. While we strive for AA conformance across our primary user flows, some legacy content or third‑party integrations may not yet fully meet the standard. We welcome your feedback to help us prioritize fixes.
        </p>

        <h2>Measures to Support Accessibility</h2>
        <p>ROI Home Services takes the following measures:</p>
        <ul>
          <li>Include accessibility in our mission and product requirements.</li>
          <li>Integrate accessibility into procurement and vendor selection.</li>
          <li>Provide continual accessibility training for staff and contractors.</li>
          <li>Assign clear accessibility targets, ownership, and timelines.</li>
          <li>Test with assistive technologies and keyboard‑only navigation.</li>
          <li>Maintain a documented process for reporting and remediating issues.</li>
        </ul>

        <h2>Technical Specifications</h2>
        <p>Accessibility of ROI Home Services’ website relies on:</p>
        <ul>
            <li>HTML</li>
            <li>WAI‑ARIA</li>
            <li>CSS</li>
            <li>JavaScript</li>
        </ul>
        <p>These technologies are relied upon for conformance with the accessibility standards used.</p>
        
        <h3>Compatibility with Browsers and Assistive Technology</h3>
        <p>Our site is designed to be compatible with recent versions of major browsers and assistive technologies. We aim to support:</p>
        <ul>
            <li>Current and previous major versions of Chrome, Safari, Edge, and Firefox</li>
            <li>Screen readers such as NVDA and VoiceOver</li>
            <li>Keyboard‑only navigation and sufficient color contrast</li>
        </ul>
        <p>Some third‑party widgets, embedded maps, or media players may have accessibility limitations. When feasible, we provide alternative means of access.</p>

        <h2>Assessment Approach</h2>
        <p>We use a combination of:</p>
        <ul>
            <li>Automated scans (e.g., axe, Lighthouse)</li>
            <li>Manual testing against WCAG 2.2 AA success criteria</li>
            <li>User feedback and issue tracking</li>
        </ul>
        
        <h2>Known Limitations</h2>
        <p>Despite our best efforts, some content may not be fully accessible:</p>
        <ul>
            <li>PDFs or documents uploaded by users or third parties may not be fully tagged.</li>
            <li>Older pages and archived marketing assets may not meet current headings/contrast standards.</li>
            <li>Third‑party iframes (maps, scheduling, analytics, payment forms) may have constraints beyond our control.</li>
        </ul>
        <p>We prioritize remediation based on severity, frequency, and user impact.</p>

        <h2>Feedback</h2>
        <p>We welcome your feedback on the accessibility of ROI Home Services’ website. If you encounter barriers, please contact us:</p>
        <ul>
            <li>Phone: 407‑759‑3611</li>
            <li>Email: accessibility@myroihome.com</li>
            <li>Mailing Address: Available upon request or listed on your engagement letter</li>
        </ul>
        <p>We aim to respond within 5 business days. When feasible, we will provide an accessible alternative for the requested content or functionality.</p>
        
        <h2>Preparation of This Accessibility Statement</h2>
        <p>This statement was prepared and last reviewed on August 20, 2025. We review the statement at least annually and upon major site updates.</p>

        <h2>Requesting Alternative Formats</h2>
        <p>If you need any of our content in an alternative format (large print, audio, braille, tagged PDF), contact us using the methods above and describe the content and format you require.</p>
      </div>
    </div>
  );
}
