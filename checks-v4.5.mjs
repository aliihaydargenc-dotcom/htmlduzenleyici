import fs from 'node:fs';
import vm from 'node:vm';
const html=fs.readFileSync('index.html','utf8');
const js=html.slice(html.lastIndexOf('<script>')+8,html.lastIndexOf('</script>'));
new vm.Script(js); console.log('JavaScript syntax PASS');
import assert from 'node:assert/strict';
const context=vm.createContext({TextEncoder,TextDecoder,btoa,atob,console,document:{addEventListener(){},querySelectorAll(){return []}},setTimeout,clearTimeout});
vm.runInContext(js,context);
const run=s=>vm.runInContext(s,context);
let passed=1;
function test(name,fn){fn();passed++;console.log('PASS '+name);}
const source='<!doctype html>\r\n<html lang="tr"><head><title>Deneme</title><script>const t="</head>";</script></head><body><h1 id="title">Başlık</h1></body></html>';
run('state.originalSource='+JSON.stringify(source));
test('Source preserved exactly after patch removal',()=>assert.equal(run('sourceWithoutPreviousPatches(buildOutput())'),source));
test('Generated runtime compiles',()=>new vm.Script(run('buildRuntimeScript()')));
test('Unicode manifest round trip',()=>{
 run(`state.operations=[{id:'test',type:'text',selector:'#title',value:'İçerik ŞĞÜ çığı',enabled:true,group:'Genel'}]`);
 assert.equal(run('JSON.stringify(extractEmbeddedOperations(buildOutput()).operations)'),run('JSON.stringify(state.operations)'));
});
test('Original scripts preserved',()=>assert.equal(run('JSON.stringify(fullScriptBlocks(sourceWithoutPreviousPatches(buildOutput())))'),JSON.stringify(['<script>const t="</head>";</script>'])));
test('No changes with protection off still exports a manifest',()=>{run('state.operations=[];state.layoutProtection=false');assert.equal(run('extractEmbeddedOperations(buildOutput()).operations.length'),0);assert.equal(run('sourceWithoutPreviousPatches(buildOutput())'),source)});
test('Style output and disabled operations',()=>{run(`state.operations=[{id:'s',type:'style',selector:'#title',enabled:true,declarations:{color:'red'},scope:'all'},{id:'h',type:'hide',selector:'.hidden',enabled:false}]`);assert.match(run('generatePatchCss()'),/#title,\[data-rve-op-s\]\{color:red!important;/);assert.doesNotMatch(run('generatePatchCss()'),/\.hidden/)});
run('let restored=null;restoreHistory=(index)=>{restored=index};state.historyIndex=2;');
const event=(tag,key,shift=false)=>`({key:${JSON.stringify(key)},ctrlKey:true,shiftKey:${shift},target:{tagName:${JSON.stringify(tag)}},preventDefault(){throw Error('native undo intercepted')}})`;
test('Text inputs keep native undo/redo',()=>{for(const tag of ['INPUT','TEXTAREA','SELECT'])for(const key of ['z','y'])run('handleEditorShortcut('+event(tag,key)+')');assert.equal(run('restored'),null)});
test('Editor Ctrl+Shift+Z redoes',()=>{run(`handleEditorShortcut({key:'z',ctrlKey:true,shiftKey:true,target:{tagName:'BUTTON'},preventDefault(){}})`);assert.equal(run('restored'),3)});
test('Editor Ctrl+Z undoes',()=>{run(`handleEditorShortcut({key:'z',ctrlKey:true,target:{tagName:'BUTTON'},preventDefault(){}})`);assert.equal(run('restored'),1)});
test('Safe attributes reject event and URL changes',()=>{for(const name of ['onclick','src','href','style','id'])assert.equal(run('isSafeAttributeName('+JSON.stringify(name)+')'),false);assert.equal(run("isSafeAttributeName('aria-label')"),true)});
console.log(`${passed} checks passed (non-browser; no visual QA).`);

test('Hide-only: no injected JavaScript or layout CSS',()=>{
 run(`state.layoutProtection=true;state.operations=[{id:'hide',type:'hide',selector:'#title',scope:'all',enabled:true}]`);
 assert.equal(run('effectiveLayoutProtection()'),false);
 assert.equal(run('fullScriptBlocks(buildOutput()).length'),1);
 assert.doesNotMatch(run('buildOutput()'),/data-rve-layout-guard|MutationObserver|data-rve-stack-repair/);
 assert.match(run('generatePatchCss()'),/visibility:hidden!important/);
 assert.doesNotMatch(run('generatePatchCss()'),/display:none/);
 assert.equal(run('sourceWithoutPreviousPatches(buildOutput())'),source);
});
test('Collapse is explicit and still CSS-only',()=>{
 run(`state.operations[0].hideMode='collapse'`);
 assert.match(run('generatePatchCss()'),/display:none!important/);
 assert.equal(run('fullScriptBlocks(buildOutput()).length'),1);
});
test('Hidden descendants cannot override visibility',()=>{
 run(`state.operations[0].hideMode='preserve'`);
 assert.match(run('generatePatchCss()'),/:is\(#title\) \*\{visibility:hidden/);
});
test('Hide mode survives output reimport',()=>{
 assert.equal(run('extractEmbeddedOperations(buildOutput()).operations[0].hideMode'),'preserve');
 assert.equal(run('extractEmbeddedOperations(buildOutput()).layoutProtection'),true);
});
test('Disabled non-hide operations do not activate layout repair',()=>{
 run(`state.operations.push({id:'s',type:'style',selector:'#title',enabled:false,declarations:{width:'50%'}})`);
 assert.equal(run('effectiveLayoutProtection()'),false);
 assert.equal(run('fullScriptBlocks(buildOutput()).length'),1);
});
test('Mixed enabled edits retain existing layout protection',()=>{
 run('state.operations[1].enabled=true');assert.equal(run('effectiveLayoutProtection()'),true);
 new vm.Script(run('buildRuntimeScript()'));
 assert.equal(run('fullScriptBlocks(buildOutput()).length'),2);
});
console.log(`${passed} total checks passed; browser rendering not tested.`);
