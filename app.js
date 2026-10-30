import {FOODS,filterFoods,randomIndex,sampleFoods,targetRotation} from './foods.js';

const $=id=>document.getElementById(id);
const icon=name=>`<svg aria-hidden="true"><use href="#i-${name}"/></svg>`;
const escapeHtml=value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const MEALS={breakfast:'早餐',lunch:'午饭',dinner:'晚饭',snack:'嘴馋加餐'};
const VIBES={all:'都可以',soul:'正经干饭',junk:'垃圾快乐餐',heavy:'重口上头',light:'清爽一点',sweet:'甜口万岁'};
const PALETTE=['#d8f65c','#efabc1','#ece6d5','#8fbaa5','#f3bd71','#bdb3d9','#e7edc7','#f1acc0','#95bba6','#eee6cc','#eec080','#d1c2e4'];
const STORAGE_KEY='chidian-sha-v1';
const form=$('filter-form');
const saved=readSaved();
let settings={meal: new Date().getHours()<10?'breakfast':new Date().getHours()<15?'lunch':'dinner',budget:0,vibe:'all',noSpicy:false,noRepeat:false,...saved.settings};
const params=new URLSearchParams(location.search);
if(MEALS[params.get('meal')]) settings.meal=params.get('meal');
if([0,15,25,40,60].includes(Number(params.get('budget')))&&params.has('budget')) settings.budget=Number(params.get('budget'));
if(VIBES[params.get('vibe')]) settings.vibe=params.get('vibe');
if(params.has('noSpicy')) settings.noSpicy=params.get('noSpicy')==='1';
if(params.has('noRepeat')) settings.noRepeat=params.get('noRepeat')==='1';
let customFoods=saved.customFoods,excluded=saved.excluded,history=saved.history,sound=saved.sound;
let pool=[],slate=[],rotation=0,spinning=false,selected=null,expanded=false,search='',toastTimer,audioContext;
let confirmed=false;
let saveWarningShown=false;
const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)');

/** 仅在存储入口解析未知数据，损坏或旧版本数据不影响转盘运行。 */
function readSaved(){
  const defaults={settings:{},customFoods:[],excluded:[],history:[],sound:false};
  try{
    const raw=JSON.parse(localStorage.getItem(STORAGE_KEY)||'null');
    if(!raw||typeof raw!=='object')return defaults;
    const config=raw.settings||{};
    const validSettings={};
    if(Object.hasOwn(MEALS,config.meal))validSettings.meal=config.meal;
    if([0,15,25,40,60].includes(config.budget))validSettings.budget=config.budget;
    if(Object.hasOwn(VIBES,config.vibe))validSettings.vibe=config.vibe;
    for(const key of ['noSpicy','noRepeat'])if(typeof config[key]==='boolean')validSettings[key]=config[key];
    return {
      settings:validSettings,
      customFoods:Array.isArray(raw.customFoods)?raw.customFoods.filter(f=>f&&typeof f.id==='string'&&f.id.startsWith('custom-')&&typeof f.name==='string'&&f.name.length>0&&f.name.length<=24&&Number.isInteger(f.min)&&f.min>0&&f.min<=999&&f.max===f.min&&['rice'].includes(f.icon)&&[0,1].includes(f.spicy)&&Array.isArray(f.tags)&&f.tags.length===1&&Object.hasOwn(VIBES,f.tags[0])&&f.tags[0]!=='all'&&Array.isArray(f.meals)&&f.meals.length===4&&f.meals.every(m=>Object.hasOwn(MEALS,m))&&typeof f.note==='string').slice(0,100):[],
      excluded:Array.isArray(raw.excluded)?raw.excluded.filter(v=>typeof v==='string').slice(0,200):[],
      history:Array.isArray(raw.history)?raw.history.filter(h=>h&&typeof h.id==='string'&&typeof h.name==='string'&&h.name.length<=24&&typeof h.icon==='string'&&['soup','noodle','rice','snack','cake','leaf','burger','chicken','wrap','pizza','dumpling'].includes(h.icon)&&Object.hasOwn(MEALS,h.meal)&&Number.isFinite(h.at)&&h.at>0).slice(0,30):[],
      sound:raw.sound===true,
    };
  }catch{return defaults;}
}

