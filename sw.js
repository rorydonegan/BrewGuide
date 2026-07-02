const icons={
  v60:'<svg viewBox="0 0 24 24"><path d="M5 5h14l-3.5 14h-7L5 5Z"/><path d="M8 9h8"/><path d="M10 13h4"/></svg>',
  aeropress:'<svg viewBox="0 0 24 24"><path d="M8 3h8v5H8z"/><path d="M9 8v10a3 3 0 0 0 6 0V8"/><path d="M7 21h10"/></svg>',
  clever:'<svg viewBox="0 0 24 24"><path d="M5 8h14l-2 10H7L5 8Z"/><path d="M8 5h8"/><path d="M7 18h10"/></svg>',
  chemex:'<svg viewBox="0 0 24 24"><path d="M8 3h8l-3 6 5 12H6l5-12-3-6Z"/><path d="M9 12h6"/></svg>',
  flair:'<svg viewBox="0 0 24 24"><path d="M12 3v18"/><path d="M6 7h12"/><path d="M8 21h8"/><path d="M9 11h6v6H9z"/></svg>',
  sage:'<svg viewBox="0 0 24 24"><rect x="5" y="4" width="14" height="16" rx="3"/><path d="M8 8h8"/><path d="M9 13h6"/><path d="M10 17h4"/></svg>',
  oxo:'<svg viewBox="0 0 24 24"><path d="M7 3h10l-1 18H8L7 3Z"/><path d="M8 8h8"/><path d="M10 12h4"/></svg>'
};
const methods={
  v60:{name:'V60',style:'Pour-over',ratio:16.7,temp:'93°C',grind:5.25,type:'Medium fine',micro:'0 (Centre)',quick:[250,300,340,500],steps:['Bloom with 3× coffee weight','Wait 45 seconds','Pour to 60% of total water','Finish pour to target weight','Target drawdown 2:45–3:15'],guided:[['Bloom','60g','Pour gently and saturate all grounds.'],['Wait','45s','Let the bloom finish before the next pour.'],['Pour','to 200g','Keep the stream gentle and centred.'],['Finish','to 340g','Finish the final pour and let it draw down.']]},
  aeropress:{name:'AeroPress',style:'Immersion',ratio:14,temp:'90°C',grind:5.00,type:'Medium fine',micro:'0 (Centre)',quick:[200,240,250,300],steps:['Add coffee and water','Stir or swirl gently','Steep 1:30–2:00','Press slowly for 20–30 seconds'],guided:[['Add water','Target weight','Start timer once water is in.'],['Steep','1:45','Agitate gently once.'],['Press','20–30s','Press steadily and stop at the hiss.']]},
  clever:{name:'Clever',style:'Immersion filter',ratio:16,temp:'94°C',grind:6.00,type:'Medium',micro:'0 (Centre)',quick:[250,300,400,500],steps:['Add water first, then coffee','Steep covered for 2:30–3:00','Stir gently','Place on cup and draw down'],guided:[['Water first','Target weight','Add water before coffee for cleaner drawdown.'],['Steep','3:00','Cover and wait.'],['Drain','≈1:00','Place on cup and let it drain.']]},
  chemex:{name:'Chemex',style:'Large pour-over',ratio:16.7,temp:'94°C',grind:7.50,type:'Medium coarse',micro:'0 (Centre)',quick:[500,600,750,1000],steps:['Bloom with 3× coffee weight','Pour in slow pulses','Keep the bed from drying out','Target 4:00–5:30 total'],guided:[['Bloom','3× dose','Saturate evenly.'],['Pulse pour','to 60%','Keep the bed moving gently.'],['Finish','target weight','Let it draw down fully.']]},
  flair:{name:'Flair Neo Flex',style:'Espresso',ratio:2.2,temp:'93°C',grind:1.00,type:'Espresso',micro:'0; use micro finer if needed',quick:[36,40,45,50],steps:['Use 1.00 for bottomless basket','Use around 2.50 for Flow-Control basket','Tamp level and preheat well','Aim for 30–45 seconds'],guided:[['Prep','Dose + tamp','Distribute evenly and tamp level.'],['Preheat','Brew chamber','Hotter is usually better.'],['Pull shot','30–45s','Adjust grind by flow and taste.']]},
  sage:{name:'Sage Precision',style:'Batch brewer',ratio:16.7,temp:'Gold',grind:6.75,type:'Medium',micro:'0 (Centre)',quick:[500,750,1000,1250],steps:['Use Gold/Auto mode as default','For 500g, try 6.25–6.50','For 1L+, try 6.75–7.25','Adjust by taste next brew'],guided:[['Load brewer','Coffee + water','Rinse filter if using paper.'],['Start','Gold mode','Let the machine handle the brew.'],['Taste','Adjust next time','Sour finer; bitter coarser.']]},
  oxo:{name:'OXO Rapid',style:'Cold brew',ratio:8,temp:'Cold',grind:9.50,type:'Coarse',micro:'0 (Centre)',quick:[300,500,750,1000],steps:['Use a coarse grind','Wet grounds evenly','Steep per OXO instructions','Dilute concentrate to taste'],guided:[['Grind coarse','Opus 9.50','Avoid fines where possible.'],['Wet grounds','Evenly','Make sure everything is saturated.'],['Steep','per OXO','Dilute finished concentrate to taste.']]}
};
let current='v60'; let guidedIndex=0;
const $=id=>document.getElementById(id);
function validGrind(n){ return Math.round(n*4)/4; }
function formatGrind(n){ return validGrind(n).toFixed(2); }
function classify(g){ if(g<=2) return 'Espresso'; if(g<5) return 'Fine'; if(g<6.25) return 'Medium fine'; if(g<7.25) return 'Medium'; if(g<8.5) return 'Medium coarse'; return 'Coarse'; }
function renderDial(){
  $('dialNumbers').innerHTML=Array.from({length:11},(_,i)=>`<span>${i+1}</span>`).join('');
}
function setThumb(g){
  const pct=((validGrind(g)-1)/10)*100;
  $('dialThumb').style.left=`${pct}%`;
  const base=Math.floor(validGrind(g));
  const qs=[0,.25,.5,.75,1].map(x=>base+x).filter(x=>x>=1&&x<=11).map(x=>Number.isInteger(x)?String(x):x.toFixed(2));
  $('quarterHint').textContent=qs.join(' · ');
}
function calculate(){
  const m=methods[current], liquid=Number($('liquidInput').value||0), coffee=liquid/m.ratio;
  $('coffeeOut').textContent=`${coffee.toFixed(1)}g`;
  $('waterOut').textContent=`${liquid.toFixed(0)}g`;
  $('ratioOut').textContent=`1:${m.ratio}`;
  $('tempOut').textContent=m.temp;
  $('grindValue').textContent=formatGrind(m.grind);
  $('grindType').textContent=m.type||classify(m.grind);
  $('microOut').textContent=m.micro;
  setThumb(m.grind);
  $('stepsOut').innerHTML=m.steps.map((s,i)=>`<div class="step"><div class="step-num">${i+1}</div><div><b>${s}</b><span>${i===0?'Start here. BrewGuide will guide you through the rest.':''}</span></div></div>`).join('');
  localStorage.setItem('brewguide-v04-last',JSON.stringify({current,liquid}));
}
function openRecipe(key){
  current=key; const m=methods[key];
  $('methodName').textContent=m.name; $('styleLabel').textContent=m.style; $('methodIcon').innerHTML=icons[key];
  $('quickAmounts').innerHTML=m.quick.map(q=>`<button class="chip" data-amount="${q}">${q}g</button>`).join('');
  $('quickAmounts').querySelectorAll('button').forEach(btn=>btn.addEventListener('click',()=>{ $('liquidInput').value=btn.dataset.amount; calculate(); markChips(); }));
  $('homeScreen').classList.remove('active'); $('recipeScreen').classList.add('active'); $('guidedScreen').classList.remove('active');
  $('backBtn').classList.add('show'); $('resetBtn').classList.add('show');
  calculate(); markChips();
}
function markChips(){ const val=String($('liquidInput').value); document.querySelectorAll('.chip').forEach(c=>c.classList.toggle('on',c.dataset.amount===val)); }
function goHome(){ $('homeScreen').classList.add('active'); $('recipeScreen').classList.remove('active'); $('guidedScreen').classList.remove('active'); $('backBtn').classList.remove('show'); $('resetBtn').classList.remove('show'); }
function renderHome(){
  $('methodGrid').innerHTML=Object.entries(methods).map(([key,m])=>`<button class="method" data-brew="${key}">${icons[key]}<strong>${m.name}</strong><span>Opus ${formatGrind(m.grind)} · ${m.type}</span></button>`).join('');
  document.querySelectorAll('[data-brew]').forEach(btn=>btn.addEventListener('click',()=>openRecipe(btn.dataset.brew)));
}
function startGuided(){ guidedIndex=0; $('recipeScreen').classList.remove('active'); $('guidedScreen').classList.add('active'); renderGuided(); }
function renderGuided(){ const steps=methods[current].guided; const s=steps[guidedIndex]; $('guidedTitle').textContent=s[0]; $('guidedBig').textContent=s[1]; $('guidedText').textContent=s[2]; $('guidedProgress').style.width=`${((guidedIndex+1)/steps.length)*100}%`; $('nextStep').textContent=guidedIndex===steps.length-1?'Finish brew':'Next step'; }
function nextGuided(){ if(guidedIndex < methods[current].guided.length-1){ guidedIndex++; renderGuided(); } else { $('guidedTitle').textContent='Done'; $('guidedBig').textContent='☕'; $('guidedText').textContent='Taste it. Next version will help log and dial it in.'; $('nextStep').textContent='Back to recipe'; $('nextStep').onclick=()=>openRecipe(current); } }
function saveFavourite(){ localStorage.setItem('brewguide-v04-fav',JSON.stringify({current,amount:$('liquidInput').value})); alert('Favourite saved on this phone.'); }
function resetAll(){ localStorage.removeItem('brewguide-v04-last'); localStorage.removeItem('brewguide-v04-fav'); location.reload(); }
window.addEventListener('load',()=>{
  renderDial(); renderHome();
  $('backBtn').addEventListener('click',goHome); $('resetBtn').addEventListener('click',resetAll); $('liquidInput').addEventListener('input',()=>{calculate();markChips()}); $('startGuided').addEventListener('click',startGuided); $('nextStep').addEventListener('click',nextGuided); $('saveFavourite').addEventListener('click',saveFavourite);
  const saved=JSON.parse(localStorage.getItem('brewguide-v04-last')||'null'); if(saved){ $('liquidInput').value=saved.liquid||340; current=saved.current||'v60'; }
});
if('serviceWorker' in navigator){ window.addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{})); }
