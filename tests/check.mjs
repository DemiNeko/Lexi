// Offline integrity, full source coverage, legacy identity and reproducible builds.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const words=JSON.parse(read('vocabulary.json'));
const old=JSON.parse(read('tests/fixtures/legacy-vocabulary.json'));
const report=JSON.parse(read('data/merge-report.json'));
const byId=new Map(words.map(w=>[w.id,w]));
const key=s=>s.normalize('NFKC').toLowerCase().replace(/\s+/g,' ').trim();
assert.equal(words.length,903);assert.equal(old.length,181);
assert.equal(byId.size,words.length);
assert.equal(new Set(words.map(w=>key(w.en))).size,words.length);
const ranges={1:[14,25],2:[26,37],3:[42,53],4:[54,65],5:[70,81]};
// All old fields, including IDs, translations, aliases and examples, stay identical.
for(const previous of old){
 const w=byId.get(previous.id);assert.ok(w,previous.id);
 for(const field of Object.keys(previous))assert.deepEqual(w[field],previous[field],`${previous.id}.${field}`);
 assert.ok(w.units.includes(previous.unit));
}
for(const w of words){
 assert.ok(ranges[w.unit]);assert.ok(w.units.includes(w.unit));
 assert.equal(new Set(w.units).size,w.units.length);
 for(const u of w.units)assert.deepEqual(w.unitPages[u],ranges[u]);
 assert.ok(w.en&&w.example&&w.exampleRu&&w.exampleKk);
 for(const lang of ['ru','kk'])assert.ok(Array.isArray(w[lang])&&w[lang].length&&w[lang].every(x=>typeof x==='string'&&x.trim()),w.id+' '+lang);
 assert.ok(Array.isArray(w.aliases)&&w.aliases.every(x=>typeof x==='string'&&x.trim()));
 assert.ok(['n','v','adj','adv','phrase','v/n','n/adj'].includes(w.pos),w.id+' pos');
 assert.equal(typeof w.note,'string');assert.equal(typeof w.noteKk,'string');
 if(w.note)assert.ok(w.noteKk.trim());
 if(!old.some(x=>x.id===w.id)){
  assert.equal(w.page,null,'New cards must not invent a precise page');
  assert.deepEqual(w.pageRange,ranges[w.unit]);
 }else assert.ok(w.page>=ranges[w.unit][0]&&w.page<=ranges[w.unit][1]);
 for(const src of w.sourceEntries){assert.ok(w.units.includes(src.unit));assert.deepEqual(src.pageRange,ranges[src.unit]);}
}
// Independently parse the supplied document, rather than trusting generated counts.
const rows=[];let unit;
for(const line of read('data/source-vocabulary.md').split('\n')){
 const m=line.match(/^## Unit (\d)/);if(m)unit=Number(m[1]);
 if(line.startsWith('| ')&&!line.startsWith('| English')){
  const [en,ru]=line.split('|').slice(1,3).map(x=>x.trim());rows.push({unit,en,ru});
 }
}
assert.equal(rows.length,750);
assert.equal(report.sourceMatches.length,rows.length);
for(const row of rows){
 const matches=words.filter(w=>w.sourceEntries.some(s=>s.unit===row.unit&&s.en===row.en&&s.ru===row.ru));
 assert.equal(matches.length,1,`${row.unit} ${row.en}: exactly one source match`);
 const w=matches[0];assert.ok(w.units.includes(row.unit));
 assert.ok([w.en,...w.aliases].some(a=>key(a)===key(row.en)));
 assert.equal(report.sourceMatches.find(s=>s.unit===row.unit&&s.en===row.en).id,w.id);
}
const corrections=JSON.parse(read('data/content-corrections.json'));
const previous=JSON.parse(read('tests/fixtures/previous-vocabulary.json'));
for(const p of previous){const w=byId.get(p.id);assert.ok(w);for(const f of Object.keys(p)){if(['units','unitPages'].includes(f))continue;if(corrections[p.id]?.[f]){assert.deepEqual(w[f],corrections[p.id][f]);continue;}if(f==='aliases'){for(const a of p.aliases)assert.ok(w.aliases.includes(a));continue;}assert.deepEqual(w[f],p[f],p.id+'.'+f);}for(const u of p.units)assert.ok(w.units.includes(u));}
const readingReport=JSON.parse(read('data/reading-report.json'));
const readings=JSON.parse(read('data/readings.json'));
const active=words.filter(w=>w.readings.length);
assert.equal(active.length,353);assert.equal(readings.length,19);
assert.equal(readingReport.newCards,144);
for(const [u,n] of Object.entries({3:98,4:147,5:124}))assert.equal(active.filter(w=>w.readingUnits.includes(+u)).length,n);
for(const r of readings){
 assert.ok([3,4,5].includes(r.unit));assert.deepEqual(r.pdfPages,r.pages.map(p=>p+1));
 for(const p of r.pages)assert.ok(p>=ranges[r.unit][0]&&p<=ranges[r.unit][1]);
 for(const term of r.terms){const matches=words.filter(w=>[w.en,...w.aliases].some(a=>key(a)===key(term)));assert.equal(matches.length,1,r.id+' '+term);assert.ok(matches[0].readings.includes(r.id));}
}
for(const w of words){assert.deepEqual(w.readingUnits,[...new Set(readings.filter(r=>w.readings.includes(r.id)).map(r=>r.unit))]);}
assert.ok(active.find(w=>w.en==='budget').readingUnits.includes(5));
assert.ok(active.find(w=>w.en==='intellectual property').readingUnits.includes(4));
assert.ok(active.find(w=>w.en==='digital divide').readings.includes('u4-divide'),'Supplementary text on printed page64 included');
const sandbox={window:{}};vm.runInNewContext(read('assets/words.js'),sandbox);
assert.equal(JSON.stringify(sandbox.window.LEXI_WORDS),JSON.stringify(words));
const generated=['vocabulary.json','assets/words.js','data/merge-report.json','data/reading-report.json'];
const before=generated.map(read);execFileSync(process.execPath,['scripts/build-vocabulary.mjs'],{cwd:root});
assert.deepEqual(generated.map(read),before,'Build must be byte-for-byte reproducible');
console.log('PASS: 353 active cards / 19 readings / Units 3–5; 144 additions; all 181 original records unchanged; 759 previous IDs retained; explicit translation correction checked; 750 legacy source rows preserved; RU/KK; passage references; reproducible JSON/JS.');
