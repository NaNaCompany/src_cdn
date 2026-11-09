const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const code = fs.readFileSync(require('node:path').join(__dirname, '../banner/astra-banner.js'), 'utf8');

function browser(options = {}) {
  const nodes = [], events = {}, frames = [], stored = new Map(options.dismissed ? [['nana-book-banner-dismissed:astra-book-198213028', '1']] : []);
  const random = (options.random || [0, 0]).slice();
  let draws = 0; const math = Object.create(Math); math.random = () => ++draws === 3 ? 0 : random.length ? random.shift() : 0;
  const style = () => ({ setProperty(key, value) { this[key] = value; } });
  function element(tag) {
    const node = { tag, style: style(), dataset: {}, children: [], listeners: {}, parentElement: null,
      setAttribute(key, value) { this[key] = value; },
      prepend(...children) { this.children.unshift(...children); children.forEach(child => { child.parentElement = this; }); },
      append(...children) { this.children.push(...children); children.forEach(child => { child.parentElement = this; }); },
      attachShadow() { this.shadowRoot = element('shadow'); this.shadowRoot.parentElement = this; return this.shadowRoot; },
      addEventListener(name, callback) { this.listeners[name] = callback; },
      remove() { this.removed = true; }, matches() { return false; }, getClientRects() { return [1]; }
    };
    nodes.push(node); return node;
  }
  const document = { body: element('body'), documentElement: { lang: options.lang || 'ko', clientWidth: options.width || 1000 },
    currentScript: { src: options.src || 'https://nanalab.kr/src_cdn/banner/astra-banner.js?v=1', dataset: { preview: String(!!options.preview) } }, readyState: options.loading ? 'loading' : 'complete',
    getElementById(id) { return nodes.find(node => node.id === id && !node.removed); }, createElement: element,
    addEventListener(name, callback) { events[name] = callback; }, querySelectorAll() { return options.modal ? [element('dialog')] : []; },
    elementsFromPoint() { return options.nav ? [options.nav] : []; }
  };
  const window = { innerHeight: 800, addEventListener(name, callback) { if (!events[name]) events[name] = callback; }, removeEventListener(name) { delete events[name]; } };
  window.top = window.self = window;
  if (options.iframe) window.top = {};
  const context = { document, window, location: { hostname: options.hostname || 'nanalab.kr', pathname: options.path || '/dll-directory/en/dll/test.dll/' },
    Math: math, URL,
    setInterval(callback, milliseconds) { if (!events.timer) events.timer = callback; events.interval = milliseconds; return 1; },
    clearInterval() { delete events.timer; },
    sessionStorage: { getItem(key) { if (options.storageBlocked) throw Error('blocked'); return stored.get(key); }, setItem(key, value) { if (options.storageBlocked) throw Error('blocked'); stored.set(key, value); } },
    MutationObserver: class { constructor(callback) { if (!events.mutation) events.mutation = callback; } observe() {} disconnect() {} }, requestAnimationFrame(callback) { frames.push(callback); events.frame = () => { while(frames.length) frames.shift()(); }; return frames.length; }, cancelAnimationFrame() {},
    getComputedStyle(node) { return { position: node.position || 'static' }; }
  };
  vm.createContext(context);
  function run() { vm.runInContext(code, context); if (events.frame) { const cb = events.frame; delete events.frame; cb(); } }
  run();
  return { run, document, window, get nodes() { return nodes.filter(n => { for(let p=n;p;p=p.parentElement) if(p.id==='nana-book-banner-bottom') return false; return true; }); }, events, stored, host: () => document.getElementById('nana-book-banner') };
}

