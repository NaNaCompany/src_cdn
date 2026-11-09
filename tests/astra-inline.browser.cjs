// Run: node tests/astra-inline.browser.cjs (requires Playwright + Chromium).
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
(async () => {
 const root=path.resolve(__dirname,'..');
 const server=http.createServer((req,res)=>{
  const pathname=new URL(req.url,'http://localhost').pathname;
  if(pathname.startsWith('/banner/')) { const f=path.join(root,pathname); if(fs.existsSync(f)){res.end(fs.readFileSync(f));return;} }
  res.setHeader('Content-Type','text/html; charset=utf-8');res.end(`<html lang="ko"><head><style>body{margin:0;font:18px sans-serif}main{max-width:900px;margin:auto;padding:20px;min-height:1800px}dialog{padding:40px}</style></head><body><main><h1>법령 본문</h1>${'<p>제1조 목적 및 내용. 본문은 배너와 겹치지 않아야 합니다.</p>'.repeat(35)}<input aria-label="검색"></main><footer>페이지 끝</footer><script defer data-preview="true" src="/banner/astra.js"></script></body></html>`);
 }); await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox']}).catch(error=>{server.close();throw error;});
 try {for(const width of [1440,375,320]) {
  const page=await browser.newPage({viewport:{width,height:900}});let errors=[];page.on('pageerror',e=>errors.push(String(e)));
  await page.goto(`http://127.0.0.1:${server.address().port}`);await page.locator('#nana-book-banner-bottom').waitFor();
  let geometry=await page.evaluate(()=>{const a=document.getElementById('nana-book-banner'),b=document.getElementById('nana-book-banner-bottom'),m=document.querySelector('main');return {top:a.getBoundingClientRect().bottom,main:m.getBoundingClientRect().top,mainEnd:m.getBoundingClientRect().bottom,bottom:b.getBoundingClientRect().top,pos:[getComputedStyle(a).position,getComputedStyle(b).position],overflow:document.documentElement.scrollWidth>innerWidth};});
  assert.deepEqual(geometry.pos,['static','static']);assert.ok(geometry.top<=geometry.main);assert.ok(geometry.mainEnd<=geometry.bottom);assert.equal(geometry.overflow,false);
  await page.screenshot({path:`/tmp/banner-top-${width}.png`});
  await page.evaluate(()=>scrollTo(0,500));assert.ok(await page.locator('#nana-book-banner').evaluate(el=>el.getBoundingClientRect().bottom<0));
  await page.evaluate(()=>{let ad=document.createElement('div');ad.id='test-ad';ad.style='position:fixed;bottom:0;height:250px;width:100%;background:#ddd';document.body.append(ad);});
  assert.equal(await page.locator('#nana-book-banner-bottom').evaluate(el=>getComputedStyle(el).position),'static');
  await page.locator('#test-ad').evaluate(el=>el.remove());await page.evaluate(()=>scrollTo(0,document.body.scrollHeight));await page.screenshot({path:`/tmp/banner-bottom-${width}.png`});
  await page.locator('#nana-book-banner-bottom').locator('button').click();assert.equal(await page.locator('#nana-book-banner').count(),0);assert.equal(await page.locator('#nana-book-banner-bottom').count(),0);await page.reload();assert.equal(await page.locator('#nana-book-banner').count(),0);
  assert.deepEqual(errors,[]);await page.close();console.log(`${width}px: normal flow, no overlap/overflow, scroll, fixed ad independence, close-both, reload persistence passed`);
 }}finally{await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
