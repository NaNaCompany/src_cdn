# Update log

## 2026-11-02 — Shared Astra book advertisement

- Added `banner/astra.js`: a compact, closable floating book ad linking to the user-provided YES24 product page for 스스로 일하는 GPT 아스트라.
- The campaign, translated controls, style and target are centrally maintained in one script. Existing applications consume its stable URL.
- Original CSS icon; no unverified book-cover redistribution. Shadow DOM isolates the design. Existing bottom navigation, mobile input, modal dialogs and fullscreen are considered.
- The Astra practice site is excluded. No additional analytics or ad-network integrations are introduced by this banner.
- Validation and rollout evidence are recorded under workspace `.tools/shared-book-banner-20261102/`.
- Production browser QA found an existing AdSense bottom anchor; the component now clears anchored overlays up to 320px or half the viewport height. The close button and session dismissal were verified in the browser.
- The CDN returns `Cache-Control: max-age=14400`. The stable `astra.js` loader now requests `astra-banner.js` with a shared five-minute time bucket. Future edits to the runtime propagate on navigation/reload without changing any consumer repository; existing cached pre-migration scripts may first require revalidation.
- The runtime also reacts to inline-style changes in existing bottom anchors; its own layout writes are excluded to prevent observer loops. Component and loader regression tests: 14 passed.
- Consumers: 266 repositories committed/pushed, exact deployment commits and public HTML/shared-asset responses verified. Static checks preserve 41,000 direct HTML documents and cover 178,403 archive documents through shared assets. Source templates are included in these audit counts; they are not presented as a count of unique public URLs. Engineering/locale regeneration checks: 163 passed.
- Browser checks verified the 44px banner, YES24 destination, existing ad-anchor clearance and close/session persistence. PDF/Word/QR browser downloads were validated structurally and decoded. The browser ignored the requested mobile viewport override; physical/mobile pixel QA remains unverified.
- The existing main catalog checkout coverage check still requires missing sibling repositories; its pre-existing failure is recorded separately from banner checks. No catalog entries or sitemap URL sets were changed.