function persist(){
  try{localStorage.setItem(STORAGE_KEY,JSON.stringify({settings,customFoods,excluded,history,sound}));}
  catch{if(!saveWarningShown){saveWarningShown=true;toast('浏览器未允许保存，当前页面仍可正常转盘。');}}
}
function toast(message){clearTimeout(toastTimer);$('toast').textContent=message;$('toast').hidden=false;toastTimer=setTimeout(()=>$('toast').hidden=true,3200);}
function allFoods(){return [...FOODS,...customFoods];}
function todayIds(){const today=new Date().toDateString();return history.filter(h=>new Date(h.at).toDateString()===today).map(h=>h.id);}
function syncForm(){for(const key of ['meal','budget','vibe']){const input=form.querySelector(`input[name="${key}"][value="${settings[key]}"]`);if(input)input.checked=true;}for(const key of ['noSpicy','noRepeat'])form.elements[key].checked=settings[key];}

function refresh({hideResult=true}={}){
  pool=filterFoods(allFoods(),settings,{excluded,eaten:todayIds()});
  slate=sampleFoods(pool);
  rotation=0;
  $('wheel-rotor').style.transition='none';
  $('wheel-rotor').style.transform='rotate(0deg)';
  if(hideResult){$('result-ticket').hidden=true;selected=null;confirmed=false;}
  renderWheel();renderMenu();
  $('pool-status').textContent=pool.length?`${MEALS[settings.meal]} · ${pool.length} 道候选，本轮 ${slate.length} 道`:'没有符合条件的美食';
  $('empty-state').hidden=pool.length>0;
  $('spin-button').disabled=!pool.length;
  $('center-spin').disabled=!pool.length;
  $('shuffle-button').disabled=!pool.length;
  $('spin-label').textContent=pool.length?'转一下，就开饭':'先换个筛选吧';
  $('spin-hint').textContent=pool.length?'每次从全部候选随机上桌，再由转盘决定。':'预算、口味和排除项可以重新调整。';
}

function renderWheel(){
  const items=slate.length?slate:Array.from({length:12},()=>({name:'等你好胃口',icon:'soup',min:0,max:0}));
  const angle=360/items.length;
  const point=(degrees,r)=>{const radians=degrees*Math.PI/180;return [300+r*Math.cos(radians),300+r*Math.sin(radians)];};
  let markup='';
  items.forEach((food,i)=>{
    const start=-90+i*angle,end=start+angle,middle=(start+end)/2;
    const [sx,sy]=point(start,288),[ex,ey]=point(end,288);
    const path=items.length===1?'M300 12 A288 288 0 1 1 299.999 12Z':`M300 300L${sx} ${sy}A288 288 0 ${angle>180?1:0} 1 ${ex} ${ey}Z`;
    markup+=`<path d="${path}" fill="${PALETTE[i%PALETTE.length]}" stroke="#292d22" stroke-width="1.2"/>`;
    const [tx,ty]=point(middle,211),[ix,iy]=point(middle,145);
    const labelRotation=middle+90;
    // 转盘空间固定，只缩短扇区标签；菜单、无障碍描述与结果保留完整名称。
    const characters=Array.from(food.name);
    const display=characters.length>10?[...characters.slice(0,9),'…']:characters;
    const split=Math.ceil(display.length/2);
    const lines=display.length>5?[display.slice(0,split).join(''),display.slice(split).join('')]:[display.join('')];
    markup+=`<g transform="translate(${tx} ${ty}) rotate(${labelRotation})"><text text-anchor="middle" fill="#292d22" font-family="PingFang SC, Microsoft YaHei, sans-serif" font-size="${items.length>10?19:22}" font-weight="600">${lines.map((line,n)=>`<tspan x="0" dy="${n===0?(lines.length>1?-5:3):24}">${escapeHtml(line)}</tspan>`).join('')}</text><text y="${lines.length>1?43:28}" text-anchor="middle" fill="#505840" font-size="12" font-family="sans-serif">${food.max?`¥${food.min}–${food.max}`:''}</text></g>`;
    markup+=`<g transform="translate(${ix-18} ${iy-18}) rotate(${labelRotation} 18 18)" color="#292d22"><use href="#i-${food.icon}" width="36" height="36" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></g>`;
  });
  markup+='<circle cx="300" cy="300" r="290" fill="none" stroke="#292d22" stroke-width="2"/>';
  $('food-wheel').innerHTML=markup;
  $('food-wheel').setAttribute('aria-label',`本轮候选：${slate.map(f=>f.name).join('、')||'暂无候选'}`);
}

