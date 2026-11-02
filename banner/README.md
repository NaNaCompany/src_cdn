# Shared Astra book banner

Central script: `https://nanalab.kr/src_cdn/banner/astra.js`

```html
<script defer src="https://nanalab.kr/src_cdn/banner/astra.js"></script>
```

Include the script once on each public page, or load it from an application asset shared by every page. Do not pin the script to a commit or use a content hash: existing consumers must receive subsequent central updates. GitHub Pages/browser caches can delay updates; an already open document updates after navigation or reload.

`astra.js` is a stable loader. Edit the campaign object at the top of `astra-banner.js` to change the title, destination, campaign ID or global enable/disable switch. CSS and translated ad/CTA labels are in that same runtime file. The loader requests the runtime using a shared five-minute time bucket, avoiding long browser cache lifetimes for future campaign changes. It does not refresh already open documents. The initial loader migration can still be subject to existing cached copies; reloading revalidates them.

The Korean book title is preserved in all languages; other languages explicitly label it as a Korean book. The link opens the supplied YES24 product page, not the Astra exercise application.

- Original CSS book icon; no cover image, third-party font, or publisher artwork is redistributed.
- Source for book title and destination: https://www.yes24.com/product/goods/198213028 (checked 2026-11-02).
- Approximately 44px high, max-width 660px, Shadow DOM isolation, no animation, no dependency, one shared runtime script request, and no analytics events. Time buckets are identical for all visitors and contain no visitor/page/input data.
- Closable; dismissal is shared across apps in the same origin and tab session. Storage-disabled browsers can still close the current instance.
- Reserves document-end space and moves above detected fixed/sticky bottom navigation. Hides for visible modal dialogs, fullscreen, print and mobile text entry.
- No changes to uploaded files or user inputs; no new analytics/ad-network calls.
- Runs only on NaNa production hostnames. `/astra/` is always excluded under the practice-site no-advertising exception.
- For local QA only, add `data-preview="true"` on localhost/127.0.0.1. This does not enable publisher analytics.
- Duplicate script loading is idempotent. Failures leave the host app functional.

Future applications should include this stable URL in their shared source template or publisher integration helper. Do not copy the banner implementation into consuming repositories.
