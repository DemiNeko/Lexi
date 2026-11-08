/* Reading vocabulary on the overview; training and progress stay owned by app.js. */
(() => {
  'use strict';
  // Editorial selections from the existing reading corpus, not inferred CEFR levels
  // or the learner's personal error history.
  const picks = {
    3: {
      key: ['recession','inflation','unemployment','economic recovery','financial crisis','labour market','income','stock market','decline','percentage point','workforce','career prospects'],
      hard: ['entrepreneur','deflation','foothold','apprenticeship','prolonged','productive capacity','capital formation','Gross National Product','smooth transition','prosperous','stock market crash','school-leaver']
    },
    4: {
      key: ['digital divide','intellectual property','information overload','privacy','Internet access','search engine','customer loyalty','confidentiality','target market','information technology (IT)','global reach','personal information'],
      hard: ['paradigm shift','unprecedented','dehumanization','surveillance device','cutting-edge technologies','interpersonal exchange','excess capacity','price-sensitive','law enforcement','information-poor','information-rich','misuse']
    },
    5: {
      key: ['budget','microfinance','interest rate','borrower','poverty line','standard of living','financial consequences','sustainable','economic independence','basic needs','savings scheme','credit union'],
      hard: ['chronic deprivation','non-governmental agency','Microfinance Institution','sample survey','capability','adequate','analogous','forthcoming','staffing','fulfil','get underway','extreme poverty']
    }
  };
  let context, query='', filter='all', unit=0;
  const expanded = new Set();
  const kind = (word, u) => picks[u].key.includes(word.en) ? 'key' : picks[u].hard.includes(word.en) ? 'hard' : '';
  function wordsFor(u) {
    const {WORDS,inUnit,normalize}=context, q=normalize(query);
    const p=picks[u], order=[...p.key.slice(0,4),...p.hard.slice(0,4),...p.key.slice(4),...p.hard.slice(4)];
    const rank=w=>{const i=order.indexOf(w.en);return i<0?999:i};
    return WORDS.filter(w=>inUnit(w,u)&&(filter==='all'||kind(w,u)===filter)&&
      (!q||normalize([w.en,...w.ru,...w.kk,...w.aliases].join(' ')).includes(q)))
      .sort((a,b)=>rank(a)-rank(b)||a.en.localeCompare(b.en,'en'));
  }
  const visibleUnits=()=>[3,4,5].filter(u=>!unit||u===unit);
  const count=()=>new Set(visibleUnits().flatMap(u=>wordsFor(u).map(w=>w.id))).size;
  function wordCard(w,u) {
    const {t,esc,language,translations,soundButton,bookmarkButton,example,locationLabel,icon}=context;
    const label=kind(w,u)==='key'?t('Ключевое'):kind(w,u)==='hard'?t('Трудная лексика'):t('Из текста');
    return '<article class="home-word" data-word-id="'+w.id+'"><div class="home-word-top"><div><span class="home-word-label">'+label+
      '</span><h3 lang="en">'+esc(w.en)+'</h3></div><div class="word-actions">'+soundButton(w,true)+bookmarkButton(w)+
      '</div></div><p class="home-translation" lang="'+language()+'">'+esc(translations(w).join('; '))+
      '</p><details class="home-example"><summary>'+t('Пример и источник')+'</summary>'+example(w)+
      '<p class="home-source">'+esc(locationLabel(w))+'</p><button class="text-link" data-action="practice-word" data-id="'+w.id+'">'+
      t('Потренировать слово')+' '+icon('arrow')+'</button></details></article>';
  }
  function results() {
    const {t,esc,WORDS,inUnit,units,icon}=context;
    return visibleUnits().map(u=>{
      const all=WORDS.filter(w=>inUnit(w,u)), words=wordsFor(u);
      const isExpanded=expanded.has(u)||!!query.trim(), shown=isExpanded?words:words.slice(0,8);
      return '<section class="home-unit" data-home-unit="'+u+'" aria-labelledby="home-title-'+u+'">'+
        '<header class="home-unit-heading"><span class="home-unit-number">0'+u+'</span><div><span class="home-unit-kicker">'+t('Unit')+' '+u+
        ' · '+all.length+' '+t('слов и выражений')+'</span><h2 id="home-title-'+u+'">'+esc(units[u].title)+'</h2><p>'+esc(units[u].label)+
        '</p></div><button class="text-link" data-action="open-unit" data-unit="'+u+'">'+t('Практика')+' '+icon('arrow')+
        '</button></header><div class="home-word-grid" id="home-words-'+u+'">'+(shown.length?shown.map(w=>wordCard(w,u)).join(''):
        '<p class="home-empty">'+t('В этом юните ничего не найдено.')+'</p>')+'</div><footer class="home-unit-footer"><span>'+t('Показано:')+
        ' '+shown.length+' / '+words.length+'</span>'+(words.length>8&&!query.trim()?'<button class="text-link" data-home-action="expand" data-unit="'+u+
        '" aria-expanded="'+isExpanded+'" aria-controls="home-words-'+u+'">'+(isExpanded?t('Свернуть список'):t('Показать все слова'))+
        ' '+(isExpanded?'↑':icon('arrow'))+'</button>':'')+'</footer></section>';
    }).join('');
  }
  function update() {
    const root=document.getElementById('home-results');
    if(!root)return;
    root.innerHTML=results();
    document.getElementById('home-count').textContent=context.t('Найдено:')+' '+count();
  }
  function render(c) {
    context=c;
    const {t,esc,icon}=c;
    return '<section class="home-vocabulary" aria-label="'+t('Словарь Units 3–5')+'"><div class="home-tools"><div class="segmented" aria-label="'+t('Выбрать юнит')+'">'+
      [0,3,4,5].map(u=>'<button class="chip '+(unit===u?'active':'')+'" data-home-action="unit" data-unit="'+u+'" aria-pressed="'+(unit===u)+'">'+
      (u?t('Unit')+' 0'+u:t('Все юниты'))+'</button>').join('')+'</div><div class="dictionary-toolbar"><div class="search-wrap">'+icon('search')+
      '<input id="home-search" class="search-input" type="search" placeholder="'+t('Найти слово или перевод…')+'" aria-label="'+t('Поиск по словарю')+'" value="'+esc(query)+
      '"></div><select class="select" id="home-filter" aria-label="'+t('Фильтр словаря')+'">'+
      [['all',t('Все слова')],['key',t('Ключевые слова')],['hard',t('Трудная лексика')]].map(([v,label])=>'<option value="'+v+'"'+(v===filter?' selected':'')+'>'+label+'</option>').join('')+
      '</select></div><div class="home-search-meta"><p>'+t('Сначала — слова для понимания текстов и более сложные выражения.')+
      '</p><span id="home-count" role="status">'+t('Найдено:')+' '+count()+'</span></div></div><div id="home-results">'+results()+
      '</div><p class="priority-note">'+icon('info')+' '+t('Ключевые слова — основа темы. Трудная лексика — учебная подборка, а не оценка твоих ошибок.')+'</p></section>';
  }
  document.addEventListener('input',e=>{if(e.target.id==='home-search'){query=e.target.value;update()}});
  document.addEventListener('change',e=>{if(e.target.id==='home-filter'){filter=e.target.value;expanded.clear();update()}});
  document.addEventListener('click',e=>{
    const button=e.target.closest('[data-home-action]');
    if(!button)return;
    const u=Number(button.dataset.unit);
    if(button.dataset.homeAction==='unit'){
      unit=u;
      document.querySelectorAll('[data-home-action="unit"]').forEach(b=>{
        const active=Number(b.dataset.unit)===unit;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));
      });
      update();
    }else if(button.dataset.homeAction==='expand'){
      const collapse=expanded.has(u);
      if(collapse)expanded.delete(u);else expanded.add(u);
      update();
      const section=document.querySelector('[data-home-unit="'+u+'"]');
      section.querySelector('[data-home-action="expand"]').focus({preventScroll:true});
      if(collapse)section.scrollIntoView({block:'start'});
    }
  });
  window.LexiHome=Object.freeze({render});
})();
