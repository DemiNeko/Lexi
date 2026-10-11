/* Lexi. No dependencies, accounts, analytics or remote data storage. */
(() => {
  'use strict';
  const WORDS = window.LEXI_WORDS || [];
  const byId = new Map(WORDS.map(w => [w.id, w]));
  const STORAGE = 'lexi-progress-v1', ACTIVE = 'lexi-session-v1';
  const DAY = 86400000;
  const units = {
    1: { title: 'Styles of learning', ru: 'Стили обучения', icon: 'brain', pages: '14–25' },
    2: { title: 'Problems in the natural world', ru: 'Проблемы окружающего мира', icon: 'leaf', pages: '26–37' },
    3: { title: 'Indications and trends', ru: 'Показатели и тенденции', icon: 'trend', pages: '42–53' }
  };
  const modes = {
    cards: { title: 'Карточки', subtitle: 'Вспомни перевод. Переверни. Проверь себя.', icon: 'cards', intro: 'Сначала вспомни.\nПотом посмотри.', description: 'Не торопись переворачивать карточку. Произнеси перевод вслух, а затем оцени свой ответ. Сложные слова вернутся в этой же сессии.' },
    quiz: { title: 'Проверь себя', subtitle: 'Четыре варианта. Один верный перевод.', icon: 'check-square', intro: 'Узнать слово —\nуже половина дела.', description: 'Выбери верный вариант, разбери ошибку и посмотри пример. После сессии можно отдельно повторить слова, в которых ты ошибся.' },
    typing: { title: 'Вспомни и напиши', subtitle: 'Без вариантов ответа — почти как на проверке.', icon: 'type', intro: 'Из пассивного запаса\nв активный.', description: 'Напиши слово по памяти. Регистр не важен, британское и американское написание учитывается там, где есть варианты. По-русски достаточно одного перевода из карточки.' }
  };
  const paths = {
    home:'M3 10 12 3l9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z',
    cards:'M8 3h11a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2ZM3 7v13a2 2 0 0 0 2 2h11M10 8h7M10 12h5',
    'check-square':'M21 11v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h12M8 11l4 4L22 4',
    type:'M4 5V3h16v2M12 3v18M8 21h8',
    book:'M12 5C9 2 5 2 2 3v17c4-1 7 0 10 2 3-2 6-3 10-2V3c-3-1-7-1-10 2Zm0 0v17M5 7h3M16 7h3M5 11h3M16 11h3',
    chart:'M4 3v18h17M8 16v-5M13 16V6M18 16V9',
    'arrow-up-right':'M6 18 18 6M6 6h12v12',
    arrow:'M4 12h16M14 6l6 6-6 6',
    back:'M20 12H4m6-6-6 6 6 6',
    moon:'M20 13A8 8 0 0 1 11 4a8 8 0 1 0 9 9Z',
    sun:'M12 3V1m0 22v-2M3 12H1m22 0h-2M5 5 3.5 3.5M19 19l1.5 1.5M5 19l-1.5 1.5M19 5l1.5-1.5M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0',
    fire:'M12 2c1 5-5 6-5 10-2-1-2-2-2-2-4 8 1 12 7 12s10-5 6-10c-1-2-3-3-2-6-2 1-2 3-2 3 0-3-2-7-2-7Z',
    sliders:'M4 3v5m0 4v9M12 3v10m0 4v4M20 3v3m0 4v11M1 8h6v4H1zm8 5h6v4H9zm8-7h6v4h-6z',
    brain:'M12 5c-4-5-8-1-7 3-4 1-4 7 0 8-1 5 5 7 7 3 2 4 8 2 7-3 4-1 4-7 0-8 1-4-3-8-7-3Zm0 0v14M5 8l3 2M5 16l3-2m11-6-3 2m3 6-3-2',
    leaf:'M20 3C9 1 2 5 3 13s12 11 16 1c1-3 1-7 1-11ZM4 21 15 10M8 17v-5m0 5h5',
    trend:'M3 18 10 11l4 4 7-11M15 4h6v6',
    spark:'m12 2 2.7 7.3L22 12l-7.3 2.7L12 22l-2.7-7.3L2 12l7.3-2.7Z',
    star:'m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3L7.5 14 3 9.6l6.2-.9Z',
    bookmark:'M6 3h12v19l-6-4-6 4z',
    volume:'M11 4 6 8H2v8h4l5 4Zm4 4a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14',
    refresh:'M3 10a9 9 0 0 1 15-6l3 3M21 2v5h-5M21 14a9 9 0 0 1-15 6l-3-3M3 22v-5h5',
    check:'M5 12l4 4L19 6',
    close:'m6 6 12 12M18 6 6 18',
    search:'M16 10a6 6 0 1 1-12 0 6 6 0 0 1 12 0Zm-2 4 7 7',
    clock:'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM12 7v5l3 2',
    target:'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-4 0a5 5 0 1 1-10 0 5 5 0 0 1 10 0Zm-4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0',
    trophy:'M7 3h10v7a5 5 0 0 1-10 0ZM7 5H3v3a4 4 0 0 0 4 4m10-7h4v3a4 4 0 0 1-4 4m-5 3v6m-4 0h8',
    info:'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM12 11v6m0-10v.01',
    download:'M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5',
    upload:'M12 16V4m-5 5 5-5 5 5M4 16v5h16v-5'
  };
  const icon = name => `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="${paths[name] || paths.spark}"/></svg>`;
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const normalize = s => String(s).normalize('NFKC').toLowerCase().replace(/ё/g,'е').replace(/[’‘]/g,"'").replace(/[‐‑–—-]/g,' ').replace(/[.,!?;:()[\]"«»]/g,'').replace(/^to\s+/,'').replace(/\s+/g,' ').trim();
  const dayKey = (date = new Date()) => `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
  function shuffled(array) { const a=[...array]; for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a; }
  const finite = (v, max=1e9) => typeof v==='number' && Number.isFinite(v) ? Math.min(max,Math.max(0,v)) : 0;
  const freshState = () => ({version:1,words:{},daily:{},settings:{goal:20,unit:0,pool:'all',length:'20',direction:'en-ru'},bookmarks:[]});
  let state=freshState(), storageOk=true, session=null;
  // Only copy known keys and word IDs; imports never become executable HTML or arbitrary app settings.
  function validatedState(input) {
    if (!input || input.version!==1 || typeof input.words!=='object' || !input.words || Array.isArray(input.words)) throw new Error('Неверный формат файла прогресса.');
    const clean=freshState();
    for(const [id,w] of Object.entries(input.words)){
      if(!byId.has(id) || !w || typeof w!=='object') continue;
      clean.words[id]={seen:Math.floor(finite(w.seen)),correct:Math.floor(finite(w.correct)),wrong:Math.floor(finite(w.wrong)),streak:Math.floor(finite(w.streak,50)),due:finite(w.due,9e15),last:finite(w.last,9e15)};
    }
    for(const [date,d] of Object.entries(input.daily || {})){
      if(!/^\d{4}-\d{2}-\d{2}$/.test(date)||!d||typeof d!=='object') continue;
      clean.daily[date]={attempts:Math.floor(finite(d.attempts)),correct:Math.min(Math.floor(finite(d.correct)),Math.floor(finite(d.attempts))),ids:[...new Set(Array.isArray(d.ids)?d.ids.filter(id=>byId.has(id)):[])]};
    }
    clean.bookmarks=[...new Set(Array.isArray(input.bookmarks)?input.bookmarks.filter(id=>byId.has(id)):[])];
    const s=input.settings || {};
    clean.settings.goal=[10,20,30,50].includes(s.goal)?s.goal:20;
    clean.settings.unit=[0,1,2,3].includes(s.unit)?s.unit:0;
    clean.settings.pool=['all','priority','due','difficult','bookmarks'].includes(s.pool)?s.pool:'all';
    clean.settings.length=['10','20','all'].includes(String(s.length))?String(s.length):'20';
    clean.settings.direction=['en-ru','ru-en','mixed'].includes(s.direction)?s.direction:'en-ru';
    return clean;
  }
  try { const raw=localStorage.getItem(STORAGE); if(raw) state=validatedState(JSON.parse(raw)); } catch(e) { storageOk=false; }
  function save(){try{localStorage.setItem(STORAGE,JSON.stringify(state));storageOk=true;return true}catch(e){storageOk=false;toast('Браузер не сохраняет данные. Экспортируй прогресс в настройках.');return false}}
  function saveSession(){try{if(session)localStorage.setItem(ACTIVE,JSON.stringify(session));else localStorage.removeItem(ACTIVE)}catch(e){storageOk=false}}
  try{
    const saved=JSON.parse(localStorage.getItem(ACTIVE)||'null');
    if(saved && modes[saved.mode] && Array.isArray(saved.queue) && saved.queue.length<=WORDS.length*3 && saved.queue.every(id=>byId.has(id)) && Number.isInteger(saved.cursor) && saved.cursor>=0 && saved.cursor<=saved.queue.length && Array.isArray(saved.history) && saved.history.every(x=>x&&byId.has(x.id)&&typeof x.correct==='boolean') && Array.isArray(saved.baseIds) && saved.baseIds.every(id=>byId.has(id)) && Array.isArray(saved.mistakes) && saved.mistakes.every(id=>byId.has(id))){
      if(Array.isArray(saved.optionIds) && saved.optionIds.some(id=>!byId.has(id))) saved.optionIds=[];
      session=saved;
    }
  }catch(e){session=null}
  let view=['home','cards','quiz','typing','dictionary','stats'].includes(location.hash.slice(1))?location.hash.slice(1):'home';
  let dictionaryQuery='',dictionaryFilter='all',dictionaryExpanded=null,toastTimer;
  const main=document.getElementById('main');
  const progress = w => state.words[typeof w==='string'?w:w.id] || {seen:0,correct:0,wrong:0,streak:0,due:0,last:0};
  const learned = w => progress(w).streak>=3;
  const difficult = w => progress(w).wrong>0 && progress(w).streak<2;
  const due = w => progress(w).seen>0 && progress(w).due<=Date.now();
  const today = () => state.daily[dayKey()] || {attempts:0,correct:0,ids:[]};
  function toast(message){clearTimeout(toastTimer);const el=document.getElementById('toast');el.textContent=message;el.classList.add('visible');toastTimer=setTimeout(()=>el.classList.remove('visible'),4000)}
  function streakDays(){let d=new Date();if(!state.daily[dayKey(d)]?.attempts)d.setDate(d.getDate()-1);let count=0;while(state.daily[dayKey(d)]?.attempts){count++;d.setDate(d.getDate()-1);if(count>3650)break;}return count}
  function updateChrome(){
    document.querySelectorAll('[data-view]').forEach(b=>{b.classList.toggle('active',b.dataset.view===view);if(b.dataset.view===view)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current')});
    document.querySelectorAll('[data-icon]').forEach(el=>el.innerHTML=icon(el.dataset.icon));
    document.getElementById('nav-count').textContent=WORDS.length;
    document.getElementById('streak-pill').innerHTML=`${icon('fire')} ${streakDays()} дн. подряд`;
    const isDark=document.documentElement.dataset.theme==='dark';
    document.querySelectorAll('.theme-toggle').forEach(el=>{el.innerHTML=icon(isDark?'sun':'moon');el.setAttribute('aria-label',isDark?'Включить светлую тему':'Включить тёмную тему')});
  }
  function setView(next){if(!['home','cards','quiz','typing','dictionary','stats'].includes(next))return;view=next;try{history.replaceState(null,'',`#${view}`)}catch(e){}render();window.scrollTo({top:0,behavior:'instant'})}
  function header(eyebrow,title,sub='',right=''){return `<div class="page-heading"><div><div class="eyebrow">${esc(eyebrow)}</div><h1>${esc(title)}</h1>${sub?`<p class="subtext">${esc(sub)}</p>`:''}</div>${right}</div>`}
  function metrics(items){return `<div class="metrics">${items.map(i=>`<div class="metric"><div class="metric-icon">${icon(i.icon)}</div><div><div class="metric-value">${i.value}${i.suffix?`<span>${esc(i.suffix)}</span>`:''}</div><div class="metric-name">${esc(i.label)}</div></div></div>`).join('')}</div>`}
  function unitChips(){return `<div class="segmented" aria-label="Выбрать юнит">${[0,1,2,3].map(u=>`<button class="chip ${state.settings.unit===u?'active':''}" data-action="unit" data-unit="${u}" aria-pressed="${state.settings.unit===u}">${u?`Unit 0${u}`:'Все юниты'}</button>`).join('')}</div>`}
  function render(){
    if(!WORDS.length){main.innerHTML='<div class="empty-state"><h1>Словарь не загрузился</h1><p>Проверь наличие assets/words.js рядом с сайтом.</p></div>';return}
    let html='';
    if(view==='home')html=renderHome();
    else if(modes[view])html=session?.mode===view?renderSession():renderSetup();
    else if(view==='dictionary')html=renderDictionary();
    else if(view==='stats')html=renderStats();
    main.innerHTML=(!storageOk?'<div class="storage-warning">Сохранение в браузере недоступно или файл прогресса повреждён. Используй экспорт данных в настройках.</div>':'')+`<div class="page-enter">${html}</div>`;
    updateChrome();
    if(view==='typing'&&session&&session.cursor<session.queue.length&&!session.answered)requestAnimationFrame(()=>document.getElementById('answer-input')?.focus({preventScroll:true}));
  }
  function renderHome(){
    const nLearned=WORDS.filter(learned).length,nDue=WORDS.filter(due).length,nToday=today().ids.length,goal=state.settings.goal;
    const active=session&&session.cursor<session.queue.length;
    const date=new Intl.DateTimeFormat('ru',{day:'numeric',month:'long'}).format(new Date());
    return header('ТВОЯ ЕЖЕДНЕВНАЯ ПРАКТИКА','Немного английского сегодня?',`${WORDS.length} слово и выражение · 3 юнита · в своём темпе`,`<span class="date-label">${esc(date)}</span>`)+`
      <section class="hero"><div class="hero-text"><span class="hero-tag">${icon('spark')} МАЛЕНЬКАЯ ПРИВЫЧКА. БОЛЬШОЙ РЕЗУЛЬТАТ.</span><h2>Слова, которые<br><em>останутся с тобой.</em></h2><p>Карточки, короткие тесты и чуть-чуть практики.<br>Готовься к проверке без лишнего стресса.</p><div class="hero-actions"><button class="primary-button" data-action="${active?'resume':'quick-start'}">${active?'Продолжить сессию':'Начать учиться'} ${icon('arrow')}</button><span class="hero-fine">20 слов за один подход</span></div></div><div class="hero-art" aria-hidden="true"><div class="mini-card back"></div><div class="mini-card middle"></div><div class="mini-card front"><div class="mini-label">UNIT 01 · LEARNING</div><div class="mini-word">knowledge</div><div class="mini-translation">знания</div><div class="mini-rule"></div><div class="mini-bottom">a little, every day<span>✓</span></div></div><span class="floating-star">✦</span><span class="floating-mark">✧</span></div></section>
      ${metrics([{icon:'book',value:nLearned,suffix:`/ ${WORDS.length}`,label:'Уверенно помнишь'},{icon:'refresh',value:nDue,label:'Пора повторить'},{icon:'target',value:nToday,suffix:`/ ${goal}`,label:'Слов сегодня'}])}
      <section><div class="section-heading"><h2>Твои юниты</h2><button class="text-link" data-view="dictionary">Весь словарь ${icon('arrow')}</button></div><div class="units-grid">${[1,2,3].map(u=>{const all=WORDS.filter(w=>w.unit===u),count=all.filter(learned).length;return `<button class="unit-card" data-action="open-unit" data-unit="${u}"><div class="unit-top"><span class="unit-icon">${icon(units[u].icon)}</span><span class="unit-index">UNIT 0${u}</span></div><h3>${units[u].title}</h3><p>${units[u].ru}</p><div class="unit-progress-head"><span>${count} из ${all.length} слов освоено</span><span>${Math.round(count/all.length*100)}%</span></div><div class="progress-track"><div class="progress-fill" style="width:${count/all.length*100}%"></div></div><div class="unit-footer"><span>Открыть карточки <span class="separator-dot">·</span> стр. ${units[u].pages}</span>${icon('arrow-up-right')}</div></button>`}).join('')}</div></section>
      <div class="bottom-grid"><section class="plan-panel"><div class="section-heading"><h3>${icon('target')} План на сегодня</h3><button class="text-link" data-action="settings">Изменить</button></div><div class="plan-row"><span>Разобрать ${goal} разных слов</span><strong>${Math.min(nToday,goal)} / ${goal}</strong></div><div class="progress-track"><div class="progress-fill" style="width:${Math.min(nToday/goal*100,100)}%"></div></div><div class="plan-row"><span>${WORDS.filter(difficult).length?'Вернуться к сложным словам':'Проверить себя без подсказок'}</span><button class="text-link" data-action="${WORDS.filter(difficult).length?'practice-difficult':'open-quiz'}">${WORDS.filter(difficult).length?'Повторить':'Пройти тест'} ${icon('arrow')}</button></div></section><section class="tip-panel"><div class="tiny-tag">НЕ ПУТАЙ ЗНАЧЕНИЯ</div><p>Invaluable ≠ useless.</p><div class="tiny-note">Invaluable — «чрезвычайно ценный»,<br>а не «бесполезный». Такие нюансы есть в карточках.</div></section></div>`;
  }
  function poolWords(pool=state.settings.pool,unit=state.settings.unit){return WORDS.filter(w=>(!unit||w.unit===unit)&&({all:true,priority:w.priority,due:due(w),difficult:difficult(w),bookmarks:state.bookmarks.includes(w.id)})[pool])}
  function selectOptions(values,selected){return values.map(([value,label])=>`<option value="${value}"${String(selected)===String(value)?' selected':''}>${label}</option>`).join('')}
  function renderSetup(){
    const m=modes[view],count=poolWords().length;
    return header('РЕЖИМ ПРАКТИКИ',m.title,m.subtitle)+unitChips()+`
      <section class="setup-panel"><div class="setup-fields"><div><label for="pool-select">Что будем учить?</label><select id="pool-select" class="select" data-setting="pool">${selectOptions([['all','Все слова'],['priority','В первую очередь ★'],['due','Пора повторить'],['difficult','Мои сложные слова'],['bookmarks','Сохранённые слова']],state.settings.pool)}</select></div><div><label for="direction-select">Направление</label><select id="direction-select" class="select" data-setting="direction">${selectOptions([['en-ru','English → Русский'],['ru-en','Русский → English'],['mixed','Вперемешку ↔']],state.settings.direction)}</select></div><div><label for="length-select">Длина сессии</label><select id="length-select" class="select" data-setting="length">${selectOptions([['10','10 слов'],['20','20 слов'],['all','Все выбранные']],state.settings.length)}</select></div></div><div class="setup-bottom"><span class="pool-count"><strong>${count}</strong> слов в подборке${count===0?' · попробуй другой фильтр':''}</span><button class="primary-button" data-action="start" ${count?'':'disabled'}>${icon(m.icon)} ${view==='quiz'?'Начать тест':'Начать практику'} ${icon('arrow')}</button></div></section>
      <div class="mode-preview"><div><h2>${m.intro.split('\n').map(esc).join('<br>')}</h2><p>${m.description}</p></div><div class="preview-word"><span class="tiny-tag">${view==='typing'?'ВСПОМНИ АНГЛИЙСКОЕ СЛОВО':'СЛОВО ИЗ UNIT 03'}</span><strong>${view==='typing'?'предприниматель':'entrepreneur'}</strong><p>${view==='typing'?'e _ _ _ _ _ _ _ _ _ _ _':view==='quiz'?'Как переводится это слово?':'предприниматель'}</p></div></div><p class="priority-note">${icon('info')} ★ — приоритетная подборка по текстам и упражнениям, а не обещание конкретных вопросов преподавателя. Переводы и примеры подготовлены для тренировки.</p>`;
  }
  function startSession(customIds=null,mode=view){
    let selected=customIds?customIds.map(id=>byId.get(id)).filter(Boolean):poolWords();
    if(!selected.length){toast('В подборке пока нет слов. Выбери другой фильтр.');return}
    if(session&&session.cursor<session.queue.length&&!confirm('Начать новую сессию вместо текущей? Уже сохранённый прогресс останется.'))return;
    selected=shuffled(selected);
    if(!customIds&&state.settings.length!=='all')selected=selected.slice(0,Number(state.settings.length));
    session={mode,baseIds:selected.map(w=>w.id),queue:selected.map(w=>w.id),cursor:0,direction:state.settings.direction,questionDirection:null,optionIds:[],answered:false,correct:null,typed:'',selectedId:null,flipped:false,history:[],mistakes:[],started:Date.now()};
    prepareQuestion();saveSession();setView(mode);
  }
  function currentWord(){return session?byId.get(session.queue[session.cursor]):null}
  function getAnswers(w,direction){return (direction==='ru-en'?[w.en,...w.aliases]:w.ru).map(normalize)}
  function checkAnswer(w,answer,direction){const n=normalize(answer);if(!n)return false;return getAnswers(w,direction).includes(n)}
  function labelFor(w,direction){return direction==='en-ru'?w.ru.slice(0,2).join(' / '):w.en}
  function makeOptions(w,direction){
    const answers=new Set(getAnswers(w,direction));
    const promptAlternatives=new Set(getAnswers(w,direction==='en-ru'?'ru-en':'en-ru'));
    const allowed=x=>x.id!==w.id&&!getAnswers(x,direction).some(a=>answers.has(a))&&!getAnswers(x,direction==='en-ru'?'ru-en':'en-ru').some(a=>promptAlternatives.has(a));
    const candidates=[...shuffled(WORDS.filter(x=>x.unit===w.unit&&allowed(x))),...shuffled(WORDS.filter(x=>x.unit!==w.unit&&allowed(x)))];
    const labels=new Set([normalize(labelFor(w,direction))]);const choices=[];
    for(const x of candidates){const label=normalize(labelFor(x,direction));if(labels.has(label))continue;labels.add(label);choices.push(x.id);if(choices.length===3)break}
    return shuffled([w.id,...choices]);
  }
  function prepareQuestion(){
    if(!session||session.cursor>=session.queue.length)return;
    session.answered=false;session.correct=null;session.selectedId=null;session.typed='';session.flipped=false;
    session.questionDirection=session.direction==='mixed'?(Math.random()<.5?'en-ru':'ru-en'):session.direction;
    session.optionIds=session.mode==='quiz'?makeOptions(currentWord(),session.questionDirection):[];
  }
  function register(w,correct){
    const p=progress(w);const streak=correct?Math.min(p.streak+1,50):0;
    const interval=correct?([1,3,7,14,30][Math.min(streak-1,4)]*DAY):600000;
    state.words[w.id]={seen:p.seen+1,correct:p.correct+(correct?1:0),wrong:p.wrong+(correct?0:1),streak,due:Date.now()+interval,last:Date.now()};
    const key=dayKey(),d=today();d.attempts++;if(correct)d.correct++;if(!d.ids.includes(w.id))d.ids.push(w.id);state.daily[key]=d;
    save();
  }
  function grade(correct,typed=''){
    if(!session||session.answered||session.cursor>=session.queue.length)return;
    const w=currentWord();session.answered=true;session.correct=correct;session.typed=typed;
    register(w,correct);session.history.push({id:w.id,correct});
    if(!correct){
      if(!session.mistakes.includes(w.id))session.mistakes.push(w.id);
      // A missed word returns after up to three other cards, at most twice per session.
      const occurrences=session.queue.filter(id=>id===w.id).length;
      if(occurrences<3)session.queue.splice(Math.min(session.cursor+4,session.queue.length),0,w.id);
    }
    saveSession();
    if(session.mode==='cards')nextQuestion();else render();
  }
  function nextQuestion(){if(!session||!session.answered)return;session.cursor++;prepareQuestion();saveSession();render();window.scrollTo({top:0,behavior:'instant'})}
  function tags(w){return `<div class="card-tags"><span class="tag">UNIT 0${w.unit} · стр. ${w.page}</span>${w.priority?`<span class="tag priority">${icon('star')} Важно</span>`:''}</div>`}
  function bookmarkButton(w){const saved=state.bookmarks.includes(w.id);return `<button class="icon-button bookmark ${saved?'saved':''}" data-action="bookmark" data-id="${w.id}" aria-label="${saved?'Убрать из сохранённых':'Сохранить слово'}" aria-pressed="${saved}" title="${saved?'Убрать из сохранённых':'Сохранить слово'}">${icon('bookmark')}</button>`}
  function soundButton(w,small=false){return `<button class="${small?'icon-button':'card-sound'}" data-action="speak" data-id="${w.id}" aria-label="Произнести ${esc(w.en)}" title="Произнести по-английски">${icon('volume')}${small?'':'Послушать'}</button>`}
  function example(w){return `<div class="example-panel"><div class="example-label">ПРИМЕР ДЛЯ ЗАПОМИНАНИЯ</div><p>${esc(w.example)}</p><p>${esc(w.exampleRu)}</p>${w.note?`<div class="word-note">${esc(w.note)}</div>`:''}</div>`}
  function renderSession(){
    if(session.cursor>=session.queue.length)return renderResult();
    if(!session.questionDirection)prepareQuestion();
    const w=currentWord(),total=session.queue.length,answered=session.history.length;
    const prompt=session.questionDirection==='en-ru'?w.en:w.ru.slice(0,2).join(' / ');
    const answer=labelFor(w,session.questionDirection);
    let html=`<div class="study-container"><div class="study-header"><button class="ghost-button" data-action="session-back">${icon('back')} К подборке</button><span class="session-label">${esc(modes[session.mode].title.toUpperCase())}</span><span class="study-info"><strong>${session.cursor+1}</strong> / ${total}</span></div><div class="progress-track session-progress"><div class="progress-fill" style="width:${answered/total*100}%"></div></div>`;
    if(session.mode==='cards'){
      html+=`<article class="flash-card ${session.flipped?'flipped':''}" data-action="flip" aria-label="Карточка слова"><div class="card-top">${tags(w)}${bookmarkButton(w)}</div><h2>${esc(session.flipped?answer:prompt)}</h2><div class="card-lang">${session.flipped?'ПРОВЕРЬ СЕБЯ':session.questionDirection==='en-ru'?'ВСПОМНИ ПЕРЕВОД':'КАК ЭТО ПО-АНГЛИЙСКИ?'}</div>${session.flipped||session.questionDirection==='en-ru'?soundButton(w):''}<div class="card-flip-hint">${icon('refresh')} ${session.flipped?esc(prompt):'Нажми на карточку, чтобы перевернуть'}</div></article>`;
      if(session.flipped)html+=example(w)+`<div class="study-actions"><button class="rate-button again" data-action="rate-again">${icon('refresh')} Ещё повторить <small>1</small></button><button class="rate-button know" data-action="rate-know">${icon('check')} Помню <small>2</small></button></div>`;
      else html+='<button class="primary-button reveal-button" data-action="flip">Показать перевод</button>';
      html+='<div class="keyboard-hint"><kbd>Пробел</kbd> перевернуть <span class="separator-dot">·</span> <kbd>1</kbd> повторить <span class="separator-dot">·</span> <kbd>2</kbd> помню</div>';
    }else{
      html+=`<section class="question-panel"><div class="question-meta">${tags(w)}${bookmarkButton(w)}</div><p class="question-instruction">${session.mode==='typing'?'Напиши перевод':'Выбери перевод'} ${session.questionDirection==='en-ru'?'на русский':'на английский'}</p><h2>${esc(prompt)}</h2>${session.questionDirection==='en-ru'?soundButton(w):''}`;
      if(session.mode==='typing')html+=`<form class="typing-form" id="typing-form"><label for="answer-input" class="typing-label">${session.questionDirection==='en-ru'?'Достаточно одного из значений слова':'Английское слово или выражение'}</label><input id="answer-input" class="answer-input" autocomplete="off" spellcheck="false" autocapitalize="none" maxlength="180" lang="${session.questionDirection==='en-ru'?'ru':'en'}" placeholder="${session.questionDirection==='en-ru'?'Твой перевод…':'Type your answer…'}" value="${esc(session.typed)}" ${session.answered?'disabled':''}><div class="typing-buttons"><button type="button" class="ghost-button" data-action="skip" ${session.answered?'disabled':''}>Не помню</button><button type="submit" class="primary-button" ${session.answered?'disabled':''}>Проверить ${icon('arrow')}</button></div></form>`;
      html+='</section>';
      if(session.mode==='quiz')html+=`<div class="options" aria-label="Варианты ответа">${session.optionIds.map((id,i)=>{const correct=session.answered&&id===w.id,wrong=session.answered&&session.selectedId===id&&id!==w.id;return `<button class="option ${correct?'correct':''} ${wrong?'wrong':''}" data-action="option" data-id="${id}" ${session.answered?'disabled':''}><span class="option-key">${correct?'✓':wrong?'×':i+1}</span><span>${esc(labelFor(byId.get(id),session.questionDirection))}</span></button>`}).join('')}</div>`;
      if(session.answered)html+=`<div class="feedback ${session.correct?'':'incorrect'}" role="status"><div class="feedback-heading">${icon(session.correct?'check':'refresh')}${session.correct?'Верно. Отличная работа!':'Ничего страшного — закрепим.'}</div><p><strong>${esc(w.en)}</strong> — ${esc(w.ru.join('; '))}</p>${!session.correct?`<p class="feedback-note">${session.mode==='typing'?'Проверка принимает переводы из карточки, а не любые возможные синонимы. ':''}${session.queue.slice(session.cursor+1).includes(w.id)?'Это слово ещё вернётся в сессии.':'Вернись к этому слову после сессии.'}</p>`:''}${example(w)}<div class="feedback-bottom">${soundButton(w)}<button class="primary-button" data-action="next">${session.cursor+1>=session.queue.length?'Результат':'Дальше'} ${icon('arrow')}</button></div></div>`;
      else if(session.mode==='quiz')html+='<div class="keyboard-hint"><kbd>1</kbd> — <kbd>4</kbd> выбрать ответ <span class="separator-dot">·</span> <kbd>Enter</kbd> дальше</div>';
    }
    html+=`<p class="priority-note">${icon('info')} ${session.baseIds.length} разных слов в сессии. Ошибки добавляют до двух повторов. Прогресс сохраняется после каждого ответа.</p></div>`;
    return html;
  }
  function renderResult(){
    const good=session.history.filter(x=>x.correct).length,total=session.history.length,accuracy=total?Math.round(good/total*100):0;
    return `<div class="study-container"><div class="result-hero"><div class="result-icon">${icon('trophy')}</div><div class="eyebrow">ЕЩЁ ОДИН ШАГ ВПЕРЁД</div><h1>${accuracy>=80?'Это было здорово.':'Хорошая практика.'}</h1><p>Ты разобрал ${session.baseIds.length} разных слов. ${session.mistakes.length?'Теперь знаешь, на чём сосредоточиться.':'Все ответы в этой сессии верные.'}</p><div class="result-metrics"><div><strong>${accuracy}%</strong><span>верных ответов</span></div><div><strong>${good} / ${total}</strong><span>включая повторы</span></div><div><strong>${session.baseIds.length}</strong><span>разных слов</span></div></div></div><div class="result-actions">${session.mistakes.length?`<button class="primary-button" data-action="retry-mistakes">${icon('refresh')} Повторить ошибки (${session.mistakes.length})</button>`:'<button class="primary-button" data-action="new-session">Следующая подборка</button>'}<button class="secondary-button" data-action="finish">На главную ${icon('arrow')}</button></div>${session.mistakes.length?`<section class="mistakes-list"><div class="section-heading"><h3>Слова, которым нужно ещё немного внимания</h3></div><div class="word-list">${session.mistakes.map(id=>{const w=byId.get(id);return `<div class="mistake-row"><div><strong>${esc(w.en)}</strong><small>${esc(w.ru.join('; '))}</small></div>${soundButton(w,true)}</div>`}).join('')}</div></section>`:''}<p class="stats-help">В карточках результат основан на твоей самооценке. «Уверенно помнишь» — три успешных ответа подряд; это ориентир для тренировки, а не оценка преподавателя.</p></div>`;
  }
  function status(w){return learned(w)?['Уверенно','learned']:progress(w).seen?['Учу','']:['Новое','']}
  function dictionaryWords(){const q=normalize(dictionaryQuery);return WORDS.filter(w=>(!state.settings.unit||w.unit===state.settings.unit)&&(!q||normalize(w.en+' '+w.ru.join(' ')+' '+w.aliases.join(' ')).includes(q))&&({all:true,priority:w.priority,bookmarks:state.bookmarks.includes(w.id),difficult:difficult(w),learned:learned(w),new:progress(w).seen===0})[dictionaryFilter])}
  function wordRows(words){return words.length?`<div class="word-list">${words.map(w=>{const s=status(w);return `<div class="word-row"><button class="word-open" data-action="word-detail" data-id="${w.id}" aria-expanded="${dictionaryExpanded===w.id}"><span class="word-en">${esc(w.en)}${w.priority?'<span class="priority-dot" title="Приоритетное слово"></span>':''}</span><span class="word-sub">Unit 0${w.unit} · стр. ${w.page} · ${{n:'существительное',v:'глагол',adj:'прилагательное',adv:'наречие',phrase:'выражение','v/n':'глагол / сущ.','n/adj':'сущ. / прил.'}[w.pos]||''}</span></button><div class="word-ru">${esc(w.ru.join('; '))}</div><span class="level-tag ${s[1]}">${s[0]}</span><div class="word-actions">${soundButton(w,true)}${bookmarkButton(w)}</div></div>${dictionaryExpanded===w.id?`<div class="word-detail">${example(w)}<button class="primary-button" data-action="practice-word" data-id="${w.id}">Потренировать слово ${icon('arrow')}</button></div>`:''}`}).join('')}</div>`:`<div class="empty-state">${icon('search')}<h3>Пока ничего не нашлось</h3><p>Попробуй другой запрос, юнит или фильтр. Слова можно искать и на английском, и на русском.</p><button class="secondary-button" data-action="clear-search">Сбросить поиск</button></div>`}
  function renderDictionary(){const words=dictionaryWords();return header('ЛИЧНАЯ БИБЛИОТЕКА','Каждое слово — под рукой.','Нажми на слово, чтобы увидеть пример и подсказку.')+unitChips()+`<div class="dictionary-toolbar"><div class="search-wrap">${icon('search')}<input id="dictionary-search" class="search-input" type="search" placeholder="Найти слово или перевод…" aria-label="Поиск по словарю" value="${esc(dictionaryQuery)}"></div><select class="select" id="dictionary-filter" aria-label="Фильтр словаря">${selectOptions([['all','Все слова'],['priority','В первую очередь ★'],['bookmarks','Сохранённые'],['difficult','Сложные'],['learned','Уверенно помню'],['new','Новые']],dictionaryFilter)}</select></div><div class="dictionary-count" id="dictionary-count">Найдено: ${words.length} <span class="separator-dot">·</span> всего в курсе ${WORDS.length}</div><div id="dictionary-results">${wordRows(words)}</div><p class="priority-note">${icon('info')} Указаны печатные страницы учебника, не номера страниц PDF. Слова из текстов и упражнений Units 1–3; некоторые формы получены в заданиях на словообразование.</p>`}
  function updateDictionary(){const words=dictionaryWords();document.getElementById('dictionary-count').textContent=`Найдено: ${words.length} · всего в курсе ${WORDS.length}`;document.getElementById('dictionary-results').innerHTML=wordRows(words)}
  function renderStats(){
    const total=Object.values(state.daily).reduce((s,d)=>s+d.attempts,0),good=Object.values(state.daily).reduce((s,d)=>s+d.correct,0),acc=total?Math.round(good/total*100):0;
    const days=Array.from({length:7},(_,i)=>{const date=new Date();date.setDate(date.getDate()-(6-i));return{key:dayKey(date),label:date.toLocaleDateString('ru',{weekday:'short'}),value:(state.daily[dayKey(date)]?.ids||[]).length}}),max=Math.max(...days.map(d=>d.value),state.settings.goal,1);
    return header('ТВОЙ РИТМ','Маленькие шаги видны.','Не сравнивай себя с другими. Просто продолжай.')+metrics([{icon:'book',value:WORDS.filter(learned).length,label:'Уверенно помнишь'},{icon:'check-square',value:total,label:'Ответов за всё время'},{icon:'fire',value:streakDays(),suffix:'дн.',label:'Текущая серия'}])+`<div class="stats-grid"><section class="panel"><h2>Последние 7 дней</h2><div class="weekly-chart" role="img" aria-label="Разных слов в день: ${days.map(d=>`${d.key}: ${d.value}`).join('; ')}">${days.map(d=>`<div class="day-bar ${d.key===dayKey()?'today':''}"><span class="day-value">${d.value}</span><div class="bar-fill" style="height:${Math.max(3,d.value/max*105)}px"></div><span>${esc(d.label)}</span></div>`).join('')}</div><p class="stats-help">Количество разных слов, на которые ты ответил за день. Повторы не увеличивают дневную цель.</p></section><section class="panel"><h2>Точность ответов</h2><div class="accuracy-ring" style="--value:${acc}%"><span>${total?acc+'%':'—'}</span></div><p class="stats-help">${total?`${good} верных из ${total} ответов.`:'Начни первую сессию — здесь появится результат.'} Включает тесты, написание и самооценку в карточках.</p></section><section class="panel"><h2>Прогресс по юнитам</h2>${[1,2,3].map(u=>{const all=WORDS.filter(w=>w.unit===u),known=all.filter(learned).length;return `<div class="stat-unit"><div class="stat-unit-label"><span>Unit 0${u}</span><strong>${known} / ${all.length}</strong></div><div class="progress-track"><div class="progress-fill" style="width:${known/all.length*100}%"></div></div></div>`}).join('')}</section><section class="panel"><h2>Как работает повторение</h2><p class="stats-help">Верный ответ переносит повтор на 1, 3, 7, 14, затем 30 дней. Ошибка возвращает слово через 10 минут и добавляет повтор в текущую сессию.</p><p class="stats-help">После трёх правильных ответов подряд слово отмечается как «Уверенно». Повторять его всё равно полезно.</p><button class="text-link" data-action="practice-due">Перейти к повторению ${icon('arrow')}</button></section></div>`;
  }
  function speak(id){
    const w=byId.get(id);if(!w)return;
    if(!('speechSynthesis' in window)||!('SpeechSynthesisUtterance' in window)){toast('Озвучивание недоступно в этом браузере.');return}
    try{
      const voices=speechSynthesis.getVoices(),voice=voices.find(v=>/^en-GB$/i.test(v.lang))||voices.find(v=>/^en[-_]/i.test(v.lang));
      if(voices.length&&!voice){toast('На устройстве нет английского голоса. Добавь его в настройках речи.');return}
      speechSynthesis.cancel();const utterance=new SpeechSynthesisUtterance(w.en);utterance.lang='en-GB';utterance.rate=.85;if(voice)utterance.voice=voice;
      utterance.onerror=e=>{if(!['interrupted','canceled'].includes(e.error))toast('Не удалось воспроизвести звук. Проверь английский голос и настройки браузера.')};
      speechSynthesis.speak(utterance);
    }catch(e){toast('Озвучивание сейчас недоступно. Остальные режимы работают.');}
  }
  if('speechSynthesis' in window){speechSynthesis.getVoices();speechSynthesis.addEventListener?.('voiceschanged',()=>speechSynthesis.getVoices())}
  function toggleBookmark(id){if(!byId.has(id))return;const added=!state.bookmarks.includes(id);state.bookmarks=added?[...state.bookmarks,id]:state.bookmarks.filter(x=>x!==id);save();if(view==='dictionary')updateDictionary();else{document.querySelectorAll(`[data-action="bookmark"][data-id="${id}"]`).forEach(b=>{b.classList.toggle('saved',added);b.setAttribute('aria-pressed',String(added));b.setAttribute('aria-label',added?'Убрать из сохранённых':'Сохранить слово');b.title=added?'Убрать из сохранённых':'Сохранить слово'})}toast(added?'Слово сохранено в твою подборку.':'Слово убрано из сохранённых.')}
  function openSettings(){
    const dialog=document.getElementById('settings-dialog');dialog.className='settings-dialog';dialog.innerHTML=`<div class="dialog-header"><h2 id="settings-title">Твоё пространство</h2><button class="icon-button" data-action="close-settings" aria-label="Закрыть настройки">${icon('close')}</button></div><div class="dialog-group"><h3>Дневная цель</h3><p>Считаем разные слова, а не количество повторов.</p><label for="goal-select" class="hidden">Слов в день</label><select id="goal-select" class="select">${selectOptions([[10,'10 слов — лёгкий темп'],[20,'20 слов — привычный темп'],[30,'30 слов — уверенный темп'],[50,'50 слов — интенсивный темп']],state.settings.goal)}</select></div><div class="dialog-group"><h3>Твой прогресс</h3><p>Слова, закладки и статистика сохраняются только в этом браузере. Между устройствами они не синхронизируются. Для переноса или резервной копии сохрани JSON.</p><div class="dialog-buttons"><button class="secondary-button" data-action="export">${icon('download')} Экспорт</button><button class="secondary-button" data-action="import">${icon('upload')} Импорт</button></div></div><div class="dialog-group"><h3>Полезное</h3><div class="dialog-buttons"><button class="secondary-button" data-view="stats" data-action="close-settings">${icon('chart')} Мой прогресс</button><button class="secondary-button" data-action="theme">${icon('moon')} Сменить тему</button></div></div><div class="dialog-group"><h3>О словаре</h3><p>Независимый тренажёр по подборке лексики Cambridge Academic English, Intermediate, Units 1–3 (стр. 14–37, 42–53). Не официальный продукт Cambridge. В нём нет сканов учебника; переводы, примеры и подсказки — учебные дополнения. Приоритет ★ не предсказывает вопросы преподавателя.</p><p>Озвучивание использует голос браузера/устройства: голос может требовать интернет. Сам тренажёр не отправляет прогресс на сервер. Написание проверяется по вариантам карточки, без ИИ.</p></div><div class="dialog-group"><button class="ghost-button danger-button" data-action="reset">Удалить весь прогресс</button></div>`;
    dialog.showModal();
  }
  function exportData(){const data={...state,exportedAt:new Date().toISOString(),app:'Lexi Academic'};const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`lexi-progress-${dayKey()}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);toast('Резервная копия прогресса готова.')}
  function practicePool(pool,mode='cards'){state.settings.pool=pool;state.settings.unit=0;save();if(session&&session.cursor<session.queue.length){setView(mode);toast('У тебя есть незавершённая сессия. Можно закончить её или вернуться к подборке.');return}session=null;saveSession();setView(mode)}
  document.addEventListener('click',event=>{
    const target=event.target.closest('[data-action], [data-view]');if(!target||target.disabled)return;
    const action=target.dataset.action,id=target.dataset.id;
    if(target.dataset.view){document.getElementById('settings-dialog').close();setView(target.dataset.view);return}
    if(action==='theme'){const next=document.documentElement.dataset.theme==='dark'?'light':'dark';document.documentElement.dataset.theme=next;try{localStorage.setItem('lexi-theme',next)}catch(e){}updateChrome()}
    else if(action==='settings')openSettings();
    else if(action==='close-settings')document.getElementById('settings-dialog').close();
    else if(action==='unit'){state.settings.unit=Number(target.dataset.unit);save();render()}
    else if(action==='open-unit'){state.settings.unit=Number(target.dataset.unit);state.settings.pool='all';save();if(session?.cursor>=session?.queue.length){session=null;saveSession()}setView('cards');if(session)toast('Продолжи текущую сессию или нажми «К подборке», чтобы выбрать новый юнит.')}
    else if(action==='quick-start'){state.settings.unit=0;state.settings.pool='priority';state.settings.length='20';save();startSession(null,'cards')}
    else if(action==='resume'){setView(session?.mode||'cards')}
    else if(action==='start')startSession();
    else if(action==='session-back'){if(confirm('Выйти из текущей сессии? Прогресс ответов сохранён, но очередь сессии будет сброшена.')){session=null;saveSession();render()}}
    else if(action==='flip'){if(session?.mode==='cards'){session.flipped=!session.flipped;saveSession();render()}}
    else if(action==='rate-again'&&session?.flipped)grade(false);
    else if(action==='rate-know'&&session?.flipped)grade(true);
    else if(action==='option'&&session&&!session.answered){session.selectedId=id;grade(id===currentWord().id)}
    else if(action==='skip')grade(false,'');
    else if(action==='next')nextQuestion();
    else if(action==='bookmark')toggleBookmark(id);
    else if(action==='speak')speak(id);
    else if(action==='finish'){session=null;saveSession();setView('home')}
    else if(action==='new-session'){session=null;saveSession();render()}
    else if(action==='retry-mistakes'){const ids=[...session.mistakes],mode=session.mode;session=null;startSession(ids,mode)}
    else if(action==='open-quiz'){if(session?.cursor>=session?.queue.length){session=null;saveSession()}setView('quiz')}
    else if(action==='practice-difficult')practicePool('difficult');
    else if(action==='practice-due')practicePool('due');
    else if(action==='clear-search'){dictionaryQuery='';dictionaryFilter='all';state.settings.unit=0;save();render()}
    else if(action==='word-detail'){dictionaryExpanded=dictionaryExpanded===id?null:id;updateDictionary()}
    else if(action==='practice-word')startSession([id],'cards');
    else if(action==='export')exportData();
    else if(action==='import')document.getElementById('import-file').click();
    else if(action==='reset'){if(confirm('Удалить весь прогресс, статистику и закладки? Сначала можно сделать экспорт.')){state=freshState();session=null;save();saveSession();document.getElementById('settings-dialog').close();setView('home');toast('Прогресс сброшен. Начнём с чистого листа.')}}
  });
  document.addEventListener('change',event=>{
    const el=event.target;
    if(el.dataset.setting){state.settings[el.dataset.setting]=el.value;save();render()}
    if(el.id==='dictionary-filter'){dictionaryFilter=el.value;updateDictionary()}
    if(el.id==='goal-select'){state.settings.goal=Number(el.value);save();render();toast('Дневная цель обновлена.')}
  });
  document.addEventListener('input',event=>{if(event.target.id==='dictionary-search'){dictionaryQuery=event.target.value;updateDictionary()}});
  document.addEventListener('submit',event=>{if(event.target.id!=='typing-form')return;event.preventDefault();if(!session||session.answered)return;const value=document.getElementById('answer-input').value.trim();if(!value){toast('Напиши перевод или нажми «Не помню».');return}grade(checkAnswer(currentWord(),value,session.questionDirection),value)});
  document.getElementById('import-file').addEventListener('change',async event=>{
    const file=event.target.files[0];if(!file)return;
    try{if(file.size>3000000)throw new Error('Файл слишком большой. Нужен JSON-экспорт Lexi до 3 МБ.');const clean=validatedState(JSON.parse(await file.text()));if(!confirm('Импорт заменит текущий прогресс. Продолжить?'))return;state=clean;session=null;storageOk=save();saveSession();document.getElementById('settings-dialog').close();render();toast('Прогресс успешно восстановлен.')}catch(e){toast(e instanceof SyntaxError?'Не удалось прочитать JSON. Выбери файл экспорта Lexi.':e.message)}finally{event.target.value=''}
  });
  document.addEventListener('keydown',event=>{
    if(event.repeat||event.altKey||event.ctrlKey||event.metaKey||document.getElementById('settings-dialog').open)return;
    if(['INPUT','TEXTAREA','SELECT','BUTTON','A'].includes(event.target.tagName))return;
    if(!session||session.mode!==view||session.cursor>=session.queue.length)return;
    if(session.mode==='cards'){
      if(event.code==='Space'){event.preventDefault();session.flipped=!session.flipped;saveSession();render()}
      else if(session.flipped&&['1','2'].includes(event.key)){event.preventDefault();grade(event.key==='2')}
    }else if(event.key==='Enter'&&session.answered){event.preventDefault();nextQuestion()}
    else if(session.mode==='quiz'&&!session.answered&&/^[1-4]$/.test(event.key)){event.preventDefault();const id=session.optionIds[Number(event.key)-1];if(id){session.selectedId=id;grade(id===currentWord().id)}}
  });
  document.getElementById('settings-dialog').addEventListener('click',event=>{if(event.target===event.currentTarget){const r=event.currentTarget.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)event.currentTarget.close()}});
  window.addEventListener('hashchange',()=>{const hash=location.hash.slice(1);if(['home','cards','quiz','typing','dictionary','stats'].includes(hash)){view=hash;render()}});
  // Exposed pure helpers make data validation and answer checking reproducibly testable.
  window.LexiCore=Object.freeze({normalize,checkAnswer,validatedState,makeOptions,dayKey,wordCount:WORDS.length});
  render();
})();
