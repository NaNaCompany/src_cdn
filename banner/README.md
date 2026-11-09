# Shared Astra book banner

Central script: `https://nanalab.kr/src_cdn/banner/astra.js`

```html
<script defer src="https://nanalab.kr/src_cdn/banner/astra.js"></script>
```

Include the script once on each public page, or load it from an application asset shared by every page. Do not pin the script to a commit or use a content hash: existing consumers must receive subsequent central updates. GitHub Pages/browser caches can delay updates; an already open document updates after navigation or reload.

`astra.js` is a stable loader. Edit the campaign object at the top of `astra-banner.js` to change the book catalog, destinations, campaign ID or global enable/disable switch. CSS and translated ad/CTA labels are in that same runtime file. The loader requests the runtime using a shared five-minute time bucket, avoiding long browser cache lifetimes for future campaign changes. It does not refresh already open documents. The initial loader migration can still be subject to existing cached copies; reloading revalidates them.

One of 32 books is chosen uniformly per page. Two ordinary-flow banners are inserted at the beginning and end of the body; both show that book. The Korean book title is preserved in all languages; other languages explicitly label it as a Korean book. YES24 or Kyobo is independently chosen at mount and randomly chosen again every five seconds. Consecutive selections can be the same store. The book stays fixed until a new document/banner mount. Cover, title and store button always link to the same selected store product.

The timer pauses while the document or banner is hidden, the pointer is over the banner, or a banner control has keyboard focus. This keeps the destination stable during an intended click. Closing either banner removes both and clears their timers, and preserves the existing session dismissal key across all books and apps.

- Local thumbnail files are in `covers/`. Only the selected cover is loaded, from this CDN; the browser makes no bookstore requests before a click. The original proportions are preserved with `object-fit:contain`; covers remain visible on narrow screens.
- Covers are the bookstore-provided small thumbnail variants (220px maximum dimension, approximately 8KB each), not large originals scaled only through CSS. The 28×38px cover box replaces the former icon. The disclosure is 8px; the title is 15px (14px on narrow screens).
- Approximately 48px high, max-width 660px, Shadow DOM isolation, no animation, no dependency, and no analytics events. Time buckets are identical for all visitors and contain no visitor/page/input data.
- Catalog source: https://bhban.kr/api/books.json and https://bhban.kr/books/ (checked 2026-11-03). The missing YES24 links for 컴퓨터 활용팁 and 내 자산 자동으로 관리하기 were found on their store product pages; the stale 코딩하는 공익 link was replaced with https://www.yes24.com/product/goods/90081924.
- `covers/SOURCES.json` records the original thumbnail URL, author catalog, store URLs, file hashes, dimensions, and HTTP observations for every book. Kyobo's ordinary product responses returned HTTP 200 with an empty body to the verification client; those URLs are verified against the author's current catalog, not presented as a successful visual inspection of each store page.
- Cover artwork is used only for the author's explicitly requested promotion of their own books. Copyright remains with the publishers/cover creators; this is not an open-license claim or permission for unrelated onward reuse. No cover artwork was edited. Original source URLs and authorship context are retained in `covers/SOURCES.json`.
- Four catalog items are not in rotation: 별처럼 찬란히 빛나는 꿈으로 and Cheesecake Vol.1 lack a confirmed direct Kyobo product link; 법대로 합시다 and the childhood project 환세취호전 have no verified two-store product pair. Do not invent product identifiers or send visitors to a different book.
- Closable; dismissal is shared across apps in the same origin and tab session. Storage-disabled browsers can still close the current instance.
- Uses static positioning in normal document flow, without a spacer, viewport offsets or advertising-anchor detection. It does not follow scrolling or move above Google ads. Hides for visible modal dialogs, fullscreen, print and mobile text entry.
- No changes to uploaded files or user inputs; no new analytics/ad-network calls.
- Runs only on NaNa production hostnames. `/astra/` is always excluded under the practice-site no-advertising exception.
- For local QA only, add `data-preview="true"` on localhost/127.0.0.1. This does not enable publisher analytics.
- Duplicate script loading is idempotent. Failures leave the host app functional.

Future applications should include this stable URL in their shared source template or publisher integration helper. Do not copy the banner implementation into consuming repositories.

Validation: `node --test tests/*.test.cjs`. Optional real-browser regression: `node tests/astra-inline.browser.cjs` (Playwright and Chromium required). The browser fixture tests 1440px, 375px and 320px layouts, scrolling, coexistence with a fixed ad, close-both and reload dismissal.
