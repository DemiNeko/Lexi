// Optional browser regression suite: install Playwright, then run node tests/browser.cjs.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { chromium } = require('playwright');
const root = path.resolve(__dirname, '..');
const words = JSON.parse(fs.readFileSync(path.join(root, 'vocabulary.json')));
const server = http.createServer((req,res) => {
  const file=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));
  if(!file.startsWith(root+path.sep)&&file!==root){res.writeHead(403).end();return;}
  const target=file===root||file===root+path.sep?path.join(root,'index.html'):file;
  try {res.setHeader('Content-Type',target.endsWith('.js')?'text/javascript; charset=utf-8':target.endsWith('.css')?'text/css; charset=utf-8':'text/html; charset=utf-8');res.end(fs.readFileSync(target));}
  catch {res.writeHead(404).end();}
});
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const base=`http://127.0.0.1:${server.address().port}`;
 const browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH,args:['--no-sandbox','--disable-dev-shm-usage','--disable-gpu']}: {})});
 try {
  const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('dialog',d=>d.accept());
  await page.goto(base);
  assert.equal(await page.locator('html').getAttribute('lang'),'ru');
  assert.match(await page.locator('h1').innerText(),/Немного английского/);
  await page.selectOption('#language-select','kk');
  assert.match(await page.locator('h1').innerText(),/ағылшын/);
  assert.equal(await page.title(),'Lexi — сенің академиялық ағылшын тілің');
  await page.reload();assert.equal(await page.locator('html').getAttribute('lang'),'kk');
  assert.equal(await page.evaluate(()=>LexiI18n.formatDate(new Date(2026,9,11))),'11 қазан');
  assert.equal(await page.evaluate(()=>LexiI18n.formatWeekday(new Date(2026,9,11))),'жс');
  // Every accepted answer, both locales/directions; Kazakh letters stay distinct.
  const failures=await page.evaluate(()=>{
   const out=[],c=LexiCore;
   for(const locale of ['ru','kk']){
    LexiI18n.setLanguage(locale);
    for(const w of LEXI_WORDS){
     for(const answer of w[locale])if(!c.checkAnswer(w,'  '+answer.toUpperCase()+'!  ','en-local',locale))out.push(w.id+' '+answer);
     for(const answer of [w.en,...w.aliases])if(!c.checkAnswer(w,answer,'local-en',locale))out.push(w.id+' English');
     for(const dir of ['en-local','local-en']){
      const ids=c.makeOptions(w,dir);if(ids.length!==4||new Set(ids).size!==4||!ids.includes(w.id))out.push(w.id+' options');
      const correct=c.getAnswers(w,dir);
      for(const id of ids.filter(id=>id!==w.id))if(c.getAnswers(LEXI_WORDS.find(x=>x.id===id),dir).some(a=>correct.includes(a)))out.push(w.id+' ambiguous');
     }
    }
   }
   if(c.normalize('қ')===c.normalize('к')||c.normalize('і')===c.normalize('и')||c.normalize('ң')===c.normalize('н'))out.push('Kazakh alphabet');
   const migrated=c.validatedState({version:1,words:{'u1-008':{seen:5,correct:4,wrong:1,streak:2}},settings:{direction:'ru-en'},bookmarks:['u1-008']});
   if(migrated.settings.direction!=='local-en'||migrated.settings.language!=='ru'||migrated.words['u1-008'].seen!==5)out.push('migration');
   return out;
  });
  assert.deepEqual(failures,[]);
  await page.reload();
  await page.locator('[data-view="dictionary"]').first().click();
  for(const query of ['білім','знания','knowledge']){
   await page.fill('#dictionary-search',query);assert.ok(await page.locator('[data-action="word-detail"][data-id="u1-008"]').count());
  }
  await page.locator('[data-action="word-detail"][data-id="u1-008"]').click();
  assert.match(await page.locator('.word-detail').innerText(),/өсімдіктер туралы білімі мол/);
  await page.locator('[data-action="practice-word"]').click();
  await page.locator('.reveal-button').click();assert.equal(await page.locator('.flash-card h2').innerText(),'білім');
  await page.locator('[data-action="rate-know"]').click();
  assert.match(await page.locator('.result-hero').innerText(),/Барлық|барлық/);
  const before=await page.evaluate(()=>JSON.parse(localStorage.getItem('lexi-progress-v1')).words);
  await page.selectOption('#language-select','ru');assert.match(await page.locator('.result-hero').innerText(),/Все ответы/);
  await page.selectOption('#language-select','kk');
  assert.deepEqual(await page.evaluate(()=>JSON.parse(localStorage.getItem('lexi-progress-v1')).words),before);
  async function seed(mode,direction,ids=['u3-006']){
   await page.evaluate(({mode,direction,ids})=>{
    localStorage.setItem('lexi-session-v1',JSON.stringify({mode,direction,questionDirection:direction==='mixed'?'local-en':direction,queue:ids,baseIds:ids,cursor:0,history:[],mistakes:[],optionIds:[],answered:false,flipped:false,typed:'',started:Date.now()}));
   },{mode,direction,ids});
   await page.goto(base+'/#'+mode);await page.reload();
  }
  await seed('typing','local-en');assert.equal(await page.locator('.question-panel h2').innerText(),'кәсіпкер');
  await page.fill('#answer-input','entrepreneur');await page.locator('[type="submit"]').click();
  assert.equal(await page.locator('.feedback.incorrect').count(),0);assert.match(await page.locator('.feedback-heading').innerText(),/Дұрыс/);
  await seed('typing','en-local');assert.equal(await page.locator('#answer-input').getAttribute('lang'),'kk');
  await page.fill('#answer-input','КӘСІПКЕР');await page.locator('[type="submit"]').click();assert.match(await page.locator('.feedback-heading').innerText(),/Дұрыс/);
  await page.locator('[data-action="next"]').click();assert.ok(await page.locator('.result-hero').count());
  await seed('typing','en-local');await page.fill('#answer-input','предприниматель');await page.locator('[type="submit"]').click();
  assert.equal(await page.locator('.feedback.incorrect').count(),1);assert.match(await page.locator('.feedback').innerText(),/кәсіпкер/);
  await page.locator('[data-action="next"]').click();assert.ok(await page.locator('#answer-input').count());
  // Real quiz setup creates localized options; switching mid-session keeps progress.
  await page.locator('[data-action="session-back"]').click();
  await page.locator('[data-view="quiz"]').first().click();await page.locator('[data-action="start"]').click();
  assert.equal(await page.locator('.option').count(),4);
  const session=await page.evaluate(()=>JSON.parse(localStorage.getItem('lexi-session-v1')));
  await page.selectOption('#language-select','ru');await page.selectOption('#language-select','kk');
  assert.equal(await page.locator('.option').count(),4);
  await page.locator(`.option[data-id="${session.queue[0]}"]`).click();assert.match(await page.locator('.feedback-heading').innerText(),/Дұрыс/);
  await page.reload();assert.match(await page.locator('.feedback-heading').innerText(),/Дұрыс/);
  // Export contains locale, old exports remain importable, new exports restore it.
  await page.locator('[data-action="settings"]').first().click();
  assert.match(await page.locator('#settings-dialog').innerText(),/Сенің кеңістігің/);
  const dlPromise=page.waitForEvent('download');await page.locator('[data-action="export"]').click();
  const dl=await dlPromise,exported=JSON.parse(fs.readFileSync(await dl.path(),'utf8'));assert.equal(exported.settings.language,'kk');
  const old={version:1,words:{},daily:{},bookmarks:['u1-008'],settings:{direction:'en-ru'}};
  await page.setInputFiles('#import-file',{name:'old.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(old))});
  await page.waitForFunction(()=>document.documentElement.lang==='ru');
  await page.setInputFiles('#import-file',{name:'new.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(exported))});
  await page.waitForFunction(()=>document.documentElement.lang==='kk');
  // Mobile/tablet/desktop layout across every view and both themes.
  for(const width of [320,390,768,1440]){
   await page.setViewportSize({width,height:900});
   for(const view of ['home','cards','quiz','typing','dictionary','stats']){
    await page.goto(base+'/#'+view);
    await page.waitForTimeout(50);
    const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);

    assert.equal(overflow,false,`${view} overflow at ${width}`);
   }
  }
  await page.goto(base+'/#home');await page.locator('[data-action="theme"]').first().click();
  assert.equal(await page.locator('html').getAttribute('data-theme'),'dark');
  if(process.env.SCREENSHOT_DIR){fs.mkdirSync(process.env.SCREENSHOT_DIR,{recursive:true});await page.locator('#toast').evaluate(el=>el.classList.remove('visible'));await page.screenshot({path:path.join(process.env.SCREENSHOT_DIR,'desktop-kk.png'),fullPage:true});await page.setViewportSize({width:390,height:844});await page.screenshot({path:path.join(process.env.SCREENSHOT_DIR,'mobile-kk.png'),fullPage:true});}
  assert.deepEqual(errors,[]);
  console.log('PASS: bilingual answers/options for 181 words; UI/cards/quiz/typing; search; locale persistence; legacy progress; export/import; responsive layouts; no runtime errors.');
 } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1}).finally(()=>server.close());
