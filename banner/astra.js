/* Stable NaNa book-banner loader. Edit astra-banner.js for campaign changes. */
(function () {
  'use strict';
  var own = document.currentScript;
  var hostname = location.hostname.toLowerCase();
  var preview = own && own.dataset.preview === 'true' && /^(localhost|127\.0\.0\.1|\[::1\])$/.test(hostname);
  if (window.top !== window.self || /^\/astra(?:\/|$)/i.test(location.pathname)) return;
  if (!preview && !['nanalab.kr', 'www.nanalab.kr', 'nanacompany.github.io'].includes(hostname)) return;
  if (!own || !own.src || document.querySelector('script[data-nana-book-runtime]')) return;
  var runtime = document.createElement('script');
  var url = new URL('astra-banner.js', own.src);
  // One shared five-minute bucket, without visitor identifiers or page/input data.
  url.searchParams.set('v', String(Math.floor(Date.now() / 300000)));
  runtime.src = url.href;
  runtime.async = true;
  runtime.setAttribute('data-nana-book-runtime', '');
  if (preview) runtime.dataset.preview = 'true';
  document.head.appendChild(runtime);
})();
