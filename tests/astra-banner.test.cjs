const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const code = fs.readFileSync(require('node:path').join(__dirname, '../banner/astra-banner.js'), 'utf8');

function browser(options = {}) {
  const nodes = [], events = {}, stored = new Map(options.dismissed ? [['nana-book-banner-dismissed:astra-book-198213028', '1']] : []);
  const style = () => ({ setProperty(key, value) { this[key] = value; } });
  function element(tag) {
    const node = { tag, style: style(), dataset: {}, children: [], listeners: {}, parentElement: null,
      setAttribute(key, value) { this[key] = value; },
      append(...children) { this.children.push(...children); children.forEach(child => { child.parentElement = this; }); },
      attachShadow() { this.shadowRoot = element('shadow'); return this.shadowRoot; },
      addEventListener(name, callback) { this.listeners[name] = callback; },
      remove() { this.removed = true; }, matches() { return false; }, getClientRects() { return [1]; }
    };
    nodes.push(node); return node;
  }
  const document = { body: element('body'), documentElement: { lang: options.lang || 'ko', clientWidth: options.width || 1000 },
    currentScript: { dataset: { preview: String(!!options.preview) } }, readyState: options.loading ? 'loading' : 'complete',
    getElementById(id) { return nodes.find(node => node.id === id && !node.removed); }, createElement: element,
    addEventListener(name, callback) { events[name] = callback; }, querySelectorAll() { return options.modal ? [element('dialog')] : []; },
    elementsFromPoint() { return options.nav ? [options.nav] : []; }
  };
  const window = { innerHeight: 800, addEventListener(name, callback) { events[name] = callback; }, removeEventListener(name) { delete events[name]; } };
  window.top = window.self = window;
  if (options.iframe) window.top = {};
  const context = { document, window, location: { hostname: options.hostname || 'nanalab.kr', pathname: options.path || '/dll-directory/en/dll/test.dll/' },
    sessionStorage: { getItem(key) { if (options.storageBlocked) throw Error('blocked'); return stored.get(key); }, setItem(key, value) { if (options.storageBlocked) throw Error('blocked'); stored.set(key, value); } },
    MutationObserver: class { observe() {} disconnect() {} }, requestAnimationFrame(callback) { events.frame = callback; return 1; }, cancelAnimationFrame() {},
    getComputedStyle(node) { return { position: node.position || 'static' }; }
  };
  vm.createContext(context);
  function run() { vm.runInContext(code, context); if (events.frame) { const cb = events.frame; delete events.frame; cb(); } }
  run();
  return { run, document, window, nodes, events, stored, host: () => document.getElementById('nana-book-banner') };
}

test('one centrally configured, disclosed book campaign with exact destination', () => {
  const b = browser(), shadow = b.host().shadowRoot;
  const links = b.nodes.filter(n => n.tag === 'a');
  assert.equal(links.length, 2);
  for (const link of links) { assert.equal(link.href, 'https://www.yes24.com/product/goods/198213028'); assert.equal(link.target, '_blank'); assert.match(link.rel, /sponsored.*noopener.*noreferrer/); }
  assert.ok(b.nodes.some(n => n.textContent === '도서 광고'));
  assert.ok(shadow);
  b.run(); assert.equal(b.nodes.filter(n => n.id === 'nana-book-banner').length, 1);
});
test('Astra exercises, iframes, other domains and ordinary preview hosts excluded', () => {
  for (const settings of [{path:'/astra/'},{path:'/astra/recipe/1/'},{iframe:true},{hostname:'example.org'},{hostname:'localhost'}]) assert.equal(browser(settings).host(), undefined);
  assert.ok(browser({hostname:'localhost',preview:true}).host());
});
test('session dismissal prevents reinsertion and removes reserved space', () => {
  const b = browser(); b.nodes.find(n => n.tag === 'button').listeners.click();
  assert.equal(b.host(), undefined); assert.equal(b.document.getElementById('nana-book-banner-space'), undefined);
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
test('moves above bottom navigation and reserves the additional space', () => {
  const nav = { position:'fixed', parentElement:null, getBoundingClientRect() { return {height:64,bottom:800,top:736}; } };
  const b = browser({nav}); assert.match(b.host().style.bottom, /80px/); assert.equal(b.document.getElementById('nana-book-banner-space').style.height, '136px');
});
test('visible modal hides banner and releases space', () => {
  const b = browser({modal:true}); assert.equal(b.host().style.display, 'none'); assert.equal(b.document.getElementById('nana-book-banner-space').style.height, '0px');
});
test('clears a taller existing advertising anchor instead of being covered', () => {
  const nav = { position:'fixed', parentElement:null, getBoundingClientRect() { return {height:250,bottom:800,top:550}; } };
  const b = browser({nav}); assert.match(b.host().style.bottom, /266px/);
});
test('waits for body readiness; no duplicates from concurrent initial scripts', () => {
  const b = browser({loading:true}); assert.equal(b.host(), undefined); b.events.DOMContentLoaded(); assert.ok(b.host()); b.events.DOMContentLoaded(); assert.equal(b.nodes.filter(n=>n.id==='nana-book-banner').length,1);
});
test('mobile editing hides and focusout restores the banner', () => {
  const b = browser({width:375}); b.document.activeElement = {matches(){return true;}}; b.events.focusin(); b.events.frame(); assert.equal(b.host().style.display,'none');
  b.document.activeElement = null; b.events.focusout(); b.events.frame(); assert.equal(b.host().style.display,'block');
});
