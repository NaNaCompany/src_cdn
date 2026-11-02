const test=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs'),path=require('node:path');
const code=fs.readFileSync(path.join(__dirname,'../banner/astra.js'),'utf8');
function run(options={}){
 const loaded=[],window={};window.top=window.self=window;
 const document={currentScript:{src:options.src||'https://nanalab.kr/src_cdn/banner/astra.js',dataset:{preview:String(!!options.preview)}},querySelector(){return loaded[0]||null},createElement(){return{dataset:{},setAttribute(k,v){this[k]=v}}},head:{appendChild(node){loaded.push(node)}}};
 const context={window,document,location:{hostname:options.hostname||'nanalab.kr',pathname:options.pathname||'/dll-directory/en/dll/example.dll/'},Date:{now:()=>900000},URL};vm.createContext(context);vm.runInContext(code,context);return{loaded,again(){vm.runInContext(code,context)}};
}
test('stable loader requests the CDN runtime with one shared five-minute bucket',()=>{const b=run();assert.equal(b.loaded[0].src,'https://nanalab.kr/src_cdn/banner/astra-banner.js?v=3');assert.equal(b.loaded[0].async,true);b.again();assert.equal(b.loaded.length,1)});
test('excluded practice site and unapproved/local hosts make no runtime request',()=>{for(const options of[{pathname:'/astra/'},{pathname:'/astra/recipe/1/'},{hostname:'example.org'},{hostname:'localhost'}])assert.equal(run(options).loaded.length,0)});
test('explicit local preview resolves the adjacent runtime without enabling production integrations',()=>{const b=run({hostname:'localhost',preview:true,src:'http://localhost:8766/banner/astra.js'});assert.equal(b.loaded[0].src,'http://localhost:8766/banner/astra-banner.js?v=3');assert.equal(b.loaded[0].dataset.preview,'true')});
