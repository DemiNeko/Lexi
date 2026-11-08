/* Runs against the actual app in a same-origin iframe; no framework or browser driver needed. */
const frame=document.getElementById('app'),result=document.getElementById('result');
const reports=[];let win,doc;const failures=[];
function assert(ok,message){if(!ok)throw Error(message)}
function eq(a,b,message){assert(JSON.stringify(a)===JSON.stringify(b),message+'\n'+JSON.stringify(a)+'\n!=\n'+JSON.stringify(b))}
function log(s){reports.push('PASS: '+s);result.textContent=reports.join('\n')}
async function load(hash='home'){
 await new Promise(resolve=>{frame.onload=resolve;frame.src='../index.html?test='+Math.random()+'#'+hash;});
 win=frame.contentWindow;doc=win.document;win.confirm=()=>true;
 win.addEventListener('error',e=>failures.push(e.message));
 await new Promise(resolve=>win.requestAnimationFrame(()=>win.requestAnimationFrame(resolve)));
 assert(win.LexiCore,'App loaded');
}
const click=s=>{const el=doc.querySelector(s);assert(el,'Missing '+s);el.click()};
function select(s,value){const el=doc.querySelector(s);assert(el,'Missing '+s);el.value=value;el.dispatchEvent(new win.Event('change',{bubbles:true}));}
function type(s,value){const el=doc.querySelector(s);el.value=value;el.dispatchEvent(new win.Event('input',{bubbles:true}));}
const state=()=>JSON.parse(localStorage.getItem('lexi-progress-v1'));
const session=()=>JSON.parse(localStorage.getItem('lexi-session-v1'));
function seed(value,saved=null){localStorage.setItem('lexi-progress-v1',JSON.stringify(value));if(saved)localStorage.setItem('lexi-session-v1',JSON.stringify(saved));else localStorage.removeItem('lexi-session-v1');localStorage.setItem('lexi-language',value.settings.language||'ru');}
async function importData(value){
 click('[data-action="settings"]');
 const f=new win.File([JSON.stringify(value)],'progress.json',{type:'application/json'}),dt=new win.DataTransfer();dt.items.add(f);
 doc.querySelector('#import-file').files=dt.files;doc.querySelector('#import-file').dispatchEvent(new win.Event('change',{bubbles:true}));
 await new Promise((resolve,reject)=>{const started=Date.now();function poll(){if(!doc.querySelector('#settings-dialog').open)return resolve();if(Date.now()-started>3000)return reject(Error('Import did not complete'));requestAnimationFrame(poll)}poll();});
}
function makeState(words){return {version:1,words:Object.fromEntries(words.map((w,i)=>[w.id,{seen:10+i,correct:7+i,wrong:3,streak:3,due:1794000000000+i,last:1793000000000+i}])),daily:{'2026-10-20':{attempts:words.length,correct:words.length,ids:words.map(w=>w.id)}},bookmarks:words.filter((_,i)=>i%3===0).map(w=>w.id),settings:{goal:30,unit:3,pool:'all',length:'20',direction:'ru-en',language:'kk'}};}
async function run(){
 reports.length=0;result.textContent='Running…';document.getElementById('run').disabled=true;
 try{
 const [words,legacy,previous,readings]=await Promise.all(['../vocabulary.json','fixtures/legacy-vocabulary.json','fixtures/previous-vocabulary.json','../data/readings.json'].map(p=>fetch(p).then(r=>r.json())));
 const active=words.filter(w=>w.readings.length);
 // Home browsing must not silently change training filters or an active session.
 seed(makeState([]));await load('home');select('#language-select','ru');
 const beforeHome=state();
 assert(doc.querySelectorAll('.home-unit').length===3,'Home shows Units 3, 4 and 5');
 assert(doc.querySelectorAll('.home-word').length===24,'Each unit starts with eight useful/demanding terms');
 assert(doc.querySelector('#home-count').textContent.includes('353'),'Shared words counted once');
 for(const u of [3,4,5]){
  click('[data-home-unit="'+u+'"] [data-home-action="expand"]');
  assert(doc.querySelectorAll('[data-home-unit="'+u+'"] .home-word').length===active.filter(w=>w.readingUnits.includes(u)).length,'Full unit available on home '+u);
 }
 for(const group of ['key','hard']){
  select('#home-filter',group);
  for(const u of [3,4,5]){
   click('[data-home-unit="'+u+'"] [data-home-action="expand"]');
   assert(doc.querySelectorAll('[data-home-unit="'+u+'"] .home-word').length===12,'Twelve curated '+group+' terms in Unit '+u);
  }
 }
 select('#home-filter','all');
 for(const q of ['digital divide','цифровой разрыв','цифрлық алшақтық']){
  type('#home-search',q);
  assert(doc.querySelectorAll('.home-word').length===1,'Home searches English/Russian/Kazakh: '+q);
 }
 type('#home-search','zzzz-no-result');assert(!doc.querySelector('.home-word'),'Home has an empty result state');
 type('#home-search','');click('[data-home-action="unit"][data-unit="5"]');
 assert(doc.querySelectorAll('.home-unit').length===1&&doc.querySelector('[data-home-unit="5"]'),'Home unit filter');
 eq(state(),beforeHome,'Browsing home does not alter progress or training settings');
 click('.home-example summary');assert(doc.querySelector('.home-example').open,'Home example expands');
 const homeId=doc.querySelector('.home-word').dataset.wordId;
 click('.home-word [data-action="bookmark"]');assert(state().bookmarks.includes(homeId),'Home bookmark uses existing progress');
 select('#language-select','kk');assert(doc.querySelector('.home-word-label').textContent==='Негізгі сөз','Home localized');
 click('[data-home-action="unit"][data-unit="0"]');
 click('.home-word [data-action="practice-word"]');assert(session().baseIds.length===1,'Home word launches existing practice');
 log('Home: full Units 3–5, 72 curated terms, three-language search, unit/type filters, examples, bookmarks, practice and independent training settings');
 for(const oldWords of [legacy,previous]){
  const old=makeState(oldWords);const saved={mode:'typing',direction:'ru-en',questionDirection:'ru-en',queue:['u1-008','u3-006'],baseIds:['u1-008','u3-006'],cursor:1,history:[{id:'u1-008',correct:true}],mistakes:[],optionIds:[],answered:false,flipped:false,typed:'',started:1792400000000};
  localStorage.setItem('lexi-theme','dark');seed(old,saved);await load('typing');
  assert(doc.querySelector('.question-panel h2').textContent==='кәсіпкер','Legacy session resumes in Kazakh');
  select('#language-select','ru');select('#language-select','kk');
  for(const field of ['words','daily','bookmarks'])eq(state()[field],old[field],oldWords.length+' retained '+field);
  for(const field of ['queue','baseIds','cursor','history','mistakes','started'])eq(session()[field],saved[field],'Session retained '+field);
  assert(doc.documentElement.dataset.theme==='dark','Theme retained');
  await load('typing');type('#answer-input','entrepreneur');doc.querySelector('#typing-form').dispatchEvent(new win.Event('submit',{bubbles:true,cancelable:true}));
  assert(state().words['u3-006'].seen===old.words['u3-006'].seen+1,'Resumed answer increments one card');
  for(const w of oldWords.filter(w=>w.id!=='u3-006'))eq(state().words[w.id],old.words[w.id],'Unrelated progress retained');
  const preLocale=structuredClone(old);delete preLocale.settings.language;preLocale.settings.unit=1;preLocale.settings.direction='en-ru';await importData(preLocale);
  for(const field of ['words','daily','bookmarks'])eq(state()[field],old[field],'Actual old import '+field);
  assert(state().settings.unit===0&&state().settings.direction==='en-local','Obsolete unit resets safely; old direction maps');
  await load('stats');assert(doc.querySelector('.metric-value').textContent===String(active.filter(w=>old.words[w.id]).length),'Stats count active course only');
  const stats=[...doc.querySelectorAll('.stat-unit-label strong')].map(e=>e.textContent);
  eq(stats,[3,4,5].map(u=>`${active.filter(w=>w.readingUnits.includes(u)&&old.words[w.id]).length} / ${active.filter(w=>w.readingUnits.includes(u)).length}`),'Shared membership stats');
  const mixed=state();const added=words.find(w=>w.en==='microfinance');mixed.words[added.id]={seen:2,correct:1,wrong:1,streak:1,due:1795000000000,last:1794000000000};mixed.bookmarks.push(added.id);mixed.settings.unit=5;mixed.settings.text='u5-microfinance';mixed.settings.language='kk';await importData(mixed);eq(state(),mixed,'Mixed import exact');
  let exported;win.URL.createObjectURL=blob=>{exported=blob;return 'blob:test'};win.HTMLAnchorElement.prototype.click=function(){};click('[data-action="settings"]');click('[data-action="export"]');const parsed=JSON.parse(await exported.text());
  for(const field of ['words','daily','bookmarks','settings'])eq(parsed[field],mixed[field],'Export '+field);
  click('[data-action="close-settings"]');await importData(parsed);await load('home');eq(state(),mixed,'Export/import/reload round trip');
  log(`${oldWords.length} old records: IDs, counters, due dates, daily IDs, ${old.bookmarks.length} bookmarks, locale/theme, session resume, old import and mixed export round trip`);
 }
 const empty={version:1,words:{},daily:{},bookmarks:[],settings:{language:'ru'}};seed(empty);await load('home');
 assert(doc.querySelectorAll('.home-unit').length===3,'Three units');
 for(const locale of ['ru','kk']){
  select('#language-select',locale);
  for(const w of words){
   for(const a of w[locale])assert(win.LexiCore.checkAnswer(w,' '+a.toUpperCase()+'! ','en-local',locale),w.id+' translation');
   for(const a of [w.en,...w.aliases])assert(win.LexiCore.checkAnswer(w,a,'local-en',locale),w.id+' spelling');
  }
  for(const w of active){for(const direction of ['en-local','local-en']){const ids=win.LexiCore.makeOptions(w,direction);assert(ids.length===4&&new Set(ids).size===4&&ids.includes(w.id),'Four distinct quiz options');const answers=win.LexiCore.getAnswers(w,direction);for(const id of ids.filter(id=>id!==w.id)){assert(!win.LexiCore.getAnswers(words.find(x=>x.id===id),direction).some(a=>answers.includes(a)),'No ambiguous distractor');}}}
 }
 assert(!win.LexiCore.checkAnswer(words.find(w=>w.en==='microfinance'),'wrong','local-en'),'Wrong spelling rejected');
 log('All 903 cards: RU/KK translations and English aliases; all 353 active cards: four unambiguous quiz options in both directions/locales');
 await load('dictionary');select('#language-select','ru');
 for(const r of readings){select('#reading-select',r.id);const expected=active.filter(w=>w.readings.includes(r.id));assert(doc.querySelectorAll('.word-row').length===expected.length,r.id+' filter');}
 select('#reading-select','');click('[data-action="unit"][data-unit="5"]');assert(doc.querySelectorAll('.word-row').length===124,'Unit 5 count');
 for(const q of ['microfinance','микрофинансирование','микроқаржыландыру']){type('#dictionary-search',q);assert(doc.querySelectorAll('.word-row').length>=1,'Three-language search');}
 type('#dictionary-search','');select('#course-scope','archive');assert(doc.querySelectorAll('.word-row').length===550,'Archive retained');
 type('#dictionary-search','knowledge');click('[data-action="word-detail"]');click('[data-action="practice-word"]');assert(session().baseIds[0]==='u1-008','Archived card can be practised');
 log('All 19 source filters, Unit 5 count, three-language search, archived words and archived-word practice');
 for(const mode of ['cards','quiz','typing']){
  localStorage.removeItem('lexi-session-v1');await load(mode);click('[data-action="unit"][data-unit="5"]');select('#reading-select','u5-microfinance');select('#pool-select','all');select('#length-select','all');select('#direction-select','local-en');click('[data-action="start"]');
  const s=session();eq([...s.baseIds].sort(),active.filter(w=>w.readings.includes('u5-microfinance')).map(w=>w.id).sort(),mode+' respects selected text');
  const w=words.find(w=>w.id===s.queue[0]);
  if(mode==='cards'){click('[data-action="flip"]');assert(doc.querySelector('.flash-card.flipped'),'Flip');click('[data-action="rate-know"]');}
  if(mode==='quiz'){click(`.option[data-id="${w.id}"]`);assert(!doc.querySelector('.feedback.incorrect'),'Correct quiz feedback');}
  if(mode==='typing'){type('#answer-input',w.en);doc.querySelector('#typing-form').dispatchEvent(new win.Event('submit',{bubbles:true,cancelable:true}));assert(!doc.querySelector('.feedback.incorrect'),'Correct typing feedback');}
  assert(state().words[w.id].seen>0,'Answer saved');
 }
 log('Cards / quiz / typing use the chosen Unit 5 text and save real answers');
 for(const width of [320,390,768,1366]){frame.style.width=width+'px';for(const theme of ['light','dark']){localStorage.setItem('lexi-theme',theme);for(const view of ['home','dictionary','stats','cards']){localStorage.removeItem('lexi-session-v1');await load(view);select('#language-select','kk');assert(doc.documentElement.scrollWidth<=win.innerWidth,`${width} ${theme} ${view} horizontal overflow`);}}}
 const long=words.find(w=>w.en==='high-tech surveillance devices');const archiveSession={mode:'cards',direction:'en-local',questionDirection:'en-local',queue:[long.id],baseIds:[long.id],cursor:0,history:[],mistakes:[],optionIds:[],answered:false,flipped:false,typed:'',started:Date.now()};seed(state(),archiveSession);frame.style.width='320px';await load('cards');const top=doc.querySelector('.card-top').getBoundingClientRect(),heading=doc.querySelector('.flash-card h2').getBoundingClientRect();assert(top.bottom<=heading.top,'Long card has no overlap');assert(doc.documentElement.scrollWidth<=320,'Long archived card fits phone');
 log('Responsive overflow: 320/390/768/1366, both themes, KK home/dictionary/stats/cards; long archived card has no overlap');
 eq(failures,[],'No page errors');log('No JavaScript errors');
 result.dataset.status='passed';result.textContent+='\nALL CHECKS PASSED';
 }catch(e){result.dataset.status='failed';result.textContent+='\nFAIL: '+e.stack;}
 finally{document.getElementById('run').disabled=false;}
}
document.getElementById('run').onclick=run;