/** 整轮锁定筛选与候选，停止后展示同一目标扇区对应的菜品。 */
async function spin(){
  if(spinning||!pool.length)return;
  spinning=true;selected=null;confirmed=false;
  $('result-ticket').hidden=true;
  // 每轮重新均匀采样，未上桌的候选也有相同机会。
  slate=sampleFoods(pool);renderWheel();
  const winner=randomIndex(slate.length);
  const destination=targetRotation(rotation,winner,slate.length,6+randomIndex(3));
  const duration=reduceMotion.matches?250:4400;
  setBusy(true);
  $('spin-label').textContent='命运正在上菜…';
  $('spin-hint').textContent='别催，大厨正在安排。';
  if(sound)prepareAudio();
  let ticks;
  if(sound&&!reduceMotion.matches)ticks=setInterval(()=>beep(250+Math.random()*150,.025,.025),110);
  await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
  $('wheel-rotor').style.transition=`transform ${duration}ms cubic-bezier(.12,.76,.12,1)`;
  $('wheel-rotor').style.transform=`rotate(${destination}deg)`;
  await new Promise(resolve=>setTimeout(resolve,duration+60));
  clearInterval(ticks);
  rotation=destination;selected=slate[winner];
  spinning=false;setBusy(false);renderResult();
  $('spin-label').textContent='再转一次，也可以';
  $('spin-hint').textContent='心动就开吃，不心动就再给命运一次机会。';
  burst();
  if(sound){beep(523,.12);setTimeout(()=>beep(659,.12),120);setTimeout(()=>beep(784,.2),240);}
}

function setBusy(busy){
  $('wheel-stage').classList.toggle('is-spinning',busy);
  $('wheel-stage').setAttribute('aria-busy',String(busy));
  for(const button of [$('spin-button'),$('center-spin'),$('shuffle-button'),$('restore-button'),$('expand-menu')])button.disabled=busy;
  for(const fieldset of form.querySelectorAll('fieldset'))fieldset.disabled=busy;
  for(const input of form.querySelectorAll('input[type=checkbox]'))input.disabled=busy;
  $('custom-menu').inert=busy;
  $('menu-grid').inert=busy;
  $('clear-history').disabled=busy;
}

function renderResult(){
  $('result-icon').innerHTML=icon(selected.icon);
  $('result-name').textContent=selected.name;
  $('result-pretitle').textContent='今天就吃这个！';
  $('result-price').textContent=`约 ¥${selected.min}–${selected.max}`;
  $('result-detail').textContent=`${MEALS[settings.meal]} · ${VIBES[selected.tags[0]]} · ${selected.spicy?'有辣，可按商家情况调整':'参考口味不辣'}`;
  $('result-note').textContent=selected.note;
  $('confirm-food').disabled=false;
  $('confirm-food').innerHTML=`${icon('check')}就它了，开吃！`;
  $('exclude-result').disabled=false;
  $('result-ticket').hidden=false;
  if(innerWidth<801)$('result-ticket').scrollIntoView({behavior:reduceMotion.matches?'instant':'smooth',block:'nearest'});
}

function renderMenu(){
  // 展示遵循当前条件的菜品，排除项也保留在列表里，方便恢复。
  const available=filterFoods(allFoods(),settings,{eaten:todayIds()});
  const matches=available.filter(f=>f.name.toLowerCase().includes(search.toLowerCase()));
  $('menu-count').textContent=`${pool.length} 道待选`;
  const shown=expanded?matches:matches.slice(0,12);
  $('menu-grid').innerHTML=shown.map(food=>{
    const isExcluded=excluded.includes(food.id);
    return `<button type="button" class="food-item${isExcluded?' excluded':''}" data-id="${escapeHtml(food.id)}" aria-pressed="${!isExcluded}" aria-label="${isExcluded?'恢复':'排除'}${escapeHtml(food.name)}"><span class="food-item-icon">${icon(food.icon)}</span><span class="food-item-info"><span class="food-item-name">${escapeHtml(food.name)}</span><span class="food-item-meta">约 ¥${food.min}–${food.max} · ${food.spicy?'有辣':'不辣'}${food.id.startsWith('custom-')?' · 自定义':''}</span></span><span class="food-item-x">${icon(isExcluded?'plus':'close')}</span></button>`;
  }).join('')||'<p class="menu-empty">没有找到这道菜。换个词搜搜，或者在下面把它加进来。</p>';
  $('expand-menu').hidden=matches.length<=12;
  $('expand-menu').textContent=expanded?'收起菜单':`展开全部 ${matches.length} 道美食`;
  $('restore-button').hidden=excluded.length===0;
  $('restore-button').textContent=`恢复排除项（${excluded.length}）`;
}

