// No npm install is required: only Node's built-in modules.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const words=JSON.parse(fs.readFileSync(path.join(root,'vocabulary.json'),'utf8'));
assert.equal(words.length,181);
assert.equal(new Set(words.map(w=>w.id)).size,words.length);
assert.equal(new Set(words.map(w=>w.en)).size,words.length);
for(const w of words){
  assert.ok([1,2,3].includes(w.unit));
  assert.ok(w.en&&Array.isArray(w.ru)&&w.ru.length&&w.ru.every(x=>typeof x==='string'&&x.length));
  assert.ok(Number.isInteger(w.page));
  assert.ok(w.page >= (w.unit===1?14:w.unit===2?26:42));
  assert.ok(w.page <= (w.unit===1?25:w.unit===2?37:53));
  assert.ok(w.example&&w.exampleRu&&Array.isArray(w.aliases));
  assert.ok(Array.isArray(w.kk)&&w.kk.length&&w.kk.every(x=>typeof x==='string'&&x.trim()),w.id+' Kazakh translations');
  assert.ok(w.exampleKk&&typeof w.noteKk==='string',w.id+' Kazakh example');
  if(w.note)assert.ok(w.noteKk.trim(),w.id+' Kazakh note');
  assert.ok(['n','v','adj','adv','phrase','v/n','n/adj'].includes(w.pos));
}
const sandbox={window:{}};
vm.runInNewContext(fs.readFileSync(path.join(root,'assets/words.js'),'utf8'),sandbox);
assert.equal(JSON.stringify(sandbox.window.LEXI_WORDS),JSON.stringify(words));
for(const file of ['index.html','assets/style.css','assets/app.js','assets/i18n.js','assets/words.js','assets/icon.svg','.nojekyll'])assert.ok(fs.existsSync(path.join(root,file)));
console.log('PASS: 181 words, unique IDs, valid units/pages, RU/KK translations/examples/notes, JSON and JS in sync.');