test('random book campaign links cover, title and store to one exact destination', () => {
  const b = browser(), shadow = b.host().shadowRoot;
  const links = b.nodes.filter(n => n.tag === 'a');
  assert.equal(links.length, 3);
  for (const link of links) { assert.equal(link.href, 'https://www.yes24.com/product/goods/198213028'); assert.equal(link.target, '_blank'); assert.match(link.rel, /sponsored.*noopener.*noreferrer/); }
  assert.ok(b.nodes.some(n => n.textContent === '도서 광고'));
  assert.ok(shadow);
  const cover = b.nodes.find(n => n.tag === 'img');
  assert.equal(cover.src, 'https://nanalab.kr/src_cdn/banner/covers/books-35.jpg');
  assert.equal(cover.alt, '스스로 일하는 GPT 아스트라 표지');
  b.run(); assert.equal(b.nodes.filter(n => n.id === 'nana-book-banner').length, 1);
});
test('Astra exercises, iframes, other domains and ordinary preview hosts excluded', () => {
  for (const settings of [{path:'/astra/'},{path:'/astra/recipe/1/'},{iframe:true},{hostname:'example.org'},{hostname:'localhost'}]) assert.equal(browser(settings).host(), undefined);
  assert.ok(browser({hostname:'localhost',preview:true}).host());
});
test('session dismissal prevents reinsertion and removes reserved space', () => {
  const b = browser(); b.nodes.find(n => n.tag === 'button').listeners.click();
  assert.equal(b.host(), undefined); assert.equal(b.document.getElementById('nana-book-banner-space'), undefined);
  assert.equal(b.events.timer, undefined);
  b.run(); assert.equal(b.host(), undefined); assert.equal(browser({dismissed:true}).host(), undefined);
});
test('blocked storage never prevents display or closing', () => {
  const b = browser({storageBlocked:true}); assert.ok(b.host());
  b.nodes.find(n => n.tag === 'button').listeners.click(); assert.equal(b.host(), undefined);
});
test('uses page language and discloses the Korean edition', () => {
  const b = browser({lang:'en-US'}); assert.ok(b.nodes.some(n => n.textContent === 'Book ad · Korean'));
  assert.ok(b.nodes.some(n => n.textContent === '스스로 일하는 GPT 아스트라' && n.lang === 'ko'));
});
test('top and bottom banners remain in ordinary flow with bottom navigation', () => {
  const nav = { position:'fixed', parentElement:null, getBoundingClientRect() { return {height:64,bottom:800,top:736}; } };
  const b = browser({nav}); assert.match(b.host().style.cssText, /position:static!important/); assert.equal(b.host().style.bottom, undefined); assert.equal(b.document.body.children[0], b.host()); assert.equal(b.document.body.children.at(-1).id, 'nana-book-banner-bottom'); assert.equal(b.document.getElementById('nana-book-banner-space'), undefined);
});
test('visible modal hides banners', () => {
  const b = browser({modal:true}); assert.equal(b.host().style.display, 'none'); assert.equal(b.document.getElementById('nana-book-banner-bottom').style.display, 'none');
});
test('never raises the banner above an advertising anchor', () => {
  const nav = { position:'fixed', parentElement:null, getBoundingClientRect() { return {height:250,bottom:800,top:550}; } };
  const b = browser({nav}); assert.equal(b.host().style.bottom, undefined); assert.doesNotMatch(b.host().style.cssText, /position:fixed|position:sticky|z-index/);
});
test('waits for body readiness; no duplicates from concurrent initial scripts', () => {
  const b = browser({loading:true}); assert.equal(b.host(), undefined); b.events.DOMContentLoaded(); assert.ok(b.host()); b.events.DOMContentLoaded(); assert.equal(b.nodes.filter(n=>n.id==='nana-book-banner').length,1);
});
test('mobile editing hides and focusout restores the banner', () => {
  const b = browser({width:375}); b.document.activeElement = {matches(){return true;}}; b.events.focusin(); b.events.frame(); assert.equal(b.host().style.display,'none');
  b.document.activeElement = null; b.events.focusout(); b.events.frame(); assert.equal(b.host().style.display,'block');
});
test('external inline-style changes relayout; own style writes cannot loop', () => {
  const b=browser();b.events.mutation([{target:b.host()},{target:b.document.getElementById('nana-book-banner-bottom')}]);assert.equal(b.events.frame,undefined);
  b.events.mutation([{target:{}}]);assert.equal(typeof b.events.frame,'function');
});

test('book selection spans the catalog; initial store is independently random', () => {
  const b = browser({random:[0.999,0.999]});
  assert.ok(b.nodes.some(n => n.textContent === '카이스트 공부벌레들'));
  for (const link of b.nodes.filter(n => n.tag === 'a')) assert.equal(link.href,'https://product.kyobobook.co.kr/detail/S000000721696');
});

test('store rerolls every 5000ms without changing the book or requesting images again', () => {
  const b = browser({random:[0,0,0.9,0.1]}), image = b.nodes.find(n=>n.tag==='img');
  assert.equal(b.events.interval,5000);
  const originalCover = image.src;
  b.events.timer();
  assert.ok(b.nodes.some(n=>n.className==='cta' && n.textContent==='교보문고'));
  for (const link of b.nodes.filter(n=>n.tag==='a')) assert.equal(link.href,'https://product.kyobobook.co.kr/detail/S000221652926');
  b.events.timer();
  for (const link of b.nodes.filter(n=>n.tag==='a')) assert.equal(link.href,'https://www.yes24.com/product/goods/198213028');
  assert.equal(image.src,originalCover);
});

test('hidden document, hovered banner, focused link and hidden layout pause reroll', () => {
  for (const pause of ['document','hover','focus','layout']) {
    const b = browser({random:[0,0,0.9]}), bar = b.nodes.find(n=>n.className==='bar');
    if(pause==='document') b.document.hidden=true;
    if(pause==='hover') bar.listeners.pointerenter();
    if(pause==='focus') b.host().shadowRoot.activeElement={};
    if(pause==='layout') b.host().style.display='none';
    b.events.timer();
    assert.equal(b.nodes.find(n=>n.className==='cta').textContent,'YES24');
    b.document.hidden=false; bar.listeners.pointerleave(); b.host().shadowRoot.activeElement=null; b.host().style.display='block';
    b.events.timer(); assert.equal(b.nodes.find(n=>n.className==='cta').textContent,'교보문고');
  }
});

test('all configured covers exist and match recorded hashes; only the two approved stores', () => {
  const path = require('node:path'), crypto = require('node:crypto');
  const provenance = JSON.parse(fs.readFileSync(path.join(__dirname,'../banner/covers/SOURCES.json'),'utf8'));
  assert.equal(provenance.books.length,32);
  const ids = new Set();
  for (let index=0;index<provenance.books.length;index++) {
    const expected = provenance.books[index];
    assert.ok(!ids.has(expected.id)); ids.add(expected.id);
    const b=browser({random:[(index+0.1)/provenance.books.length,0]});
    assert.ok(b.nodes.some(n=>n.className==='title' && n.textContent===expected.title));
    assert.equal(b.nodes.find(n=>n.tag==='img').src,'https://nanalab.kr/src_cdn/banner/covers/'+expected.cover);
    assert.match(expected.stores.yes24,/^https:\/\/www\.yes24\.com\//);
    assert.match(expected.stores.kyobo,/^https:\/\/(product|ebook-product)\.kyobobook\.co\.kr\//);
    const bytes=fs.readFileSync(path.join(__dirname,'../banner/covers',expected.cover));
    assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),expected.cover_sha256);
  }
});
