# Update log

## 2026-11-03 — Book covers and randomized two-store banner

- Replaced the CSS icon with a real 28×38px proportional cover. Stored 32 bookstore-provided small thumbnails separately in `banner/covers/`, approximately 0.28MB in total. Full source URLs, SHA-256 hashes, dimensions, store links and authorization context are in `covers/SOURCES.json`.
- Reduced the disclosure to 8px and increased the title to 15px (14px on narrow screens). Preserved the narrow banner, close/session dismissal, bottom navigation clearance, local-host restrictions and Astra practice exclusion.
- Select a random book on each document/banner mount and independently select YES24 or Kyobo. Reroll the store every 5,000ms while visible and not being hovered or focused. All three links (cover/title/button) update together; no cover download or book change occurs on a store tick. Clear the timer on dismissal. Repeated random store choices are allowed.
- Imported the author's current catalog, found two missing YES24 destinations and corrected the 404 YES24 link for 코딩하는 공익. 32 books have a two-store pair; four without a verified pair remain excluded, documented in the banner README. Kyobo product URLs are confirmed against the author catalog; ordinary Kyobo HTML responses were empty, so store-page visual verification is not claimed.
- Component and stable-loader regression checks: 18 passed. Verified every configured cover file and hash, catalog selection, both store destinations, five-second timer, hover/focus/hidden pause, cleanup, session dismissal and existing host/layout guards.
- Browser visual QA was attempted, but both existing-browser selection and in-app browser creation returned `Local browser use is disabled in Work settings`. Mobile/desktop rendering and actual store-click UI remain unverified for this revision.
- This revision changes the central CDN only. Existing app embeds continue using the same stable loader URL; their four publisher integrations and source files are untouched.

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