function renderHistory(){
  $('clear-history').hidden=history.length===0;
  $('history-list').innerHTML=history.length?history.slice(0,8).map(h=>{
    const when=new Date(h.at);
    return `<div class="history-item">${icon(h.icon)}<div><strong>${escapeHtml(h.name)}</strong><small>${when.getMonth()+1}/${when.getDate()} ${MEALS[h.meal]}</small></div></div>`;
  }).join(''):`<p class="history-empty">${icon('clock')}还没定下今天的第一顿。转一下，给肚子一个交代。</p>`;
}

function syncSound(){
  $('sound-button').innerHTML=icon(sound?'sound':'mute');
  $('sound-button').setAttribute('aria-label',sound?'关闭音效':'开启音效');
  $('sound-button').setAttribute('aria-pressed',String(sound));
}
function prepareAudio(){
  const AudioAPI=window.AudioContext||window.webkitAudioContext;
  if(!AudioAPI)return;
  audioContext??=new AudioAPI();
  if(audioContext.state==='suspended')audioContext.resume().catch(()=>{});
}
function beep(frequency,duration,volume=.06){
  if(!audioContext||audioContext.state!=='running')return;
  const oscillator=audioContext.createOscillator(),gain=audioContext.createGain();
  oscillator.connect(gain);gain.connect(audioContext.destination);oscillator.type='sine';oscillator.frequency.value=frequency;
  gain.gain.setValueAtTime(volume,audioContext.currentTime);gain.gain.exponentialRampToValueAtTime(.001,audioContext.currentTime+duration);
  oscillator.start();oscillator.stop(audioContext.currentTime+duration);
}
function burst(){
  if(reduceMotion.matches)return;
  const container=$('confetti');container.replaceChildren();
  for(let i=0;i<38;i++){const piece=document.createElement('i');piece.style.background=PALETTE[i%PALETTE.length];piece.style.setProperty('--x',`${(Math.random()-.5)*Math.min(innerWidth,1100)}px`);piece.style.setProperty('--y',`${(Math.random()-.3)*innerHeight}px`);piece.style.setProperty('--r',`${Math.random()*1000-500}deg`);piece.style.borderRadius=i%3?'2px':'50%';container.append(piece);}
  setTimeout(()=>container.replaceChildren(),1800);
}

