/* NaNa shared book advertisement. Campaign, copy and appearance live in this file. */
(function () {
  'use strict';
  var campaign = {
    id: 'astra-book-198213028',
    enabled: true,
    title: '스스로 일하는 GPT 아스트라',
    url: 'https://www.yes24.com/product/goods/198213028'
  };
  var hostId = 'nana-book-banner';
  var storageKey = 'nana-book-banner-dismissed:' + campaign.id;
  var ownScript = document.currentScript;
  var hostname = location.hostname.toLowerCase();
  var preview = ownScript && ownScript.dataset.preview === 'true' && /^(localhost|127\.0\.0\.1|\[::1\])$/.test(hostname);
  if (!campaign.enabled || document.getElementById(hostId) || window.top !== window.self) return;
  if (!preview && !['nanalab.kr', 'www.nanalab.kr', 'nanacompany.github.io'].includes(hostname)) return;
  // The Astra practice site has an explicit no-advertising exception.
  if (/^\/astra(?:\/|$)/i.test(location.pathname)) return;
  try { if (sessionStorage.getItem(storageKey) === '1') return; } catch (_) { /* Storage may be disabled. */ }

  function mount() {
    if (!document.body || document.getElementById(hostId)) return;
    var language = (document.documentElement.lang || 'en').toLowerCase().split('-')[0];
    var labels = {
      ko: ['도서 광고', 'YES24에서 보기', '광고 닫기'],
      en: ['Book ad · Korean', 'View on YES24', 'Close advertisement'],
      es: ['Libro · coreano', 'Ver en YES24', 'Cerrar anuncio'],
      ja: ['書籍広告 · 韓国語', 'YES24で見る', '広告を閉じる'],
      zh: ['图书广告 · 韩文', '在YES24查看', '关闭广告'],
      de: ['Buch · Koreanisch', 'Bei YES24 ansehen', 'Werbung schließen'],
      fr: ['Livre · coréen', 'Voir sur YES24', 'Fermer la publicité'],
      pt: ['Livro · coreano', 'Ver na YES24', 'Fechar anúncio'],
      ru: ['Книга · корейский', 'На YES24', 'Закрыть рекламу']
    };
    var copy = labels[language] || labels.en;
    var host = document.createElement('aside');
    host.id = hostId;
    host.setAttribute('aria-label', copy[0]);
    host.style.cssText = 'all:initial!important;position:fixed!important;display:block!important;left:12px!important;right:12px!important;bottom:calc(10px + env(safe-area-inset-bottom,0px))!important;z-index:1000!important;pointer-events:none!important;';
    var shadow = host.attachShadow({ mode: 'open' });
    var style = document.createElement('style');
    style.textContent = ':host{color-scheme:light;font-family:Arial,"Malgun Gothic",sans-serif}' +
      '*{box-sizing:border-box}.bar{pointer-events:auto;display:flex;align-items:center;gap:10px;max-width:660px;min-height:44px;margin:0 auto;padding:5px 7px 5px 12px;border:1px solid #dce2e8;border-radius:12px;background:#fff;color:#17212f;box-shadow:0 3px 18px #1422381a;font:13px/1.35 Arial,"Malgun Gothic",sans-serif}' +
      '.icon{flex:none;display:grid;place-items:center;width:23px;height:29px;background:#202d65;border-radius:2px 4px 4px 2px;color:#fff;font:bold 17px/1 Georgia,serif;box-shadow:inset 3px 0 #ffffff24}.copy{min-width:0;flex:1}.label{display:block;color:#717b89;font-size:10px;line-height:1.3}.title{display:block;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;font-weight:700;font-size:13px;line-height:1.5}' +
      'a{color:inherit;text-decoration:none}.cta{flex:none;display:flex;align-items:center;min-height:32px;padding:5px 10px;border-radius:7px;background:#eff3fc;color:#253f86;font-size:11px;font-weight:700;white-space:nowrap}.close{flex:none;width:32px;height:32px;padding:0;border:0;border-radius:6px;background:transparent;color:#737d89;font:24px/1 Arial,sans-serif;cursor:pointer}.close:hover{background:#f0f2f5}.cta:hover{background:#e4ebfa}a:focus-visible,button:focus-visible{outline:2px solid #315bc4;outline-offset:2px}' +
      '@media(max-width:400px){.bar{gap:7px;padding-left:9px}.icon{display:none}.title{font-size:12px}.cta{font-size:10px;padding:5px 7px}}@media print{:host{display:none!important}}';
    var bar = document.createElement('div'); bar.className = 'bar';
    var icon = document.createElement('span'); icon.className = 'icon'; icon.textContent = 'A'; icon.setAttribute('aria-hidden', 'true');
    var link = document.createElement('a'); link.className = 'copy';
    var label = document.createElement('span'); label.className = 'label'; label.textContent = copy[0];
    var title = document.createElement('span'); title.className = 'title'; title.textContent = campaign.title; title.lang = 'ko';
    link.append(label, title);
    var cta = document.createElement('a'); cta.className = 'cta'; cta.textContent = copy[1];
    [link, cta].forEach(function (anchor) {
      anchor.href = campaign.url; anchor.target = '_blank'; anchor.rel = 'sponsored noopener noreferrer';
    });
    var close = document.createElement('button'); close.className = 'close'; close.type = 'button'; close.textContent = '×'; close.setAttribute('aria-label', copy[2]);
    bar.append(icon, link, cta, close); shadow.append(style, bar);
    var spacer = document.createElement('div'); spacer.id = hostId + '-space'; spacer.setAttribute('aria-hidden', 'true'); spacer.style.cssText = 'display:block;flex:none;width:100%;height:66px;pointer-events:none;';
    document.body.append(spacer, host);
    var dismissed = false, frame = 0, previous = '';
    function schedule() { if (!frame && !dismissed) frame = requestAnimationFrame(layout); }
    function layout() {
      frame = 0;
      if (dismissed) return;
      var viewportHeight = window.innerHeight;
      var width = document.documentElement.clientWidth;
      var focused = document.activeElement;
      var editing = focused && (focused.matches('input,textarea,select') || focused.isContentEditable);
      var modal = Array.from(document.querySelectorAll('dialog[open],[aria-modal="true"]')).some(function (el) { return el.getClientRects().length > 0; });
      var keyboard = window.visualViewport && window.visualViewport.height < viewportHeight * 0.75;
      var hidden = !!document.fullscreenElement || modal || (editing && (width < 768 || keyboard));
      var offset = 0;
      if (!hidden && document.elementsFromPoint) {
        [0.15, 0.5, 0.85].forEach(function (fraction) {
          document.elementsFromPoint(width * fraction, viewportHeight - 6).forEach(function (el) {
            for (var current = el; current && current !== document.body; current = current.parentElement) {
              if (current === host || current === spacer) break;
              var computed = getComputedStyle(current), rect = current.getBoundingClientRect();
              if ((computed.position === 'fixed' || computed.position === 'sticky') && rect.height > 0 && rect.height <= 180 && rect.bottom >= viewportHeight - 12) offset = Math.max(offset, viewportHeight - rect.top + 6);
            }
          });
        });
      }
      var state = [hidden, Math.ceil(offset)].join(':');
      if (state === previous) return;
      previous = state;
      host.style.setProperty('display', hidden ? 'none' : 'block', 'important');
      host.style.setProperty('bottom', 'calc(' + (10 + Math.ceil(offset)) + 'px + env(safe-area-inset-bottom,0px))', 'important');
      spacer.style.height = hidden ? '0px' : (66 + Math.ceil(offset)) + 'px';
    }
    var observer = new MutationObserver(schedule);
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['open', 'aria-modal', 'class', 'hidden'] });
    ['resize', 'scroll', 'focusin', 'focusout', 'fullscreenchange'].forEach(function (name) { window.addEventListener(name, schedule, { passive: true }); });
    if (window.visualViewport) window.visualViewport.addEventListener('resize', schedule);
    close.addEventListener('click', function () {
      dismissed = true; observer.disconnect(); if (frame) cancelAnimationFrame(frame);
      ['resize', 'scroll', 'focusin', 'focusout', 'fullscreenchange'].forEach(function (name) { window.removeEventListener(name, schedule); });
      if (window.visualViewport) window.visualViewport.removeEventListener('resize', schedule);
      host.remove(); spacer.remove();
      try { sessionStorage.setItem(storageKey, '1'); } catch (_) { /* Dismissal still works without storage. */ }
    });
    schedule();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount, { once: true }); else mount();
})();