form.addEventListener('change',()=>{
  if(spinning)return;
  const data=new FormData(form);settings={meal:data.get('meal'),budget:Number(data.get('budget')),vibe:data.get('vibe'),noSpicy:data.has('noSpicy'),noRepeat:data.has('noRepeat')};
  expanded=false;persist();refresh();
});
form.addEventListener('submit',event=>event.preventDefault());
$('spin-button').addEventListener('click',spin);$('center-spin').addEventListener('click',spin);
$('shuffle-button').addEventListener('click',()=>{if(!spinning){refresh();toast('换好一桌，看看这轮有没有你的心头好。');}});
$('reset-filters').addEventListener('click',()=>{settings={meal:settings.meal,budget:0,vibe:'all',noSpicy:false,noRepeat:false};excluded=[];syncForm();persist();refresh();toast('已重置预算、口味与排除项。');});
$('menu-grid').addEventListener('click',event=>{
  if(spinning)return;const button=event.target.closest('[data-id]');if(!button)return;
  const id=button.dataset.id;const exists=excluded.includes(id);excluded=exists?excluded.filter(v=>v!==id):[...excluded,id];persist();refresh();toast(exists?'请回转盘里了。':'这道先不吃，已从候选中排除。');
});
$('restore-button').addEventListener('click',()=>{if(spinning)return;excluded=[];persist();refresh();toast('排除的美食都回来啦。');});
$('expand-menu').addEventListener('click',()=>{expanded=!expanded;renderMenu();});
$('menu-search').addEventListener('input',event=>{search=event.target.value;renderMenu();});
$('confirm-food').addEventListener('click',()=>{
  if(!selected||confirmed||spinning)return;confirmed=true;
  history.unshift({id:selected.id,name:selected.name,icon:selected.icon,meal:settings.meal,at:Date.now()});history=history.slice(0,30);persist();renderHistory();
  $('confirm-food').disabled=true;$('confirm-food').innerHTML=`${icon('check')}记好啦，慢慢吃`;$('result-pretitle').textContent='决定了，今天就它！';
  toast(`今天就吃${selected.name}，好好吃饭！`);burst();
  // 记录完成后立即重算候选，保证“今天别重复”的下一轮真实生效。
  pool=filterFoods(allFoods(),settings,{excluded,eaten:todayIds()});renderMenu();
  $('pool-status').textContent=pool.length?`${MEALS[settings.meal]} · ${pool.length} 道候选，下轮重新上桌`:'今天的候选都吃过啦';
  if(!pool.length){$('spin-button').disabled=true;$('center-spin').disabled=true;$('shuffle-button').disabled=true;$('spin-label').textContent='今天的候选都吃过啦';$('spin-hint').textContent='关闭“今天别重复”或放宽筛选，可以继续抽。';}
});
$('exclude-result').addEventListener('click',()=>{if(!selected||spinning)return;const name=selected.name;excluded.push(selected.id);persist();refresh();toast(`已跳过${name}，下一道可能更合胃口。`);});
$('clear-history').addEventListener('click',()=>{if(spinning)return;history=[];persist();renderHistory();refresh();toast('记录已清空，今天重新开吃。');});
$('sound-button').addEventListener('click',()=>{sound=!sound;if(sound){prepareAudio();beep(660,.1);}syncSound();persist();toast(sound?'音效已开启。':'音效已关闭。');});
$('share-button').addEventListener('click',async()=>{
  const url=new URL(location.href);url.hash='';url.search='';
  for(const key of ['meal','budget','vibe'])url.searchParams.set(key,settings[key]);
  if(settings.noSpicy)url.searchParams.set('noSpicy','1');if(settings.noRepeat)url.searchParams.set('noRepeat','1');
  try{await navigator.clipboard.writeText(url.href);toast('链接已复制，带上你的预算和口味一起分享。');}
  catch{try{if(navigator.share){await navigator.share({title:'吃点啥 · 今天这顿，转了算',url:url.href});}else{const input=document.createElement('input');input.value=url.href;document.body.append(input);input.select();const copied=document.execCommand('copy');input.remove();toast(copied?'链接已复制。':'复制未成功，可以复制浏览器地址分享。');}}catch(error){if(error.name!=='AbortError')toast('分享暂未成功，可以复制浏览器地址。');}}
});
$('custom-form').addEventListener('submit',event=>{
  event.preventDefault();if(spinning)return;
  const data=new FormData(event.currentTarget);const name=String(data.get('name')||'').trim(),price=Number(data.get('price')),vibe=data.get('vibe');
  if(!name||name.length>24||!Number.isInteger(price)||price<1||price>999||!Object.hasOwn(VIBES,vibe)||vibe==='all'){toast('填个美食名字和 1–999 元的整数参考价吧。');return;}
  if(customFoods.length>=100){toast('自定义菜单最多 100 道，先享用已有菜单吧。');return;}
  if(allFoods().some(f=>f.name===name)){toast('这道菜已经在菜单里啦，试试搜索它。');return;}
  const food={id:`custom-${crypto.randomUUID()}`,name,min:price,max:price,icon:'rice',spicy:data.has('spicy')?1:0,tags:[vibe],meals:Object.keys(MEALS),note:'你亲自加入的心头好，值得认真吃一顿。'};
  customFoods.push(food);persist();refresh();event.currentTarget.reset();
  const included=pool.some(f=>f.id===food.id);toast(included?`${name}已加入转盘！`:`${name}已保存；当前筛选不匹配，放宽条件就能抽到。`);
});
syncForm();syncSound();refresh();renderHistory();
