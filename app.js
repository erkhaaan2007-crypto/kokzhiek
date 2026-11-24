/* КӨКЖИЕК: қолданба логикасы (таза JavaScript; PDF оқу үшін ғана cdnjs-тен pdf.js жүктеледі) */
(function(){
'use strict';
var C=window.CONTENT||{},GEO=window.GEO||{topics:[],single:[],context:[],multi:[],match:[],games:{},books:[]};
var QUIZ=(window.QUIZ||[]).filter(function(s){return s.id!=='geography'});

/* ---------- көмекші функциялар ---------- */
var $=function(s,r){return (r||document).querySelector(s)};
var $$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
var esc=function(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
var pad=function(n){return String(n).padStart(2,'0')};

/* ---------- иконкалар: Flaticon UIcons, Regular Rounded (https://www.flaticon.com/uicons/interface-icons) ----------
   Кодтағы және деректердегі эмодзи бетке шыққан кезде осы карта бойынша Flaticon иконкасына ауысады.
   Иконканы ауыстыру үшін осы картадағы атауды өзгерт (атауларды flaticon.com/uicons бетінен ал).
   data-noic атрибуты бар элементтің ішіндегі эмодзи өзгермейді (оқушының аватары). */
var ICONS={
 '🏠':'house-chimney','🌍':'earth-americas','📚':'books','🎮':'gamepad','🎯':'bullseye-arrow','🎥':'video-camera',
 '🗓':'calendar','📅':'calendar-day','📆':'calendar-lines','🌱':'seedling','✨':'sparkles','🔔':'bell','👤':'user','👥':'users-alt',
 '🎬':'clapperboard','🔥':'flame','⭐':'star','▶':'play-circle','🗂':'folder-tree','📂':'folder-open','⏰':'alarm-clock',
 '⏱':'stopwatch','⏳':'hourglass-end','📝':'memo','📖':'book-open-cover','📘':'book-alt','📕':'cross-circle','📄':'document',
 '✅':'checkbox','☑':'list-check','✓':'check','✗':'cross-small','🏆':'trophy','🎉':'party-horn','💪':'gym','🧩':'puzzle-alt',
 '🔗':'link','↗':'arrow-up-right-from-square','↔':'arrows-h','☀':'sun','🌙':'moon','📜':'scroll','🔖':'bookmark ic-on','📑':'bookmark',
 '⛶':'expand','☁':'cloud','💾':'disk','💡':'bulb','🚫':'ban','🧹':'broom','🏛':'bank','🧮':'abacus','📐':'ruler-triangle',
 '⚛':'physics','🧪':'flask','⚗':'flask','🧬':'dna','🗿':'monument','🗣':'language','💻':'laptop','⚖':'balance-scale-left','✍':'pen-nib',
 '🔤':'letter-case','🇬🇧':'language','🇰🇿':'flag-alt','🗺':'map','⚡':'bolt','🚀':'rocket-lunch','🧠':'brain','🔢':'sort-numeric-down',
 '🎙':'microphone','🎤':'microphone-alt','🧭':'compass-alt','⛰':'mountains','🏔':'mountain','🌲':'tree','🌿':'leaf','🌊':'water',
 '♻':'recycle','🏭':'industry-windows','🌬':'wind','🎓':'graduation-cap','🐢':'turtle','💰':'coins','🔍':'search','🔭':'telescope','😴':'bed',
 '🔒':'lock','🔓':'unlock','📍':'map-marker','🌐':'globe','📇':'cards-blank','🏅':'medal','📊':'chart-histogram','👑':'crown','💎':'gem',
 '📲':'mobile-notch','🚩':'flag','🛤':'route','🏁':'flag-checkered','🌗':'moon-stars','💬':'comments','⋯':'apps','🔑':'key','🧷':'marker','🔎':'zoom-in'
};
var ICRE=new RegExp('('+Object.keys(ICONS).sort(function(a,b){return b.length-a.length}).join('|')+')️?','g');
var NOIC='[data-noic],textarea,input,select,option,script,style,svg,title';
function iconText(node){
  var s=node.nodeValue,p=node.parentNode;if(!s||!p||p.nodeType!==1)return;
  ICRE.lastIndex=0;if(!ICRE.test(s))return;
  if(p.closest&&p.closest(NOIC))return;
  var fr=document.createDocumentFragment(),last=0,m;ICRE.lastIndex=0;
  while((m=ICRE.exec(s))){
    if(m.index>last)fr.appendChild(document.createTextNode(s.slice(last,m.index)));
    var i=document.createElement('i');i.className='fi fi-rr-'+ICONS[m[1]];i.setAttribute('aria-hidden','true');fr.appendChild(i);
    last=m.index+m[0].length;
  }
  if(last<s.length)fr.appendChild(document.createTextNode(s.slice(last)));
  p.replaceChild(fr,node);
}
function iconize(root){
  if(!root)return;if(root.nodeType===3){iconText(root);return}
  if(root.nodeType!==1||(root.closest&&root.closest(NOIC)))return;
  var w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,null),list=[],n;
  while((n=w.nextNode()))list.push(n);
  list.forEach(iconText);
}
if(window.MutationObserver){
  new MutationObserver(function(ms){ms.forEach(function(m){
    if(m.type==='characterData')iconText(m.target);else Array.prototype.forEach.call(m.addedNodes,iconize);
  })}).observe(document.body,{childList:true,subtree:true,characterData:true});
}
var dkey=function(d){return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate())};
var todayKey=function(){return dkey(new Date())};
var addDays=function(n){var d=new Date();d.setHours(12,0,0,0);d.setDate(d.getDate()+n);return dkey(d)};
var uid=function(){return Math.random().toString(36).slice(2,9)};
var MONTHS=['қаңтар','ақпан','наурыз','сәуір','мамыр','маусым','шілде','тамыз','қыркүйек','қазан','қараша','желтоқсан'];
var DAYS=['Жексенбі','Дүйсенбі','Сейсенбі','Сәрсенбі','Бейсенбі','Жұма','Сенбі'];
var DS=['Жс','Дс','Сс','Ср','Бс','Жм','Сб'];
function parseKey(k){var p=String(k).split('-').map(Number);return new Date(p[0],p[1]-1,p[2],12,0,0)}
function daysFrom(key){return Math.round((parseKey(key)-parseKey(todayKey()))/864e5)}
function fmtDate(k){var p=k.split('-').map(Number);return p[2]+' '+MONTHS[p[1]-1]}
function fmtShort(k){var p=k.split('-');return p[2]+'.'+p[1]}
function fmtFull(k){var p=k.split('-');return p[2]+'.'+p[1]+'.'+p[0]}
function dueTs(d){var m=String(d||'').match(/^(\d{4})-(\d\d)-(\d\d)(?:T(\d\d):(\d\d))?/);if(!m)return NaN;return new Date(+m[1],+m[2]-1,+m[3],m[4]!=null?+m[4]:23,m[5]!=null?+m[5]:59).getTime()}
function fmtDue(d){var t=new Date(dueTs(d));if(isNaN(t))return '';return t.getDate()+' '+MONTHS[t.getMonth()]+(t.getFullYear()!==new Date().getFullYear()?' '+t.getFullYear():'')+', '+String(t.getHours()).padStart(2,'0')+':'+String(t.getMinutes()).padStart(2,'0')}
function leftText(ms){var m=Math.max(1,Math.round(Math.abs(ms)/60000)),d=Math.floor(m/1440),h=Math.floor(m%1440/60),mi=m%60;return d?d+' күн'+(h?' '+h+' сағ':''):h?h+' сағ'+(mi?' '+mi+' мин':''):mi+' мин'}
function hash(s){var h=2166136261;for(var i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
function rng(seed){var a=seed;return function(){a|=0;a=a+0x6D2B79F5|0;var t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function shuffle(arr,r){r=r||Math.random;var a=arr.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(r()*(i+1));var t=a[i];a[i]=a[j];a[j]=t}return a}
function safeUrl(u){return /^https:\/\//.test(String(u))?u:'#'}
function ext(l,u){return '<a href="'+esc(safeUrl(u))+'" target="_blank" rel="noopener noreferrer">'+esc(l)+' ↗</a>'}
function cut(s,n){s=String(s||'').trim();return s.length>n?s.slice(0,n):s}
function variantNo(){return Math.max(1,Math.round((parseKey(todayKey())-new Date(2026,0,1,12))/864e5)+1)}

/* ---------- география базасын дайындау ---------- */
var OLDMAP={'Қазақстан географиясы':'kz','Рельеф':'kz','Көлдер':'kz','Климат':'kz','Табиғат зоналары':'kz','Табиғи ресурстар':'kz','Жалпы география':'karto','Мұхиттар':'hydro','Өзендер':'kz'};
(window.QUIZ||[]).forEach(function(s){if(s.id==='geography')s.qs.forEach(function(q){if(!GEO.single.some(function(x){return x.q===q.q}))GEO.single.push({t:OLDMAP[q.t]||'kz',q:q.q,o:q.o,e:q.e,src:''})})});
var GIDX={};
GEO.single.forEach(function(q){q.id='s:'+hash(q.q);GIDX[q.id]={k:'s',q:q}});
GEO.context.forEach(function(c){c.qs.forEach(function(q){q.id='c:'+hash(c.id+q.q);GIDX[q.id]={k:'c',q:q,ctx:c}})});
GEO.multi.forEach(function(q){q.id='m:'+hash(q.q+q.o.join());GIDX[q.id]={k:'m',q:q}});
GEO.match.forEach(function(q){q.id='x:'+hash(q.q+q.L.join());GIDX[q.id]={k:'x',q:q}});
var BOOKS=GEO.books||[];
function bookById(id){for(var i=0;i<BOOKS.length;i++)if(BOOKS[i].id===id)return BOOKS[i];return null}
function bookLabel(b){return b?b.grade+'-сынып'+(b.part?', '+b.part+'-бөлім':'')+' · '+b.publisher:''}
function bookQs(id){return GEO.single.filter(function(q){return q.src&&q.src.b===id})}
function topicById(id){for(var i=0;i<GEO.topics.length;i++)if(GEO.topics[i].id===id)return GEO.topics[i];return null}
function geoTotal(){return GEO.single.length+GEO.context.reduce(function(a,c){return a+c.qs.length},0)+GEO.multi.length+GEO.match.length}

/* ---------- күй ---------- */
var KEY='bagdar-11-v1';
var PROFILE=['География','Математика','Физика','Химия','Биология','Дүниежүзі тарихы','Информатика','Шет тілі','Құқық негіздері','Қазақ тілі мен әдебиеті','Орыс тілі мен әдебиеті'];
var PROFILE_QUIZ={'Математика':['math'],'Физика':['physics'],'Химия':['chemistry'],'Биология':['biology'],'Дүниежүзі тарихы':['worldhist'],'Информатика':['informatics'],'Шет тілі':['english'],'Құқық негіздері':['law'],'Қазақ тілі мен әдебиеті':['kazlang','kazlit'],'Орыс тілі мен әдебиеті':['russlang','ruslit']};
/* Аватар: 'ic:<иконка>:<түс нөмірі>' (Flaticon UIcons + градиент) немесе ескі эмодзи. Өз суреті profile.photo (256px) және profile.ph (72px) ішінде. */
var AVS=['ic:earth-americas:0','ic:compass-alt:1','ic:mountains:2','ic:rocket-lunch:3','ic:telescope:4','ic:water:5','ic:leaf:6','ic:bolt:7','ic:planet-ringed:8','ic:crown:9','ic:graduation-cap:10','ic:island-tropical:11','ic:volcano:12','ic:snowflake:13','ic:dragon:14','ic:paw:15'];
var AV_GR=[['#38bdf8','#1d4ed8'],['#fbbf24','#d97706'],['#4ade80','#15803d'],['#c084fc','#7c3aed'],['#f472b6','#be185d'],['#22d3ee','#0e7490'],['#a3e635','#4d7c0f'],['#fb923c','#c2410c'],['#818cf8','#3730a3'],['#facc15','#a16207'],['#2dd4bf','#0f766e'],['#34d399','#047857'],['#f87171','#b91c1c'],['#7dd3fc','#0369a1'],['#e879f9','#a21caf'],['#fdba74','#9a3412']];
var PHOTO_RE=/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+\/=]+$/;
function avHtml(av,photo,cls){cls=cls||'';
  if(photo&&PHOTO_RE.test(photo))return '<span class="avt '+cls+'" data-noic><img src="'+photo+'" alt=""></span>';
  var m=/^ic:([a-z0-9-]+):(\d+)$/.exec(av||'');
  if(m){var g=AV_GR[+m[2]%AV_GR.length];return '<span class="avt ic '+cls+'" style="--a1:'+g[0]+';--a2:'+g[1]+'"><i class="fi fi-rr-'+m[1]+'" aria-hidden="true"></i></span>'}
  return '<span class="avt emo '+cls+'" data-noic>'+esc(av||'🙂')+'</span>';
}
function fullName(p){p=p||state.profile||{};return ((p.name||'')+' '+(p.last||'')).trim()}
function squareJpeg(im,n,q){var c=document.createElement('canvas');c.width=c.height=n;var w=im.naturalWidth,h=im.naturalHeight,s=Math.min(w,h),sx=(w-s)/2,sy=(h-s)*0.3,x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,n,n);x.drawImage(im,sx,sy,s,s,0,0,n,n);return c.toDataURL('image/jpeg',q)}
function readPhoto(file,cb){
  if(!file||!/^image\//.test(file.type)){toast('Сурет файлын таңда');return}
  var fr=new FileReader();fr.onload=function(){var im=new Image();im.onload=function(){cb(squareJpeg(im,256,.85),squareJpeg(im,72,.8))};im.onerror=function(){toast('Суретті ашу мүмкін болмады')};im.src=fr.result};fr.readAsDataURL(file);
}
function seed(){return{
  v:4,profile:null,xp:0,why:'',letter:'',chal:{},tasks:[],
  ubt:{date:'',goal:100,p1:'География',p2:'Дүниежүзі тарихы',tests:[]},
  focus:{},cycle:0,timer:{focus:25,short:5,long:15},
  tcount:10,stats:{a:0,c:0,subj:{},days:{}},wrong:[],
  geo:{a:0,c:0,topic:{},wrong:[],daily:{},best:{},games:0,seen:{},ch:{},path:{},srs:{},mocks:[]},
  read:{},ntf:{},jz:{},log:{},upd:0,
  habits:{list:(C.defaultHabits||[]).map(function(n){return{id:uid(),name:n}}),log:{}},
  vids:[],planGen:{wd:3,we:5},
  theme:'light',badgesGot:{},bgInit:false,lvl:0,
  cu:{on:false,since:'',snooze:''},cuDone:{},wplan:{wk:'',days:[],bonus:{}},cls:'',
  rid:{},comics:{},ckDone:{},
  prof:{score:'',rural:false,fav:{}},rem:{on:false,t:'19:00',last:'',nd:false}
}}
function load(){try{var r=localStorage.getItem(KEY);if(r){var o=JSON.parse(r);if(o&&typeof o==='object')return o}}catch(e){}return null}
function build(saved){
  var s=seed();
  if(saved){
    Object.keys(saved).forEach(function(k){s[k]=saved[k]});
    ['cards','mood','daily','vdone'].forEach(function(k){delete s[k]});
    if(saved.juz&&Array.isArray(saved.juz.mine)&&!saved.vids)s.vids=saved.juz.mine;delete s.juz;
    var d=seed();
    ['stats','habits','planGen','timer','ubt','geo','cu','wplan','prof','rem'].forEach(function(k){
      if(!s[k]||typeof s[k]!=='object')s[k]=d[k];else Object.keys(d[k]).forEach(function(kk){if(s[k][kk]==null)s[k][kk]=d[k][kk]});
    });
    ['wrong','tasks','vids'].forEach(function(k){if(!Array.isArray(s[k]))s[k]=[]});
    if(!s.chal||typeof s.chal!=='object')s.chal={};if(!s.prof.fav||typeof s.prof.fav!=='object'||Array.isArray(s.prof.fav))s.prof.fav={};if(!/^\d{2}:\d{2}$/.test(s.rem.t))s.rem.t='19:00';
    ['read','ntf','jz','log','badgesGot','cuDone','rid','comics','ckDone'].forEach(function(k){if(!s[k]||typeof s[k]!=='object'||Array.isArray(s[k]))s[k]={}});
    ['path','srs'].forEach(function(k){if(!s.geo[k]||typeof s.geo[k]!=='object'||Array.isArray(s.geo[k]))s.geo[k]={}});
    if(!Array.isArray(s.geo.mocks))s.geo.mocks=[];if(!Array.isArray(s.wplan.days))s.wplan.days=[];
    if(['light','dark','auto'].indexOf(s.theme)<0)s.theme='light';if(typeof s.cls!=='string')s.cls='';
    s.tasks.forEach(function(t){if(!t.scope)t.scope='week';if(t.due==null)t.due=''});
    s.xp=+s.xp||0;
  }
  return s;
}
var state=build(load());
function persist(){try{localStorage.setItem(KEY,JSON.stringify(state))}catch(e){}}
function save(){state.upd=Date.now();checkProgress();logXP();persist();cloudPush();remSync()}

/* ---------- түнгі режим: state.theme = light | dark | auto (құрылғыға сай) ---------- */
var mqDark=window.matchMedia?window.matchMedia('(prefers-color-scheme: dark)'):null;
function isDark(){return state.theme==='dark'||(state.theme==='auto'&&!!(mqDark&&mqDark.matches))}
function applyTheme(){var d=isDark();document.documentElement.setAttribute('data-theme',d?'dark':'light');var m=document.querySelector('meta[name=theme-color]');if(m)m.setAttribute('content',d?'#0b1220':'#064b84')}
if(mqDark&&mqDark.addEventListener)mqDark.addEventListener('change',function(){if(state.theme==='auto'){applyTheme();drawTop()}});
applyTheme();

/* ---------- басқа пәндер ---------- */
var COVER={geo:['#2fb5d8','#064b84','🌍 ҰБТ'],kzhist:['#C8742B','#8A4A14','1465'],reading:['#E0935B','#B5521A','¶ Аа'],mathlit:['#E7A93B','#C0721A','% ÷ ×'],math:['#3F7CAC','#274C77','π ∑ √'],physics:['#5B6BBF','#32407F','E=mc²'],chemistry:['#3FA796','#1F6F64','H₂O'],biology:['#6BAA4F','#3B7030','DNA'],worldhist:['#A8704A','#6B4226','1789'],informatics:['#55607A','#2C3446','</>'],english:['#D9534F','#8E2B28','Aa Bb'],law:['#8A6FB0','#523C78','§'],kazlang:['#E08A3C','#A24A16','Әә Ққ'],kazlit:['#C4573A','#7E2E1C','Абай'],russlang:['#4E8FC7','#2A5A8A','Яя'],ruslit:['#7A6C5D','#463C33','Пушкин']};
var TCOVER={karto:['#2fb5d8','#064b84','1:100 000'],lito:['#8a6a4a','#4b3524','⛰'],atmo:['#7cc4e8','#2c6fa8','760 мм'],hydro:['#2fb5d8','#0c4a7a','35 ‰'],bio:['#4caf7a','#1f6b45','🌲'],pop:['#d38b4f','#8a4b1d','8 млрд'],econ:['#6b7a99','#2c3446','ЖІӨ'],world:['#3d9bb3','#1f5276','195+'],kz:['#1fa2c8','#0a5a8a','2,7 млн км²'],eco:['#5bb36a','#2a6e3a','CO₂'],method:['#5a7bd6','#1d3a8a','ГАЖ']};
function coverHtml(id,ic,mt,extra){var c=COVER[id]||TCOVER[id]||['#2fb5d8','#064b84',''];return '<div class="cover" style="--c1:'+c[0]+';--c2:'+c[1]+'" aria-hidden="true"><span class="em">'+esc(ic||'📘')+'</span><span class="mt">'+esc(mt!=null?mt:c[2])+'</span>'+(extra||'')+'</div>'}
function subjById(id){for(var i=0;i<QUIZ.length;i++)if(QUIZ[i].id===id)return QUIZ[i];return null}
function findQ(sid,qt){var s=subjById(sid);if(!s)return null;for(var i=0;i<s.qs.length;i++)if(s.qs[i].q===qt)return s.qs[i];return null}

/* ---------- деңгей, марапат ---------- */
/* 30 деңгей, 6 әлем (әр әлемде 5 саты). Алғашқы 5 деңгейге әрқайсысы 100 XP, одан кейін әр деңгей 30 XP-ге қымбаттайды. */
var WORLDS=[['Ауыл','🏠','Алғашқы қадамдар'],['Дала','🌿','Кең даланы игер'],['Таулар','🏔','Шыңдарға өрле'],['Мұхиттар','🌊','Тереңге сүңгі'],['Материктер','🗺','Әлемді аралап шық'],['Планета','🌍','Көкжиектен асып түс']];
var LVMAX=30;
function lvStart(n){var m=Math.max(0,n-5);return 100*(n-1)+15*m*Math.max(0,m-1)}
function level(){var x=state.xp,n=1;while(n<LVMAX&&x>=lvStart(n+1))n++;var s=lvStart(n),e=lvStart(n+1),w=Math.floor((n-1)/5),top=n>=LVMAX;
  return {n:n,w:w,world:WORLDS[w][0],name:WORLDS[w][0]+' · '+((n-1)%5+1)+'-саты',p:top?100:Math.round((x-s)/(e-s)*100),need:top?0:e-x,top:top}}
/* Сыйлықтар кезегі: бірнеше марапат қатар шықса, бірінен соң бірі көрсетіледі */
var RQ=[];
function queueReward(i,t,s){RQ.push([i,t,s]);if(RQ.length===1)setTimeout(flushRQ,2200)}
function flushRQ(){var x=RQ[0];if(!x)return;reward(x[0],x[1],x[2]);RQ.shift();if(RQ.length)setTimeout(flushRQ,2200)}
var toastT=null;
function toast(t){var old=$('#toast');if(old)old.remove();var d=document.createElement('div');d.className='toast';d.id='toast';d.setAttribute('role','status');d.textContent=t;document.body.appendChild(d);clearTimeout(toastT);toastT=setTimeout(function(){d.remove()},3400)}
function confetti(){
  if(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  var cols=['#064b84','#2fb5d8','#edd198','#16a34a','#0c2c5a'];
  for(var i=0;i<54;i++){var s=document.createElement('span');s.className='confetti';s.style.left=Math.random()*100+'vw';s.style.background=cols[i%cols.length];s.style.animationDelay=(Math.random()*.6)+'s';s.style.animationDuration=(1.8+Math.random()*1.4)+'s';document.body.appendChild(s);setTimeout(function(el){return function(){el.remove()}}(s),4200)}
}
function reward(icon,title,sub){var old=$('.reward');if(old)old.remove();var d=document.createElement('div');d.className='reward';d.setAttribute('role','status');d.innerHTML='<div><span class="tr" aria-hidden="true">'+esc(icon)+'</span><b>'+esc(title)+'</b><span class="muted">'+esc(sub||'')+'</span></div>';document.body.appendChild(d);confetti();setTimeout(function(){d.remove()},2000)}
function notifs(){
  var out=[],tk=todayKey();
  var now=Date.now();
  state.tasks.forEach(function(t){if(t.done||!t.due)return;var left=dueTs(t.due)-now;if(left<0)out.push({c:'over',t:'Мерзімі өтті: '+t.title,s:fmtDue(t.due)+' · '+leftText(left)+' бұрын',h:'#plan',task:1});else if(left<864e5)out.push({c:'',t:'Дедлайн жақын: '+t.title,s:fmtDue(t.due)+' · '+leftText(left)+' қалды',h:'#plan',task:1})});
  var und=state.tasks.filter(function(t){return !t.done&&!t.due&&t.scope==='day'}).length;
  if(und)out.push({c:'',t:und+' күндік тапсырма орындалмаған',s:'Дедлайнсыз тапсырмалар',h:'#plan',task:1});
  if(!state.geo.daily[tk])out.push({c:'',t:'Бүгінгі география нұсқасы шешілмеген',s:'Нұсқа күн сайын жаңарады',h:'#geo'});
  if(!(state.rid[tk]&&state.rid[tk].done))out.push({c:'',t:'Күн жұмбағы шешілмеген',s:'Жаңа жұмбақ күн сайын түн ортасында шығады',h:'#home'});
  var hl=state.habits.list,hd=(state.habits.log[tk]||[]).length;
  if(hl.length&&hd<hl.length)out.push({c:'',t:'Әдеттер: '+(hl.length-hd)+' белгіленбеген',s:'Даму → Дисциплина',h:'#grow'});
  return out;
}

/* ---------- бағыттау ---------- */
var NAV=[['home','🏠','Басты'],['geo','🌍','География'],['books','📚','Оқулық'],['atlas','🗺','Атлас'],['games','🎮','Ойындар'],['comics','💬','Комикс'],['ubt','🎯','ҰБТ'],['plan','🗓','Жоспар']];
var MORE=[['prof','🎓','Мамандықтар'],['checklist','✅','Чеклист'],['juz','🎥','JUZ40'],['grow','🌱','Даму'],['video','▶','Видео'],['other','🗂','Басқа пәндер'],['class','🏆','Сынып'],['me','👤','Профиль']];
var NAV_M={home:1,geo:1,games:1,plan:1}; /* телефонның төменгі мәзіріндегі бөлімдер */
var VIEWS=NAV.concat(MORE).map(function(n){return n[0]});
/* Сырғыту реті: саусақпен немесе тачпадпен оңға-солға сырғытқанда осы ретпен ауысады */
var SWIPE=['home','geo','books','atlas','games','comics','ubt','plan','prof','checklist','juz','grow'];
var ALIAS={tests:'other',timer:'plan',mood:'home',talday:'juz'};
var cur='home',panel='';
function drawNav(){$('#nav').innerHTML=NAV.map(function(n){return '<a href="#'+n[0]+'" data-nav="'+n[0]+'"'+(NAV_M[n[0]]?' data-m="1"':'')+'><span class="ic" aria-hidden="true">'+n[1]+'</span><span class="lb">'+n[2]+'</span></a>'}).join('')
  +'<button class="nav-more" type="button" data-act="more" aria-haspopup="dialog"><span class="ic" aria-hidden="true">⋯</span><span class="lb">Тағы</span></button>'}
function moreHtml(){
  var all=NAV.concat(MORE);
  return '<div class="more-sheet" role="dialog" aria-modal="true" aria-label="Барлық бөлімдер"><div class="more-bg" data-act="more-close"></div><div class="more-in"><div class="row between" style="margin-bottom:10px"><b>Барлық бөлімдер</b><button class="icon-btn" type="button" data-act="more-close" aria-label="Жабу">×</button></div>'
   +'<div class="more-grid">'+all.map(function(n){return '<a href="#'+n[0]+'" data-act="more-go" class="'+(cur===n[0]?'on':'')+'"><span class="ic" aria-hidden="true">'+n[1]+'</span><span>'+n[2]+'</span></a>'}).join('')+'</div></div></div>';
}
function openMore(on){var s=$('#more-slot');if(!s){s=document.createElement('div');s.id='more-slot';document.body.appendChild(s)}s.innerHTML=on?moreHtml():''}
var qShift=0;
function quoteOfDay(){var q=C.quotes||[];if(!q.length)return {t:'',a:''};return q[(hash(todayKey())+qShift)%q.length]}
function drawTop(){
  var ns=notifs();
  $('#top-act').innerHTML='<button class="qchip" type="button" data-act="panel" data-p="quote" aria-expanded="'+(panel==='quote')+'">✨ <span>Күннің сөзі</span></button>'
   +'<button class="hbtn" type="button" data-act="theme" aria-label="'+(isDark()?'Күндізгі режимге ауысу':'Түнгі режимге ауысу')+'" title="'+(isDark()?'Күндізгі режим':'Түнгі режим')+'">'+(isDark()?'☀':'🌙')+'</button>'
   +'<button class="hbtn" type="button" data-act="panel" data-p="bell" aria-label="Хабарламалар: '+ns.length+'" aria-expanded="'+(panel==='bell')+'">🔔'+(ns.length?'<span class="cnt">'+ns.length+'</span>':'')+'</button>'
   +'<a class="hbtn hav" href="#me" aria-label="Профиль">'+(state.profile?avHtml(state.profile.av,state.profile.ph||state.profile.photo,'xs'):'👤')+'</a>';
  var h='';
  if(panel==='bell')h='<div class="panel" role="dialog" aria-label="Хабарламалар"><h3>Хабарламалар</h3>'+(ns.length?ns.map(function(x){return '<a class="nt '+x.c+'" href="'+x.h+'" data-act="panel-go"><span class="d"></span><span><b>'+esc(x.t)+'</b><br><span class="small muted">'+esc(x.s)+'</span></span></a>'}).join(''):'<p class="empty">Бәрі орындалған. Жарайсың!</p>')+'</div>';
  if(panel==='quote'){var q=quoteOfDay();h='<div class="panel" role="dialog" aria-label="Күннің сөзі"><div class="eyebrow">Күннің сөзі</div><p style="font-weight:700;font-size:1.05rem">'+esc(q.t)+'</p><div class="row between"><span class="muted small">— '+esc(q.a)+'</span><button class="btn sm" type="button" data-act="next-quote">Басқа сөз</button></div></div>'}
  $('#panel-slot').innerHTML=h;
}
var RENDER={};
/* Бөлім ауысқанда: View Transitions API бар браузерде бет мәзірдегі ретіне қарай оңға/солға сырғиды,
   жоқ браузерде элементтер біртіндеп көтеріледі. Шапканың астында көкжиек сызығы жылт етеді. */
/* Саусақпен (телефон) немесе екі саусақпен тачпадта (MacBook) оңға-солға сырғыту: бет саусақтың соңынан ереді,
   жеткілікті тартылса — келесі/алдыңғы бөлімге ауысады, әйтпесе орнына серіппедей қайтады. */
var SWP={on:false,dx:0,t:0,lock:0,wheelT:null,busy:0};
function swipeBlocked(t){
  if(R&&!R.done||GM&&!GM.over||CD||!state.profile||$('.more-sheet')||$('.ck-modal')||SWIPE.indexOf(cur)<0)return true;
  if(t&&t.closest&&t.closest('input,textarea,select,.zmap,.gmap,.map-wrap,.ex-nav,.onb,[data-noswipe]'))return true;
  for(var el=t;el&&el!==document.body&&el.nodeType===1;el=el.parentElement){if(el.scrollWidth>el.clientWidth+4){var ox=getComputedStyle(el).overflowX;if(ox==='auto'||ox==='scroll')return true}}
  return false;
}
function swipeTarget(dir){var i=SWIPE.indexOf(cur),j=i+dir;return j>=0&&j<SWIPE.length?SWIPE[j]:null}
function swipeMove(dx){var m=$('#main');if(!m)return;var tgt=swipeTarget(dx<0?1:-1),d=tgt?dx:dx*.25;SWP.dx=d;m.style.transition='none';m.style.transform='translateX('+d.toFixed(1)+'px)';m.style.opacity=String(1-Math.min(.25,Math.abs(d)/innerWidth*.6))}
function swipeEnd(vx){
  var m=$('#main'),d=SWP.dx;SWP.dx=0;if(!m)return;
  var tgt=swipeTarget(d<0?1:-1),go=tgt&&(Math.abs(d)>Math.min(140,innerWidth*.22)||Math.abs(vx||0)>.6&&Math.abs(d)>40);
  if(go){document.documentElement.style.setProperty('--sw',d.toFixed(1)+'px');m.style.transition='none';m.style.transform='';m.style.opacity='';SWP.busy=Date.now();location.hash='#'+tgt;setTimeout(function(){document.documentElement.style.removeProperty('--sw')},900)}
  else{m.style.transition='transform .42s cubic-bezier(.22,1,.36,1),opacity .42s';m.style.transform='';m.style.opacity='';setTimeout(function(){m.style.transition=''},450)}
}
document.addEventListener('touchstart',function(e){if(e.touches.length!==1)return;var p=e.touches[0];if(p.clientX<24||p.clientX>innerWidth-24||swipeBlocked(e.target)){SWP.on=false;return}SWP.on=true;SWP.x=p.clientX;SWP.y=p.clientY;SWP.t=Date.now();SWP.lock=0},{passive:true});
document.addEventListener('touchmove',function(e){if(!SWP.on)return;var p=e.touches[0],dx=p.clientX-SWP.x,dy=p.clientY-SWP.y;if(!SWP.lock){if(Math.abs(dx)<10&&Math.abs(dy)<10)return;SWP.lock=Math.abs(dx)>Math.abs(dy)*1.3?1:-1}if(SWP.lock===1)swipeMove(dx)},{passive:true});
document.addEventListener('touchend',function(e){if(!SWP.on)return;SWP.on=false;if(SWP.lock===1){var dt=Math.max(1,Date.now()-SWP.t);swipeEnd(SWP.dx/dt)}});
document.addEventListener('wheel',function(e){
  if(e.ctrlKey||Date.now()-SWP.busy<900)return;
  if(!SWP.wheel){if(Math.abs(e.deltaX)<4||Math.abs(e.deltaX)<Math.abs(e.deltaY)*1.4||swipeBlocked(e.target))return;SWP.wheel=true;SWP.acc=0}
  SWP.acc-=e.deltaX;swipeMove(SWP.acc*.9);clearTimeout(SWP.wheelT);
  SWP.wheelT=setTimeout(function(){SWP.wheel=false;swipeEnd(0)},140);
},{passive:true});
var routed=false,routeSeq=0;
function route(){
  var h=(location.hash||'#home').slice(1);if(ALIAS[h])h=ALIAS[h];
  var next=VIEWS.indexOf(h)>-1?h:'home',prev=cur,first=!routed;routed=true;
  var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  var useVT=!first&&!reduce&&prev!==next&&typeof document.startViewTransition==='function';
  var my=++routeSeq,ran=false;
  var go=function(){
    if(ran||my!==routeSeq)return;ran=true; /* тек ең соңғы ауысу ғана бетті салады */
    cur=next;
    VIEWS.forEach(function(id){var el=$('#view-'+id);el.hidden=(id!==cur);el.classList.remove('enter')});
    $$('[data-nav]').forEach(function(a){if(a.dataset.nav===cur)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')});
    var mb=$('.nav-more');if(mb)mb.classList.toggle('on',!NAV.some(function(n){return n[0]===cur}));openMore(false);
    panel='';drawTop();
    var el=$('#view-'+cur);RENDER[cur]();if(!useVT){el.classList.add('enter');setTimeout(function(){el.classList.remove('enter')},900)}
    window.scrollTo(0,0);
  };
  if(!first&&!reduce){var tp=$('.top');if(tp){tp.classList.remove('sweep');void tp.offsetWidth;tp.classList.add('sweep')}}
  if(useVT){document.documentElement.setAttribute('data-dir',VIEWS.indexOf(next)>=VIEWS.indexOf(prev)?'fwd':'back');
    try{var tr=document.startViewTransition(go);['ready','finished','updateCallbackDone'].forEach(function(k){if(tr&&tr[k]&&tr[k].catch)tr[k].catch(function(){})})}catch(e){go()}
    setTimeout(go,400); /* анимация үзілсе де немесе бет көрінбей тұрса да, бөлім міндетті түрде ашылады */
  }
  else go();
}
function refresh(){RENDER[cur]();drawTop()}
window.addEventListener('hashchange',route);

/* ---------- профиль құру ---------- */
var OB={av:AVS[0],photo:'',ph:'',touched:false};
function optHtml(sel){var list=PROFILE.indexOf(sel)>-1?PROFILE:PROFILE.concat([sel]);return list.map(function(p){return '<option'+(p===sel?' selected':'')+'>'+esc(p)+'</option>'}).join('')}
function avsHtml(sel,photo){
  return '<div class="avs" role="group" aria-label="Аватар">'+AVS.map(function(a){return '<button class="av" type="button" data-act="pick-av" data-v="'+a+'" aria-pressed="'+(!photo&&a===sel)+'" aria-label="Аватар: '+a.split(':')[1]+'">'+avHtml(a,'','sm')+'</button>'}).join('')
   +'<label class="av up'+(photo?' on':'')+'" title="Өз суретіңді жүкте">'+(photo?avHtml('',photo,'sm'):'<i class="fi fi-rr-camera" aria-hidden="true"></i>')+'<input type="file" accept="image/*" id="av-file" class="sr" aria-label="Өз суретіңді жүкте"></label></div>'
   +(photo?'<button class="btn sm ghost" type="button" data-act="av-photo-del" style="margin-top:8px">Суретті алып тастау</button>':'<p class="small muted" style="margin:6px 0 0">Иконка таңда немесе камера батырмасы арқылы өз суретіңді жүкте.</p>');
}
function avsBlock(){return '<div class="avs-wrap">'+avsHtml(OB.av,OB.photo)+'</div>'}
function paintAvs(){var w=$('.avs-wrap');if(w)w.innerHTML=avsHtml(OB.av,OB.photo);if($('.onb .pass'))paintPass()}
/* ---------- алғашқы кіру: анимациялы «Көкжиек» фоны + 3 қадамдық сапар + саяхатшы куәлігі ---------- */
var ONB_FACTS=['Қазақстан — теңізге шыға алмайтын елдердің ішіндегі ең үлкені.','Каспий — жер шарындағы ең үлкен тұйық су айдыны, оның деңгейі мұхиттан 28 метр төмен.','Балқаш көлінің батыс бөлігі тұщы, ал шығыс бөлігі тұзды.','Хан Тәңірі шыңының биіктігі — 7010 метр. Бұл Қазақстанның ең биік нүктесі.','Қарақия ойысы теңіз деңгейінен 132 метр төмен жатыр.','Ертіс өзенінің ұзындығы — 4248 км: ол Қытайдан басталып, Обь өзеніне құяды.'];
var ONB_WHY=['Грантқа түсу','Армандаған мамандыққа жету','Ата-анамды қуанту','Өзіме дәлелдеу','Шетелде оқу','Географ болу'];
var ONB_FEAT=[['📚','750+ оқулық сұрағы','16 оқулықтан, әр сұраққа бет нөмірімен'],['🎯','ҰБТ форматы','40 тапсырмалық байқау тест және әр қатеңнің талдауы'],['🗺','Карта ойындары','Қазақстан мен әлемді картадан тауып, ұпай жина'],['🚀','30 деңгей, 6 әлем','Ауылдан бастап планетаға дейін өрле']];
var ONB_STEPS=['Танысу','Мен','Мақсат'];
function onbInit(){if(OB.step==null){OB.step=0;OB.name='';OB.last='';OB.p1=state.ubt.p1;OB.p2=state.ubt.p2;OB.goal=state.ubt.goal||100;OB.date=state.ubt.date||'';OB.why='';OB.fact=0}}
function onbRidge(pts){var p='M0 220';[0,1440].forEach(function(off){pts.forEach(function(q){p+=' L'+(q[0]+off)+' '+q[1]})});return p+' L2880 220 Z'}
function onbContours(cx,cy,n){var s='';for(var k=1;k<=n;k++){var r=26+k*24,d='';for(var a=0;a<=64;a++){var t=a/64*Math.PI*2,rr=r*(1+.13*Math.sin(3*t+k*.7)+.06*Math.sin(5*t+k)),x=cx+rr*Math.cos(t),y=cy+rr*.72*Math.sin(t);d+=(a?'L':'M')+x.toFixed(1)+' '+y.toFixed(1)}s+='<path d="'+d+'Z"/>'}return s}
function onbSky(){
  var stars='';for(var i=0;i<70;i++){var z=Math.random()<.12?3:Math.random()<.5?2:1;stars+='<i style="left:'+(Math.random()*100).toFixed(1)+'%;top:'+(Math.random()*58).toFixed(1)+'%;width:'+z+'px;height:'+z+'px;animation-delay:'+(Math.random()*4).toFixed(2)+'s;animation-duration:'+(2.4+Math.random()*3).toFixed(2)+'s"></i>'}
  var tags=['Хан Тәңірі · 7010 м','Каспий · −28 м','Балқаш · 614 км','Ертіс · 4248 км','Қарақия · −132 м','Мұзтау · 4506 м','Арал','Сарыарқа','Алтай','Іле Алатауы'];
  var fl=tags.map(function(f,k){return '<span style="left:'+(3+k*9.6+Math.random()*3).toFixed(1)+'%;animation-delay:-'+(k*2.7).toFixed(1)+'s">'+esc(f)+'</span>'}).join('');
  var far=onbRidge([[0,150],[110,110],[200,135],[320,70],[420,118],[520,92],[640,140],[760,80],[880,128],[990,100],[1110,150],[1230,88],[1340,126],[1440,150]]);
  var near=onbRidge([[0,182],[140,150],[260,172],[380,128],[500,166],[640,140],[780,176],[900,134],[1040,168],[1180,142],[1320,172],[1440,182]]);
  return '<div class="onb-sky" aria-hidden="true">'
   +'<div class="sky-stars sky-l" data-d="6">'+stars+'</div>'
   +'<svg class="sky-topo sky-l" data-d="10" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice"><g>'+onbContours(230,230,7)+onbContours(1010,170,6)+onbContours(820,560,5)+'</g></svg>'
   +'<div class="sky-globe sky-l" data-d="14">'+globeSvg()+'</div>'
   +'<div class="sky-plane"><i class="fi fi-rr-plane-alt"></i></div>'
   +'<div class="sky-sun sky-l" data-d="4"><div class="sun-core"></div></div>'
   +'<div class="sky-mount far sky-l" data-d="18"><svg viewBox="0 0 2880 220" preserveAspectRatio="none"><path d="'+far+'"/></svg></div>'
   +'<div class="sky-horizon"></div>'
   +'<div class="sky-mount near sky-l" data-d="28"><svg viewBox="0 0 2880 220" preserveAspectRatio="none"><path d="'+near+'"/></svg></div>'
   +'<div class="sky-ground"></div>'
   +'<div class="sky-tags">'+fl+'</div></div>';
}
function goalVerdict(g){return g>=125?'Үздіктер қатарында: ең бәсекелі мамандықтарға жол ашық':g>=100?'Грантқа сенімді үміткер':g>=75?'Мықты бастама: грантқа жол ашық':g>=50?'Шекті балдан сенімді өту':'Алғашқы мақсат: шекті балдан өту'}
function passHtml(){
  var nm=((OB.name||'')+' '+(OB.last||'')).trim(),d=OB.date,n=d?daysFrom(d):null,today=new Date();
  return '<div class="pass" aria-label="Саяхатшы куәлігі"><div class="pass-h"><span>KOKZHIEK · САЯХАТШЫ КУӘЛІГІ</span><i class="fi fi-rr-plane-alt" aria-hidden="true"></i></div>'
   +'<div class="pass-who">'+avHtml(OB.av,OB.photo,'lg')+'<div><b class="pass-name">'+esc(nm||'Атың мен тегің')+'</b><span>Ауыл · 1-саты · 0 XP</span></div></div>'
   +'<div class="pass-route"><div><small>ҰШУ</small><b>Бүгін</b><span>'+pad(today.getDate())+'.'+pad(today.getMonth()+1)+'</span></div><div class="pass-line" aria-hidden="true"><i class="fi fi-rr-plane-alt"></i></div><div class="r"><small>ҚОНУ</small><b>ҰБТ</b><span>'+(d?fmtShort(d):'күні белгісіз')+'</span></div></div>'
   +'<div class="pass-grid"><div><small>БАҒЫТ</small><b>'+OB.goal+' балл</b></div><div><small>ПӘНДЕР</small><b>'+esc(OB.p1)+' + '+esc(OB.p2)+'</b></div><div><small>ҚАЛДЫ</small><b>'+(n!=null&&n>=0?n+' күн':'—')+'</b></div></div>'
   +(OB.why?'<div class="pass-why"><small>ШАБЫТ</small> '+esc(OB.why)+'</div>':'')
   +'<div class="pass-code" aria-hidden="true"></div></div>';
}
function paintPass(){var p=$('.onb .pass');if(p)p.outerHTML=passHtml()}
function onbStepHtml(){
  var s=OB.step,dots='<ol class="onb-dots">'+ONB_STEPS.map(function(x,i){return '<li class="'+(i<s?'done':i===s?'cur':'')+'"><span>'+(i<s?'✓':i+1)+'</span>'+x+'</li>'}).join('')+'</ol>';
  if(s===0)return '<div class="onb-hero">'+dots
    +'<span class="onb-pill">ҰБТ · География · Тегін</span><h1 id="onb-h">Көкжиегіңді кеңейтуге дайынсың ба?</h1>'
    +'<p class="onb-lead">Көкжиек — ҰБТ-ға географиядан дайындалуға арналған сапар. Мұнда әр күн — жаңа нұсқа, әр тақырып — бағындыратын жаңа шың, ал әр дұрыс жауап сені мақсатыңа бір қадам жақындатады.</p>'
    +'<div class="onb-feat">'+ONB_FEAT.map(function(f,i){return '<div style="animation-delay:'+(.15+i*.08).toFixed(2)+'s"><span class="ic" aria-hidden="true">'+f[0]+'</span><b>'+f[1]+'</b><small>'+f[2]+'</small></div>'}).join('')+'</div>'
    +'<div class="onb-fact" aria-live="polite"><span class="eyebrow">💡 Білесің бе?</span><p id="onb-fact">'+esc(ONB_FACTS[OB.fact%ONB_FACTS.length])+'</p></div>'
    +'<div class="onb-cta"><button class="btn sky lg" type="button" data-act="onb-next">Сапарды бастау <i class="fi fi-rr-arrow-right" aria-hidden="true"></i></button>'+(fbReady()?'<button class="btn light" type="button" data-act="cloud-in"'+(CLOUD.st==='busy'?' disabled':'')+'>Менде аккаунт бар</button>':'')+'</div>'
    +'<p class="onb-note">Тіркелу міндетті емес: деректерің осы құрылғыда сақталады. Қаласаң, кейін Google арқылы кіріп, бұлтқа сақтайсың.</p></div>';
  var form=s===1
    ?'<h2 id="onb-h">Танысайық! Сен кімсің?</h2><p class="muted">Аты-жөніңді жаз да, бейнеңді таңда. Олар саяхатшы куәлігіңде, профиліңде және сынып рейтингінде көрінеді.</p>'
     +'<div class="form-row"><div><label for="o-name">Атың</label><input id="o-name" type="text" maxlength="20" required autocomplete="given-name" placeholder="Мысалы: Айым" value="'+esc(OB.name)+'"></div><div><label for="o-last">Тегің</label><input id="o-last" type="text" maxlength="25" required autocomplete="family-name" placeholder="Мысалы: Серікқызы" value="'+esc(OB.last)+'"></div></div>'
     +'<div><label>Бейнеңді таңда</label>'+avsBlock()+'</div>'
     +'<div class="onb-nav"><button class="btn ghost" type="button" data-act="onb-back"><i class="fi fi-rr-arrow-left" aria-hidden="true"></i> Артқа</button><button class="btn primary" type="button" data-act="onb-next">Әрі қарай <i class="fi fi-rr-arrow-right" aria-hidden="true"></i></button></div>'
    :'<h2 id="onb-h">Бағытыңды белгіле</h2><p class="muted">Мақсат анық болса, жол қысқарады. Мұның бәрін кейін Профиль мен ҰБТ бөлімінде өзгертуге болады.</p>'
     +'<form data-form="onb" class="stack"><div class="form-row"><div><label for="o-p1">1-бейіндік пән</label><select id="o-p1">'+optHtml(OB.p1)+'</select></div><div><label for="o-p2">2-бейіндік пән</label><select id="o-p2">'+optHtml(OB.p2)+'</select></div></div>'
     +'<div class="goal-box"><label for="o-goal">Мақсат балың</label><div class="goal-row"><input id="o-goal" type="range" min="50" max="140" step="5" value="'+Math.max(50,OB.goal)+'"><b id="goal-num">'+OB.goal+'</b><span class="muted small">/ 140</span></div><p class="small" id="goal-v">'+goalVerdict(OB.goal)+'</p></div>'
     +'<div><label for="o-date">ҰБТ күні (міндетті емес)</label><input id="o-date" type="date" value="'+esc(OB.date)+'"></div>'
     +'<div><label>Сені не шабыттандырады?</label><div class="chips" role="group" aria-label="Себебім">'+ONB_WHY.map(function(w){return '<button class="chip" type="button" data-act="onb-why" data-v="'+esc(w)+'" aria-pressed="'+(OB.why===w)+'">'+esc(w)+'</button>'}).join('')+'</div></div>'
     +'<div class="onb-nav"><button class="btn ghost" type="button" data-act="onb-back"><i class="fi fi-rr-arrow-left" aria-hidden="true"></i> Артқа</button><button class="btn sky lg" type="submit">Сапарды бастау <i class="fi fi-rr-rocket-lunch" aria-hidden="true"></i></button></div></form>';
  return '<div class="onb-two">'+dots+'<div class="onb-panel">'+(fbReady()&&s===1?'<div class="onb-cloud"><span class="small">Басқа құрылғыда профилің бар ма?</span>'+signInBtn('sm')+'</div>':'')+form+'</div><div class="onb-side">'+passHtml()+'<p class="onb-side-note">Куәлігің сен толтырған сайын жаңарады. Сапар соңында ол профиліңде сақталады.</p></div></div>';
}
var onbFactT=null;
function paintOnbStep(focus){
  var box=$('#onb-step');if(!box)return;box.innerHTML=onbStepHtml();box.classList.remove('in');void box.offsetWidth;box.classList.add('in');
  var o=$('.onb');if(o)o.scrollTop=0;
  clearInterval(onbFactT);if(OB.step===0)onbFactT=setInterval(function(){var p=$('#onb-fact');if(!p||state.profile){clearInterval(onbFactT);return}OB.fact++;p.classList.remove('swap');void p.offsetWidth;p.textContent=ONB_FACTS[OB.fact%ONB_FACTS.length];p.classList.add('swap')},5500);
  if(focus){var f=OB.step===1?$('#o-name'):null;if(f&&!f.value)f.focus()}
}
function drawOnb(){
  var slot=$('#onb-slot');
  if(state.profile){clearInterval(onbFactT);slot.innerHTML='';$('#main').hidden=false;return}
  $('#main').hidden=true;onbInit();
  if(!slot.querySelector('.onb'))slot.innerHTML='<div class="onb" role="dialog" aria-modal="true" aria-labelledby="onb-h">'+onbSky()+'<div class="onb-wrap"><img class="onb-brand" src="img/logo-white.png" alt="Көкжиек" width="960" height="217"><div id="onb-step" class="onb-step"></div></div></div>';
  paintOnbStep(false);
}
function onbReadStep1(){var a=$('#o-name'),b=$('#o-last');if(a)OB.name=cut(a.value,20);if(b)OB.last=cut(b.value,25)}
/* фон қабаттары тінтуірге қарай сәл жылжиды (параллакс) */
document.addEventListener('pointermove',function(e){var s=$('.onb .onb-sky');if(!s)return;var x=e.clientX/innerWidth-.5,y=e.clientY/innerHeight-.5;s.style.setProperty('--px',x.toFixed(3));s.style.setProperty('--py',y.toFixed(3))});
document.addEventListener('input',function(e){
  var el=e.target;if(el.id==='at-q'){atlasSearch(el.value);return}if(el.id==='ck-q'){CK.q=el.value;var cg=$('#ck-grid');if(cg)cg.innerHTML=ckCards();return}if(!el.closest||!el.closest('.onb'))return;
  if(el.id==='o-name')OB.name=cut(el.value,20);else if(el.id==='o-last')OB.last=cut(el.value,25);
  else if(el.id==='o-goal'){OB.goal=parseInt(el.value,10)||100;var gn=$('#goal-num');if(gn)gn.textContent=OB.goal;var gv=$('#goal-v');if(gv)gv.textContent=goalVerdict(OB.goal)}
  else if(el.id==='o-date')OB.date=el.value;else if(el.id==='o-p1')OB.p1=el.value;else if(el.id==='o-p2')OB.p2=el.value;else return;
  paintPass();
});

/* ---------- ҰБТ көмекшілері ---------- */
function subjMeta(){return[{k:'h',name:'Қазақстан тарихы',max:20,min:5},{k:'r',name:'Оқу сауаттылығы',max:10,min:3},{k:'m',name:'Математикалық сауаттылық',max:10,min:3},{k:'a',name:state.ubt.p1,max:50,min:5},{k:'b',name:state.ubt.p2,max:50,min:5}]}
function tot(t){return t.h+t.r+t.m+t.a+t.b}
function sortedTests(){return state.ubt.tests.slice().sort(function(a,b){return a.date.localeCompare(b.date)})}
function lastTest(){var s=sortedTests();return s.length?s[s.length-1]:null}
function countText(){var d=state.ubt.date;if(!d)return {big:'Күнін таңда',n:null};var n=daysFrom(d);if(n>1)return {big:n+' күн қалды',n:n};if(n===1)return {big:'Ертең',n:n};if(n===0)return {big:'Бүгін',n:n};return {big:'Мерзімі өтті',n:n}}
function geoStreak(){var n=0,i=0,d=state.geo.daily;if(!d[addDays(0)])i=1;for(;i<400;i++){if(d[addDays(-i)])n++;else break}return n}
function tasksDone(){return state.tasks.filter(function(t){return t.done}).length}
/* ---------- жетістіктер: 4 сиректік дәрежесі, әрқайсысы бір рет XP береді ---------- */
var RAR=[['Қарапайым',20],['Сирек',50],['Эпостық',150],['Аңыздық',500]];
function bestGame(){var b=state.geo.best;return Object.keys(b).reduce(function(m,k){return k.indexOf('map')===0?m:Math.max(m,b[k]||0)},0)}
function bestMock(){return state.geo.mocks.reduce(function(m,x){return Math.max(m,x.m?x.s/x.m:0)},0)}
function srsLearned(){var s=state.geo.srs,n=0;Object.keys(s).forEach(function(k){if(s[k].b>=4)n++});return n}
function pathDone(){return GEO.topics.filter(function(t){return pathPass(t.id)}).length}
var BADGES=[
 ['first','🎬','Алғашқы қадам','1 география жауабы',0,function(g){return g.a>=1}],
 ['daily1','📝','Алғашқы нұсқа','1 күндік нұсқа шешу',0,function(g){return Object.keys(g.daily).length>=1}],
 ['game1','🎮','Ойыншы','1 ойын ойнау',0,function(g){return g.games>=1}],
 ['card10','📇','Карточкашы','10 карточка қайталау',0,function(g){return Object.keys(g.srs).length>=10}],
 ['map1','📍','Картограф','карта ойынында 10+ ұпай',0,function(g){return (g.best.mapkz||0)>=10||(g.best.mapw||0)>=5}],
 ['a200','🌍','География сарапшысы','200 жауап',1,function(g){return g.a>=200}],
 ['st7','🔥','Апталық қатар','7 күн қатарынан нұсқа',1,function(){return geoStreak()>=7}],
 ['d10','📅','Тұрақты','10 күндік нұсқа',1,function(g){return Object.keys(g.daily).length>=10}],
 ['plan10','🗓','Жоспаршыл','10 тапсырма орындау',1,function(){return tasksDone()>=10}],
 ['path1','🔓','Алғашқы тақырып','1 тақырыпты 75%-дан өту',1,function(){return pathDone()>=1}],
 ['mock1','🎯','Байқау тест','1 байқау тест тапсыру',1,function(g){return g.mocks.length>=1}],
 ['game15','🏆','Ойын шебері','ойында 15+ ұпай',1,function(){return bestGame()>=15}],
 ['w2','🌿','Дала әлемі','6-деңгейге жету',1,function(){return level().n>=6}],
 ['w3','🏔','Таулар әлемі','11-деңгейге жету',1,function(){return level().n>=11}],
 ['a1000','🧠','Білім қоры','1000 жауап',2,function(g){return g.a>=1000}],
 ['st30','🔥','Айлық қатар','30 күн қатарынан нұсқа',2,function(){return geoStreak()>=30}],
 ['path5','🛤','Жол табушы','5 тақырыпты меңгеру',2,function(){return pathDone()>=5}],
 ['mock80','🏅','Сынақ шебері','байқау тестте 80%+',2,function(){return bestMock()>=.8}],
 ['srs100','💎','Есте сақтау','100 карточканы меңгеру',2,function(){return srsLearned()>=100}],
 ['map25','🌐','Саяхатшы','Қазақстан картасында 25+ ұпай',2,function(g){return (g.best.mapkz||0)>=25}],
 ['w4','🌊','Мұхиттар әлемі','16-деңгейге жету',2,function(){return level().n>=16}],
 ['w5','🗺','Материктер әлемі','21-деңгейге жету',2,function(){return level().n>=21}],
 ['pathall','👑','Көкжиек шебері','барлық тақырыпты меңгеру',3,function(){return pathDone()>=GEO.topics.length}],
 ['goal','🎯','Мақсатқа жеттім','сынақ ҰБТ-да мақсат балл',3,function(){var lt=lastTest();return !!lt&&tot(lt)>=state.ubt.goal}],
 ['st100','🏁','Жүз күн','100 күн қатарынан нұсқа',3,function(){return geoStreak()>=100}],
 ['w6','🚀','Планета әлемі','26-деңгейге жету',3,function(){return level().n>=26}],
 ['cx1','💬','Комикс оқырманы','«Ұмыт тұманы» комиксінен 1 кристалл жинау',0,function(){return cmxKeys()>=1}],
 ['cx11','💎','Тұманды жеңуші','Комикстің 24 кристалын түгел жинау',2,function(){var n=cmxEps().length;return n>0&&cmxKeys()>=n}],
 ['ck10','✅','Чеклист шебері','10 чеклистті оқу',1,function(){return Object.keys(state.ckDone).length>=10}],
 ['rid7','🧩','Жұмбақшы','Күн жұмбағын 7 күн қатарынан шешу',2,function(){return ridStreak()>=7}]
];
function badges(){return BADGES.map(function(b){return {id:b[0],ic:b[1],t:b[2],d:b[3],r:b[4],got:state.badgesGot[b[0]]||''}})}
/* Әр сақтау кезінде жаңа жетістік пен деңгейді тексереді. Алғашқы рет бұрын жиналған жетістіктерді үнсіз есептейді. */
function checkProgress(){
  if(!state.profile)return;
  var g=state.geo,got=state.badgesGot,silent=!state.bgInit,n=0,pass=0,added;
  do{added=0;BADGES.forEach(function(b){if(got[b[0]])return;var ok=false;try{ok=!!b[5](g)}catch(e){}if(!ok)return;got[b[0]]=todayKey();state.xp+=RAR[b[4]][1];added++;n++;
    if(!silent)queueReward(b[1],'Жетістік: '+b[2],RAR[b[4]][0]+' · +'+RAR[b[4]][1]+' XP')})}while(added&&++pass<4);
  if(silent){state.bgInit=true;if(n)setTimeout(function(){toast(n+' жетістік есептелді: Профиль бөлімінен қара')},1600)}
  var lv=level();
  if(state.lvl&&lv.n>state.lvl&&!silent){var nw=Math.floor((lv.n-1)/5)!==Math.floor((state.lvl-1)/5);queueReward(nw?WORLDS[lv.w][1]:'🚀',nw?'Жаңа әлем: '+lv.world+'!':'Жаңа деңгей: '+lv.n,lv.name)}
  state.lvl=lv.n;
}

/* ================= БАСТЫ БЕТ ================= */
RENDER.home=function(){
  var now=new Date(),h=now.getHours(),greet=h<5?'Қайырлы түн':h<12?'Қайырлы таң':h<18?'Қайырлы күн':'Қайырлы кеш';
  var c=countText(),lv=level(),nm=state.profile?state.profile.name:'',tk=todayKey(),dg=state.geo.daily[tk];
  var dayT=state.tasks.filter(function(t){return t.scope==='day'}),dayD=dayT.filter(function(t){return t.done}).length;
  var ns=notifs().filter(function(x){return x.task}),q=quoteOfDay(),gs=geoStreak(),pc=state.geo.a?Math.round(state.geo.c/state.geo.a*100):0;
  $('#view-home').innerHTML=
  '<section class="banner has-logo hero '+heroPhase(h)+'">'+heroScene(h)+'<img class="banner-logo" src="img/logo-white.png" alt="Көкжиек логотипі" width="960" height="217"><span class="badge-pill">⭐ '+DAYS[now.getDay()]+', '+now.getDate()+' '+MONTHS[now.getMonth()]+'</span>'
   +'<h1>'+greet+(nm?', '+esc(nm):'')+'! География бойынша ҰБТ-ға бірге дайындаламыз</h1>'
   +'<p>'+(state.why?'Сенің себебің: '+esc(state.why):'Күн сайын жаңа нұсқа, ҰБТ форматындағы тапсырмалар, ойындар және жоспар бір жерде.')+'</p>'
   +'<div class="row"><a class="btn sky" href="#geo">'+(dg?'Бүгінгі нұсқа: '+dg.s+'/'+dg.m:'Бүгінгі нұсқаны бастау')+'</a><a class="btn light" href="#books">Оқулық</a></div></section>'
  +'<nav class="seg" aria-label="Бөлімдер">'
   +segA('geo','🌍','География')+segA('books','📚','Оқулық')+segA('atlas','🗺','Атлас')+segA('games','🎮','Ойындар')+segA('comics','💬','Комикс')+segA('prof','🎓','Мамандықтар')+segA('ubt','🎯','ҰБТ')+segA('plan','🗓','Жоспар')+segA('grow','🌱','Даму')+segA('video','▶️','Видео')+segA('other','🗂','Басқа пәндер')+segA('class','🏆','Сынып')+segA('atlas','🗺','Атлас')+segA('comics','💬','Комикс')+segA('checklist','✅','Чеклист')+'<a href="#me" class="special"><span class="ic" aria-hidden="true">👤</span>Профиль</a></nav>'
  +(ns.length?'<div class="card" style="border-color:#fecaca;background:var(--bad-soft)"><b>⏰ Назар аудар:</b> '+esc(ns[0].t)+(ns.length>1?' және тағы '+(ns.length-1)+' ескерту':'')+'. <a href="#plan">Жоспарға өту</a></div>':'')
  +ridCard()+remNudge()+cuCard('home')+wpTodayHtml()
  +'<div class="grid g4" style="margin-bottom:18px">'
   +statCard('ҰБТ-ға дейін',esc(c.big),state.ubt.date?fmtFull(state.ubt.date):'Күнін «ҰБТ» бөлімінде таңда')
   +statCard('Деңгей '+lv.n+' · '+lv.name,state.xp+' <small>XP</small>','<div class="lvl"><i style="width:'+lv.p+'%"></i></div>')
   +statCard('География',pc+'% <small>дұрыс</small>',state.geo.a+' жауап · '+(gs?'<span class="flame">🔥</span> '+gs+' күн':'қатар жоқ'))
   +statCard('Күндік тапсырмалар',dayD+' / '+dayT.length,'барлығы '+state.tasks.filter(function(t){return !t.done}).length+' ашық тапсырма')
  +'</div>'
  +'<div class="card today-act"><div class="row between"><div><div class="eyebrow">📅 Бүгінгі әрекеттерің</div><b>'+esc(actLine(state.log[tk]))+'</b></div><a class="btn sm" href="#me">Күнделік</a></div></div>'
  +factHtml()
  +'<div class="quote"><div class="eyebrow">✨ Күннің сөзі</div><p>'+esc(q.t)+'</p><div class="row between"><cite>— '+esc(q.a)+'</cite><button class="btn sm" data-act="next-quote" type="button">Басқа сөз</button></div></div>'
  +'<div class="sec-h"><h2>Бүгін не істейміз?</h2></div><div class="grid g4">'
   +homeTile('geo','📝','Күнделікті нұсқа','20 тапсырма, 25 балл, ҰБТ форматында')
   +homeTile('books','📖','Оқулық оқу',(function(){var lb=lastBook();return lb?'Жалғастыр: '+lb.grade+'-сынып, '+rd(lb.id).p+'-бет':'16 оқулық, онлайн оқу режимі'})())
   +homeTile('games','🎮','5 минут ойын','Карта ойыны, астаналар, терминдер')
   +homeTile('plan','✅','Жоспардағы тапсырма',dayT.length?(dayT.length-dayD)+' тапсырма қалды':'Күндік жоспар құр')
  +'</div>';
};
/* Басты беттің баннері: таң, күндіз, кеш, түн — сағатқа қарай аспан ауысады; күн/ай, бұлт, тау, ұшақ, изосызықтар қозғалады */
function heroPhase(h){return h<6||h>=21?'night':h<9?'dawn':h<17?'day':'dusk'}
var HERO_CACHE={};
function heroScene(h){
  var ph=heroPhase(h);if(HERO_CACHE[ph])return HERO_CACHE[ph];
  var stars='';if(ph==='night'||ph==='dusk'||ph==='dawn')for(var i=0;i<46;i++){stars+='<i style="left:'+(Math.random()*100).toFixed(1)+'%;top:'+(Math.random()*60).toFixed(1)+'%;animation-delay:'+(Math.random()*4).toFixed(2)+'s"></i>'}
  var far=onbRidge([[0,150],[110,110],[200,135],[320,70],[420,118],[520,92],[640,140],[760,80],[880,128],[990,100],[1110,150],[1230,88],[1340,126],[1440,150]]);
  var near=onbRidge([[0,182],[140,150],[260,172],[380,128],[500,166],[640,140],[780,176],[900,134],[1040,168],[1180,142],[1320,172],[1440,182]]);
  var cloud='<svg viewBox="0 0 120 50"><path d="M20 42h80a16 16 0 0 0 0-32 22 22 0 0 0-41-6A18 18 0 0 0 20 42z"/></svg>';
  return HERO_CACHE[ph]='<div class="hs" aria-hidden="true"><div class="hs-stars">'+stars+'</div>'
   +'<svg class="hs-topo" viewBox="0 0 1200 600" preserveAspectRatio="xMidYMid slice"><g>'+onbContours(260,200,6)+onbContours(980,330,5)+'</g></svg>'
   +'<div class="hs-orb '+(ph==='night'?'moon':'sun')+'"></div>'
   +'<div class="hs-cloud c1">'+cloud+'</div><div class="hs-cloud c2">'+cloud+'</div><div class="hs-cloud c3">'+cloud+'</div>'
   +'<div class="hs-plane"><i class="fi fi-rr-plane-alt"></i></div>'
   +'<div class="hs-mount far"><svg viewBox="0 0 2880 220" preserveAspectRatio="none"><path d="'+far+'"/></svg></div>'
   +'<div class="hs-mount near"><svg viewBox="0 0 2880 220" preserveAspectRatio="none"><path d="'+near+'"/></svg></div></div>';
}
function segA(h,ic,t){return '<a href="#'+h+'"><span class="ic" aria-hidden="true">'+ic+'</span>'+esc(t)+'</a>'}
function statCard(e,v,s){return '<div class="card" style="margin:0"><div class="eyebrow">'+e+'</div><div class="stat">'+v+'</div><div class="muted small" style="margin-top:6px">'+s+'</div></div>'}
function homeTile(h,ic,t,d){return '<a class="tile" href="#'+h+'"><span class="ico" aria-hidden="true">'+ic+'</span><b>'+esc(t)+'</b><span class="d">'+esc(d)+'</span></a>'}
function globeSvg(){return '<svg class="globe" viewBox="0 0 200 200" aria-hidden="true"><g fill="none" stroke="#fff" stroke-width="2"><circle cx="100" cy="100" r="90"/><ellipse cx="100" cy="100" rx="45" ry="90"/><ellipse cx="100" cy="100" rx="15" ry="90"/><path d="M10 100h180M22 55h156M22 145h156"/></g></svg>'}

/* ================= ТЕСТ ҚОЗҒАЛТҚЫШЫ ================= */
/* item: {k:'s'|'c'|'m'|'x', g:true(география)|false, sid, q, ctx, perm, ord, rord, ans, chk, pts} */
var R=null,CD=null,mockIv=null;
function itemS(q,r,ctx,g,sid){return {k:ctx?'c':'s',g:g,sid:sid||'geo',q:q,ctx:ctx||null,perm:shuffle([0,1,2,3],r),ans:null,chk:false,pts:0}}
function itemM(q,r){return {k:'m',g:true,sid:'geo',q:q,ord:shuffle(q.o.map(function(_,i){return i}),r),ans:[],chk:false,pts:0}}
function itemX(q,r){return {k:'x',g:true,sid:'geo',q:q,rord:shuffle(q.R.map(function(_,i){return i}),r),ans:q.L.map(function(){return -1}),chk:false,pts:0}}
function maxPts(it){return it.k==='m'||it.k==='x'?2:1}
function stopMock(){if(mockIv){clearInterval(mockIv);mockIv=null}}
function startRun(title,mode,items,back,mins,exam){
  stopMock();R={title:title,mode:mode,items:items,pos:0,score:0,max:items.reduce(function(a,it){return a+maxPts(it)},0),done:false,back:back||cur,by:{},exam:!!exam,rv:'miss'};CD=null;
  if(mins){R.endAt=Date.now()+mins*60000;mockIv=setInterval(function(){var el=$('#mock-time');var left=Math.max(0,Math.ceil((R.endAt-Date.now())/1000));if(el)el.textContent='⏱ '+pad(Math.floor(left/60))+':'+pad(left%60);if(left<=0){if(R&&R.exam)finishExam();else finishRun()}},500)}
  showRun();
}
function showRun(){var v=R?R.back:(CD?CD.back:cur);if(cur!==v)location.hash='#'+v;else RENDER[v]();window.scrollTo(0,0)}
function pickCtx(r){return GEO.context.length?GEO.context[Math.floor(r()*GEO.context.length)]:null}
/* Қайталанбайтын іріктеу: алдымен оқушы әлі көрмеген тапсырмалар алынады; бәрі көрілсе, цикл жаңадан басталады */
function pickFresh(pool,n,r,skip){var s=state.geo.seen,f=[],o=[];skip=skip||{};pool.forEach(function(q){if(skip[q.id])return;(s[q.id]?o:f).push(q)});var out=shuffle(f,r).slice(0,n);if(out.length<n){pool.forEach(function(q){delete s[q.id]});out=out.concat(shuffle(o,r).slice(0,n-out.length))}out.forEach(function(q){skip[q.id]=1});return out}
function freshCount(){var s=state.geo.seen,n=0;GEO.single.forEach(function(q){if(!s[q.id])n++});return n}
var SHORT=null;function shortPool(){if(!SHORT)SHORT=GEO.single.filter(function(q){return q.o[0].length<=70&&q.q.length<=170});return SHORT}
/* Оқулық сұрақтарынан автоматты түрде құралатын сәйкестендіру және көп жауапты тапсырмалар */
function genMatch(r,skip){var ps=pickFresh(shortPool(),3,r,skip),R=ps.map(function(q){return q.o[0]});if(R[0]===R[1]||R[1]===R[2]||R[0]===R[2])return null;var d=ps[0].o[1+Math.floor(r()*3)];if(R.indexOf(d)<0)R.push(d);
  return {gen:'x',id:'gx:'+hash(ps.map(function(q){return q.id}).join()),t:ps[0].t,q:'Сұрақ пен оның дұрыс жауабын сәйкестендіріңіз.',L:ps.map(function(q){return q.q}),R:R,a:[0,1,2],e:ps.map(function(q){return q.e}).join(' '),parts:ps.map(function(q){return q.id}),src:ps[0].src||''}}
function genMulti(r,skip){var ps=pickFresh(shortPool(),6,r,skip),nt=2+Math.floor(r()*2);
  return {gen:'m',id:'gm:'+hash(ps.map(function(q){return q.id}).join()),t:ps[0].t,q:'Төмендегі «сұрақ — жауап» жұптарының қайсысы дұрыс?',o:ps.map(function(q,i){return q.q.replace(/\?\s*$/,'')+' — '+(i<nt?q.o[0]:q.o[1+Math.floor(r()*3)])}),a:ps.map(function(_,i){return i}).slice(0,nt),e:ps.slice(0,nt).map(function(q){return q.o[0]}).join('; ')+' — дұрыс жұптар.',parts:ps.map(function(q){return q.id}),src:''}}
function geoVariant(seedStr,nS,nCtx,nM,nX){
  var r=rng(hash(seedStr+':'+Date.now())),items=[],skip={};
  pickFresh(GEO.single,nS,r,skip).forEach(function(q){items.push(itemS(q,r,null,true))});
  if(nCtx){var cs=GEO.context.map(function(c){return {id:'C:'+c.id,c:c}}),c=pickFresh(cs,1,r)[0];if(c)c.c.qs.forEach(function(q){items.push(itemS(q,r,c.c,true))})}
  var ms=pickFresh(GEO.multi,Math.ceil(nM/2),r,skip);while(ms.length<nM){var gm=genMulti(r,skip);if(gm)ms.push(gm);else break}
  shuffle(ms,r).forEach(function(q){items.push(itemM(q,r))});
  var xs=pickFresh(GEO.match,Math.ceil(nX/2),r,skip),tries=0;while(xs.length<nX&&tries++<8){var gx=genMatch(r,skip);if(gx)xs.push(gx)}
  shuffle(xs,r).forEach(function(q){items.push(itemX(q,r))});
  return items;
}
function evalItem(it){
  if(it.k==='s'||it.k==='c'){it.pts=it.perm[it.ans]===0?1:0}
  else if(it.k==='m'){var a=it.q.a,s=it.ans,diff=0;s.forEach(function(i){if(a.indexOf(i)<0)diff++});a.forEach(function(i){if(s.indexOf(i)<0)diff++});it.pts=diff===0?2:diff===1?1:0}
  else{var wrong=0;it.ans.forEach(function(v,i){if(v!==it.q.a[i])wrong++});it.pts=wrong===0?2:wrong===1?1:0}
  it.chk=true;R.score+=it.pts;
  var key=it.g?'geo':it.sid,b=R.by[key]||(R.by[key]={c:0,t:0});b.t+=maxPts(it);b.c+=it.pts;
  recordItem(it,it.pts===maxPts(it));
}
function recordItem(it,ok){
  if(it.g){
    var g=state.geo;g.a++;if(ok)g.c++;var tp=it.q.t||(it.ctx&&it.ctx.t)||'';
    if(tp){var t=g.topic[tp]||(g.topic[tp]={a:0,c:0});t.a++;if(ok)t.c++}
    var ids=[it.q.id];
    if(it.q.parts){ids=[];it.q.parts.forEach(function(pid,i){g.seen[pid]=1;var bad=it.k==='x'?it.ans[i]!==it.q.a[i]:((it.ans.indexOf(i)>-1)!==(it.q.a.indexOf(i)>-1));if(bad&&g.wrong.indexOf(pid)<0)g.wrong.push(pid)})}
    else{g.seen[it.q.id]=1;if(it.ctx)g.seen['C:'+it.ctx.id]=1}
    ids.forEach(function(id){var ix=g.wrong.indexOf(id);if(!ok&&ix<0)g.wrong.push(id);if(ok&&ix>-1&&R&&R.mode==='wrong')g.wrong.splice(ix,1)});
  }else{
    var st=state.stats;st.a++;if(ok)st.c++;var ss=st.subj[it.sid]||(st.subj[it.sid]={a:0,c:0});ss.a++;if(ok)ss.c++;
    var idx=-1;for(var i=0;i<state.wrong.length;i++)if(state.wrong[i].s===it.sid&&state.wrong[i].q===it.q.q){idx=i;break}
    if(!ok&&idx<0)state.wrong.push({s:it.sid,q:it.q.q});if(ok&&idx>-1&&R&&R.mode==='wrong')state.wrong.splice(idx,1);
  }
  act('q');if(ok)act('c');
  if(ok)state.xp+=2;save();
}
function finishRun(){
  if(!R||R.done)return;stopMock();R.done=true;var tk=todayKey(),pc=R.max?Math.round(R.score/R.max*100):0;
  if(R.mode==='geo-daily'){act('d');var old=state.geo.daily[tk];if(!old||R.score>=old.s)state.geo.daily[tk]={s:R.score,m:R.max};if(!old)state.xp+=15}
  if(R.mode==='geo-mock'){state.xp+=20;act('m');state.geo.mocks.push({d:tk,s:R.score,m:R.max});if(state.geo.mocks.length>40)state.geo.mocks.shift()}
  if(R.mode==='geo-path'&&R.topic){var prev=state.geo.path[R.topic]||0;if(pc>prev)state.geo.path[R.topic]=pc;act('e');
    if(pc>=PASS&&prev<PASS){state.xp+=30;var nx=pathNext(),tn=topicById(R.topic);queueReward('🔓','Тақырып меңгерілді!',(tn?tn.name+' · ':'')+pc+'% · +30 XP'+(nx?' · Келесі ашылды: '+nx.name:''))}}
  if(R.mode==='catchup'){state.cuDone[tk]={s:R.score,m:R.max};state.xp+=10;act('u');var ks=Object.keys(state.cuDone).sort();while(ks.length>120)delete state.cuDone[ks.shift()]}
  var MK={'geo-daily':'daily','geo-mock':'mock','geo-path':'path','geo-topic':'topic','catchup':'catchup'};if(R.mode==='wrong'&&R.back==='geo')MK.wrong='wrong';
  if(MK[R.mode])planMark(MK[R.mode],R.topic);
  save();drawTop();
  if(R.max&&R.score/R.max>=.8)reward('🏆','Керемет нәтиже!',R.score+' / '+R.max+' балл');
  showRun();
}
/* Байқау тест: жауаптар соңында бір-ақ рет тексеріледі */
function finishExam(){if(!R||R.done)return;R.items.forEach(function(it){if(!it.chk)evalItem(it)});finishRun()}
var LET=['A','B','C','D','E','F'];
function isAnswered(it){return it.k==='m'?it.ans.length>0:it.k==='x'?it.ans.some(function(v){return v>-1}):it.ans!=null}
function rightText(it){var q=it.q;if(it.k==='m')return q.a.map(function(i){return q.o[i]}).join(', ');if(it.k==='x')return q.L.map(function(l,i){return l+' — '+q.R[q.a[i]]}).join('; ');return q.o[0]}
function ansText(it){var q=it.q;if(it.k==='m')return it.ans.length?it.ans.map(function(i){return q.o[i]}).join(', '):'жауап жоқ';if(it.k==='x')return it.ans.some(function(v){return v>-1})?q.L.map(function(l,i){return l+' — '+(it.ans[i]>-1?q.R[it.ans[i]]:'?')}).join('; '):'жауап жоқ';return it.ans!=null?q.o[it.perm[it.ans]]:'жауап жоқ'}
var TYPE_NAME={s:'Бір дұрыс жауап',c:'Контекст негізіндегі тапсырма',m:'Бір немесе бірнеше дұрыс жауап',x:'Сәйкестендіру'};
function qBody(it){
  var q=it.q,ex=!!(R&&R.exam&&!R.done);
  if(it.k==='s'||it.k==='c'){
    var cp=it.perm.indexOf(0);
    return (it.ctx?'<div class="passage"><b>'+esc(it.ctx.title)+'</b>\n'+esc(it.ctx.text)+'</div>':(it.sid!=='geo'&&!it.g&&subjById(it.sid)&&subjById(it.sid).passages&&q.p!=null?'<div class="passage">'+esc(subjById(it.sid).passages[q.p])+'</div>':''))
     +'<div class="q-text">'+esc(q.q)+'</div><div class="opts">'+it.perm.map(function(oi,i){var cls='opt';if(it.chk){if(i===cp)cls+=' ok';else if(i===it.ans)cls+=' bad'}else if(it.ans===i)cls+=' sel';return '<button class="'+cls+'" type="button" data-act="ans" data-i="'+i+'"'+(it.chk?' disabled':'')+(ex?' aria-pressed="'+(it.ans===i)+'"':'')+'><span class="k">'+LET[i]+'</span><span>'+esc(q.o[oi])+'</span></button>'}).join('')+'</div>';
  }
  if(it.k==='m'){
    return '<div class="q-text">'+esc(q.q)+'</div><p class="muted small">Бір немесе бірнеше дұрыс жауапты белгіле'+(ex?'':', кейін «Тексеру» бас')+'. Толық дұрыс — 2 балл, бір қате — 1 балл.</p><div class="opts">'
     +it.ord.map(function(oi,i){var on=it.ans.indexOf(oi)>-1,cor=q.a.indexOf(oi)>-1,cls='opt';if(it.chk){if(on&&cor)cls+=' ok';else if(on&&!cor)cls+=' bad';else if(!on&&cor)cls+=' miss'}else if(on)cls+=' sel';
       return '<button class="'+cls+'" type="button" data-act="mtog" data-v="'+oi+'" aria-pressed="'+on+'"'+(it.chk?' disabled':'')+'><span class="k">'+(on?'✓':LET[i])+'</span><span>'+esc(q.o[oi])+'</span></button>'}).join('')+'</div>';
  }
  return '<div class="q-text">'+esc(q.q)+'</div><p class="muted small">Әр элементке сәйкес жауапты таңда. Толық дұрыс — 2 балл, бір қате — 1 балл.</p>'
   +q.L.map(function(l,i){var v=it.ans[i],cls='mrow';if(it.chk)cls+=v===q.a[i]?' ok':' bad';
     return '<div class="'+cls+'"><label for="mx'+i+'"><b>'+LET[i]+')</b> '+esc(l)+'</label><select id="mx'+i+'" data-act="xsel" data-i="'+i+'"'+(it.chk?' disabled':'')+'><option value="-1">Таңда…</option>'+it.rord.map(function(ri){return '<option value="'+ri+'"'+(v===ri?' selected':'')+'>'+esc(q.R[ri])+'</option>'}).join('')+'</select></div>'}).join('');
}
function runHtml(){
  if(R.exam)return examHtml();
  var it=R.items[R.pos],q=it.q,n=R.items.length,after='';
  if(it.chk){
    var full=it.pts===maxPts(it),tp=it.g?topicById(it.q.t||(it.ctx&&it.ctx.t)):null;
    after='<div class="explain '+(full?'good':'')+'" role="status"><b>'+(full?'Дұрыс! ':it.pts?'Жартылай дұрыс ('+it.pts+' балл). ':'Қате. ')+'</b>'+(full?'':'Дұрыс жауап: '+esc(rightText(it))+'. ')+esc(q.e)+'</div>'
     +(it.g?srcHint(q,tp,full):'')
     +'<div class="row" style="margin-top:14px"><button class="btn primary" data-act="next" type="button">'+(R.pos+1>=n?'Нәтижені көру':'Келесі тапсырма')+'</button></div>';
  }else if(it.k==='m'||it.k==='x'){
    var ready=it.k==='m'?it.ans.length>0:it.ans.every(function(v){return v>-1});
    after='<div class="row" style="margin-top:14px"><button class="btn primary" data-act="check" type="button"'+(ready?'':' disabled')+'>Тексеру</button></div>';
  }
  return '<div class="row between" style="margin-bottom:12px"><button class="btn ghost sm" data-act="quit" type="button">← Шығу</button>'+(R.endAt?'<span class="mtimer" id="mock-time">⏱</span>':'')+'<span class="pill">'+(R.pos+1)+' / '+n+' · '+R.score+' балл</span></div>'
   +'<div class="bar" style="margin-bottom:16px" aria-hidden="true"><i style="width:'+Math.round((R.pos+(it.chk?1:0))/n*100)+'%"></i></div>'
   +'<div class="card q-card"><div class="q-meta"><b>'+esc(R.title)+'</b><span class="pill sky">'+TYPE_NAME[it.k]+' · '+maxPts(it)+' балл</span></div>'+qBody(it)+after+'</div>';
}
/* Байқау тест экраны: тапсырмалар картасы, белгілеу, кез келген тапсырмаға оралу */
function examHtml(){
  var it=R.items[R.pos],n=R.items.length,answered=R.items.filter(isAnswered).length,left=n-answered;
  var nav='<div class="ex-nav" role="group" aria-label="Тапсырмалар картасы">'+R.items.map(function(x,i){return '<button type="button" class="'+(i===R.pos?'cur ':'')+(isAnswered(x)?'on ':'')+(x.flag?'flag':'')+'" data-act="ex-go" data-i="'+i+'" aria-label="'+(i+1)+'-тапсырма'+(isAnswered(x)?', жауап берілді':'')+(x.flag?', белгіленген':'')+'"'+(i===R.pos?' aria-current="step"':'')+'>'+(i+1)+'</button>'}).join('')+'</div>';
  var fin=R.confirm?'<div class="explain" role="alert"><b>Тағы '+left+' тапсырмаға жауап берілмеді.</b> Жауапсыз тапсырма 0 балл болады. Тестті аяқтайсың ба?<div class="row" style="margin-top:10px"><button class="btn primary" data-act="ex-finish" data-f="1" type="button">Иә, аяқтау</button><button class="btn" data-act="ex-cancel" type="button">Жалғастыру</button></div></div>':'';
  return '<div class="row between" style="margin-bottom:12px"><button class="btn ghost sm" data-act="quit" type="button">← Шығу</button>'+(R.endAt?'<span class="mtimer" id="mock-time">⏱</span>':'')+'<span class="pill">Жауап берілді: '+answered+' / '+n+'</span></div>'
   +'<div class="card ex-card"><div class="row between" style="margin-bottom:10px"><b>'+esc(R.title)+'</b><span class="small muted">Жауаптар соңында тексеріледі</span></div>'+nav
   +'<div class="ex-leg small muted"><span><i class="ex-lg on"></i> жауап берілді</span><span><i class="ex-lg flag"></i> кейін қарау</span><span><i class="ex-lg"></i> жауап жоқ</span></div></div>'
   +'<div class="card q-card"><div class="q-meta"><b>'+(R.pos+1)+'-тапсырма</b><span class="pill sky">'+TYPE_NAME[it.k]+' · '+maxPts(it)+' балл</span></div>'+qBody(it)
   +'<div class="row between ex-foot"><div class="row"><button class="btn" data-act="ex-prev" type="button"'+(R.pos?'':' disabled')+'>← Алдыңғы</button><button class="btn ghost" data-act="ex-flag" type="button" aria-pressed="'+!!it.flag+'">🚩 '+(it.flag?'Белгіні алу':'Кейін қарау')+'</button></div>'
   +'<div class="row">'+(R.pos+1<n?'<button class="btn primary" data-act="ex-next" type="button">Келесі →</button>':'')+'<button class="btn'+(R.pos+1<n?'':' primary')+'" data-act="ex-finish" type="button">Тестті аяқтау</button></div></div>'+fin+'</div>';
}
function reviewHtml(){
  var rows=R.items.map(function(it,i){return {it:it,i:i}}).filter(function(x){return R.rv==='all'||x.it.pts<maxPts(x.it)});
  return '<div class="card"><div class="row between"><h2 style="margin:0">Жауаптарды талдау</h2><div class="chips"><button class="chip" type="button" data-act="rv" data-v="miss" aria-pressed="'+(R.rv!=='all')+'">Тек қателер</button><button class="chip" type="button" data-act="rv" data-v="all" aria-pressed="'+(R.rv==='all')+'">Барлығы</button></div></div>'
   +(rows.length?rows.map(function(x){var it=x.it,full=it.pts===maxPts(it),tp=it.g?topicById(it.q.t||(it.ctx&&it.ctx.t)):null;
     return '<div class="rv-item '+(full?'ok':it.pts?'part':'bad')+'"><div class="row between"><b>'+(x.i+1)+'-тапсырма'+(tp?' · '+esc(tp.name):'')+'</b><span class="pill '+(full?'green':it.pts?'amber':'rose')+'">'+it.pts+' / '+maxPts(it)+' балл</span></div>'
      +(it.ctx?'<p class="small muted" style="margin:6px 0 0">Мәтін: '+esc(it.ctx.title)+'</p>':'')
      +'<p style="margin:6px 0">'+esc(it.q.q)+'</p><p class="small" style="margin:0"><b>Сенің жауабың:</b> '+esc(ansText(it))+'</p>'+(full?'':'<p class="small" style="margin:4px 0 0"><b>Дұрыс жауап:</b> '+esc(rightText(it))+'</p>')
      +(it.q.e?'<p class="small muted" style="margin:6px 0 0">'+esc(it.q.e)+'</p>':'')+(it.g?srcHint(it.q,tp,full):'')+'</div>'}).join(''):'<p class="empty">Қате жоқ. Керемет!</p>')+'</div>';
}
function resultExtra(p){
  if(R.mode==='geo-path'){var ok=p>=PASS,nx=pathNext();return '<p><span class="pill '+(ok?'green':'rose')+'">'+(ok?'Тақырып меңгерілді: '+PASS+'%-дан өттің':'Өту шегі — '+PASS+'%. Конспектті қайталап, қайта тапсыр')+'</span></p>'+(ok&&nx?'<p class="small muted">Келесі тақырып ашылды: <b>'+esc(nx.name)+'</b></p>':'')}
  if(R.mode==='geo-mock'){var ms=state.geo.mocks,prev=ms.length>1?ms[ms.length-2]:null;return prev?'<p class="small muted">Алдыңғы байқау тест: '+prev.s+' / '+prev.m+' балл ('+fmtDate(prev.d)+')</p>':''}
  if(R.mode==='catchup')return '<p class="small muted">Бағдарлама сабағы: +10 XP. Енді 10 карточка қайтала, сонда бүгінгі жоспар толық орындалады.</p>';
  return '';
}
function srcHint(q,tp,full){
  var b=q.src&&q.src.b?bookById(q.src.b):null;
  if(full&&!b)return '';
  return '<div class="book-hint">📘 '+(b?'<b>Оқулықта:</b> '+esc(bookLabel(b))+', '+q.src.p+'-бет. <a href="#books" data-act="book-goto" data-b="'+b.id+'" data-p="'+q.src.p+'">Оқулықтан ашу</a>':'')
   +(full?'':(b?' · ':'')+'<b>Қайтала:</b> «'+esc(tp?tp.name:'География')+'». <a href="#geo" data-act="open-topic" data-id="'+esc(tp?tp.id:'')+'">Конспект</a>')+'</div>';
}
function resultHtml(){
  var p=R.max?Math.round(R.score/R.max*100):0,CI=2*Math.PI*60,miss=R.items.filter(function(it){return it.chk&&it.pts<maxPts(it)}),skip=R.items.filter(function(it){return !it.chk}).length;
  var msg=p>=80?'Тамаша нәтиже! Осы қарқынды сақта.':p>=50?'Жақсы бастама. Қателерді талдап, қайта шығып көр.':'Қиын болды, бірақ өсу осы жерден басталады. Конспектті қайта оқы.';
  var topics={};miss.forEach(function(it){var t=it.g?topicById(it.q.t||(it.ctx&&it.ctx.t)):null;var n=t?t.name:(subjById(it.sid)?subjById(it.sid).name:'');if(n)topics[n]=(topics[n]||0)+1});
  return '<div class="card" style="text-align:center"><h1>'+esc(R.title)+'</h1>'
   +'<div class="score-ring"><svg viewBox="0 0 140 140" aria-hidden="true"><circle class="tr" cx="70" cy="70" r="60"/><circle class="pg" cx="70" cy="70" r="60" stroke-dasharray="'+CI+'" stroke-dashoffset="'+(CI*(1-p/100))+'"/></svg><b>'+p+'%</b></div>'
   +'<p><b>'+R.score+' / '+R.max+'</b> балл'+(skip?' ('+skip+' тапсырмаға жауап берілмеді)':'')+'</p><p class="muted">'+msg+'</p>'
   +(Object.keys(topics).length?'<div style="text-align:left;max-width:520px;margin:0 auto 14px"><b>Қайталайтын тақырыптар:</b><div class="chips" style="margin-top:8px">'+Object.keys(topics).map(function(t){return '<span class="pill rose">'+esc(t)+' · '+topics[t]+'</span>'}).join('')+'</div></div>':'')
   +resultExtra(p)+'<div class="row" style="justify-content:center">'+(miss.length?'<button class="btn primary" data-act="retry-missed" type="button">Қателерді қайта шығу</button>':'')+(R.mode==='catchup'?'<button class="btn sky" data-act="srs-open" type="button">Карточкаларды қайталау</button>':'')+'<button class="btn" data-act="quit" type="button">Мәзірге оралу</button></div></div>'+(R.exam?reviewHtml():'');
}
function cardsHtml(){
  if(CD.srs)return srsHtml();
  var q=CD.items[CD.pos],n=CD.items.length;
  return '<div class="row between" style="margin-bottom:12px"><button class="btn ghost sm" data-act="quit" type="button">← Шығу</button><span class="pill">'+esc(CD.title)+' · '+(CD.pos+1)+' / '+n+'</span></div>'
   +'<div class="card"><button class="flash-in'+(CD.flip?' back':'')+'" type="button" data-act="flip" aria-label="Карточканы аудару">'+(CD.flip?'<span><b>'+esc(q.o[0])+'</b><br><span class="small" style="font-weight:500">'+esc(q.e)+'</span></span>':'<span>'+esc(q.q)+'</span>')+'</button>'
   +'<p class="muted small" style="text-align:center;margin:10px 0">'+(CD.flip?'Жауап көрсетілді':'Жауапты көру үшін карточканы бас')+'</p>'
   +'<div class="row" style="justify-content:center"><button class="btn" data-act="card-prev" type="button"'+(CD.pos?'':' disabled')+'>← Алдыңғы</button><button class="btn primary" data-act="card-next" type="button">'+(CD.pos+1>=n?'Қайта бастау':'Келесі →')+'</button></div></div>';
}

/* ================= ГЕОГРАФИЯ ================= */
/* ---------- іске қосу функциялары: батырмалар мен апталық жоспар осыларды шақырады ---------- */
function startDaily(){startRun('География · №'+variantNo()+' нұсқа','geo-daily',geoVariant('geo'+todayKey(),10,1,3,2),'geo')}
function startMock(){startRun('Байқау тест · ҰБТ форматы','geo-mock',geoVariant('mock'+Date.now(),25,1,5,5),'geo',80,true)}
function startTopic(id){var tp=topicById(id),ti=tp?topicItems(id):[];if(!ti.length){toast('Бұл тақырыпқа тапсырма әлі қосылмаған');return}startRun(tp.name,'geo-topic',ti,'geo');R.topic=id}
function startPath(id){var i=pathIndex(id),tp=topicById(id);if(!tp)return;if(!pathOpen(i)){toast('Алдымен алдыңғы тақырыптан '+PASS+'%-дан өт');return}var ti=topicItems(id);if(!ti.length){toast('Бұл тақырыпқа тапсырма әлі қосылмаған');return}startRun(tp.name+' · тақырып емтиханы','geo-path',ti,'geo');R.topic=id}
function startWrong(tp){var wi=[];state.geo.wrong.forEach(function(id){var x=GIDX[id];if(!x)return;if(tp&&(x.q.t||(x.ctx&&x.ctx.t))!==tp)return;if(x.k==='m')wi.push(itemM(x.q,Math.random));else if(x.k==='x')wi.push(itemX(x.q,Math.random));else wi.push(itemS(x.q,Math.random,x.ctx,true))});if(!wi.length){toast('Қателер дәптері бос');return}startRun('Қателер дәптері'+(tp&&topicById(tp)?' · '+topicById(tp).name:''),'wrong',shuffle(wi).slice(0,15),'geo')}
function startCatchup(){var it=cuItems();if(!it.length){toast('Тапсырма табылмады');return}startRun('Қуып жету · бүгінгі сабақ','catchup',it,'geo')}

/* ---------- тақырып жолы: тақырып емтиханынан 75%-дан өтсең, келесі тақырып ашылады ---------- */
var PASS=75;
function topicHasExam(id){return GEO.single.some(function(q){return q.t===id})}
function pathPass(id){return (state.geo.path[id]||0)>=PASS||!topicHasExam(id)}
function pathIndex(id){for(var i=0;i<GEO.topics.length;i++)if(GEO.topics[i].id===id)return i;return -1}
function pathOpen(i){return i<=0||pathPass(GEO.topics[i-1].id)}
function pathNext(){for(var i=0;i<GEO.topics.length;i++)if(!pathPass(GEO.topics[i].id))return GEO.topics[i];return null}
function pathHtml(){
  var T=GEO.topics,done=T.filter(function(t){return pathPass(t.id)}).length;
  return '<div class="card"><div class="eyebrow">🛤 Тақырып жолы</div><h2 style="margin:0">'+done+' / '+T.length+' тақырып меңгерілді</h2><p class="muted small" style="margin-top:6px">Әр тақырыптың емтиханынан '+PASS+'%-дан жоғары жинасаң, келесі тақырып ашылады. Конспект, жаттығу және карточкалар әрқашан ашық.</p><div class="bar green" style="margin:10px 0 14px"><i style="width:'+Math.round(done/Math.max(1,T.length)*100)+'%"></i></div><ol class="path">'
   +T.map(function(t,i){var ok=pathPass(t.id),op=pathOpen(i),b=state.geo.path[t.id];
     return '<li class="'+(ok?'ok':op?'open':'lock')+'"><span class="dot" aria-hidden="true">'+(ok?'✓':op?(i+1):'🔒')+'</span><div class="t"><b>'+esc(t.name)+'</b><span class="small muted">'+(b?'Ең жақсы нәтиже: '+b+'%':!topicHasExam(t.id)?'Емтихан әлі жоқ':op?'Ашық: емтиханды тапсыр':PASS+'%-дан өтсең ашылады')+'</span></div>'
      +(op&&topicHasExam(t.id)?'<button class="btn sm'+(ok?'':' primary')+'" type="button" data-act="path-run" data-id="'+t.id+'">'+(ok?'Қайта тапсыру':'Емтихан')+'</button>':op?'':'<span class="pill">Жабық</span>')+'</li>'}).join('')+'</ol></div>';
}

/* ---------- карточкалар: аралықты қайталау (Лейтнер жүйесі, 6 қорап) ---------- */
var SRS_DAYS=[0,1,3,7,14,30],SRS_NEW=10,SRS_MAX=25;
function srsPool(tp){return GEO.single.filter(function(q){return !tp||q.t===tp})}
function srsStats(tp){var tk=todayKey(),s=state.geo.srs,due=0,learn=0,seen=0,pool=srsPool(tp);pool.forEach(function(q){var c=s[q.id];if(!c)return;seen++;if(c.d<=tk)due++;if(c.b>=4)learn++});return {due:due,learn:learn,seen:seen,total:pool.length,fresh:pool.length-seen}}
function srsSession(tp){var tk=todayKey(),s=state.geo.srs,due=[],fresh=[];srsPool(tp).forEach(function(q){var c=s[q.id];if(c){if(c.d<=tk)due.push(q)}else fresh.push(q)});due=shuffle(due).slice(0,SRS_MAX);return due.concat(shuffle(fresh).slice(0,Math.max(0,Math.min(SRS_NEW,SRS_MAX-due.length))))}
function srsRate(q,r){var s=state.geo.srs,c=s[q.id]||{b:0,d:todayKey(),n:0};if(r===0)c.b=0;else if(r===2)c.b=Math.min(5,c.b+1);else c.b=Math.max(1,c.b);c.d=addDays(r===0?0:r===1?1:SRS_DAYS[c.b]);c.n=(c.n||0)+1;s[q.id]=c;act('k');if(r>0)state.xp+=1;save()}
function openSRS(tp){var items=srsSession(tp);if(!items.length){toast('Бүгін қайталайтын карточка жоқ. Ертең қайта кел!');return}stopMock();R=null;CD={title:tp&&topicById(tp)?topicById(tp).name:'Карточкалар',items:items,pos:0,flip:false,back:'geo',srs:true,again:{},stat:[0,0,0]};showRun()}
function srsHtml(){
  if(CD.done)return '<div class="card" style="text-align:center"><span class="ico" style="margin:0 auto 10px" aria-hidden="true">📇</span><h1>Карточкалар аяқталды</h1><p class="stat">'+CD.stat[2]+' <small>білдім</small></p><p class="muted">Қиын: '+CD.stat[1]+' · Білмедім: '+CD.stat[0]+'</p><p class="small muted">Білген карточкаң бірнеше күннен кейін қайта шығады, ал білмегенің ертең-ақ қайталанады.</p><div class="row" style="justify-content:center"><button class="btn primary" data-act="quit" type="button">Аяқтау</button></div></div>';
  var q=CD.items[CD.pos],n=CD.items.length,c=state.geo.srs[q.id],tp=topicById(q.t);
  return '<div class="row between" style="margin-bottom:12px"><button class="btn ghost sm" data-act="quit" type="button">← Шығу</button><span class="pill">'+esc(CD.title)+' · '+(CD.pos+1)+' / '+n+'</span></div>'
   +'<div class="bar" style="margin-bottom:16px" aria-hidden="true"><i style="width:'+Math.round(CD.pos/n*100)+'%"></i></div>'
   +'<div class="card"><div class="row between small muted" style="margin-bottom:10px"><span>'+(tp?esc(tp.name):'')+'</span><span class="pill '+(c?'sky':'hl')+'">'+(c?c.b+'-қорап':'Жаңа карточка')+'</span></div>'
   +'<button class="flash-in'+(CD.flip?' back':'')+'" type="button" data-act="flip" aria-label="Карточканы аудару">'+(CD.flip?'<span><b>'+esc(q.o[0])+'</b><br><span class="small" style="font-weight:500">'+esc(q.e)+'</span></span>':'<span>'+esc(q.q)+'</span>')+'</button>'
   +(CD.flip?'<p class="muted small" style="text-align:center;margin:10px 0">Өзіңді адал бағала: келесі қайталау уақыты осыған байланысты.</p><div class="row srs-rate" style="justify-content:center"><button class="btn" data-act="srs-rate" data-r="0" type="button">Білмедім<small>бүгін қайта</small></button><button class="btn" data-act="srs-rate" data-r="1" type="button">Қиын<small>ертең</small></button><button class="btn primary" data-act="srs-rate" data-r="2" type="button">Білдім<small>'+SRS_DAYS[Math.min(5,(c?c.b:0)+1)]+' күннен кейін</small></button></div>'
     :'<p class="muted small" style="text-align:center;margin:10px 0">Жауабын есіңе түсір, кейін карточканы аудар.</p><div class="row" style="justify-content:center"><button class="btn primary" data-act="flip" type="button">Жауабын көру</button></div>')+'</div>';
}
function cardsTab(){
  var st=srsStats();
  return '<div class="grid g2" style="margin-bottom:18px"><div class="card" style="margin:0"><div class="eyebrow">Бүгін</div><h2>'+st.due+' карточка қайталауға дайын</h2><p class="muted">Аралықты қайталау әдісі: білген карточкаң 1, 3, 7, 14 және 30 күннен кейін қайта шығады, білмегенің ертең-ақ қайталанады. Күніне '+SRS_NEW+' жаңа карточка қосылады.</p><button class="btn primary" data-act="srs-open" type="button">Бүгінгі қайталауды бастау</button></div>'
   +'<div class="card" style="margin:0"><div class="eyebrow">Прогресс</div><div class="passrow"><span>Меңгерілді (4–5-қорап)</span><b>'+st.learn+'</b></div><div class="passrow"><span>Қайталауда</span><b>'+st.seen+'</b></div><div class="passrow"><span>Әлі ашылмаған</span><b>'+st.fresh+'</b></div><div class="bar green" style="margin-top:10px"><i style="width:'+Math.round(st.learn/Math.max(1,st.total)*100)+'%"></i></div></div></div>'
   +'<div class="card"><h3>Тақырып бойынша</h3><div class="grid auto">'+GEO.topics.map(function(t){var s2=srsStats(t.id);if(!s2.total)return '';return '<div class="card flat" style="margin:0"><b>'+esc(t.name)+'</b><p class="small muted" style="margin:4px 0 8px">'+s2.learn+' / '+s2.total+' меңгерілді'+(s2.due?' · '+s2.due+' қайталау':'')+'</p><button class="btn sm" data-act="srs-open" data-t="'+t.id+'" type="button">Ашу</button></div>'}).join('')+'</div></div>';
}

/* ---------- қуып жету бағдарламасы: нәтиже төмен болса, күніне 20 минуттық жеке сабақ ---------- */
function geoKeyInUbt(){return state.ubt.p1==='География'?'a':state.ubt.p2==='География'?'b':''}
function cuReason(){var g=state.geo,m=g.mocks.length?g.mocks[g.mocks.length-1]:null,lt=lastTest(),k=geoKeyInUbt();
  if(m&&m.m&&m.s/m.m<.6)return 'соңғы байқау тестте '+Math.round(m.s/m.m*100)+'% жинадың';
  if(lt&&k&&lt[k]<30)return 'соңғы сынақ ҰБТ-да географиядан '+lt[k]+' / 50 алдың';
  if(g.a>=40&&g.c/g.a<.6)return 'дұрыс жауап үлесі әзірге '+Math.round(g.c/g.a*100)+'%';
  return ''}
function weakTopics(n){var g=state.geo.topic;return GEO.topics.filter(function(t){return topicHasExam(t.id)}).map(function(t){var s=g[t.id];return {t:t,r:s&&s.a>=5?s.c/s.a:.45}}).sort(function(a,b){return a.r-b.r}).slice(0,n).map(function(x){return x.t})}
function cuStreak(){var n=0,i=0,d=state.cuDone;if(!d[addDays(0)])i=1;for(;i<200;i++){if(d[addDays(-i)])n++;else break}return n}
function cuItems(){var r=Math.random,items=[],skip={};
  shuffle(state.geo.wrong.filter(function(id){var x=GIDX[id];return x&&x.k==='s'})).slice(0,6).forEach(function(id){skip[id]=1;items.push(itemS(GIDX[id].q,r,null,true))});
  var wt=weakTopics(2),need=15-items.length;
  wt.forEach(function(t,i){var pool=GEO.single.filter(function(q){return q.t===t.id&&!skip[q.id]});pickFresh(pool,i===0?Math.ceil(need/2):Math.floor(need/2),r,skip).forEach(function(q){items.push(itemS(q,r,null,true))})});
  return shuffle(items)}
function cuCard(where){
  var why=cuReason(),tk=todayKey();
  if(!state.cu.on){
    if(why&&!(state.cu.snooze&&state.cu.snooze>tk))return '<div class="card cu"><div class="eyebrow">🎯 Қуып жету бағдарламасы ұсынылады</div><h3 style="margin:4px 0 6px">Нәтижеңді көтеруге көмектесейік</h3><p class="muted small">Себебі: '+esc(why)+'. Бағдарлама күніне шамамен 20 минут алады: қателер дәптері мен ең әлсіз тақырыптарыңнан 15 тапсырма және 10 карточка. Төмен балл — соңғы нүкте емес.</p><div class="row"><button class="btn primary" data-act="cu-on" type="button">Бағдарламаны қосу</button><button class="btn ghost" data-act="cu-snooze" type="button">Кейін</button></div></div>';
    if(where==='geo')return '<div class="card flat cu-mini"><div class="row between"><span class="small"><b>Қуып жету бағдарламасы:</b> күніне 20 минуттық жеке сабақ, әлсіз тақырыптарға арналған.</span><button class="btn sm" data-act="cu-on" type="button">Қосу</button></div></div>';
    return '';
  }
  var dn=state.cuDone[tk],wt=weakTopics(2),days=[];for(var i=6;i>=0;i--)days.push(addDays(-i));
  return '<div class="card cu on"><div class="row between" style="gap:12px;align-items:flex-start"><div><div class="eyebrow">🎯 Қуып жету бағдарламасы · '+cuStreak()+' күн қатар</div><h3 style="margin:4px 0">'+(dn?'Бүгінгі сабақ орындалды: '+dn.s+' / '+dn.m:'Бүгінгі сабақ: 15 тапсырма + 10 карточка · ~20 минут')+'</h3>'
   +'<p class="small muted" style="margin:0">Бүгінгі тақырыптар: '+wt.map(function(t){return esc(t.name)}).join(', ')+(state.geo.wrong.length?'. Қателер дәптерінен: '+Math.min(6,state.geo.wrong.length)+' тапсырма':'')+'.</p>'
   +'<div class="cu-days" aria-label="Соңғы 7 күн">'+days.map(function(k){return '<span class="'+(state.cuDone[k]?'on':'')+(k===tk?' today':'')+'" title="'+fmtDate(k)+'">'+DS[parseKey(k).getDay()]+'</span>'}).join('')+'</div></div>'
   +'<div class="row">'+(dn?'<button class="btn sm sky" data-act="srs-open" type="button">Карточкалар</button>':'<button class="btn primary" data-act="cu-run" type="button">Сабақты бастау</button>')+(where==='geo'?'<button class="btn sm ghost" data-act="cu-off" type="button">Тоқтату</button>':'')+'</div></div></div>';
}
function mockCard(){var ms=state.geo.mocks.slice(-6).reverse();
  return '<div class="card"><div class="row between"><div><div class="eyebrow">ҰБТ форматы</div><h2 style="margin:0">Байқау тест</h2></div><span class="pill sky">40 тапсырма · 50 балл · 80 минут</span></div>'
   +'<p class="muted" style="margin-top:10px">Нағыз ҰБТ-дағыдай: 25 бір жауапты, 5 контекстік, 5 көп жауапты және 5 сәйкестендіру тапсырмасы. Жауаптар бірден тексерілмейді: кез келген тапсырмаға оралып, жауабыңды өзгерте аласың. Соңында әр қатеңнің толық талдауы шығады.</p>'
   +(ms.length?'<div class="chips" style="margin-bottom:12px">'+ms.map(function(m){var p=Math.round(m.s/m.m*100);return '<span class="pill '+(p>=80?'green':p>=60?'sky':'rose')+'">'+fmtShort(m.d)+': '+m.s+' / '+m.m+'</span>'}).join('')+'</div>':'')
   +'<button class="btn sky" data-act="geo-mock" type="button">Байқау тестті бастау</button></div>';
}
var GV={tab:'today',topic:null};
RENDER.geo=function(){
  var el=$('#view-geo');
  if(R&&R.back==='geo'){el.innerHTML=R.done?resultHtml():runHtml();if(R.exam&&!R.done){var cb=$('.ex-nav .cur');if(cb&&cb.parentNode.scrollWidth>cb.parentNode.clientWidth)cb.parentNode.scrollLeft=cb.offsetLeft-cb.parentNode.clientWidth/2+19}if(R.endAt){var t=$('#mock-time');if(t){var left=Math.max(0,Math.ceil((R.endAt-Date.now())/1000));t.textContent='⏱ '+pad(Math.floor(left/60))+':'+pad(left%60)}}return}
  if(CD&&CD.back==='geo'){el.innerHTML=cardsHtml();return}
  var tabs=[['today','📅','Бүгін'],['topics','🧩','Тақырыптар'],['cards','📇','Карточкалар'],['formats','📝','ҰБТ форматы'],['wrong','📕','Қателер'],['base','🗂','Дерекқор']];
  el.innerHTML='<section class="banner">'+globeSvg()+'<span class="badge-pill">🌍 Бейіндік пән · 40 тапсырма · 50 балл</span><h1>География</h1><p>Күн сайын жаңа нұсқа, тақырыптық жаттығулар және ҰБТ-ның төрт форматы. Дерекқорда '+geoTotal()+' тапсырма.</p></section>'
   +'<div class="seg" role="tablist">'+tabs.map(function(t){return '<button type="button" role="tab" data-act="gtab2" data-t="'+t[0]+'" aria-selected="'+(GV.tab===t[0])+'"><span class="ic" aria-hidden="true">'+t[1]+'</span>'+t[2]+'</button>'}).join('')+'</div>'
   +geoBody();
};
function geoBody(){
  var g=state.geo,tk=todayKey();
  if(GV.tab==='today'){
    var d=g.daily[tk],days=[];for(var i=6;i>=0;i--)days.push(addDays(-i));
    return cuCard('geo')+'<div class="grid g2" style="margin-bottom:18px"><div class="card" style="margin:0"><div class="eyebrow">Бүгінгі нұсқа · №'+variantNo()+'</div><h2>'+fmtDate(tk)+'</h2>'
     +'<p class="muted">10 бір жауапты, 5 контекстік, 3 көп жауапты және 2 сәйкестендіру тапсырмасы: 20 тапсырма, 25 балл. Әр нұсқа сен әлі шешпеген сұрақтардан автоматты құралады, сұрақтар қайталанбайды.</p><p class="small muted">Әлі кездеспеген сұрақтар: <b>'+freshCount()+'</b> / '+GEO.single.length+'</p>'
     +(d?'<p class="stat">'+d.s+' / '+d.m+' <small>балл</small></p>':'')
     +'<button class="btn primary" data-act="geo-daily" type="button">'+(d?'Жаңа нұсқа шешу':'Нұсқаны бастау')+'</button></div>'
     +'<div class="card" style="margin:0"><div class="eyebrow">Соңғы 7 күн</div><div class="grid" style="grid-template-columns:repeat(7,1fr);gap:6px;margin:8px 0 14px">'
     +days.map(function(k){var x=g.daily[k];return '<div style="text-align:center"><div class="small muted">'+DS[parseKey(k).getDay()]+'</div><div style="height:46px;border-radius:10px;display:grid;place-items:center;font-weight:800;'+(x?'background:var(--brand);color:#fff':'background:var(--muted-bg);color:var(--ink2)')+'">'+(x?x.s:'–')+'</div></div>'}).join('')+'</div>'
     +'<div class="passrow"><span>Барлық жауап</span><b>'+g.a+'</b></div><div class="passrow"><span>Дұрыс жауап үлесі</span><b>'+(g.a?Math.round(g.c/g.a*100):0)+'%</b></div><div class="passrow"><span>Қатар</span><b>'+geoStreak()+' күн</b></div></div></div>'
     +mockCard();
  }
  if(GV.tab==='topics'){
    if(GV.topic&&topicById(GV.topic))return topicPage(topicById(GV.topic));
    return pathHtml()+'<div class="sec-h"><h2>Барлық тақырып: конспект және жаттығу</h2></div><div class="grid auto">'+GEO.topics.map(function(t){var st=g.topic[t.id],p=st&&st.a?Math.round(st.c/st.a*100):null,n=countTopic(t.id);
      return '<div class="card subj" style="margin:0;padding:12px" data-act="open-topic" data-id="'+t.id+'" role="button" tabindex="0">'+coverHtml(t.id,t.ic)+'<h3 style="margin-bottom:4px">'+esc(t.name)+'</h3><p class="muted small" style="margin:0 0 8px">'+n+' тапсырма'+(p!==null?' · '+p+'% дұрыс':'')+'</p><div class="bar sky"><i style="width:'+(p||0)+'%"></i></div></div>'}).join('')+'</div>';
  }
  if(GV.tab==='cards')return cardsTab();
  if(GV.tab==='formats'){
    return '<div class="grid g2">'
     +fmtCard('📝','Бір дұрыс жауап','4 нұсқаның біреуі дұрыс · 1 балл',GEO.single.length,'fmt-s')
     +fmtCard('📄','Контекст негізіндегі','Мәтін, кесте немесе есеп бойынша 5 сұрақ · әрқайсысы 1 балл',GEO.context.length+' мәтін','fmt-c')
     +fmtCard('☑','Бір немесе бірнеше дұрыс жауап','6 нұсқа · 2 балл (бір қате болса 1 балл)',GEO.multi.length,'fmt-m')
     +fmtCard('🔗','Сәйкестендіру','Сол жақ пен оң жақты сәйкестендір · 2 балл',GEO.match.length,'fmt-x')
     +'</div><div class="card"><h3>Карточкалар</h3><p class="muted small">Аралықты қайталау әдісімен: білгенің сирек, білмегенің жиі шығады.</p><button class="btn" data-act="srs-open" type="button">Карточкаларды ашу</button></div>';
  }
  if(GV.tab==='wrong'){
    var items=g.wrong.map(function(id){return GIDX[id]}).filter(Boolean),byT={};
    items.forEach(function(x){var k=x.q.t||(x.ctx&&x.ctx.t)||'';if(k)byT[k]=(byT[k]||0)+1});
    var tks=Object.keys(byT).sort(function(a,b){return byT[b]-byT[a]});
    return '<div class="card"><h2>Қателер дәптері</h2><p class="muted">Қате жауап берген тапсырмаларың осында жиналады. Қайталауда дұрыс жауап берсең, тапсырма дәптерден өшеді. Тек осы қателерден құралған тест — әлсіз жерді жабудың ең жылдам жолы.</p><p class="stat">'+items.length+' <small>тапсырма</small></p>'
     +'<button class="btn primary" data-act="geo-wrong" type="button"'+(items.length?'':' disabled')+'>Барлық қатеден тест (15 тапсырма)</button>'
     +(tks.length?'<h3 style="margin-top:16px">Тақырып бойынша қайталау</h3><div class="chips">'+tks.map(function(k){var tp=topicById(k);return '<button class="chip" type="button" data-act="geo-wrong" data-t="'+esc(k)+'">'+esc(tp?tp.name:k)+' · '+byT[k]+'</button>'}).join('')+'</div>':'')+'</div>'
     +(items.length?'<div class="card"><h3>Тізім</h3><ul class="link-list">'+items.slice(0,40).map(function(x){var t=topicById(x.q.t||(x.ctx&&x.ctx.t));return '<li>'+esc(x.q.q)+' <span class="pill">'+esc(t?t.name:'')+'</span></li>'}).join('')+'</ul></div>':'');
  }
  var b=GEO.books||[];
  return '<div class="card"><h2>Дерекқор</h2><div class="grid g4" style="margin:12px 0">'
   +[['Бір жауапты',GEO.single.length],['Контекст мәтіндері',GEO.context.length],['Көп жауапты',GEO.multi.length],['Сәйкестендіру',GEO.match.length]].map(function(x){return '<div class="card flat" style="margin:0;text-align:center"><div class="stat">'+x[1]+'</div><div class="small muted">'+x[0]+'</div></div>'}).join('')+'</div>'
   +'<p class="small muted">Нұсқа: '+esc(GEO.version||'')+'. Жаңа тапсырмалар қосылғанда сайт жаңарады, ал сенің нәтижелерің сақталады.</p></div>'
   +'<div class="card"><h2>Оқулықтар бойынша</h2><div class="tbl-wrap"><table><thead><tr><th>Оқулық</th><th>Тапсырма</th></tr></thead><tbody>'+b.map(function(x){return '<tr><td><a href="#books" data-act="book-open" data-b="'+x.id+'">'+esc(x.title+' · '+bookLabel(x))+'</a><br><span class="small muted">'+esc(x.authors)+', '+x.year+'</span></td><td><b>'+(GEO.byBook[x.id]||0)+'</b></td></tr>'}).join('')+'</tbody></table></div><p class="small muted">Әр оқулық сұрағының түсіндірмесінде кітап пен бет нөмірі көрсетіледі. Сәйкестендіру және көп жауапты тапсырмалардың бір бөлігі оқулық сұрақтарынан автоматты құралады, сондықтан нұсқалар таусылмайды.</p></div>'
   +'<div class="card"><h3>Ресми сілтемелер</h3><ul class="link-list">'+(C.official||[]).slice(0,3).map(function(x){return '<li>'+ext(x.l,x.u)+'</li>'}).join('')+'</ul></div>';
}
function countTopic(id){return GEO.single.filter(function(q){return q.t===id}).length+GEO.context.filter(function(c){return c.t===id}).reduce(function(a,c){return a+c.qs.length},0)+GEO.multi.filter(function(q){return q.t===id}).length+GEO.match.filter(function(q){return q.t===id}).length}
function fmtCard(ic,t,d,n,act){return '<div class="card" style="margin:0"><div class="row"><span class="ico" aria-hidden="true">'+ic+'</span><div><h3 style="margin:0">'+t+'</h3><div class="small muted">'+d+'</div></div></div><p class="small muted" style="margin:10px 0">Дерекқорда: '+n+'</p><button class="btn sm primary" type="button" data-act="'+act+'">Жаттығу</button></div>'}
function topicPage(t){
  var st=state.geo.topic[t.id],p=st&&st.a?Math.round(st.c/st.a*100):null;
  return '<div class="row" style="margin-bottom:12px"><button class="btn ghost sm" data-act="topics-back" type="button">← Барлық тақырып</button></div>'
   +'<div class="card">'+coverHtml(t.id,t.ic)+'<h2>'+esc(t.name)+'</h2><p class="muted">'+countTopic(t.id)+' тапсырма'+(p!==null?' · '+p+'% дұрыс':'')+'</p>'
   +'<div class="row"><button class="btn primary" data-act="topic-run" data-id="'+t.id+'" type="button">Тақырып бойынша тест</button><button class="btn" data-act="topic-cards" data-id="'+t.id+'" type="button">Карточкалар</button></div></div>'
   +(topicHasExam(t.id)?'<div class="card"><div class="row between"><div><div class="eyebrow">🛤 Тақырып емтиханы</div><b>'+(pathPass(t.id)?'Меңгерілді: '+(state.geo.path[t.id]||0)+'%':pathOpen(pathIndex(t.id))?PASS+'%-дан жинасаң, келесі тақырып ашылады':'Жабық: алдымен алдыңғы тақырыптан өт')+'</b></div>'+(pathOpen(pathIndex(t.id))?'<button class="btn sky" data-act="path-run" data-id="'+t.id+'" type="button">'+(pathPass(t.id)?'Қайта тапсыру':'Емтиханды бастау')+'</button>':'<span class="pill">🔒 Жабық</span>')+'</div></div>':'')
   +'<div class="card"><h3>Қысқа конспект</h3><ul class="link-list">'+t.notes.map(function(n){return '<li>'+esc(n)+'</li>'}).join('')+'</ul></div>'
   +'<div class="card"><h3>Бейне-сабақтар</h3><div class="row">'+ext('Ең көп қаралған',C.yt('ҰБТ география '+t.name,'top'))+ext('Ең жаңа',C.yt('ҰБТ география '+t.name,'new'))+'</div></div>';
}
function topicItems(id){
  var r=Math.random,items=[];
  pickFresh(GEO.single.filter(function(q){return q.t===id}),10,r).forEach(function(q){items.push(itemS(q,r,null,true))});
  GEO.multi.filter(function(q){return q.t===id}).slice(0,2).forEach(function(q){items.push(itemM(q,r))});
  GEO.match.filter(function(q){return q.t===id}).slice(0,2).forEach(function(q){items.push(itemX(q,r))});
  return items;
}

/* ================= ОҚУЛЫҚ ================= */
/* Оқулық файлы оқушының өз құрылғысынан ашылады және тек осы браузердің IndexedDB қоймасында сақталады: ешқайда жіберілмейді. */
var BK={id:null,view:'list',grade:0,page:1,doc:null,docId:null,zoom:1,theme:'light',full:false,loading:'',err:'',has:{},task:null,qp:false};
var PDFJS='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/';
var pdfReady=null,IDB=null;
function loadScript(u){return new Promise(function(res,rej){var s=document.createElement('script');s.src=u;s.async=true;s.crossOrigin='anonymous';s.referrerPolicy='no-referrer';s.onload=function(){res()};s.onerror=function(){rej(new Error('script'))};document.head.appendChild(s)})}
function pdfLib(){
  if(!pdfReady)pdfReady=loadScript(PDFJS+'pdf.min.js').then(function(){return loadScript(PDFJS+'pdf.worker.min.js')}).then(function(){return waitFor(function(){return window.pdfjsLib&&window.pdfjsLib.getDocument},5000).then(function(){return waitFor(function(){return window.pdfjsWorker},2000).catch(function(){})})}).then(function(){var L=window.pdfjsLib;L.GlobalWorkerOptions.workerSrc=PDFJS+'pdf.worker.min.js';return L});
  pdfReady.catch(function(){pdfReady=null});return pdfReady;
}
function waitFor(fn,ms){return new Promise(function(res,rej){var t0=Date.now();(function chk(){if(fn())return res();if(Date.now()-t0>ms)return rej(new Error('script'));setTimeout(chk,50)})()})}
function idb(){
  if(!IDB)IDB=new Promise(function(res,rej){try{var q=indexedDB.open('kokzhiek-books',1);q.onupgradeneeded=function(){q.result.createObjectStore('pdf')};q.onsuccess=function(){res(q.result)};q.onerror=function(){rej(q.error)}}catch(e){rej(e)}});
  IDB.catch(function(){IDB=null});return IDB;
}
function idbDo(mode,fn){return idb().then(function(db){return new Promise(function(res,rej){var tx=db.transaction('pdf',mode),st=tx.objectStore('pdf'),rq=fn(st);tx.oncomplete=function(){res(rq?rq.result:null)};tx.onerror=function(){rej(tx.error)};tx.onabort=function(){rej(tx.error)}})})}
function idbGet(k){return idbDo('readonly',function(s){return s.get(k)})}
function idbPut(k,v){return idbDo('readwrite',function(s){return s.put(v,k)})}
function idbDel(k){return idbDo('readwrite',function(s){return s.delete(k)})}
function idbKeys(){return idbDo('readonly',function(s){return s.getAllKeys()})}
idbKeys().then(function(ks){(ks||[]).forEach(function(k){BK.has[k]=true});if(cur==='books'&&BK.view==='list')RENDER.books()}).catch(function(){});

function rd(id){var r=state.read[id];if(!r||typeof r!=='object')r=state.read[id]={p:1,v:[],bm:[]};if(!Array.isArray(r.v))r.v=[];if(!Array.isArray(r.bm))r.bm=[];return r}
function readPct(b){var r=state.read[b.id];return r&&r.v?Math.min(100,Math.round(r.v.length/b.pages*100)):0}
function book3d(b,big){return '<span class="b3'+(big?' big':'')+'"><img src="'+esc(b.img)+'" alt="" loading="lazy" decoding="async"><i class="b3-gloss"></i></span>'}
function lastBook(){var best=null,t=0;BOOKS.forEach(function(b){var r=state.read[b.id];if(r&&r.t>t){t=r.t;best=b}});return best}

RENDER.books=function(){
  var el=$('#view-books');
  if(R&&R.back==='books'){el.innerHTML=R.done?resultHtml():runHtml();return}
  if(BK.view==='read'&&bookById(BK.id)){el.innerHTML=readerHtml();afterReader();return}
  BK.view='list';
  var lb=lastBook(),grades=[7,8,9,10,11],total=BOOKS.reduce(function(a,b){return a+(GEO.byBook[b.id]||0)},0);
  el.innerHTML='<section class="banner">'+globeSvg()+'<span class="badge-pill">📚 '+BOOKS.length+' оқулық · 7–11 сынып</span><h1>Оқулық</h1><p>ҰБТ спецификациясындағы география оқулықтары. Онлайн оқу режимі, бетбелгілер, оқу прогресі және әр беттен сұрақтар. Оқулықтардан '+total+' тапсырма құрастырылды.</p></section>'
   +(lb?'<div class="card cont-read"><div class="row" style="gap:18px;flex-wrap:nowrap"><button class="book3d sm" type="button" data-act="book-read" data-b="'+lb.id+'" aria-label="Оқуды жалғастыру">'+book3d(lb)+'</button><div style="flex:1;min-width:0"><div class="eyebrow">Оқуды жалғастыр</div><h3 style="margin:2px 0">'+esc(lb.title)+' · '+esc(bookLabel(lb))+'</h3><p class="small muted" style="margin:0 0 8px">'+rd(lb.id).p+'-бет · '+readPct(lb)+'% оқылды</p><div class="bar sky"><i style="width:'+readPct(lb)+'%"></i></div><div class="row" style="margin-top:12px"><button class="btn primary sm" type="button" data-act="book-read" data-b="'+lb.id+'">Жалғастыру</button></div></div></div></div>':'')
   +'<div class="chips" role="group" aria-label="Сынып бойынша сүзу" style="margin:4px 0 14px"><button class="chip" type="button" data-act="book-grade" data-g="0" aria-pressed="'+(!BK.grade)+'">Барлығы</button>'+grades.map(function(g){return '<button class="chip" type="button" data-act="book-grade" data-g="'+g+'" aria-pressed="'+(BK.grade===g)+'">'+g+'-сынып</button>'}).join('')+'</div>'
   +grades.filter(function(g){return !BK.grade||BK.grade===g}).map(function(g){var list=BOOKS.filter(function(b){return b.grade===g});
     return '<section class="shelf-sec"><h2 class="shelf-h">'+g+'-сынып <span class="muted small">· '+list.length+' кітап</span></h2><div class="shelf">'+list.map(function(b){var p=readPct(b),n=GEO.byBook[b.id]||0;
       return '<article class="bk"><button class="book3d" type="button" data-act="book-open" data-b="'+b.id+'" aria-label="'+esc(b.title+', '+bookLabel(b))+'">'+book3d(b)+(BK.has[b.id]?'<span class="bk-dl" title="Құрылғыда сақталған">✓</span>':'')+'</button>'
        +'<div class="bk-meta"><b>'+esc(b.title)+'</b><span class="small muted">'+esc(bookLabel(b))+', '+b.year+'</span><span class="small muted">'+esc(b.authors)+'</span>'
        +'<div class="bar sky" style="margin:8px 0 4px" aria-label="Оқылды '+p+'%"><i style="width:'+p+'%"></i></div><span class="small muted">'+(p?p+'% оқылды · ':'')+n+' тапсырма</span>'
        +'<div class="row" style="margin-top:8px;gap:6px"><button class="btn primary sm" type="button" data-act="book-read" data-b="'+b.id+'">Оқу</button><button class="btn sm" type="button" data-act="book-test" data-b="'+b.id+'"'+(n?'':' disabled')+'>Тест</button>'+(b.view?'<a class="btn sm ghost" href="'+esc(b.view)+'" target="_blank" rel="noopener noreferrer" title="Google Drive-та ашу">Drive ↗</a>':'')+'</div></div></article>'}).join('')+'</div></section>'}).join('')
   +'<div class="card drive-card"><div class="row between" style="gap:14px"><div><h3 style="margin:0 0 4px">📂 Барлық оқулықтар Google Drive-та</h3><p class="small muted" style="margin:0">Кез келген кітапты Drive-та бірден оқуға немесе жүктеп алуға болады. Жүктеп алған файлды «Оқу» → «Файлды таңдау» арқылы ашсаң, сайттағы оқу режимі (бетбелгі, түнгі режим, беттен тест) іске қосылады.</p></div><a class="btn primary" href="'+esc(GEO.drive)+'" target="_blank" rel="noopener noreferrer">Папканы ашу ↗</a></div></div>';
};

function readerHtml(){
  var b=bookById(BK.id),r=rd(b.id),qs=pageQs(b.id,BK.page),bm=r.bm.indexOf(BK.page)>-1,n=BK.doc&&BK.docId===b.id?BK.doc.numPages:b.pages;
  var head='<div class="row between" style="margin-bottom:12px"><button class="btn ghost sm" type="button" data-act="book-back">← Сөре</button><span class="pill">'+esc(b.title+' · '+bookLabel(b))+'</span></div>';
  if(!BK.has[b.id])return head+'<div class="card reader-empty"><div class="row" style="gap:22px;align-items:flex-start;flex-wrap:wrap"><div class="book3d big-wrap">'+book3d(b,true)+'</div><div style="flex:1;min-width:240px"><div class="eyebrow">'+b.grade+'-сынып · '+esc(b.publisher)+' · '+b.year+'</div><h2 style="margin:4px 0">'+esc(b.title)+(b.part?' · '+b.part+'-бөлім':'')+'</h2><p class="muted">'+esc(b.authors)+' · '+b.pages+' бет</p>'
    +(BK.loading?'<p class="pill sky">'+esc(BK.loading)+'</p>':'')+(BK.err?'<p class="explain" role="alert">'+esc(BK.err)+'</p>':'')
    +(b.view?'<div class="row" style="margin:10px 0 4px"><a class="btn primary" href="'+esc(b.view)+'" target="_blank" rel="noopener noreferrer">📖 Google Drive-та оқу ↗</a><a class="btn" href="'+esc(b.dl)+'" target="_blank" rel="noopener noreferrer">⬇️ Жүктеп алу</a></div>':'')
    +'<p class="small muted" style="margin:10px 0 6px">Сайттың ішінде оқу режимін қосу үшін: кітапты жүктеп ал да, төмендегі батырмамен сол файлды таңда. Файл тек осы құрылғыда сақталады.</p>'
    +'<label class="btn file-btn"><input type="file" accept="application/pdf,.pdf" data-act="book-file" data-b="'+b.id+'">📂 Файлды таңдау</label>'
    +'<div class="row" style="margin-top:12px"><button class="btn sm" type="button" data-act="book-test" data-b="'+b.id+'"'+((GEO.byBook[b.id]||0)?'':' disabled')+'>Осы кітап бойынша тест · '+(GEO.byBook[b.id]||0)+'</button></div></div></div></div>';
  return head+'<div class="reader t-'+BK.theme+(BK.full?' full':'')+'" id="reader">'
   +'<div class="rd-bar" role="toolbar" aria-label="Оқу құралдары">'
   +'<button class="icon-btn" type="button" data-act="rd-prev" aria-label="Алдыңғы бет"'+(BK.page<=1?' disabled':'')+'>‹</button>'
   +'<span class="rd-page"><input id="rd-num" type="number" min="1" max="'+n+'" value="'+BK.page+'" aria-label="Бет нөмірі"> / '+n+'</span>'
   +'<button class="icon-btn" type="button" data-act="rd-next" aria-label="Келесі бет"'+(BK.page>=n?' disabled':'')+'>›</button>'
   +'<span class="rd-sep"></span><button class="icon-btn" type="button" data-act="rd-zoom" data-z="-1" aria-label="Кішірейту">−</button><span class="small rd-z">'+Math.round(BK.zoom*100)+'%</span><button class="icon-btn" type="button" data-act="rd-zoom" data-z="1" aria-label="Үлкейту">+</button>'
   +'<span class="rd-sep"></span><div class="rd-th" role="group" aria-label="Оқу режимі">'+[['light','☀️','Күндізгі'],['sepia','📜','Сепия'],['night','🌙','Түнгі']].map(function(t){return '<button class="icon-btn" type="button" data-act="rd-theme" data-t="'+t[0]+'" aria-pressed="'+(BK.theme===t[0])+'" title="'+t[2]+'" aria-label="'+t[2]+' режим">'+t[1]+'</button>'}).join('')+'</div>'
   +'<button class="icon-btn" type="button" data-act="rd-bm" aria-pressed="'+bm+'" title="Бетбелгі" aria-label="Бетбелгі">'+(bm?'🔖':'📑')+'</button>'
   +'<button class="icon-btn" type="button" data-act="rd-full" aria-pressed="'+BK.full+'" title="Кең экран" aria-label="Кең экран">⛶</button></div>'
   +'<div class="bar sky rd-prog" aria-hidden="true"><i style="width:'+Math.round(BK.page/n*100)+'%"></i></div>'
   +'<div class="rd-body"><div class="rd-wrap" id="rd-wrap">'+(BK.loading?'<div class="rd-load">'+esc(BK.loading)+'</div>':'')+(BK.err?'<p class="explain" role="alert">'+esc(BK.err)+'</p>':'')+'<canvas id="rd-canvas" aria-label="'+BK.page+'-бет"></canvas></div>'
   +'<aside class="rd-side"><div class="card flat" style="margin:0"><div class="eyebrow">Осы бет</div>'
   +(qs.length?'<p class="small" style="margin:6px 0 10px">Бұл беттен <b>'+qs.length+'</b> сұрақ бар. Оқып болған соң өзіңді тексер.</p><button class="btn primary sm" type="button" data-act="rd-quiz">Беттен тест</button>':'<p class="small muted" style="margin:6px 0">Бұл бетке байланған сұрақ жоқ. Жақын беттердегі сұрақтар осы жерде шығады.</p>')
   +'</div><div class="card flat" style="margin:12px 0 0"><div class="eyebrow">Бетбелгілер</div>'+(r.bm.length?'<div class="chips" style="margin-top:8px">'+r.bm.slice().sort(function(a,c){return a-c}).map(function(p){return '<button class="chip" type="button" data-act="rd-go" data-p="'+p+'">'+p+'-бет</button>'}).join('')+'</div>':'<p class="small muted" style="margin:6px 0 0">📑 белгісін басып, бетті сақта.</p>')+'</div>'
   +'<div class="card flat" style="margin:12px 0 0"><div class="eyebrow">Прогресс</div><p class="small" style="margin:6px 0">'+r.v.length+' бет оқылды · '+readPct(b)+'%</p><button class="btn sm" type="button" data-act="book-test" data-b="'+b.id+'">Кітап бойынша тест</button>'+(b.view?'<a class="btn sm ghost" href="'+esc(b.view)+'" target="_blank" rel="noopener noreferrer" style="margin-top:6px">Drive-та ашу ↗</a>':'')+'<button class="btn sm ghost" type="button" data-act="book-forget" data-b="'+b.id+'" style="margin-top:6px">Файлды құрылғыдан өшіру</button></div></aside></div>'
   +'<p class="small muted rd-tip">Пернетақта: ← → беттер, + − масштаб. Телефонда: солға/оңға сырғыт.</p></div>';
}
function pageQs(id,p){return GEO.single.filter(function(q){return q.src&&q.src.b===id&&Math.abs(q.src.p-p)<=1})}
function afterReader(){
  var b=bookById(BK.id);if(!b||!BK.has[b.id])return;
  if(BK.doc&&BK.docId===b.id){drawPage();return}
  if(BK.loading)return;
  BK.loading='Кітап ашылып жатыр…';BK.err='';RENDER.books();
  Promise.all([pdfLib(),idbGet(b.id)]).then(function(x){
    var L=x[0],buf=x[1];if(!buf){BK.has[b.id]=false;throw new Error('nofile')}
    return L.getDocument({data:new Uint8Array(buf),isEvalSupported:false,cMapUrl:PDFJS+'cmaps/',cMapPacked:true,standardFontDataUrl:PDFJS+'standard_fonts/'}).promise;
  }).then(function(doc){
    if(BK.doc&&BK.doc.destroy)try{BK.doc.destroy()}catch(e){}
    BK.doc=doc;BK.docId=b.id;BK.page=Math.max(1,Math.min(doc.numPages,BK.page||1));BK.loading='';if(cur==='books'&&BK.view==='read')RENDER.books();
  }).catch(function(e){BK.loading='';BK.err=e&&e.message==='nofile'?'Файл табылмады. Қайта таңдап көр.':(e&&e.message==='script'?'PDF оқу модулі жүктелмеді. Интернет байланысын тексеріп, қайта көр.':'Файлды ашу мүмкін болмады. Ол PDF екенін тексер.');if(cur==='books')RENDER.books()});
}
function drawPage(){
  var cv=$('#rd-canvas'),wrap=$('#rd-wrap');if(!cv||!wrap||!BK.doc)return;var n=BK.page,id=BK.id;
  BK.doc.getPage(n).then(function(pg){
    if(BK.page!==n||BK.id!==id)return;
    var dpr=Math.min(2,window.devicePixelRatio||1),w=Math.max(260,wrap.clientWidth-8),v1=pg.getViewport({scale:1}),sc=w/v1.width*BK.zoom,vp=pg.getViewport({scale:sc*dpr});
    if(BK.task)try{BK.task.cancel()}catch(e){}
    cv.width=Math.floor(vp.width);cv.height=Math.floor(vp.height);cv.style.width=Math.floor(vp.width/dpr)+'px';cv.style.height=Math.floor(vp.height/dpr)+'px';
    BK.task=pg.render({canvasContext:cv.getContext('2d'),viewport:vp});
    BK.task.promise.then(function(){cv.classList.remove('turn');void cv.offsetWidth;cv.classList.add('turn');markRead(id,n)}).catch(function(){});
  }).catch(function(){});
}
function markRead(id,p){var r=rd(id),b=bookById(id);r.p=p;r.t=Date.now();if(r.v.indexOf(p)<0){r.v.push(p);state.xp+=1;act('p');if(r.v.length%25===0)reward('📖',r.v.length+' бет оқыдың!',b.title+' · '+bookLabel(b))}save()}
function goPage(p){var n=BK.doc&&BK.docId===BK.id?BK.doc.numPages:(bookById(BK.id)||{}).pages||1;p=Math.max(1,Math.min(n,p|0));if(p===BK.page&&$('#rd-canvas'))return;BK.page=p;rd(BK.id).p=p;RENDER.books()}
function openBook(id,page){var b=bookById(id);if(!b)return;leaveRun();BK.id=id;BK.view='read';BK.err='';BK.page=page||rd(id).p||1;if(cur!=='books')location.hash='#books';else{RENDER.books();window.scrollTo(0,0)}}
function bookRun(id,qs,title){var r=Math.random,items=pickFresh(qs,Math.min(15,qs.length),r).map(function(q){return itemS(q,r,null,true)});
  var xs=GEO.match.filter(function(q){return q.src&&q.src.b===id}),ms=GEO.multi.filter(function(q){return q.src&&q.src.b===id});
  if(qs.length>3){shuffle(ms,r).slice(0,1).forEach(function(q){items.push(itemM(q,r))});shuffle(xs,r).slice(0,1).forEach(function(q){items.push(itemX(q,r))})}
  if(!items.length){toast('Бұл кітап бойынша сұрақтар әзірге жоқ');return}
  startRun(title,'book',items,'books')}
function saveFile(id,file){
  var b=bookById(id);if(!b||!file)return;
  if(file.size>160*1024*1024){toast('Файл тым үлкен (160 МБ-тан аспауы керек)');return}
  BK.err='';BK.loading='Файл тексеріліп, сақталып жатыр…';RENDER.books();
  file.arrayBuffer().then(function(buf){
    var h=new Uint8Array(buf,0,5);if(String.fromCharCode.apply(null,h)!=='%PDF-')throw new Error('notpdf');
    return idbPut(id,buf).then(function(){return buf});
  }).then(function(){BK.has[id]=true;BK.loading='';BK.doc=null;BK.docId=null;toast('Кітап құрылғыға сақталды');RENDER.books()})
  .catch(function(e){BK.loading='';BK.err=e&&e.message==='notpdf'?'Бұл PDF файл емес. Оқулықтың PDF нұсқасын таңда.':'Файлды сақтау мүмкін болмады: браузер жады толы немесе жеке режим қосулы болуы мүмкін.';RENDER.books()});
}
document.addEventListener('click',function(e){
  var b=e.target.closest('[data-act]');if(!b)return;var a=b.dataset.act,d=b.dataset;
  switch(a){
   case 'book-grade':BK.grade=parseInt(d.g,10)||0;RENDER.books();break;
   case 'book-open':case 'book-read':e.preventDefault();openBook(d.b);break;
   case 'book-goto':e.preventDefault();openBook(d.b,parseInt(d.p,10)||1);break;
   case 'book-back':BK.view='list';BK.full=false;RENDER.books();window.scrollTo(0,0);break;
   case 'book-test':var bb=bookById(d.b);if(bb)bookRun(bb.id,bookQs(bb.id),bb.title+' · '+bookLabel(bb));break;
   case 'book-forget':idbDel(d.b).then(function(){BK.has[d.b]=false;if(BK.docId===d.b){BK.doc=null;BK.docId=null}toast('Файл құрылғыдан өшірілді');RENDER.books()}).catch(function(){});break;
   case 'rd-prev':goPage(BK.page-1);break;
   case 'rd-next':goPage(BK.page+1);break;
   case 'rd-go':goPage(parseInt(d.p,10));break;
   case 'rd-zoom':BK.zoom=Math.max(.6,Math.min(2.4,Math.round((BK.zoom+(d.z==='1'?.2:-.2))*10)/10));RENDER.books();break;
   case 'rd-theme':BK.theme=d.t;var rr=$('#reader');if(rr){rr.className='reader t-'+BK.theme+(BK.full?' full':'');$$('[data-act=rd-theme]').forEach(function(x){x.setAttribute('aria-pressed',String(x.dataset.t===BK.theme))})}break;
   case 'rd-bm':var r=rd(BK.id),ix=r.bm.indexOf(BK.page);if(ix>-1)r.bm.splice(ix,1);else{r.bm.push(BK.page);toast('Бетбелгі қойылды: '+BK.page+'-бет')}save();RENDER.books();break;
   case 'rd-full':BK.full=!BK.full;document.body.classList.toggle('noscroll',BK.full);RENDER.books();break;
   case 'rd-quiz':var qs=pageQs(BK.id,BK.page);if(qs.length){var r2=Math.random;startRun(BK.page+'-бет бойынша тест','book',shuffle(qs).slice(0,10).map(function(q){return itemS(q,r2,null,true)}),'books')}break;
  }
});
document.addEventListener('change',function(e){
  var el=e.target;
  if(el.dataset&&el.dataset.act==='book-file'&&el.files&&el.files[0])saveFile(el.dataset.b,el.files[0]);
  if(el.id==='rd-num')goPage(parseInt(el.value,10)||1);
});
document.addEventListener('keydown',function(e){
  if(cur!=='books'||BK.view!=='read'||R||!BK.doc)return;var tg=e.target.tagName;if(tg==='INPUT'||tg==='SELECT'||tg==='TEXTAREA')return;
  if(e.key==='ArrowRight'||e.key==='PageDown'){e.preventDefault();goPage(BK.page+1)}
  else if(e.key==='ArrowLeft'||e.key==='PageUp'){e.preventDefault();goPage(BK.page-1)}
  else if(e.key==='+'||e.key==='='){BK.zoom=Math.min(2.4,BK.zoom+.2);RENDER.books()}
  else if(e.key==='-'){BK.zoom=Math.max(.6,BK.zoom-.2);RENDER.books()}
  else if(e.key==='Escape'&&BK.full){BK.full=false;document.body.classList.remove('noscroll');RENDER.books()}
});
var tsx=null;
document.addEventListener('touchstart',function(e){if(e.target.closest&&e.target.closest('#rd-wrap')&&BK.zoom<=1&&e.touches.length===1)tsx={x:e.touches[0].clientX,y:e.touches[0].clientY};else tsx=null},{passive:true});
document.addEventListener('touchend',function(e){if(!tsx)return;var t=e.changedTouches[0],dx=t.clientX-tsx.x,dy=t.clientY-tsx.y;tsx=null;if(Math.abs(dx)>60&&Math.abs(dx)>Math.abs(dy)*1.5)goPage(BK.page+(dx<0?1:-1))},{passive:true});
window.addEventListener('hashchange',function(){if(BK.full){BK.full=false;document.body.classList.remove('noscroll')}});
var rsT=null;window.addEventListener('resize',function(){if(cur==='books'&&BK.view==='read'){clearTimeout(rsT);rsT=setTimeout(drawPage,200)}});

/* ---------- дедлайн бақылаушысы: әр 30 секунд ---------- */
function sysNotify(t){try{if(window.Notification&&Notification.permission==='granted')new Notification('Көкжиек',{body:t})}catch(e){}}
function checkDue(){
  var now=Date.now(),ch=false;
  state.tasks.forEach(function(t){if(t.done||!t.due)return;var ts=dueTs(t.due);if(isNaN(ts))return;
    if(ts<=now&&!state.ntf[t.id]){state.ntf[t.id]=2;ch=true;if(now-ts<36e5*6){toast('⏰ Дедлайн келді: '+t.title);beep();sysNotify('Дедлайн келді: '+t.title)}}
    else if(ts>now&&ts-now<=36e5&&!state.ntf[t.id]){state.ntf[t.id]=1;ch=true;toast('⏳ 1 сағаттан аз қалды: '+t.title);sysNotify('1 сағаттан аз қалды: '+t.title)}});
  Object.keys(state.ntf).forEach(function(k){if(!state.tasks.some(function(t){return t.id===k}))delete state.ntf[k]});
  if(ch)save();
  if(!panel)drawTop();
  if(cur==='plan'&&P.tab!=='timer'){var ae=document.activeElement,ti=$('#t-title');if((!ae||!ae.closest||!ae.closest('form'))&&(!ti||!ti.value))RENDER.plan()}
}
setInterval(checkDue,30000);setTimeout(checkDue,1500);

/* ================= КҮНДЕЛІК, БҰЛТҚА САҚТАУ, КҮННІҢ ЖИНАҒЫ ================= */
/* --- әрекеттер күнделігі: әр күннің әрекеттері state.log[күн] ішінде сақталады --- */
function act(k,n){var tk=todayKey(),L=state.log[tk]||(state.log[tk]={x0:state.xp});L[k]=(L[k]||0)+(n||1)}
function logStart(){var tk=todayKey();if(!state.log[tk])state.log[tk]={x0:state.xp};var ks=Object.keys(state.log).sort();while(ks.length>400)delete state.log[ks.shift()]}
function logXP(){var tk=todayKey(),L=state.log[tk]||(state.log[tk]={x0:state.xp});if(L.x0==null)L.x0=state.xp;L.x=Math.max(0,state.xp-L.x0)}
var ACT_NAMES=[['q','сұрақ'],['c','дұрыс'],['d','күндік нұсқа'],['m','байқау тест'],['e','тақырып емтиханы'],['u','бағдарлама сабағы'],['k','карточка'],['g','ойын'],['p','бет оқылды'],['t','тапсырма'],['v','JUZ40 талдау'],['f','мин фокус'],['ch','челлендж']];
function actScore(L){if(!L)return 0;return (L.q||0)+3*(L.g||0)+(L.p||0)+4*(L.t||0)+5*(L.d||0)+3*(L.v||0)+Math.round((L.f||0)/10)+5*(L.ch||0)+8*(L.m||0)+5*(L.e||0)+5*(L.u||0)+Math.round((L.k||0)/2)}
function actLine(L){var a=[];ACT_NAMES.forEach(function(x){if(L&&L[x[0]])a.push(L[x[0]]+' '+x[1])});if(L&&L.x)a.push('+'+L.x+' XP');return a.length?a.join(' · '):'Әрекет жоқ'}
function historyHtml(){
  var days=[],i;for(i=34;i>=0;i--)days.push(addDays(-i));
  var list=Object.keys(state.log).filter(function(k){return actScore(state.log[k])>0}).sort().reverse().slice(0,21);
  return '<div class="card"><div class="row between"><h2 style="margin:0">📅 Әрекеттер күнделігі</h2>'+cloudBadge()+'</div><p class="muted small">Әр күнгі әрекеттерің автоматты түрде жазылады: шешкен сұрақтар, ойындар, оқыған беттер, орындалған тапсырмалар, жиналған XP.</p>'
   +'<div class="heat" role="img" aria-label="Соңғы 35 күндегі белсенділік">'+days.map(function(k){var s=actScore(state.log[k]),lv=s>=60?4:s>=30?3:s>=10?2:s>0?1:0;return '<span class="hc l'+lv+(k===todayKey()?' today':'')+'" title="'+esc(fmtDate(k)+': '+actLine(state.log[k]))+'"></span>'}).join('')+'</div>'
   +'<div class="heat-leg small muted"><span>Аз</span><span class="hc l1"></span><span class="hc l2"></span><span class="hc l3"></span><span class="hc l4"></span><span>Көп</span></div>'
   +(list.length?'<ul class="link-list hist">'+list.map(function(k){return '<li><b>'+(k===todayKey()?'Бүгін':fmtDate(k))+'</b><span class="small muted">'+esc(actLine(state.log[k]))+'</span></li>'}).join('')+'</ul>':'<p class="empty">Әзірге жазба жоқ. Бір тест шешіп көр!</p>')+'</div>';
}

/* --- бұлттық сақтау және сынып рейтингі: Firebase (Google арқылы кіру + Firestore) ---
   Баптауы firebase-config.js ішінде (window.FIREBASE_CONFIG). Баптау жоқ болса, деректер тек осы браузерде қалады.
   Firestore құрылымы: users/{uid} = {json: бүкіл state, upd, name}; classes/{КОД} = {name, owner};
   classes/{КОД}/members/{uid} = {name, av, xp, wxp (апталық XP), wk (апта басы), lvl}. Қауіпсіздік ережелері: firestore.rules. */
var FB_V='10.12.2',FB=null,FB_P=null;
var CLOUD={st:'local',user:null,ref:null,last:'',busy:false,pend:false,t:null,at:0,err:'',watch:false};
function fbReady(){var c=window.FIREBASE_CONFIG;return !!(c&&c.apiKey&&c.projectId)}
/* App Check: Firestore-ға тек осы сайттан келген сұраныстар өтеді (reCAPTCHA / Google Cloud Fraud Defense, оқушыға көрінбейді).
   Кілт firebase-config.js ішіндегі APPCHECK_SITE_KEY. Бос болса, App Check өшірулі. */
var FB_C=null,AC=null;
function fbCore(){
  if(FB_C)return FB_C;var base='https://www.gstatic.com/firebasejs/'+FB_V+'/',key=window.APPCHECK_SITE_KEY||'';
  /* Netlify-де /__/auth/* жолы firebaseapp.com-ға бағытталған (_redirects). Ол жұмыс істесе, кіру сайттың өз доменінде өтеді:
     бөгде доменнің cookie-лерін бұғаттайтын браузерлерде (Safari, Telegram ішіндегі браузер) де кіру сақталады. */
  var proxy=location.protocol!=='https:'?Promise.resolve(false):fetch('__/auth/handler.js',{method:'HEAD',cache:'no-store'}).then(function(r){return r.ok}).catch(function(){return false});
  FB_C=Promise.all([import(base+'firebase-app.js'),key?import(base+'firebase-app-check.js').catch(function(){return null}):null,proxy]).then(function(m){
    var cfg={};Object.keys(window.FIREBASE_CONFIG).forEach(function(k){cfg[k]=window.FIREBASE_CONFIG[k]});if(m[2])cfg.authDomain=location.host;
    var app=m[0].initializeApp(cfg);
    if(m[1]){try{AC={M:m[1],ac:m[1].initializeAppCheck(app,{provider:new m[1].ReCaptchaEnterpriseProvider(key),isTokenAutoRefreshEnabled:true})}}catch(e){AC=null}}
    return app;
  }).catch(function(e){FB_C=null;throw e});
  return FB_C;
}
function acToken(){return fbCore().then(function(){return AC?AC.M.getToken(AC.ac,false).then(function(r){return r.token}):null}).catch(function(){return null})}
function fbLoad(){
  if(FB_P)return FB_P;var base='https://www.gstatic.com/firebasejs/'+FB_V+'/';
  FB_P=Promise.all([fbCore(),import(base+'firebase-auth.js'),import(base+'firebase-firestore.js')]).then(function(m){
    var app=m[0];FB={A:m[1],F:m[2],auth:m[1].getAuth(app),db:m[2].getFirestore(app)};return FB
  }).catch(function(e){FB_P=null;throw e});
  return FB_P;
}
function cloudBadge(){
  if(CLOUD.st==='on')return '<span class="pill green" id="cloud-st" title="Деректерің Google аккаунтыңа байланған бұлтта сақталады">☁️ Бұлтта сақталады'+(CLOUD.at?' · '+pad(new Date(CLOUD.at).getHours())+':'+pad(new Date(CLOUD.at).getMinutes()):'')+'</span>';
  if(CLOUD.st==='busy')return '<span class="pill sky" id="cloud-st">☁️ Қосылып жатыр…</span>';
  if(CLOUD.st==='err')return '<span class="pill amber" id="cloud-st" title="'+esc(CLOUD.err)+'">💾 Бұлтқа қосылмады, осы браузерде сақталады</span>';
  return '<span class="pill" id="cloud-st">💾 Осы браузерде сақталады</span>';
}
function signInBtn(cls){return '<button class="btn '+(cls||'primary')+'" type="button" data-act="cloud-in"'+(CLOUD.st==='busy'?' disabled':'')+'>Google арқылы кіру</button>'}
function cloudInit(){
  /* SDK тек бұрын кірген (немесе кіру барысында Google бетіне кеткен) пайдаланушыға жүктеледі */
  if(!fbReady())return;var was=false;try{was=!!localStorage.getItem('kokzhiek-fb')}catch(e){}
  if(was)cloudStart().catch(function(){CLOUD.st='err';CLOUD.err='Firebase жүктелмеді';drawTop()});
}
function cloudStart(){
  return fbLoad().then(function(fb){
    if(CLOUD.watch)return fb;CLOUD.watch=true;
    fb.A.getRedirectResult(fb.auth).catch(function(e){var c=e&&e.code||'';toast('Кіру сәтсіз болды'+(c?': '+c:''))});
    fb.A.onAuthStateChanged(fb.auth,function(u){
      CLOUD.user=u||null;
      if(u){try{localStorage.setItem('kokzhiek-fb','1')}catch(e){}cloudSync()}else{CLOUD.st='local';CLOUD.ref=null;try{if(localStorage.getItem('kokzhiek-fb')==='pending')localStorage.removeItem('kokzhiek-fb')}catch(e){}}
      drawTop();if(cur==='me'||cur==='class')RENDER[cur]();
    });
    return fb;
  });
}
function cloudSignIn(){
  if(!fbReady()){toast('Бұлттық сақтау әлі бапталмаған');return}
  CLOUD.st='busy';refresh();drawOnb();
  cloudStart().then(function(fb){var p=new fb.A.GoogleAuthProvider();p.setCustomParameters({prompt:'select_account'});
    return fb.A.signInWithPopup(fb.auth,p).catch(function(e){if(e&&e.code==='auth/popup-blocked'){try{localStorage.setItem('kokzhiek-fb','pending')}catch(er){}return fb.A.signInWithRedirect(fb.auth,p)}throw e})})
  .catch(function(e){var c=e&&e.code||'';CLOUD.st='local';if(c!=='auth/popup-closed-by-user'&&c!=='auth/cancelled-popup-request')toast('Кіру сәтсіз болды'+(c?': '+c:'. Интернетті тексер'));refresh();drawOnb()});
}
function cloudSignOut(){
  if(!FB)return;clearTimeout(CLOUD.t);cloudWrite();
  FB.A.signOut(FB.auth).then(function(){try{localStorage.removeItem('kokzhiek-fb')}catch(e){}CLOUD.user=null;CLOUD.st='local';CLOUD.ref=null;CLS.list=null;toast('Аккаунттан шықтың. Деректерің осы браузерде қалды');refresh()});
}
function cloudSync(){
  var fb=FB,u=CLOUD.user;if(!fb||!u)return;var F=fb.F;CLOUD.st='busy';
  CLOUD.ref=F.doc(fb.db,'users',u.uid);
  F.getDoc(CLOUD.ref).then(function(snap){
    CLOUD.st='on';var d=snap.exists()?snap.data():null,remote=null;
    if(d&&typeof d.json==='string'){try{remote=JSON.parse(d.json)}catch(e){remote=null}}
    if(remote&&remote.profile&&(!state.profile||(+remote.upd||0)>(+state.upd||0))){
      var ns=build(remote);Object.keys(state).forEach(function(k){delete state[k]});Object.keys(ns).forEach(function(k){state[k]=ns[k]});
      CLOUD.last=d.json;persist();applyTheme();logStart();drawOnb();route();toast('☁️ Деректерің бұлттан жүктелді');
    }else if(state.profile)cloudPush(true);
    if(!snap.exists()){F.setDoc(F.doc(fb.db,'stats','total'),{signed:F.increment(1)},{merge:true}).catch(function(){})}
    CLS.list=null;drawTop();if(cur==='me'||cur==='class')RENDER[cur]();
  }).catch(function(e){CLOUD.st='err';CLOUD.err=e&&e.code||'';drawTop();if(cur==='me')RENDER.me()});
}
function cloudPush(now){if(CLOUD.st!=='on'||!CLOUD.ref)return;clearTimeout(CLOUD.t);CLOUD.t=setTimeout(cloudWrite,now?50:2500)}
function cloudWrite(){
  if(CLOUD.st!=='on'||!CLOUD.ref||!state.profile||!FB)return;
  classPush();
  if(CLOUD.busy){CLOUD.pend=true;return}
  var json=JSON.stringify(state);if(json===CLOUD.last)return;
  if(json.length>900000){state.geo.seen={};json=JSON.stringify(state)}
  CLOUD.busy=true;
  FB.F.setDoc(CLOUD.ref,{json:json,upd:+state.upd||Date.now(),name:cut(state.profile.name,30),v:2}).then(function(){CLOUD.last=json;CLOUD.at=Date.now();CLOUD.busy=false;if(CLOUD.pend){CLOUD.pend=false;cloudWrite()}var cb=$('#cloud-st');if(cb)cb.outerHTML=cloudBadge()})
  .catch(function(e){CLOUD.busy=false;var c=e&&e.code;if(c==='unavailable'||c==='resource-exhausted'||c==='deadline-exceeded'){CLOUD.t=setTimeout(cloudWrite,8000+Math.random()*4000)}else{CLOUD.st='err';CLOUD.err=c||'';drawTop()}});
}
document.addEventListener('visibilitychange',function(){if(document.visibilityState==='hidden'&&CLOUD.st==='on'){clearTimeout(CLOUD.t);cloudWrite()}});

/* --- сынып рейтингі --- */
var CLS={tab:'week',list:null,info:null,err:'',busy:false,lastPush:'',leaveAsk:false};
function weekXP(){var ws=weekStart(),n=0;Object.keys(state.log).forEach(function(k){if(k>=ws)n+=state.log[k].x||0});return n}
function memberData(){return {name:cut(fullName(),30),av:state.profile.av,ph:state.profile.ph||'',xp:Math.round(state.xp),wxp:Math.round(weekXP()),wk:weekStart(),lvl:level().n,upd:Date.now()}}
function classCode(){var A='ABCDEFGHJKLMNPQRSTUVWXYZ23456789',s='';for(var i=0;i<6;i++)s+=A[Math.floor(Math.random()*A.length)];return s}
function classPush(){
  if(!state.cls||!CLOUD.user||!FB||!state.profile)return;var m=memberData(),key=[m.name,m.av,m.xp,m.wxp,m.wk,m.lvl].join('|');if(key===CLS.lastPush)return;CLS.lastPush=key;
  FB.F.setDoc(FB.F.doc(FB.db,'classes',state.cls,'members',CLOUD.user.uid),m,{merge:true}).catch(function(){CLS.lastPush=''});
}
function classLoad(){
  if(!state.cls||!CLOUD.user||!FB)return;CLS.busy=true;var F=FB.F,code=state.cls;
  Promise.all([F.getDoc(F.doc(FB.db,'classes',code)),F.getDocs(F.collection(FB.db,'classes',code,'members'))]).then(function(r){
    CLS.busy=false;if(!r[0].exists()){CLS.err='Сынып табылмады: оны құрған адам өшіріп тастаған болуы мүмкін.';CLS.list=[];}
    else{CLS.info=r[0].data();CLS.list=r[1].docs.map(function(d){var x=d.data();x.uid=d.id;return x});CLS.err=''}
    if(cur==='class')RENDER.class();
  }).catch(function(e){CLS.busy=false;CLS.list=[];CLS.err='Рейтингті жүктеу мүмкін болмады'+(e&&e.code?' ('+e.code+')':'');if(cur==='class')RENDER.class()});
}
function classJoin(code){
  code=String(code||'').toUpperCase().replace(/[^A-Z0-9]/g,'');if(code.length!==6){toast('Сынып коды 6 таңбадан тұрады');return}
  var F=FB.F;F.getDoc(F.doc(FB.db,'classes',code)).then(function(s){
    if(!s.exists()){toast('Мұндай кодпен сынып табылмады');return}
    state.cls=code;CLS.lastPush='x';save();
    return F.setDoc(F.doc(FB.db,'classes',code,'members',CLOUD.user.uid),memberData()).then(function(){CLS.lastPush='';CLS.list=null;toast('Сыныпқа қосылдың: '+s.data().name);refresh()});
  }).catch(function(e){toast('Қосылу мүмкін болмады'+(e&&e.code?': '+e.code:''))});
}
function classCreate(name){
  name=cut(name,60);if(!name){toast('Сынып атауын жаз');return}var F=FB.F,tries=0;
  (function attempt(){var code=classCode();
    F.getDoc(F.doc(FB.db,'classes',code)).then(function(s){
      if(s.exists()){if(tries++<5)attempt();return}
      return F.setDoc(F.doc(FB.db,'classes',code),{name:name,owner:CLOUD.user.uid,ownerName:cut(state.profile.name,30),created:Date.now()})
        .then(function(){state.cls=code;CLS.lastPush='x';save();return F.setDoc(F.doc(FB.db,'classes',code,'members',CLOUD.user.uid),memberData())})
        .then(function(){CLS.lastPush='';CLS.list=null;toast('Сынып құрылды. Коды: '+code);refresh()});
    }).catch(function(e){toast('Сынып құру мүмкін болмады'+(e&&e.code?': '+e.code:''))});
  })();
}
function classLeave(){
  var F=FB.F,code=state.cls;F.deleteDoc(F.doc(FB.db,'classes',code,'members',CLOUD.user.uid)).catch(function(){}).then(function(){state.cls='';CLS.list=null;CLS.info=null;CLS.leaveAsk=false;save();toast('Сыныптан шықтың');refresh()});
}

/* --- күннің жинағы: ойын сұрақтары, факт пен челлендж күн сайын ауысады --- */
var ORD2=[
 {t:'Қорықтарды құрылған жылы бойынша ретте (ең ертесінен)',items:['Ақсу-Жабағылы','Наурызым','Барсакелмес','Қорғалжын','Марқакөл','Үстірт']},
 {t:'Қорықтарды құрылған жылы бойынша ретте (ең ертесінен)',items:['Үстірт','Батыс Алтай','Алакөл','Қаратау']},
 {t:'Шыңдарды биіктігі бойынша ретте (ең биігінен)',items:['Хан Тәңірі','Талғар','Бесбақан','Мұзтау','Ақсораң']},
 {t:'Геологиялық заманларды ретте (ең ежелгісінен)',items:['Архей','Протерозой','Палеозой','Мезозой','Кайнозой']},
 {t:'Қазақстанның табиғат зоналарын солтүстіктен оңтүстікке ретте',items:['Орманды дала','Дала','Шөлейт','Шөл']},
 {t:'Мұнай кен орындарын игерілу/ашылу уақыты бойынша ретте',items:['Ембі','Доссор','Мақат','Теңіз']},
 {t:'Халықаралық экологиялық оқиғаларды хронология бойынша ретте',items:['Стокгольм конференциясы','Вена конвенциясы','Рио конференциясы','Киото хаттамасы']},
 {t:'ЮНЕСКО тізіміне енген қазақстандық нысандарды енгізілу жылы бойынша ретте',items:['Қожа Ахмет Ясауи кесенесі','Тамғалы петроглифтері','«Сарыарқа» номинациясы','Ұлы Жібек жолы нысандары','Батыс Тянь-Шань']},
 {t:'Миллионер қалаларды халық саны бойынша ретте (көбінен)',items:['Алматы','Нұр-Сұлтан','Шымкент']},
 {t:'Қазақстан географиясы тарихындағы оқиғаларды ретте',items:['Ш. Уәлихановтың Жетісуға саяхаты','КСРО ҒА Қазақ филиалында география секторы құрылды','Қазақстан Ғылым академиясы құрылды','«Қазақ КСР Атласының» бірінші томы шықты']},
 {t:'Тропосфераның жоғарғы шекарасын биіктігі бойынша ретте (ең биігінен)',items:['Экватор үсті','Қоңыржай белдеулер','Поляр маңы']},
 {t:'Мұхиттарды ауданы бойынша ретте (ең үлкенінен)',items:['Тынық мұхит','Атлант мұхиты','Үнді мұхиты','Солтүстік Мұзды мұхит']}
];
var DAY={k:''};
function dayR(tag){return rng(hash(tag+'|'+todayKey()+'|'+(state.profile?state.profile.created||'':'')))}
function daily(){
  var tk=todayKey();if(DAY.k===tk)return DAY;
  var G2=GEO.games,book=GEO.single.filter(function(q){return q.src&&q.src.b&&q.q.length<=160&&q.o[0].length<=70}),r;
  DAY={k:tk,i:{}};
  DAY.cap=shuffle(G2.capitals,dayR('cap')).slice(0,24);DAY.capRev=hash('crev'+tk)%2===1;
  DAY.reg=shuffle(G2.regions,dayR('reg'));DAY.regRev=hash('rrev'+tk)%2===0;
  r=dayR('tf');
  DAY.tf=shuffle(shuffle(G2.tf,r).slice(0,12).map(function(s){return {text:s[0],ok:s[1],e:s[2]}}).concat(shuffle(book,r).slice(0,40).map(function(q){var t=r()<.5;return {text:q.q,claim:t?q.o[0]:q.o[1+Math.floor(r()*3)],ok:t,e:'Дұрыс жауап: '+q.o[0]+'. '+q.e}})),r);
  DAY.blitz=shuffle(GEO.single,dayR('blitz')).slice(0,120);
  var terms=G2.terms.slice(),seenT={};terms.forEach(function(t){seenT[t[0]]=1});
  GEO.single.forEach(function(q){var m=q.q.match(/^(.{12,120}?)\s+қалай аталады\?$/);if(m&&q.o[0].length<=42&&!/\d/.test(q.o[0])&&!seenT[q.o[0]]){seenT[q.o[0]]=1;terms.push([q.o[0].replace(/\s*\(.*\)$/,''),m[1]])}});
  DAY.terms=shuffle(terms,dayR('mem'));
  DAY.ord=shuffle((G2.order||[]).concat(ORD2),dayR('ord'));
  DAY.fact=book.length?book[Math.floor(dayR('fact')()*book.length)]:null;
  var gid=['cap','reg','tf','blitz','mem','ord'][Math.floor(dayR('chal')()*6)];
  DAY.chal={id:gid,goal:{cap:12,reg:10,tf:15,blitz:10,mem:14,ord:1}[gid]};
  return DAY;
}
function nextOf(id,list){var D=daily(),i=D.i[id]||0;D.i[id]=i+1;return list[i%list.length]}
function chalText(c){var g=GAMES.filter(function(x){return x.id===c.id})[0];return '«'+g.t+'» ойынында '+(c.id==='mem'?c.goal+' жүрістен аспай барлық жұпты тап':c.id==='ord'?'ретті толық дұрыс қой':c.goal+' ұпай жина')}
function chalDone(){return !!(state.geo.ch&&state.geo.ch[todayKey()])}
function chalCheck(){
  var c=daily().chal,tk=todayKey();if(!GM||GM.id!==c.id||chalDone())return;
  var ok=c.id==='mem'?GM.moves<=c.goal:c.id==='ord'?GM.score===GM.list.length:GM.score>=c.goal;
  if(ok){state.geo.ch=state.geo.ch||{};state.geo.ch[tk]=1;state.xp+=20;act('ch');save();setTimeout(function(){reward('🎯','Бүгінгі челлендж орындалды!','+20 XP')},500)}
}
function factHtml(){
  var f=daily().fact;if(!f)return '';var b=f.src&&bookById(f.src.b);
  return '<div class="card fact"><div class="eyebrow">💡 Күннің фактісі · '+fmtDate(todayKey())+'</div><p class="fact-q">'+esc(f.q)+'</p><p class="fact-a"><b>'+esc(f.o[0])+'</b>. '+esc(f.e)+'</p>'
   +(b?'<p class="small muted" style="margin:0">📘 '+esc(bookLabel(b))+', '+f.src.p+'-бет · <a href="#books" data-act="book-goto" data-b="'+b.id+'" data-p="'+f.src.p+'">Оқулықтан ашу</a></p>':'')+'</div>';
}
function chalHtml(){var c=daily().chal,d=chalDone();return '<div class="card chal'+(d?' done':'')+'"><div class="row between" style="gap:12px"><div><div class="eyebrow">🎯 Бүгінгі челлендж</div><b>'+esc(chalText(c))+'</b><div class="small muted">'+(d?'Орындалды! Ертең жаңа челлендж келеді.':'Орындасаң +20 XP. Челлендж күн сайын ауысады.')+'</div></div>'+(d?'<span class="pill green">✓ Орындалды</span>':'<button class="btn primary sm" type="button" data-act="game" data-id="'+c.id+'">Бастау</button>')+'</div></div>'}

/* --- JUZ40 нұсқа талдаулары: барлық ҰБТ пәндері бойынша --- */
var JSUBJ=[['kzhist','Қазақстан тарихы','m','🏛'],['reading','Оқу сауаттылығы','m','📖'],['mathlit','Математикалық сауаттылық','m','🧮'],['geo','География','p','🌍'],['math','Математика','p','📐'],['physics','Физика','p','⚛️'],['chemistry','Химия','p','🧪'],['biology','Биология','p','🧬'],['worldhist','Дүниежүзі тарихы','p','🗿'],['informatics','Информатика','p','💻'],['english','Ағылшын тілі','p','🇬🇧'],['law','Құқық негіздері','p','⚖️'],['kazlang','Қазақ тілі','p','✍️'],['kazlit','Қазақ әдебиеті','p','📜'],['russlang','Орыс тілі','p','🔤'],['ruslit','Орыс әдебиеті','p','📚']];
var JZ={f:'all'};
function mySubj(n){var p1=state.ubt.p1||'',p2=state.ubt.p2||'';return n==='Қазақстан тарихы'||n==='Оқу сауаттылығы'||n==='Математикалық сауаттылық'||p1.indexOf(n)===0||p2.indexOf(n)===0||(n==='Ағылшын тілі'&&(p1==='Шет тілі'||p2==='Шет тілі'))||((n==='Қазақ тілі'||n==='Қазақ әдебиеті')&&(p1+p2).indexOf('Қазақ тілі мен')>-1)||((n==='Орыс тілі'||n==='Орыс әдебиеті')&&(p1+p2).indexOf('Орыс тілі мен')>-1)}
RENDER.juz=function(){
  var yr=new Date().getFullYear(),list=JSUBJ.filter(function(s){return JZ.f==='all'||(JZ.f==='m'&&s[2]==='m')||(JZ.f==='p'&&s[2]==='p')||(JZ.f==='my'&&mySubj(s[1]))});
  list.sort(function(a,b){return (mySubj(b[1])?1:0)-(mySubj(a[1])?1:0)});
  $('#view-juz').innerHTML='<section class="banner">'+globeSvg()+'<span class="badge-pill">🎥 JUZ40 · '+JSUBJ.length+' пән</span><h1>JUZ40 нұсқа талдаулары</h1><p>ҰБТ-ның барлық пәндері бойынша JUZ40 нұсқа талдаулары мен сабақтары. Сілтемелер YouTube-та JUZ40 бейнелерін ашады: ең көп қаралғандары мен ең жаңалары, сондықтан жаңа талдаулар өзі қосылып отырады.</p></section>'
   +'<div class="chips" role="group" aria-label="Пәндерді сүзу" style="margin-bottom:14px">'+[['all','Барлығы'],['my','Менің пәндерім'],['m','Міндетті пәндер'],['p','Бейіндік пәндер']].map(function(x){return '<button class="chip" type="button" data-act="jz-f" data-f="'+x[0]+'" aria-pressed="'+(JZ.f===x[0])+'">'+x[1]+'</button>'}).join('')+'</div>'
   +'<div class="grid auto">'+list.map(function(s){var q='JUZ40 '+s[1]+' ҰБТ',j=state.jz[s[0]]||{},mine=mySubj(s[1]);
     return '<div class="card jz'+(mine?' mine':'')+'" style="margin:0">'+coverHtml(s[0],s[3],s[2]==='m'?'Міндетті':'Бейіндік')+'<div class="row between" style="gap:6px"><h3 style="margin:0">'+esc(s[1])+'</h3>'+(mine?'<span class="pill sky">Менің пәнім</span>':'')+'</div>'
      +'<div class="jz-links">'
      +'<a class="btn primary sm" href="'+esc(C.yt(q+' нұсқа талдау','top'))+'" target="_blank" rel="noopener noreferrer">▶ Нұсқа талдау</a>'
      +'<a class="btn sm" href="'+esc(C.yt(q+' нұсқа талдау','new'))+'" target="_blank" rel="noopener noreferrer">🆕 Жаңа талдаулар</a>'
      +'<a class="btn sm" href="'+esc(C.yt(q+' '+yr+' нұсқа','new'))+'" target="_blank" rel="noopener noreferrer">📅 '+yr+' нұсқалары</a>'
      +'<a class="btn sm" href="'+esc(C.yt(q+' сабақ тақырып','top'))+'" target="_blank" rel="noopener noreferrer">📚 Тақырыптық сабақ</a></div>'
      +'<div class="row between jz-foot"><span class="small muted">'+(j.n?'Көрілді: '+j.n+' рет · соңғысы '+fmtDate(j.last):'Әлі белгіленбеген')+'</span><button class="btn ghost sm" type="button" data-act="jz-done" data-id="'+s[0]+'"'+(j.last===todayKey()?' disabled':'')+'>'+(j.last===todayKey()?'✓ Бүгін көрдім':'Бүгін көрдім')+'</button></div></div>'}).join('')+'</div>'
   +'<div class="card" style="margin-top:18px"><h3>JUZ40 ресми арналары</h3><ul class="link-list"><li>'+ext('JUZ40 ресми сайты','https://juz40-edu.kz')+'</li><li>'+ext('JUZ40 қосымшасы (App Store)','https://apps.apple.com/ru/app/juz40/id6479574134')+'</li><li>'+ext('YouTube: JUZ40 барлық бейнелері','https://www.youtube.com/results?search_query=JUZ40+%D2%B0%D0%91%D0%A2')+'</li></ul><p class="small muted">«Бүгін көрдім» батырмасы көрген талдауларыңды күнделікке жазады.</p></div>';
};
document.addEventListener('click',function(e){
  var b=e.target.closest('[data-act]');if(!b)return;var d=b.dataset;
  if(d.act==='jz-f'){JZ.f=d.f;RENDER.juz()}
  else if(d.act==='jz-done'){var j=state.jz[d.id]||(state.jz[d.id]={n:0,last:''});if(j.last!==todayKey()){j.n++;j.last=todayKey();state.xp+=3;act('v');save();toast('Белгіленді: +3 XP');RENDER.juz();drawTop()}}
  else if(d.act==='dl-quick'){dlQuick(d.v)}
});

/* --- дедлайн таңдағыш: күн, сағат, минут --- */
function dlParts(due){var m=String(due||'').match(/^(\d{4}-\d\d-\d\d)T(\d\d):(\d\d)/);return m?{d:m[1],h:m[2],m:m[3]}:{d:dkey(new Date()),h:'21',m:'00'}}
function dlHtml(sc){
  var p=dlParts(defDue(sc)),hs='',ms='',i;for(i=0;i<24;i++)hs+='<option'+(pad(i)===p.h?' selected':'')+'>'+pad(i)+'</option>';for(i=0;i<60;i++)ms+='<option'+(pad(i)===p.m?' selected':'')+'>'+pad(i)+'</option>';
  return '<div style="grid-column:1/-1"><label class="check" for="t-has"><input type="checkbox" id="t-has" data-act="has-due"'+(P.has?' checked':'')+'> ⏰ Дедлайн қою</label>'
   +'<div class="dl'+(P.has?'':' off')+'" id="dl-box"><div class="dl-row">'
   +'<label class="dl-f dl-date"><span>📅 Күні</span><input id="t-due" type="date" value="'+p.d+'"'+(P.has?'':' disabled')+'></label>'
   +'<label class="dl-f"><span>Сағат</span><select id="t-h" aria-label="Сағат"'+(P.has?'':' disabled')+'>'+hs+'</select></label><b class="dl-colon" aria-hidden="true">:</b>'
   +'<label class="dl-f"><span>Минут</span><select id="t-m" aria-label="Минут"'+(P.has?'':' disabled')+'>'+ms+'</select></label></div>'
   +'<div class="chips dl-quick" role="group" aria-label="Жылдам таңдау">'+[['h1','+1 сағат'],['h3','+3 сағат'],['t21','Бүгін 21:00'],['m9','Ертең 09:00'],['m18','Ертең 18:00'],['sun','Жексенбі 20:00']].map(function(x){return '<button class="chip" type="button" data-act="dl-quick" data-v="'+x[0]+'"'+(P.has?'':' disabled')+'>'+x[1]+'</button>'}).join('')+'</div>'
   +'<div class="dl-prev" id="dl-prev" aria-live="polite">'+dlPrevText()+'</div></div></div>';
}
function dlValue(){var d=$('#t-due'),h=$('#t-h'),m=$('#t-m');if(!d||!h||!m)return '';var dv=/^\d{4}-\d\d-\d\d$/.test(d.value)?d.value:dkey(new Date());return dv+'T'+h.value+':'+m.value}
function dlPrevText(){var v=$('#t-due')?dlValue():defDue(P.tab);if(!v)return '';var left=dueTs(v)-Date.now();return '⏰ '+fmtDue(v)+' · '+(left<0?'<span class="bad-t">өтіп кеткен уақыт</span>':leftText(left)+' қалды')}
function dlPaint(){var p=$('#dl-prev');if(p)p.innerHTML=dlPrevText()}
function dlQuick(v){var t=new Date();t.setSeconds(0,0);
  if(v==='h1')t=new Date(t.getTime()+36e5);else if(v==='h3')t=new Date(t.getTime()+3*36e5);
  else if(v==='t21')t.setHours(21,0);else if(v==='m9'){t.setDate(t.getDate()+1);t.setHours(9,0)}else if(v==='m18'){t.setDate(t.getDate()+1);t.setHours(18,0)}
  else if(v==='sun'){t.setDate(t.getDate()+((7-t.getDay())%7||7));t.setHours(20,0)}
  var d=$('#t-due'),h=$('#t-h'),m=$('#t-m');if(d)d.value=dkey(t);if(h)h.value=pad(t.getHours());if(m)m.value=pad(t.getMinutes());dlPaint()}
document.addEventListener('change',function(e){var id=e.target.id;if(id==='t-due'||id==='t-h'||id==='t-m')dlPaint()});
setInterval(function(){if(cur==='plan')dlPaint()},30000);

/* ================= ОЙЫНДАР ================= */
var GM=null,gmIv=null;
var GAMES=[
 {id:'cap',ic:'🏛',t:'Астаналар',d:'60 секунд: ел мен астана. Бүгінгі 24 ел'},
 {id:'reg',ic:'🗺',t:'Қазақстан облыстары',d:'Облыс пен әкімшілік орталығы'},
 {id:'tf',ic:'⚡',t:'Иә ме, жоқ па?',d:'60 секунд: оқулық фактілері дұрыс па?'},
 {id:'blitz',ic:'🚀',t:'Жылдам раунд',d:'90 секунд: оқулық сұрақтары'},
 {id:'mem',ic:'🧠',t:'Терминдер жұбы',d:'Термин мен анықтаманы жұпта'},
 {id:'ord',ic:'🔢',t:'Ретпен қой',d:'Хронология, биіктік, аудан'},
 {id:'mapkz',ic:'📍',t:'Қазақстан картасы',d:'Қала, көл, өзен, тауды картадан тап: 10 сұрақ'},
 {id:'mapw',ic:'🌐',t:'Әлем елдері',d:'Елді әлем картасынан тап: 10 сұрақ'},
 {id:'nom',ic:'🚩',t:'Номенклатура',d:'Теңіз, бұғаз, арал, түбек, тау, өзен, көл: 270-тен астам нысан'}
];
/* ---------- карта ойыны: Қазақстан нысандары (қашықтық бойынша ұпай) және әлем елдері ----------
   Ел шекаралары: world-atlas 2.0.2 (Natural Earth, 1:110 млн), jsDelivr-ден ойын ашылғанда ғана жүктеледі.
   Нысан: [атауы, [[ендік, бойлық], ...], түсініктеме]. Бірнеше нүкте болса (өзен, жота, көл), сызыққа дейінгі қашықтық алынады. */
var KZPTS=[
 ['Астана',[[51.17,71.45]],'Елорда, Есіл өзенінің бойында'],['Алматы',[[43.24,76.95]],'Іле Алатауының етегінде'],['Шымкент',[[42.32,69.59]],'Республикалық маңызы бар қала, оңтүстікте'],
 ['Ақтөбе',[[50.28,57.17]],'Елек өзенінің бойында'],['Атырау',[[47.11,51.88]],'Жайық өзенінің Каспийге құяр тұсында'],['Ақтау',[[43.65,51.16]],'Каспий жағалауындағы порт қала'],
 ['Орал',[[51.23,51.37]],'Жайық өзенінің бойында'],['Қостанай',[[53.21,63.63]],'Тобыл өзенінің бойында'],['Петропавл',[[54.87,69.15]],'Есіл өзенінің бойында, ең солтүстік облыс орталығы'],
 ['Көкшетау',[[53.28,69.39]],'Ақмола облысының орталығы'],['Павлодар',[[52.29,76.97]],'Ертіс өзенінің бойында'],['Өскемен',[[49.95,82.61]],'Ертіс пен Үлбі өзендерінің түйіскен жерінде'],
 ['Семей',[[50.41,80.25]],'Абай облысының орталығы, Ертіс бойында'],['Қарағанды',[[49.81,73.09]],'Сарыарқаның ортасында, көмір алабы'],['Жезқазған',[[47.78,67.71]],'Ұлытау облысының орталығы, мыс кені'],
 ['Қызылорда',[[44.85,65.51]],'Сырдария өзенінің бойында'],['Түркістан',[[43.30,68.27]],'Түркістан облысының орталығы'],['Тараз',[[42.90,71.37]],'Жамбыл облысының орталығы, Талас өзенінің бойында'],
 ['Талдықорған',[[45.02,78.37]],'Жетісу облысының орталығы'],['Қонаев',[[43.87,77.07]],'Алматы облысының орталығы, Қапшағай су қоймасының жағасында'],['Байқоңыр',[[45.62,63.31]],'Ғарыш айлағы, Сырдария бойында'],
 ['Балқаш көлі',[[46.3,73.8],[46.6,74.9],[46.4,76.2],[46.5,77.4],[46.6,78.7]],'Жартысы тұщы, жартысы тұзды көл'],['Зайсан көлі',[[48.0,84.0]],'Шығыс Қазақстан, Ертіс бойындағы көл'],
 ['Алакөл',[[46.1,81.7]],'Балқаш-Алакөл ойысындағы тұзды көл'],['Кіші Арал теңізі',[[46.4,61.0]],'Көкарал бөгетімен сақталған солтүстік бөлігі'],['Каспий теңізі',[[46.0,50.2],[44.8,50.4],[43.0,51.0]],'Жер шарындағы ең үлкен тұйық су айдыны'],
 ['Теңіз көлі',[[50.45,69.0]],'Қоқиқаздар ұя салатын тұзды көл'],['Қапшағай су қоймасы',[[43.9,77.6]],'Іле өзенінде'],['Бұқтырма су қоймасы',[[49.7,83.6]],'Ертіс өзенінде, ең ірі су қоймасы'],
 ['Ертіс өзені',[[47.9,84.5],[49.95,82.6],[50.4,80.2],[51.7,77.5],[52.3,76.9],[53.4,75.4],[54.0,74.3]],'Қытайдан басталып, Обьқа құяды'],
 ['Сырдария өзені',[[42.3,68.8],[43.4,67.5],[44.85,65.5],[45.6,63.3],[46.1,61.6]],'Арал теңізіне құяды'],
 ['Жайық өзені',[[51.2,57.5],[51.3,54.5],[51.2,51.4],[49.6,51.3],[48.2,51.7],[47.1,51.9]],'Еуропа мен Азияның шекарасы бойымен ағады'],
 ['Іле өзені',[[43.9,80.0],[43.9,78.5],[44.2,77.0],[45.0,75.5],[45.4,74.7]],'Балқаш көліне құяды'],
 ['Есіл өзені',[[50.9,73.2],[51.17,71.45],[51.0,69.3],[52.2,68.3],[53.5,68.8],[54.87,69.15]],'Астана мен Петропавл арқылы ағады'],
 ['Хан Тәңірі шыңы',[[42.21,80.17]],'Қазақстанның ең биік нүктесі, 7010 м'],['Мұзтау (Белуха)',[[49.81,86.59]],'Алтайдың ең биік шыңы, 4506 м'],
 ['Іле Алатауы',[[43.05,76.5],[43.1,77.3],[43.2,78.0]],'Алматының оңтүстігіндегі жота'],['Жетісу (Жоңғар) Алатауы',[[45.0,79.5],[45.2,80.3],[45.4,81.0]],'Қытаймен шекарадағы тау жүйесі'],
 ['Қаратау жотасы',[[42.9,70.7],[43.6,69.3],[44.3,68.3]],'Фосфорит кені бар жота'],['Мұғалжар таулары',[[48.5,58.6],[49.3,58.4]],'Оралдың оңтүстік жалғасы'],['Ұлытау',[[48.6,67.0]],'Сарыарқаның батысындағы тарихи тау'],
 ['Үстірт',[[43.5,55.5],[44.5,56.0],[42.8,56.5]],'Каспий мен Арал арасындағы үстірт'],['Маңғыстау түбегі',[[44.3,51.3],[44.0,52.2]],'Каспийдің шығыс жағалауы'],['Қарақия ойысы',[[43.43,51.80]],'Қазақстанның ең төмен нүктесі, −132 м'],
 ['Бетпақдала шөлі',[[45.6,69.5],[46.2,71.8]],'Шу мен Сарысу аралығындағы шөл'],['Мойынқұм шөлі',[[44.4,71.3],[44.0,72.8]],'Шу мен Талас өзендерінің аралығында'],['Қызылқұм шөлі',[[43.6,66.6],[42.6,64.6]],'Сырдария мен Әмудария аралығы'],
 ['Сарыарқа (Қазақтың ұсақ шоқысы)',[[49.0,70.0],[49.5,73.0],[49.5,76.0]],'Қазақстанның орталығындағы ұсақ шоқылы өлке'],['Торғай үстірті',[[50.0,64.0]],'Торғай қолаты орналасқан үстірт'],['Каспий маңы ойпаты',[[48.0,50.5],[47.0,53.0],[48.5,52.0]],'Теңіз деңгейінен төмен жатқан ойпат'],
 ['Бурабай',[[53.08,70.30]],'«Қазақстанның Швейцариясы», курорттық аймақ'],['Шарын шатқалы',[[43.35,79.07]],'«Қамалдар аңғары» бар шатқал'],['Көлсай көлдері',[[42.98,78.32]],'Күнгей Алатауындағы үш көл'],
 ['Ақсу-Жабағылы қорығы',[[42.4,70.6]],'Орта Азиядағы ең алғашқы қорық (1926)'],['Наурызым қорығы',[[51.5,64.4]],'Қостанай облысындағы орманды-далалы қорық'],['Әнші құм (Алтынемел)',[[44.0,78.5]],'«Ән салатын» құм төбе']
];
var COUNTRIES=[['398','Қазақстан'],['643','Ресей'],['156','Қытай'],['417','Қырғызстан'],['860','Өзбекстан'],['795','Түрікменстан'],['762','Тәжікстан'],['496','Моңғолия'],['004','Ауғанстан'],['364','Иран'],
 ['792','Түркия'],['804','Украина'],['112','Беларусь'],['616','Польша'],['276','Германия'],['250','Франция'],['724','Испания'],['620','Португалия'],['380','Италия'],
 ['826','Ұлыбритания'],['578','Норвегия'],['752','Швеция'],['246','Финляндия'],['300','Грекия'],['642','Румыния'],['352','Исландия'],['818','Мысыр'],['434','Ливия'],['012','Алжир'],['504','Марокко'],
 ['566','Нигерия'],['231','Эфиопия'],['404','Кения'],['710','Оңтүстік Африка Республикасы'],['180','Конго Демократиялық Республикасы'],['729','Судан'],['024','Ангола'],['834','Танзания'],['450','Мадагаскар'],
 ['682','Сауд Арабиясы'],['368','Ирак'],['586','Пәкістан'],['356','Үндістан'],['050','Бангладеш'],['104','Мьянма'],['764','Таиланд'],['704','Вьетнам'],['360','Индонезия'],['608','Филиппин'],['392','Жапония'],
 ['410','Оңтүстік Корея'],['036','Австралия'],['554','Жаңа Зеландия'],['124','Канада'],['840','АҚШ'],['484','Мексика'],['192','Куба'],['076','Бразилия'],['032','Аргентина'],['152','Чили'],['604','Перу'],
 ['170','Колумбия'],['862','Венесуэла'],['068','Боливия'],['304','Гренландия (Дания)']];
var WORLD_URL='https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-110m.json',WORLD=null,WORLD_P=null;
function topoCountries(t){
  var tr=t.transform,sx=tr.scale[0],sy=tr.scale[1],tx=tr.translate[0],ty=tr.translate[1];
  var arcs=t.arcs.map(function(a){var x=0,y=0;return a.map(function(p){x+=p[0];y+=p[1];return [x*sx+tx,y*sy+ty]})});
  function ring(r){var pts=[];r.forEach(function(i,k){var a=i<0?arcs[~i].slice().reverse():arcs[i];pts=pts.concat(k?a.slice(1):a)});return pts}
  return t.objects.countries.geometries.filter(function(g){return g.arcs}).map(function(g){
    var polys=(g.type==='Polygon'?[g.arcs]:g.arcs).map(function(p){return p.map(ring)}),bb=[180,90,-180,-90];
    polys.forEach(function(p){p[0].forEach(function(q){if(q[0]<bb[0])bb[0]=q[0];if(q[1]<bb[1])bb[1]=q[1];if(q[0]>bb[2])bb[2]=q[0];if(q[1]>bb[3])bb[3]=q[1]})});
    return {id:String(g.id),name:g.properties&&g.properties.name||'',polys:polys,bb:bb}});
}
function loadWorld(cb){
  if(WORLD){cb(WORLD);return}
  if(!WORLD_P)WORLD_P=fetch(WORLD_URL).then(function(r){if(!r.ok)throw new Error('http');return r.json()}).then(function(t){WORLD=topoCountries(t);return WORLD}).catch(function(){WORLD_P=null;return null});
  WORLD_P.then(cb);
}
var KZV={x0:46,y1:55.9,c:Math.cos(48*Math.PI/180)};KZV.k=800/(42*KZV.c);KZV.w=800;KZV.h=Math.round(15.8*KZV.k);
var WV={k:800/360};WV.w=800;WV.h=Math.round(142*WV.k);
function projKZ(lon,lat){return [(lon-KZV.x0)*KZV.c*KZV.k,(KZV.y1-lat)*KZV.k]}
function projW(lon,lat){return [(lon+180)*WV.k,(84-lat)*WV.k]}
/* 180-меридианнан өтетін сақиналардың бойлығы үзіліссіз етіп «жазылады», артық бөлігі карта шетінен тыс қалады */
function pathD(c,pr){var s='';c.polys.forEach(function(poly){poly.forEach(function(r){var off=0,pl=null;r.forEach(function(p,i){var lon=p[0];if(pl!==null){var d=lon+off-pl;if(d>180)off-=360;else if(d<-180)off+=360}pl=lon+off;var q=pr(pl,p[1]);s+=(i?'L':'M')+q[0].toFixed(1)+' '+q[1].toFixed(1)});s+='Z'})});return s}
/* KZ проекциясында екі ось бірдей масштабта: 1 бірлік = 111,32 / k км */
function kmToTarget(x,y,pts){var best=1e9,P=pts.map(function(p){return projKZ(p[1],p[0])});
  if(P.length===1)best=Math.hypot(x-P[0][0],y-P[0][1]);
  for(var i=0;i<P.length-1;i++){var a=P[i],b=P[i+1],dx=b[0]-a[0],dy=b[1]-a[1],L=dx*dx+dy*dy,t=L?Math.max(0,Math.min(1,((x-a[0])*dx+(y-a[1])*dy)/L)):0;best=Math.min(best,Math.hypot(x-a[0]-t*dx,y-a[1]-t*dy))}
  return Math.round(best*111.32/KZV.k)}
/* сұраққа шықпайтын елдердің қазақша атауы (қате басылғанда көрсетіледі) */
var CNAMES={'008':'Албания','051':'Армения','031':'Әзербайжан','268':'Грузия','040':'Австрия','056':'Бельгия','070':'Босния және Герцеговина','100':'Болгария','191':'Хорватия','203':'Чехия','208':'Дания','233':'Эстония','348':'Венгрия','372':'Ирландия','376':'Израиль','400':'Иордания','414':'Кувейт','422':'Ливан','428':'Латвия','440':'Литва','442':'Люксембург','498':'Молдова','528':'Нидерланд','512':'Оман','634':'Катар','688':'Сербия','703':'Словакия','705':'Словения','756':'Швейцария','784':'Біріккен Араб Әмірліктері','887':'Йемен','760':'Сирия','275':'Палестина','196':'Кипр','807':'Солтүстік Македония','499':'Черногория','524':'Непал','064':'Бутан','144':'Шри-Ланка','116':'Камбоджа','418':'Лаос','458':'Малайзия','598':'Папуа — Жаңа Гвинея','242':'Фиджи','408':'Солтүстік Корея','158':'Тайвань','626':'Шығыс Тимор','096':'Бруней','540':'Жаңа Каледония','090':'Соломон аралдары','548':'Вануату','706':'Сомали','232':'Эритрея','262':'Джибути','148':'Чад','562':'Нигер','466':'Мали','478':'Мавритания','788':'Тунис','686':'Сенегал','324':'Гвинея','384':'Кот-д’Ивуар','288':'Гана','854':'Буркина-Фасо','120':'Камерун','140':'Орталық Африка Республикасы','178':'Конго','266':'Габон','800':'Уганда','646':'Руанда','108':'Бурунди','454':'Малави','508':'Мозамбик','894':'Замбия','716':'Зимбабве','072':'Ботсвана','516':'Намибия','426':'Лесото','748':'Эсватини','728':'Оңтүстік Судан','732':'Батыс Сахара','226':'Экваторлық Гвинея','624':'Гвинея-Бисау','694':'Сьерра-Леоне','430':'Либерия','768':'Того','204':'Бенин','270':'Гамбия','218':'Эквадор','328':'Гайана','740':'Суринам','600':'Парагвай','858':'Уругвай','591':'Панама','188':'Коста-Рика','558':'Никарагуа','340':'Гондурас','222':'Сальвадор','320':'Гватемала','084':'Белиз','332':'Гаити','214':'Доминикан Республикасы','388':'Ямайка','780':'Тринидад және Тобаго','044':'Багам аралдары','630':'Пуэрто-Рико','238':'Фолкленд аралдары','260':'Француз оңтүстік аумақтары'};
function cName(id){for(var i=0;i<COUNTRIES.length;i++)if(COUNTRIES[i][0]===id)return COUNTRIES[i][1];if(CNAMES[id])return CNAMES[id];if(WORLD)for(var j=0;j<WORLD.length;j++)if(WORLD[j].id===id)return WORLD[j].name;return id}
function startMap(id){
  GM={id:id,score:0,n:0,mistakes:[],round:0,total:10,guess:null,fb:'',loading:true,list:[]};
  loadWorld(function(w){if(!GM||GM.id!==id)return;GM.loading=false;
    if(w){if(id==='mapkz')GM.list=shuffle(KZPTS).slice(0,GM.total);else{var have={};w.forEach(function(c){have[c.id]=1});GM.list=shuffle(COUNTRIES.filter(function(c){return have[c[0]]})).slice(0,GM.total)}}
    RENDER.games()});
}
function mapSvg(){
  var T=GM.list[GM.round],s;
  if(GM.id==='mapkz'){
    s='<svg class="gmap kzmap'+(GM.guess?' done':'')+'" viewBox="0 0 '+KZV.w+' '+KZV.h+'" data-act="map-click" role="img" aria-label="Қазақстан картасы: нысанның орнын бас">';
    WORLD.forEach(function(c){if(c.bb[2]<40||c.bb[0]>95||c.bb[3]<36||c.bb[1]>60)return;s+='<path class="'+(c.id==='398'?'kz':'nb')+'" d="'+(c.dK||(c.dK=pathD(c,projKZ)))+'"/>'});
    if(GM.guess){var P=T[1].map(function(p){return projKZ(p[1],p[0])}),g=GM.guess;
      s+=(P.length>1?'<polyline class="tg" points="'+P.map(function(p){return p[0].toFixed(1)+','+p[1].toFixed(1)}).join(' ')+'"/>':'<circle class="tp" cx="'+P[0][0].toFixed(1)+'" cy="'+P[0][1].toFixed(1)+'" r="7"/>')
       +'<circle class="gp'+(GM.pts?' ok':' bad')+'" cx="'+g[0].toFixed(1)+'" cy="'+g[1].toFixed(1)+'" r="7"/>'
       +'<text class="tl" x="'+Math.min(KZV.w-10,Math.max(10,P[0][0])).toFixed(1)+'" y="'+Math.max(18,P[0][1]-12).toFixed(1)+'" text-anchor="middle">'+esc(T[0])+'</text>'}
    return s+'</svg>';
  }
  s='<svg class="gmap wmap" viewBox="0 0 '+WV.w+' '+WV.h+'" role="img" aria-label="Әлем картасы: елді тауып бас">';
  WORLD.forEach(function(c){if(c.id==='010')return;var cls='c';if(GM.guess){if(c.id===T[0])cls+=' ok';else if(c.id===GM.guess)cls+=' bad'}s+='<path class="'+cls+'" d="'+(c.dW||(c.dW=pathD(c,projW)))+'"'+(GM.guess?'':' data-act="map-country" data-id="'+c.id+'"')+'><title>'+(GM.guess?esc(cName(c.id)):'')+'</title></path>'});
  return s+'</svg>';
}
function mapHtml(top,g){
  if(GM.loading)return top+'<div class="card"><p class="empty">Карта жүктеліп жатыр…</p></div>';
  if(!WORLD||!GM.list.length)return top+'<div class="card" style="text-align:center"><p class="empty">Картаны жүктеу мүмкін болмады. Интернетті тексеріп, қайта ашып көр.</p><button class="btn primary" data-act="game" data-id="'+GM.id+'" type="button">Қайта көру</button></div>';
  var T=GM.list[GM.round],kz=GM.id==='mapkz';
  return top+'<div class="card"><div class="gbar"><h2 style="margin:0">'+g.t+'</h2><span class="pill">'+(GM.round+1)+' / '+GM.total+'</span><span class="pill hl">Ұпай: '+GM.score+'</span></div>'
   +'<div class="gq">'+esc(kz?T[0]:T[1])+'</div><p class="muted small" style="text-align:center;margin:-8px 0 10px">'+(GM.guess?'':kz?'Осы нысанның орнын картадан бас. 60 км-ге дейін — 3 ұпай, 150 км — 2, 300 км — 1.':'Осы елді әлем картасынан тауып бас.')+'</p>'
   +'<div class="map-wrap'+(kz?'':' wide')+'">'+mapSvg()+'</div>'+(kz?'':'<p class="small muted map-hint">Карта кең: оңға-солға жылжытып қара.</p>')
   +'<p id="g-fb" role="status" class="small" style="min-height:1.5em;margin:10px 0;text-align:center">'+(GM.fb||'')+'</p>'
   +(GM.guess?'<div class="row" style="justify-content:center"><button class="btn primary" data-act="map-next" type="button">'+(GM.round+1>=GM.total?'Нәтижені көру':'Келесі →')+'</button></div>':'')+'</div>';
}
function mapClick(e,svg){
  if(!GM||GM.id!=='mapkz'||GM.guess||GM.loading||!svg.getScreenCTM)return;
  var pt=svg.createSVGPoint();pt.x=e.clientX;pt.y=e.clientY;var p=pt.matrixTransform(svg.getScreenCTM().inverse()),T=GM.list[GM.round];
  var km=kmToTarget(p.x,p.y,T[1]),pts=km<=60?3:km<=150?2:km<=300?1:0;GM.score+=pts;GM.pts=pts;GM.guess=[p.x,p.y];GM.n++;
  GM.fb=(pts?'<b class="okc">+'+pts+' ұпай.</b> ':'<b class="badc">0 ұпай.</b> ')+(km?'Қашықтық: '+km+' км. ':'Дәл таптың! ')+esc(T[2]||'');
  if(!pts)GM.mistakes.push(T[0]+': '+km+' км қателестің');RENDER.games();
}
function mapCountry(id){
  if(!GM||GM.id!=='mapw'||GM.guess)return;var T=GM.list[GM.round],ok=id===T[0];GM.n++;if(ok)GM.score++;else GM.mistakes.push(T[1]+' (сен таңдаған: '+cName(id)+')');
  GM.guess=id;GM.fb=ok?'<b class="okc">Дұрыс!</b>':'<b class="badc">Қате.</b> Сен таңдаған ел: '+esc(cName(id))+'. Дұрыс жауап жасыл түспен белгіленді.';RENDER.games();
}
function mapNext(){if(!GM||!GM.guess)return;GM.round++;GM.guess=null;GM.fb='';GM.pts=0;if(GM.round>=GM.total)endGame();else{RENDER.games();var w=$('.map-wrap');if(w)w.scrollIntoView({block:'center'})}}

function stopGame(){if(gmIv){clearInterval(gmIv);gmIv=null}}
function gameBest(id){return state.geo.best[id]||0}
function newRapidQ(){
  var id=GM.id,q,D=daily();
  if(id==='cap'||id==='reg'){var all=id==='cap'?GEO.games.capitals:GEO.games.regions,p=nextOf(id,id==='cap'?D.cap:D.reg),rev=id==='cap'?D.capRev:D.regRev,ki=rev?1:0,ai=rev?0:1;var others=shuffle(all.filter(function(x){return x[ai]!==p[ai]})).slice(0,3).map(function(x){return x[ai]});q={text:p[ki],opts:shuffle([p[ai]].concat(others)),ans:p[ai],sub:id==='cap'?(rev?'Бұл қай елдің астанасы?':'Астанасы қай қала?'):(rev?'Бұл қай облыстың орталығы?':'Әкімшілік орталығы қай қала?')}}
  else if(id==='tf'){var s=nextOf('tf',D.tf);q={text:s.text,opts:['Иә, дұрыс','Жоқ, қате'],ans:s.ok?'Иә, дұрыс':'Жоқ, қате',e:s.e,sub:s.claim?'Ұсынылған жауап: «'+s.claim+'». Дұрыс па?':'Тұжырым дұрыс па?'}}
  else{var x=nextOf('blitz',D.blitz);q={text:x.q,opts:shuffle(x.o),ans:x.o[0],sub:''}}
  GM.last=q.text;GM.q=q;GM.fb='';
}
function startGame(id){
  stopGame();if(id==='mapkz'||id==='mapw'){startMap(id);RENDER.games();window.scrollTo(0,0);return}
  if(id==='nom'||id==='rid'){GM={id:id,score:0,n:0,mistakes:[],setup:id==='nom',cat:(GM&&GM.cat)||'all',mode:(GM&&GM.mode)||'find',total:10};ZM.nmap=null;ZM.rmap=null;loadWorld(function(){if(GM&&GM.id===id&&cur==='games')RENDER.games()});RENDER.games();window.scrollTo(0,0);return}
  GM={id:id,score:0,n:0,mistakes:[]};
  if(id==='mem'){var pairs=[],used={};while(pairs.length<6){var tp=nextOf('mem',daily().terms);if(used[tp[0]]){if(Object.keys(used).length>=daily().terms.length)break;continue}used[tp[0]]=1;pairs.push(tp)}var cards=[];pairs.forEach(function(p,i){cards.push({p:i,t:p[0]});cards.push({p:i,t:p[1]})});GM.cards=shuffle(cards);GM.open=[];GM.done=[];GM.moves=0;GM.start=Date.now()}
  else if(id==='ord'){var set=nextOf('ord',daily().ord);GM.set=set;do{GM.list=shuffle(set.items)}while(GM.list.join()===set.items.join());GM.chk=false}
  else{GM.end=Date.now()+(id==='blitz'?90:60)*1000;newRapidQ();gmIv=setInterval(function(){var el=$('#g-time');var left=Math.max(0,Math.ceil((GM.end-Date.now())/1000));if(el)el.textContent=left+' с';if(left<=0)endGame()},250)}
  RENDER.games();window.scrollTo(0,0);
}
function endGame(){
  if(!GM||GM.over)return;stopGame();GM.over=true;var s=GM.score;
  act('g');chalCheck();var prev=gameBest(GM.id),better=s>prev;if(better)state.geo.best[GM.id]=s;state.geo.games++;state.xp+=5;if(GM.id==='mapkz'||GM.id==='mapw')planMark('map');save();
  if(better&&s>0)reward('🏆','Жаңа рекорд!',s+' ұпай');RENDER.games();
}
RENDER.games=function(){
  var el=$('#view-games');
  if(!GM){
    el.innerHTML='<section class="banner">'+globeSvg()+'<span class="badge-pill">🎮 '+fmtDate(todayKey())+' · бүгінгі жинақ</span><h1>Ойындар</h1><p>Ойындардың сұрақтары, фактілері мен тапсырмалары күн сайын жаңарады: бүгінгі жинақ ертең мүлде басқа болады. Сұрақтардың көбі оқулықтардан алынған. Әр ойыннан кейін +5 XP.</p></section>'+ridCard()+chalHtml()+factHtml()
     +'<div class="grid g3">'+GAMES.map(function(g){return '<button class="tile game-card" type="button" data-act="game" data-id="'+g.id+'"><span class="ico" aria-hidden="true">'+g.ic+'</span><b>'+g.t+'</b><span class="d">'+g.d+'</span>'+(gameBest(g.id)?'<span class="pill hl">Рекорд: '+gameBest(g.id)+'</span>':'')+'</button>'}).join('')+'</div>';
    return;
  }
  var g=GAMES.filter(function(x){return x.id===GM.id})[0]||{id:'rid',ic:'🧩',t:'Күн жұмбағы',d:''},top='<div class="row between" style="margin-bottom:12px"><button class="btn ghost sm" data-act="game-quit" type="button">← Ойындар</button><span class="pill hl">Рекорд: '+gameBest(GM.id)+'</span></div>';
  if((GM.id==='mapkz'||GM.id==='mapw')&&!GM.over){el.innerHTML=mapHtml(top,g);return}
  if(GM.id==='nom'&&!GM.over){el.innerHTML=nomHtml(top,g);if(!GM.setup&&WORLD)nomMount();return}
  if(GM.id==='rid'){el.innerHTML=WORLD?ridHtml(top):top+'<div class="card"><p class="empty">Карта жүктеліп жатыр…</p></div>';if(WORLD)ridMount();return}
  if(GM.over){
    el.innerHTML=top+'<div class="card" style="text-align:center"><span class="ico" style="margin:0 auto 10px" aria-hidden="true">'+g.ic+'</span><h1>'+g.t+'</h1><p class="stat">'+GM.score+' <small>ұпай</small></p>'
     +(GM.mistakes.length?'<div style="text-align:left;max-width:560px;margin:0 auto 14px"><b>Қателер:</b><ul class="link-list">'+GM.mistakes.slice(0,8).map(function(m){return '<li>'+esc(m)+'</li>'}).join('')+'</ul></div>':'')
     +'<div class="row" style="justify-content:center"><button class="btn primary" data-act="game" data-id="'+GM.id+'" type="button">Қайта ойнау</button><button class="btn" data-act="game-quit" type="button">Басқа ойын</button></div></div>';return;
  }
  if(GM.id==='mem'){
    el.innerHTML=top+'<div class="card"><div class="gbar"><h2 style="margin:0">'+g.t+'</h2><span class="pill">Жүріс: '+GM.moves+' · Табылды: '+GM.done.length/2+' / 6</span></div><p class="muted small">Екі карточка аш: термин мен оның анықтамасы сәйкес келсе, жұп табылды.</p><div class="mem">'
     +GM.cards.map(function(c,i){var o=GM.open.indexOf(i)>-1,d=GM.done.indexOf(i)>-1;return '<button class="mc'+(d?' done':o?' open':'')+(GM.bad&&o?' wrongpair':'')+'" type="button" data-act="mem" data-i="'+i+'"'+(d?' disabled':'')+' aria-label="'+(o||d?esc(c.t):'Жабық карточка')+'">'+(o||d?esc(c.t):'?')+'</button>'}).join('')+'</div></div>';return;
  }
  if(GM.id==='ord'){
    var ok=GM.chk?GM.list.map(function(x,i){return x===GM.set.items[i]}):null;
    el.innerHTML=top+'<div class="card"><h2>'+esc(GM.set.t)+'</h2><p class="muted small">Жоғары және төмен батырмаларымен ретін өзгерт, кейін «Тексеру» бас.</p><div class="ord-list">'
     +GM.list.map(function(x,i){return '<div class="ord-item'+(ok?(ok[i]?' ok':' bad'):'')+'"><span class="n">'+(i+1)+'</span>'+esc(x)+(GM.chk?'':'<span class="mv"><button type="button" data-act="ord" data-i="'+i+'" data-d="-1" aria-label="Жоғары"'+(i?'':' disabled')+'>↑</button><button type="button" data-act="ord" data-i="'+i+'" data-d="1" aria-label="Төмен"'+(i<GM.list.length-1?'':' disabled')+'>↓</button></span>')+'</div>'}).join('')+'</div>'
     +(GM.chk?'<p style="margin-top:12px"><b>Дұрыс реті:</b> '+GM.set.items.map(esc).join(' → ')+'</p><div class="row"><button class="btn primary" data-act="game" data-id="ord" type="button">Келесі тапсырма</button></div>':'<div class="row" style="margin-top:12px"><button class="btn primary" data-act="ord-check" type="button">Тексеру</button></div>')+'</div>';return;
  }
  var q=GM.q,left=Math.max(0,Math.ceil((GM.end-Date.now())/1000));
  el.innerHTML=top+'<div class="card"><div class="gbar"><h2 style="margin:0">'+g.t+'</h2><span class="mtimer" id="g-time">'+left+' с</span><span class="pill">Ұпай: '+GM.score+'</span></div>'
   +(q.sub?'<p class="muted" style="text-align:center;margin:0">'+esc(q.sub)+'</p>':'')+'<div class="gq">'+esc(q.text)+'</div>'
   +(GM.id==='tf'?'<div class="tf-row">'+q.opts.map(function(o,i){return '<button class="btn '+(i?'':'primary')+'" type="button" data-act="rapid" data-v="'+esc(o)+'">'+esc(o)+'</button>'}).join('')+'</div>'
     :'<div class="opts">'+q.opts.map(function(o,i){return '<button class="opt" type="button" data-act="rapid" data-v="'+esc(o)+'"><span class="k">'+LET[i]+'</span><span>'+esc(o)+'</span></button>'}).join('')+'</div>')
   +'<p class="small muted" id="g-fb" role="status" style="min-height:1.5em;margin-top:12px">'+esc(GM.fb||'')+'</p></div>';
};
function rapidAnswer(v){
  if(!GM||GM.over||!GM.q)return;var q=GM.q;GM.n++;
  if(v===q.ans){GM.score++;GM.fb='✓ Дұрыс!'}else{GM.fb='✗ Дұрыс жауап: '+q.ans+(q.e?'. '+q.e:'');GM.mistakes.push(q.text+' → '+q.ans)}
  var fb=GM.fb;newRapidQ();GM.fb=fb;RENDER.games();
}


/* ================= КАРТА ҚОЗҒАЛТҚЫШЫ: үлкейту, жылжыту, екі саусақпен масштабтау ================= */
var NOM=(window.NOMEN&&window.NOMEN.items||[]).map(function(x){return {n:x[0],c:x[1],p:x[2]}});
var NCAT=window.NOMEN&&window.NOMEN.cats||{};
var CAT1={ocean:'мұхит',sea:'теңіз',gulf:'шығанақ',strait:'бұғаз немесе канал',island:'арал',pen:'түбек',mount:'тау жүйесі немесе таулы қырат',peak:'шың',plain:'жазық немесе ойпат',desert:'шөл',river:'өзен',lake:'көл',falls:'сарқырама',current:'мұхит ағысы',city:'қала',water:'су айдыны',relief:'жер бедерінің нысаны',nature:'табиғат ескерткіші немесе қорық'};
var KZCAT={city:['Қалалар','🏙'],water:['Көлдер мен теңіздер','💧'],river:['Өзендер','〰'],mount:['Таулар мен шыңдар','🏔'],relief:['Жер бедері','🗺'],nature:['Қорықтар мен табиғат','🌲']};
function kzCat(n){return /(қорығы|шатқалы|Бурабай|көлдері|Әнші)/.test(n)?'nature':/өзені$/.test(n)?'river':/(көлі|теңізі|су қоймасы|Алакөл)/.test(n)?'water':/(шыңы|таулары|Алатауы|жотасы|Ұлытау|Мұзтау)/.test(n)?'mount':/(шөлі|Үстірт|ойысы|түбегі|ойпаты|Сарыарқа|үстірті)/.test(n)?'relief':'city'}
var KZO=KZPTS.map(function(x){return {n:x[0],c:kzCat(x[0]),p:x[1],e:x[2],kz:1}});
var THR={ocean:[1600,2600,3800],sea:[350,700,1200],gulf:[350,700,1200],strait:[250,600,1000],island:[300,650,1100],pen:[350,700,1200],mount:[300,650,1100],peak:[250,600,1000],plain:[450,900,1500],desert:[450,900,1500],river:[200,500,900],lake:[200,500,900],falls:[250,600,1000],current:[300,700,1200],kz:[60,150,300]};
var WN_W=1000,WN_H=Math.round(164*WN_W/360);
function projN(lon,lat){return [(lon+180)*WN_W/360,(84-lat)*WN_W/360]}
function unprojN(x,y){return [x*360/WN_W-180,84-y*360/WN_W]}
function unprojK(x,y){return [x/(KZV.c*KZV.k)+KZV.x0,KZV.y1-y/KZV.k]}
function hav(a1,o1,a2,o2){var r=Math.PI/180,da=(a2-a1)*r,dl=(o2-o1)*r,h=Math.sin(da/2)*Math.sin(da/2)+Math.cos(a1*r)*Math.cos(a2*r)*Math.sin(dl/2)*Math.sin(dl/2);return 2*6371*Math.asin(Math.min(1,Math.sqrt(h)))}
function nearKm(lat,lon,pts){var best=1e9;if(pts.length===1)return hav(lat,lon,pts[0][0],pts[0][1]);for(var i=0;i<pts.length-1;i++){var a=pts[i],b=pts[i+1];for(var s=0;s<=12;s++){var t=s/12;best=Math.min(best,hav(lat,lon,a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t))}}return best}
function bearing(a1,o1,a2,o2){var r=Math.PI/180,y=Math.sin((o2-o1)*r)*Math.cos(a2*r),x=Math.cos(a1*r)*Math.sin(a2*r)-Math.sin(a1*r)*Math.cos(a2*r)*Math.cos((o2-o1)*r);return (Math.atan2(y,x)/r+360)%360}
var DIR8=['солтүстікке','солтүстік-шығысқа','шығысқа','оңтүстік-шығысқа','оңтүстікке','оңтүстік-батысқа','батысқа','солтүстік-батысқа'];
var ZM={},ZP={};
function zmInit(id,W,H,reset){if(!ZM[id]||reset)ZM[id]={x:0,y:0,w:W,h:H,W:W,H:H};return ZM[id]}
function zmVB(z){return z.x.toFixed(1)+' '+z.y.toFixed(1)+' '+z.w.toFixed(1)+' '+z.h.toFixed(1)}
function zmClamp(z){if(z.w>=z.W){z.x=(z.W-z.w)/2}else z.x=Math.max(0,Math.min(z.W-z.w,z.x));if(z.h>=z.H){z.y=(z.H-z.h)/2}else z.y=Math.max(0,Math.min(z.H-z.h,z.y))}
function zmUnit(id){var s=document.getElementById(id),z=ZM[id];var w=s?s.getBoundingClientRect().width:0;return z.w/Math.max(1,w)}
function zmApply(id){var z=ZM[id],s=document.getElementById(id);if(!s||!z)return;s.setAttribute('viewBox',zmVB(z));var o=document.getElementById(id+'-o');if(o&&z.ov)o.innerHTML=z.ov(zmUnit(id),z.W/z.w)}
function zmZoom(id,f,cx,cy){var z=ZM[id];if(!z)return;if(!f){z.x=0;z.y=0;z.w=z.W;z.h=z.H;zmApply(id);return}var nw=Math.max(z.W/16,Math.min(z.W,z.w/f)),nh=nw*z.H/z.W;if(cx==null){cx=z.x+z.w/2;cy=z.y+z.h/2}var rx=(cx-z.x)/z.w,ry=(cy-z.y)/z.h;z.x=cx-rx*nw;z.y=cy-ry*nh;z.w=nw;z.h=nh;zmClamp(z);zmApply(id)}
function zmFocus(id,x,y,k){var z=ZM[id];if(!z)return;z.w=z.W/k;z.h=z.H/k;z.x=x-z.w/2;z.y=y-z.h/2;zmClamp(z);zmApply(id)}
function zmPt(s,cx,cy){var p=s.createSVGPoint();p.x=cx;p.y=cy;return p.matrixTransform(s.getScreenCTM().inverse())}
function zmBtns(id){return '<div class="zbtns"><button type="button" data-act="zm" data-id="'+id+'" data-f="1.7" aria-label="Үлкейту">+</button><button type="button" data-act="zm" data-id="'+id+'" data-f="0.6" aria-label="Кішірейту">−</button><button type="button" data-act="zm" data-id="'+id+'" data-f="0" aria-label="Бастапқы көрініс">⟲</button></div>'}
document.addEventListener('pointerdown',function(e){var s=e.target.closest&&e.target.closest('svg.zmap');if(!s||!ZM[s.id])return;var z=ZM[s.id];ZP[e.pointerId]={x:e.clientX,y:e.clientY,s:s.id,t:e.target};var ids=Object.keys(ZP).filter(function(k){return ZP[k].s===s.id});
  if(ids.length===2){var a=ZP[ids[0]],b=ZP[ids[1]];z.pinch={d:Math.hypot(a.x-b.x,a.y-b.y),w:z.w,cx:(a.x+b.x)/2,cy:(a.y+b.y)/2};z.drag=null}
  else z.drag={sx:e.clientX,sy:e.clientY,x:z.x,y:z.y,moved:false};
  try{s.setPointerCapture(e.pointerId)}catch(er){}});
document.addEventListener('pointermove',function(e){var p=ZP[e.pointerId];if(!p)return;p.x=e.clientX;p.y=e.clientY;var s=document.getElementById(p.s),z=ZM[p.s];if(!s||!z)return;
  if(z.pinch){var ids=Object.keys(ZP).filter(function(k){return ZP[k].s===p.s});if(ids.length<2)return;var a=ZP[ids[0]],b=ZP[ids[1]],d=Math.hypot(a.x-b.x,a.y-b.y),c=zmPt(s,(a.x+b.x)/2,(a.y+b.y)/2);var want=z.pinch.w/(d/z.pinch.d);zmZoom(p.s,z.w/want,c.x,c.y);return}
  if(!z.drag)return;var dx=e.clientX-z.drag.sx,dy=e.clientY-z.drag.sy;if(!z.drag.moved&&Math.hypot(dx,dy)<6)return;z.drag.moved=true;s.classList.add('panning');var u=zmUnit(p.s);z.x=z.drag.x-dx*u;z.y=z.drag.y-dy*u;zmClamp(z);s.setAttribute('viewBox',zmVB(z))});
function zmUp(e){var p=ZP[e.pointerId];if(!p)return;delete ZP[e.pointerId];var s=document.getElementById(p.s),z=ZM[p.s];if(!s||!z)return;s.classList.remove('panning');
  if(z.pinch){if(Object.keys(ZP).filter(function(k){return ZP[k].s===p.s}).length<2)z.pinch=null;zmApply(p.s);return}
  if(z.drag){var mv=z.drag.moved;z.drag=null;if(mv){zmApply(p.s);return}if(e.type==='pointerup'&&z.onclick){var pt=zmPt(s,e.clientX,e.clientY),tg=document.elementFromPoint(e.clientX,e.clientY);if(!tg||!s.contains(tg))tg=p.t;z.onclick(pt.x,pt.y,tg)}}}
document.addEventListener('pointerup',zmUp);document.addEventListener('pointercancel',zmUp);
document.addEventListener('wheel',function(e){var s=e.target.closest&&e.target.closest('svg.zmap');if(!s||!ZM[s.id]||!(e.ctrlKey||e.metaKey))return;e.preventDefault();var c=zmPt(s,e.clientX,e.clientY);zmZoom(s.id,e.deltaY<0?1.15:0.87,c.x,c.y)},{passive:false});
var WBASE={};
function worldBase(pol){var k=pol?'pol':'nom';if(WBASE[k])return WBASE[k];var s='';WORLD.forEach(function(c,i){s+='<path class="'+(pol?'pc p'+(i%6):'wc')+(c.id==='398'?' kz':'')+'" data-cid="'+c.id+'" d="'+(c.dN||(c.dN=pathD(c,projN)))+'"/>'});return WBASE[k]=s}
function kzBase(){if(WBASE.kz)return WBASE.kz;var s='';WORLD.forEach(function(c){if(c.bb[2]<40||c.bb[0]>95||c.bb[3]<36||c.bb[1]>60)return;s+='<path class="'+(c.id==='398'?'kz':'nb')+'" d="'+(c.dK||(c.dK=pathD(c,projKZ)))+'"/>'});return WBASE.kz=s}
function zmapHtml(id,kind,cls){var W=kind==='k'?KZV.w:WN_W,H=kind==='k'?KZV.h:WN_H,z=zmInit(id,W,H);
  return '<div class="zwrap"><svg id="'+id+'" class="zmap '+(kind==='k'?'zk':'zw')+' '+(cls||'')+'" viewBox="'+zmVB(z)+'" role="img" aria-label="Карта"><rect class="zsea" x="-2000" y="-2000" width="6000" height="6000"/><g class="zb">'+(kind==='k'?kzBase():worldBase(cls==='pol'))+'</g><g class="zo" id="'+id+'-o"></g></svg>'+zmBtns(id)+'</div>'}
function objXY(o,kind){var pr=kind==='k'?function(p){return projKZ(p[1],p[0])}:function(p){return projN(p[1],p[0])};return o.p.map(pr)}
function isLine(o){return o.p.length>1&&/^(river|current|mount)$/.test(o.c)}
function objSvg(o,kind,u,k,cls,label){var P=objXY(o,kind),s='';
  if(isLine(o))s+='<polyline class="ol '+o.c+' '+(cls||'')+'" points="'+P.map(function(p){return p[0].toFixed(1)+','+p[1].toFixed(1)}).join(' ')+'" style="stroke-width:'+(u*(cls?4.5:2.6)).toFixed(2)+'"/>';
  else P.forEach(function(p){s+='<circle class="om '+o.c+' '+(cls||'')+'" cx="'+p[0].toFixed(1)+'" cy="'+p[1].toFixed(1)+'" r="'+(u*(cls?6.5:4)).toFixed(2)+'" style="stroke-width:'+(u*1.4).toFixed(2)+'"/>'});
  if(label){var q=P[Math.floor((P.length-1)/2)];s+='<text class="ot '+(cls||'')+'" x="'+q[0].toFixed(1)+'" y="'+(q[1]-u*8).toFixed(1)+'" style="font-size:'+(u*(cls?14:11)).toFixed(2)+'px;stroke-width:'+(u*3.2).toFixed(2)+'px">'+esc(o.n)+'</text>'}
  return s}
function hitObj(list,kind,x,y,u){var best=null,bd=1e9;list.forEach(function(o){var P=objXY(o,kind),d=1e9;if(P.length===1||!isLine(o))P.forEach(function(p){d=Math.min(d,Math.hypot(p[0]-x,p[1]-y))});else for(var i=0;i<P.length-1;i++){var a=P[i],b=P[i+1],dx=b[0]-a[0],dy=b[1]-a[1],L=dx*dx+dy*dy,t=L?Math.max(0,Math.min(1,((x-a[0])*dx+(y-a[1])*dy)/L)):0;d=Math.min(d,Math.hypot(x-a[0]-t*dx,y-a[1]-t*dy))}if(d<bd){bd=d;best=o}});return bd<=u*20?best:null}

/* ================= АТЛАС ================= */
var AT={tab:'nom',lay:{},klay:{},sel:null,q:''};
Object.keys(NCAT).forEach(function(k){AT.lay[k]=true});Object.keys(KZCAT).forEach(function(k){AT.klay[k]=true});
function capOf(name){var c=(GEO.games&&GEO.games.capitals||[]).filter(function(x){return x[0]===name})[0];return c?c[1]:''}
function atlasList(){return AT.tab==='kz'?KZO.filter(function(o){return AT.klay[o.c]}):NOM.filter(function(o){return AT.lay[o.c]})}
function atlasInfo(){var o=AT.sel;
  if(!o)return '<p class="muted small" style="margin:0">'+(AT.tab==='pol'?'Елді басып, атауы мен астанасын көр.':'Картадағы нысанды бас немесе іздеу жолағына атауын жаз. Үлкейту: +/− батырмалары, екі саусақ немесе Ctrl + тінтуір дөңгелегі.')+'</p>';
  if(o.cid){var nm=cName(o.cid),cp=capOf(nm);return '<div class="at-sel"><b>'+esc(nm)+'</b>'+(cp?'<span class="pill sky">Астанасы: '+esc(cp)+'</span>':'')+'</div>'}
  var p=o.p[0];return '<div class="at-sel"><b>'+esc(o.n)+'</b><span class="pill">'+esc((o.kz?KZCAT[o.c][0]:NCAT[o.c][0]))+'</span><span class="small muted">≈ '+Math.abs(Math.round(p[0]))+'° '+(p[0]>=0?'с. е.':'о. е.')+', '+Math.abs(Math.round(p[1]))+'° '+(p[1]>=0?'ш. б.':'б. б.')+'</span></div>'+(o.e?'<p class="small" style="margin:6px 0 0">'+esc(o.e)+'</p>':'');
}
function atlasOv(u,k){
  if(AT.tab==='pol')return '';var kind=AT.tab==='kz'?'k':'w',lab=AT.tab==='kz'?k>=1.4:k>=2.6;
  return atlasList().map(function(o){return objSvg(o,kind,u,k,AT.sel===o?'sel':'',lab||AT.sel===o)}).join('');
}
function atlasMount(){var id='atmap',z=ZM[id];if(!z)return;z.ov=atlasOv;
  z.onclick=function(x,y,t){
    if(AT.tab==='pol'){var cp=t.closest&&t.closest('path[data-cid]');AT.sel=cp?{cid:cp.getAttribute('data-cid')}:null;$$('#atmap path.on').forEach(function(p){p.classList.remove('on')});if(cp)cp.classList.add('on')}
    else{var kind=AT.tab==='kz'?'k':'w';AT.sel=hitObj(atlasList(),kind,x,y,zmUnit(id))}
    var b=$('#at-info');if(b)b.innerHTML=atlasInfo();zmApply(id)};
  zmApply(id);
}
RENDER.atlas=function(){
  var el=$('#view-atlas'),A=window.ATLASES||{books:[]};
  var tabs=[['nom','🌐','Әлем номенклатурасы'],['pol','🗺','Саяси карта'],['kz','📍','Қазақстан'],['books','📚','Мектеп атластары']];
  var head='<section class="banner">'+globeSvg()+'<span class="badge-pill">🗺 Интерактивті атлас</span><h1>Атлас</h1><p>Әлем мен Қазақстанның интерактивті карталары: '+NOM.length+' әлем нысаны, '+KZO.length+' Қазақстан нысаны және 7, 8, 9-сыныптардың мектеп атластары.</p></section>'
   +'<div class="seg" role="tablist">'+tabs.map(function(t){return '<button type="button" role="tab" data-act="at-tab" data-t="'+t[0]+'" aria-selected="'+(AT.tab===t[0])+'"><span class="ic" aria-hidden="true">'+t[1]+'</span>'+t[2]+'</button>'}).join('')+'</div>';
  if(AT.tab==='books'){
    el.innerHTML=head+'<div class="atl-books">'+A.books.map(function(b){var ok=!!b.drive;
      return '<article class="card atl-b" style="margin:0"><button class="atl-art" type="button" data-act="at-book" data-g="'+b.g+'" aria-label="'+esc(b.title)+' атласын ашу"'+(ok?'':' disabled')+'><img src="'+esc(b.cover)+'" alt="" width="312" height="470" loading="lazy" decoding="async"><span class="atl-gr">'+b.g+'<small>сынып</small></span><span class="atl-lang">'+(b.lang==='ru'?'Орыс тілінде':'Қазақ тілінде')+'</span></button>'
       +'<div class="atl-meta"><h3>'+esc(b.title)+'</h3><p class="small muted">'+esc(b.note)+'</p>'
       +'<div class="passrow"><span>Авторы</span><b>'+esc(b.author)+'</b></div><div class="passrow"><span>Баспа, жылы</span><b>'+esc(b.pub)+', '+b.year+'</b></div><div class="passrow"><span>Көлемі</span><b>'+b.pages+' бет</b></div>'
       +'<div class="row" style="margin-top:12px">'+(ok?'<button class="btn primary sm" type="button" data-act="at-book" data-g="'+b.g+'">📖 Атласты ашу</button><a class="btn sm" href="https://drive.google.com/uc?export=download&id='+encodeURIComponent(b.drive)+'" target="_blank" rel="noopener noreferrer">Жүктеу</a>':'<span class="pill">Жақында ашылады</span>')+'</div></div></article>'}).join('')+'</div>'
     +'<div class="card atl-tip"><p class="small" style="margin:0"><b>Кеңес:</b> атласты ҰБТ картасымен бірге қолдан. Картадағы атауды тапсаң, «Әлем номенклатурасы» қойындысында іздеп, орнын тексер, ал «Номенклатура» ойынында бекіт.</p></div>';
    return;
  }
  if(!WORLD){el.innerHTML=head+'<div class="card"><p class="empty">Карта жүктеліп жатыр…</p></div>';loadWorld(function(w){if(cur==='atlas')RENDER.atlas();else if(!w)toast('Картаны жүктеу мүмкін болмады')});return}
  var kind=AT.tab==='kz'?'k':'w',lay=AT.tab==='kz'?KZCAT:AT.tab==='nom'?NCAT:null,on=AT.tab==='kz'?AT.klay:AT.lay;
  el.innerHTML=head+'<div class="card at-card">'
   +(lay?'<div class="at-tools"><input id="at-q" type="search" placeholder="Нысанды іздеу: мысалы, Балқаш" value="'+esc(AT.q)+'" autocomplete="off"><div class="chips at-lay">'+Object.keys(lay).map(function(k){return '<button class="chip lay-'+k+'" type="button" data-act="at-lay" data-k="'+k+'" aria-pressed="'+!!on[k]+'"><i class="dot"></i>'+lay[k][0]+'</button>'}).join('')+'</div><div id="at-res" class="at-res"></div></div>':'')
   +zmapHtml('atmap',kind,AT.tab==='pol'?'pol':'')+'<div id="at-info" class="at-info">'+atlasInfo()+'</div></div>';
  ZM.atmap=null;zmInit('atmap',kind==='k'?KZV.w:WN_W,kind==='k'?KZV.h:WN_H,true);var s=$('#atmap');if(s)s.setAttribute('viewBox',zmVB(ZM.atmap));atlasMount();
};
function atlasSearch(q){AT.q=q;var box=$('#at-res');if(!box)return;q=q.trim().toLowerCase();if(q.length<2){box.innerHTML='';return}
  var list=(AT.tab==='kz'?KZO:NOM).filter(function(o){return o.n.toLowerCase().indexOf(q)>-1}).slice(0,8);
  box.innerHTML=list.length?list.map(function(o){return '<button type="button" data-act="at-pick" data-n="'+esc(o.n)+'">'+esc(o.n)+'</button>'}).join(''):'<span class="small muted">Табылмады</span>'}
function atlasPick(n){var o=(AT.tab==='kz'?KZO:NOM).filter(function(x){return x.n===n})[0];if(!o)return;if(AT.tab==='kz')AT.klay[o.c]=true;else AT.lay[o.c]=true;AT.sel=o;
  var P=objXY(o,AT.tab==='kz'?'k':'w'),q=P[Math.floor((P.length-1)/2)];$$('.at-lay [data-k="'+o.c+'"]').forEach(function(b){b.setAttribute('aria-pressed','true')});
  var r=$('#at-res');if(r)r.innerHTML='';var b=$('#at-info');if(b)b.innerHTML=atlasInfo();zmFocus('atmap',q[0],q[1],AT.tab==='kz'?2.2:4)}

/* ================= НОМЕНКЛАТУРА ОЙЫНЫ және КҮН ЖҰМБАҒЫ ================= */
function nomPool(cat){if(cat==='kz')return KZO;return NOM.filter(function(o){return cat==='all'||o.c===cat})}
function thrOf(o){return o.kz?THR.kz:THR[o.c]||THR.sea}
function nomStart(){GM.setup=false;GM.round=0;GM.score=0;GM.n=0;GM.mistakes=[];GM.guess=null;GM.fb='';var pool=nomPool(GM.cat);GM.list=shuffle(pool).slice(0,Math.min(GM.total,pool.length));GM.kind=GM.cat==='kz'?'k':'w';ZM.nmap=null;RENDER.games()}
function nomOpts(o){var pool=nomPool(GM.cat).filter(function(x){return x!==o&&(GM.cat!=='all'||x.c===o.c)});if(pool.length<3)pool=nomPool(GM.cat).filter(function(x){return x!==o});return shuffle([o.n].concat(shuffle(pool).slice(0,3).map(function(x){return x.n})))}
function nomOv(u,k){var T=GM.list&&GM.list[GM.round],s='';if(!T)return '';var kind=GM.kind;
  if(GM.mode==='name'||GM.guess)s+=objSvg(T,kind,u,k,'sel',!!GM.guess);
  if(GM.guess&&GM.gxy){var P=objXY(T,kind),best=P[0],bd=1e9;P.forEach(function(p){var d=Math.hypot(p[0]-GM.gxy[0],p[1]-GM.gxy[1]);if(d<bd){bd=d;best=p}});s+='<line class="gl2" x1="'+GM.gxy[0].toFixed(1)+'" y1="'+GM.gxy[1].toFixed(1)+'" x2="'+best[0].toFixed(1)+'" y2="'+best[1].toFixed(1)+'" style="stroke-width:'+(u*2).toFixed(2)+'"/><circle class="gp2 '+(GM.pts?'ok':'bad')+'" cx="'+GM.gxy[0].toFixed(1)+'" cy="'+GM.gxy[1].toFixed(1)+'" r="'+(u*6).toFixed(2)+'" style="stroke-width:'+(u*2).toFixed(2)+'"/>'}
  return s}
function nomMount(){var z=ZM.nmap;if(!z)return;z.ov=nomOv;
  z.onclick=function(x,y){if(GM.mode!=='find'||GM.guess)return;var T=GM.list[GM.round],ll=GM.kind==='k'?unprojK(x,y):unprojN(x,y),km=Math.round(nearKm(ll[1],ll[0],T.p)),th=thrOf(T),pts=km<=th[0]?3:km<=th[1]?2:km<=th[2]?1:0;
    GM.score+=pts;GM.pts=pts;GM.guess=true;GM.gxy=[x,y];GM.n++;GM.fb=(pts?'<b class="okc">+'+pts+' ұпай.</b> ':'<b class="badc">0 ұпай.</b> ')+'Қашықтық: '+km+' км.';if(!pts)GM.mistakes.push(T.n+': '+km+' км');RENDER.games()};
  if(GM.mode==='name'&&!GM.focused){var T=GM.list[GM.round],P=objXY(T,GM.kind),q=P[Math.floor((P.length-1)/2)];GM.focused=true;zmFocus('nmap',q[0]+(Math.random()-.5)*60,q[1]+(Math.random()-.5)*30,GM.kind==='k'?1.3:(T.c==='ocean'?1.4:2.6))}
  else zmApply('nmap');
}
function nomHtml(top,g){
  if(GM.setup){var cats=[['all','Барлығы','🌍']].concat(Object.keys(NCAT).map(function(k){return [k,NCAT[k][0],NCAT[k][1]]})).concat([['kz','Қазақстан','📍']]);
    return top+'<div class="card"><h2>'+g.t+'</h2><p class="muted">Әлем мен Қазақстан номенклатурасы: '+NOM.length+' әлем нысаны және '+KZO.length+' Қазақстан нысаны. Санатты және ойын түрін таңда.</p>'
     +'<h3>Санат</h3><div class="chips" style="margin-bottom:14px">'+cats.map(function(c){return '<button class="chip" type="button" data-act="nom-cat" data-v="'+c[0]+'" aria-pressed="'+(GM.cat===c[0])+'">'+c[2]+' '+esc(c[1])+' · '+nomPool(c[0]).length+'</button>'}).join('')+'</div>'
     +'<h3>Ойын түрі</h3><div class="grid g2 nom-modes"><button class="tile'+(GM.mode==='find'?' on':'')+'" type="button" data-act="nom-mode" data-v="find"><span class="ico" aria-hidden="true">📍</span><b>Картадан тап</b><span class="d">Атауы беріледі, орнын картадан басасың. Жақын болған сайын ұпай көп (10 сұрақ, 30 ұпайға дейін).</span></button><button class="tile'+(GM.mode==='name'?' on':'')+'" type="button" data-act="nom-mode" data-v="name"><span class="ico" aria-hidden="true">🔎</span><b>Атауын тап</b><span class="d">Нысан картада белгіленеді, 4 атаудың ішінен дұрысын таңдайсың (10 сұрақ).</span></button></div>'
     +'<p class="small muted" style="margin-top:12px">Рекорд: '+(state.geo.best['nom-'+GM.cat+'-'+GM.mode]||0)+'</p><button class="btn primary lg2" type="button" data-act="nom-start">Бастау</button></div>'}
  if(!WORLD)return top+'<div class="card"><p class="empty">Карта жүктеліп жатыр…</p></div>';
  var T=GM.list[GM.round],cat=T.kz?KZCAT[T.c][0]:NCAT[T.c][0];
  var body=GM.mode==='find'?'<div class="gq">'+esc(T.n)+'</div><p class="muted small" style="text-align:center;margin:-8px 0 10px">'+(GM.guess?'':'Санаты: '+esc(cat)+'. Картадан орнын бас. Картаны жылжытып, үлкейтуге болады.')+'</p>'
    :'<p class="muted small" style="text-align:center;margin:0 0 10px">Картада белгіленген нысанның атауы қандай? Санаты: '+esc(cat)+'.</p>';
  var opts=GM.mode==='name'?'<div class="opts nom-opts">'+(GM.opts||(GM.opts=nomOpts(T))).map(function(o,i){var cls='opt';if(GM.guess){if(o===T.n)cls+=' ok';else if(o===GM.pick)cls+=' bad'}return '<button class="'+cls+'" type="button" data-act="nom-pick" data-v="'+esc(o)+'"'+(GM.guess?' disabled':'')+'><span class="k">'+LET[i]+'</span><span>'+esc(o)+'</span></button>'}).join('')+'</div>':'';
  return top+'<div class="card"><div class="gbar"><h2 style="margin:0">'+g.t+'</h2><span class="pill">'+(GM.round+1)+' / '+GM.list.length+'</span><span class="pill hl">Ұпай: '+GM.score+'</span></div>'+body
   +zmapHtml('nmap',GM.kind,'')+'<p id="g-fb" role="status" class="small" style="min-height:1.5em;margin:10px 0;text-align:center">'+(GM.fb||'')+'</p>'+opts
   +(GM.guess?'<div class="row" style="justify-content:center;margin-top:10px"><button class="btn primary" type="button" data-act="nom-next">'+(GM.round+1>=GM.list.length?'Нәтижені көру':'Келесі →')+'</button></div>':'')+'</div>';
}
function nomNext(){if(!GM||!GM.guess)return;GM.round++;GM.guess=false;GM.gxy=null;GM.fb='';GM.pts=0;GM.opts=null;GM.pick=null;GM.focused=false;
  if(GM.round>=GM.list.length){var key='nom-'+GM.cat+'-'+GM.mode;if(GM.score>(state.geo.best[key]||0))state.geo.best[key]=GM.score;GM.id='nom';endGame();return}
  if(GM.mode==='find')zmZoom('nmap',0);RENDER.games()}

/* Күн жұмбағы: күн сайын бәріне бірдей бір жасырын нысан, 4 талпыныс, әр қатеден кейін жаңа кеңес */
var RID0='2026-11-22';
function ridNo(k){return Math.round((parseKey(k||todayKey())-parseKey(RID0))/864e5)+1}
function ridObj(k){var pool=KZO.concat(NOM.filter(function(o){return o.c!=='ocean'})),i=hash('rid:'+(k||todayKey()))%pool.length;return pool[i]}
function ridSucc(o){return o.kz?120:thrOf(o)[1]}
function ridClues(o){var p=o.p[0],c=[];
  if(o.kz){var ns=p[0]>50.5?'солтүстік':p[0]<44.5?'оңтүстік':'',ew=p[1]<58?'батыс':p[1]>76?'шығыс':'',part=ns&&ew?ns+'-'+ew:ns||ew||'орталық';c.push('Бұл — Қазақстандағы '+CAT1[o.c]+'. Ол елдің '+part+' бөлігінде орналасқан.')}
  else c.push('Бұл — '+CAT1[o.c]+'. Ол '+(p[0]>=0?'Солтүстік':'Оңтүстік')+' жарты шарда, '+(p[1]>=0?'шығыс':'батыс')+' бойлықта жатыр.');
  var r=o.kz?1:5,la=Math.round(Math.abs(p[0])/r)*r,lo=Math.round(Math.abs(p[1])/r)*r;
  c.push('Координатасы шамамен: '+la+'° '+(p[0]>=0?'солтүстік':'оңтүстік')+' ендік, '+lo+'° '+(p[1]>=0?'шығыс':'батыс')+' бойлық.'+(o.e?' '+o.e+'.':''));
  var w=o.n.replace(/\(.*?\)/g,'').trim().split(/\s+/)[0],wl=w.replace(/[-–’']/g,'').length;c.push('Атауы «'+w.charAt(0)+'» әрпінен басталады, бірінші сөзінде '+wl+' әріп бар.');
  return c}
function ridState(){var k=todayKey();return state.rid[k]||(state.rid[k]={g:[],ok:false,done:false})}
function ridStreak(){var n=0,i=0;if(!(state.rid[addDays(0)]&&state.rid[addDays(0)].ok))i=1;for(;i<400;i++){var r=state.rid[addDays(-i)];if(r&&r.ok)n++;else break}return n}
function ridEmoji(d,s){return d<=s?'🟩':d<=s*2.5?'🟨':d<=s*6?'🟧':'🟥'}
function ridShare(){var R2=ridState(),o=ridObj(),s=ridSucc(o);return 'Көкжиек · Күн жұмбағы №'+ridNo()+'\n'+R2.g.map(function(g){return ridEmoji(g[2],s)}).join('')+' '+(R2.ok?R2.g.length+'/4':'X/4')+'\nkokzhiek.netlify.app'}
function ridLeft(){var d=new Date(),n=new Date(d);n.setHours(24,0,0,0);var m=Math.round((n-d)/60000);return Math.floor(m/60)+' сағ '+(m%60)+' мин'}
function ridCard(){var R2=ridState(),st=ridStreak();
  return '<div class="card rid-card"><div class="row between" style="gap:12px"><div><div class="eyebrow">🧩 Күн жұмбағы №'+ridNo()+(st?' · <span class="flame">🔥</span> '+st+' күн қатар':'')+'</div><b>'+(R2.done?(R2.ok?'Шештің! '+R2.g.length+'/4 талпыныс':'Бүгін таба алмадың: жауабы — '+esc(ridObj().n)):'Жасырын нысанды 4 талпыныста картадан тап')+'</b><div class="small muted">'+(R2.done?'Келесі жұмбаққа: '+ridLeft():'Күн сайын бәріне бірдей. Сыныптастарыңмен салыстыр!')+'</div></div>'
   +'<button class="btn '+(R2.done?'':'primary')+'" type="button" data-act="rid-open">'+(R2.done?'Нәтиже':'Шешу')+'</button></div></div>'}
function ridHtml(top){
  var o=ridObj(),R2=ridState(),kind=o.kz?'k':'w',cl=ridClues(o),shown=Math.min(3,R2.g.length+1),s=ridSucc(o);
  var hist=R2.g.map(function(g,i){var ar=g[3]!=null?'<i class="rid-arrow" style="transform:rotate('+Math.round(g[3])+'deg)">➤</i>':'';return '<div class="rid-g">'+ridEmoji(g[2],s)+'<span>'+(i+1)+'-талпыныс: '+(g[2]<=s?'табылды!':g[2]+' км, нысан '+DIR8[Math.round(g[3]/45)%8]+' қарай')+'</span>'+(g[2]>s?ar:'')+'</div>'}).join('');
  return top+'<div class="card"><div class="gbar"><h2 style="margin:0">🧩 Күн жұмбағы №'+ridNo()+'</h2><span class="pill">'+R2.g.length+' / 4</span><span class="pill hl">🔥 '+ridStreak()+' күн</span></div>'
   +'<div class="rid-clues">'+cl.slice(0,R2.done?3:shown).map(function(c,i){return '<div class="rid-c"><b>'+(i+1)+'-кеңес</b>'+esc(c)+'</div>'}).join('')+'</div>'
   +(R2.done?'<div class="explain '+(R2.ok?'good':'')+'"><b>'+(R2.ok?'Керемет! Бұл — '+esc(o.n)+'.':'Жауабы: '+esc(o.n)+'.')+'</b> Келесі жұмбаққа '+ridLeft()+' қалды.</div><div class="row" style="margin:10px 0"><button class="btn primary" type="button" data-act="rid-share">Нәтижені бөлісу</button></div>':'<p class="muted small" style="margin:10px 0">Картадан нысанның орнын бас. Қате болса, қашықтық пен бағыт көрсетіліп, келесі кеңес ашылады.</p>')
   +zmapHtml('rmap',kind,'')+'<div class="rid-hist">'+hist+'</div></div>';
}
function ridOv(u,k){var o=ridObj(),R2=ridState(),kind=o.kz?'k':'w',s='';
  R2.g.forEach(function(g){var xy=kind==='k'?projKZ(g[1],g[0]):projN(g[1],g[0]);s+='<circle class="gp2 '+(g[2]<=ridSucc(o)?'ok':'bad')+'" cx="'+xy[0].toFixed(1)+'" cy="'+xy[1].toFixed(1)+'" r="'+(u*6).toFixed(2)+'" style="stroke-width:'+(u*2).toFixed(2)+'"/>'});
  if(R2.done)s+=objSvg(o,kind,u,k,'sel',true);return s}
function ridMount(){var z=ZM.rmap;if(!z)return;z.ov=ridOv;
  z.onclick=function(x,y){var R2=ridState();if(R2.done)return;var o=ridObj(),ll=o.kz?unprojK(x,y):unprojN(x,y),km=Math.round(nearKm(ll[1],ll[0],o.p)),q=o.p[0];
    R2.g.push([+ll[1].toFixed(2),+ll[0].toFixed(2),km,bearing(ll[1],ll[0],q[0],q[1])]);
    if(km<=ridSucc(o)){R2.ok=true;R2.done=true;state.xp+=15;act('g');save();queueReward('🧩','Күн жұмбағы шешілді!','+15 XP · '+R2.g.length+'/4');var st=ridStreak();if(st&&st%7===0){state.xp+=30;queueReward('🔥',st+' күн қатар!','+30 XP бонус')}}
    else if(R2.g.length>=4){R2.done=true;state.xp+=5;act('g');save();toast('Бұл жолы табылмады. Ертең жаңа жұмбақ!')}
    else save();
    RENDER.games()};
  zmApply('rmap')}

/* ================= ҰБТ ================= */
function chartHtml(){
  var tests=sortedTests().slice(-10);if(!tests.length)return '<p class="empty">Нәтиже жоқ. Төмендегі формадан алғашқы сынақты қос.</p>';
  var W=600,H=230,L=38,Rr=16,Tp=20,B=30,pw=W-L-Rr,ph=H-Tp-B,goal=state.ubt.goal;
  var y=function(v){return Tp+ph*(1-v/140)},x=function(i){return tests.length===1?L+pw/2:L+24+(pw-48)*i/(tests.length-1)};
  var s='<svg class="chart" viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Сынақ ҰБТ жиынтық баллының динамикасы">';
  [0,35,70,105,140].forEach(function(v){s+='<line class="c-grid" x1="'+L+'" x2="'+(W-Rr)+'" y1="'+y(v)+'" y2="'+y(v)+'"/><text class="c-axis" x="'+(L-6)+'" y="'+(y(v)+4)+'" text-anchor="end">'+v+'</text>'});
  if(isFinite(goal))s+='<line class="c-goal" x1="'+L+'" x2="'+(W-Rr)+'" y1="'+y(goal)+'" y2="'+y(goal)+'"/><text class="c-goal-t" x="'+(L+4)+'" y="'+(y(goal)-6)+'">Мақсат '+goal+'</text>';
  if(tests.length>1)s+='<polyline class="c-line" points="'+tests.map(function(t,i){return x(i).toFixed(1)+','+y(tot(t)).toFixed(1)}).join(' ')+'"/>';
  tests.forEach(function(t,i){s+='<circle class="c-dot" cx="'+x(i).toFixed(1)+'" cy="'+y(tot(t)).toFixed(1)+'" r="5"/><text class="c-val" x="'+x(i).toFixed(1)+'" y="'+(y(tot(t))-11).toFixed(1)+'">'+tot(t)+'</text><text class="c-axis" x="'+x(i).toFixed(1)+'" y="'+(H-8)+'" text-anchor="middle">'+fmtShort(t.date)+'</text>'});
  return s+'</svg>';
}
RENDER.ubt=function(){
  var u=state.ubt,sm=subjMeta(),ts=sortedTests(),last=ts.length?ts[ts.length-1]:null,c=countText(),summary='<p class="empty">Алғашқы сынақ нәтижесін қос, осы жерде талдау шығады.</p>',check='',bars='',calc='';
  if(last){
    var total=tot(last),best=Math.max.apply(null,ts.map(tot)),gap=u.goal-total,minOk=sm.every(function(s){return last[s.k]>=s.min});
    var weak=sm.map(function(s){return {name:s.name,r:last[s.k]/s.max}}).sort(function(a,b){return a.r-b.r})[0];
    summary='<p style="margin:0 0 8px"><span class="stat">'+total+'</span> <span class="muted">/ 140 · '+fmtFull(last.date)+'</span></p><div class="passrow"><span>Ең жақсы нәтиже</span><b class="num">'+best+' / 140</b></div><div class="passrow"><span>Мақсатқа дейін</span><b class="num">'+(gap>0?gap+' балл':'жеттің 🎉')+'</b></div><div class="passrow"><span>Ең әлсіз пән</span><b>'+esc(weak.name)+'</b></div>';
    bars=sm.map(function(s){var pc=Math.round(last[s.k]/s.max*100),low=last[s.k]<s.min;return '<div style="margin-bottom:10px"><div class="row between small"><b>'+esc(s.name)+'</b><span class="num">'+last[s.k]+' / '+s.max+(low?' <span class="pill rose">шектен төмен (кемі '+s.min+')</span>':'')+'</span></div><div class="bar'+(pc>=60?' green':'')+'"><i style="width:'+pc+'%"></i></div></div>'}).join('');
    check=(C.thr||[]).map(function(r){var ok=minOk&&total>=r[1];return '<div class="passrow"><span>'+esc(r[0])+' <span class="muted small">(кемі '+r[1]+')</span></span><span class="pill '+(ok?'green':'rose')+'">'+(ok?'өтеді':(total>=r[1]?'пән шегі жетпейді':'тағы '+(r[1]-total)+' балл'))+'</span></div>'}).join('')+(minOk?'':'<p class="small" style="margin:8px 0 0">Кемінде бір пәннен ең төмен шек орындалмаған: жиынтық балл жетсе де, нәтиже есептелмейді.</p>');
    if(c.n!=null&&c.n>0&&gap>0){var w=Math.max(1,Math.ceil(c.n/7));calc='<p style="margin:0">ҰБТ-ға дейін шамамен <b>'+w+' апта</b>. Мақсатқа жету үшін аптасына орта есеппен <b>'+(Math.ceil(gap/w*10)/10)+' балл</b> қосу керек.</p>'}
    else if(gap<=0)calc='<p style="margin:0">Мақсат балға жеттің. Мақсатты көтеруге немесе нәтижені тұрақтандыруға болады.</p>';else calc='<p class="muted" style="margin:0">Апталық қарқынды есептеу үшін ҰБТ күнін таңда.</p>';
  }
  $('#view-ubt').innerHTML='<section class="banner">'+globeSvg()+'<span class="badge-pill">🎯 120 тапсырма · 240 минут · 140 балл</span><h1>ҰБТ: мақсат және талдау</h1><p>Сынақ нәтижелерін жаз: сайт өсімді, әлсіз пәнді, шекті балдан өтетініңді және апталық қарқынды көрсетеді.</p></section>'
  +'<div class="grid g2" style="margin-bottom:18px"><div class="card" style="margin:0"><div class="eyebrow">ҰБТ күніне дейін</div><div class="stat">'+esc(c.big)+'</div>'
   +'<div class="form-row" style="margin-top:14px"><div><label for="u-date">ҰБТ күні</label><input id="u-date" type="date" data-bind="ubt.date" value="'+esc(u.date)+'"></div><div><label for="u-goal">Мақсат (0–140)</label><input id="u-goal" type="number" min="0" max="140" data-bind="ubt.goal" value="'+u.goal+'"></div></div>'
   +'<div class="form-row" style="margin-top:12px"><div><label for="u-p1">1-бейіндік пән</label><select id="u-p1" data-bind="ubt.p1">'+optHtml(u.p1)+'</select></div><div><label for="u-p2">2-бейіндік пән</label><select id="u-p2" data-bind="ubt.p2">'+optHtml(u.p2)+'</select></div></div></div>'
   +'<div class="card" style="margin:0"><div class="eyebrow">Соңғы сынақ</div>'+summary+'</div></div>'
  +(last?'<div class="grid g2" style="margin-bottom:18px"><div class="card" style="margin:0"><h2>Пән бойынша талдау</h2>'+bars+'</div><div class="card" style="margin:0"><h2>Шекті балдан өтемін бе?</h2>'+check+'<h3 style="margin-top:16px">Қарқын калькуляторы</h3>'+calc+'</div></div>':'')
  +'<div class="card"><h2>Балл динамикасы</h2>'+chartHtml()+'</div>'
  +'<div class="card"><h2>Жаңа сынақ нәтижесін қос</h2><form data-form="ubt-add"><div class="form-row"><div><label for="u-d">Күні</label><input id="u-d" type="date" value="'+todayKey()+'"></div>'
   +sm.map(function(s){return '<div><label for="u-'+s.k+'">'+esc(s.name)+' (0–'+s.max+')</label><input id="u-'+s.k+'" type="number" min="0" max="'+s.max+'" inputmode="numeric" required></div>'}).join('')+'<div><button class="btn primary" type="submit">Қосу</button></div></div></form></div>'
  +'<div class="card"><h2>Нәтижелер кестесі</h2><div class="tbl-wrap"><table><thead><tr><th>Күні</th>'+sm.map(function(s){return '<th>'+esc(s.name)+'<br>/ '+s.max+'</th>'}).join('')+'<th>Жиыны</th><th><span class="sr">Өшіру</span></th></tr></thead><tbody>'
   +(ts.length?ts.slice().reverse().map(function(t){return '<tr><td class="num">'+fmtFull(t.date)+'</td>'+sm.map(function(s){return '<td class="num">'+t[s.k]+'</td>'}).join('')+'<td><b class="num">'+tot(t)+'</b></td><td><button class="icon-btn" type="button" data-act="ubt-del" data-id="'+t.id+'" aria-label="Нәтижені өшіру">×</button></td></tr>'}).join(''):'<tr><td colspan="8" class="empty">Сынақ жоқ.</td></tr>')+'</tbody></table></div></div>'
  +'<div class="grid g2"><div class="card" style="margin:0"><h2>ҰБТ құрылымы</h2>'+[['Қазақстан тарихы','20'],['Оқу сауаттылығы','10'],['Математикалық сауаттылық','10'],['Бейіндік пән (екеу)','50 + 50'],['Жиыны','140']].map(function(r){return '<div class="passrow"><span>'+r[0]+'</span><b class="num">'+r[1]+'</b></div>'}).join('')
   +'<p class="muted small" style="margin-top:8px">Ең төмен шек: тарих пен бейіндік пәндерден 5, оқу және математикалық сауаттылықтан 3 балл.</p></div>'
  +'<div class="card" style="margin:0"><h2>Бейіндік пән құрылымы</h2>'+[['Бір дұрыс жауап (4 нұсқа)','25'],['Бір немесе бірнеше дұрыс жауап','5'],['Контекст негізіндегі','5'],['Сәйкестендіру','5'],['Жиыны','40 тапсырма · 50 балл']].map(function(r){return '<div class="passrow"><span>'+r[0]+'</span><b class="num">'+r[1]+'</b></div>'}).join('')
   +'<p class="muted small" style="margin-top:8px">Шекті балдар мен ережелер жыл сайын өзгеруі мүмкін: ресми сайттан тексер.</p></div></div>'
  +'<div class="card" style="margin-top:18px"><h2>Ресми сілтемелер</h2><ul class="link-list">'+(C.official||[]).map(function(x){return '<li>'+ext(x.l,x.u)+'</li>'}).join('')+'</ul></div>';
};

/* ================= ЖОСПАР ================= */
/* ---------- автоматты апталық жоспар: әр дүйсенбіде өзі құралады, орындалған әрекет өзі белгіленеді ---------- */
function weekStart(){var d=new Date();d.setHours(12,0,0,0);d.setDate(d.getDate()-((d.getDay()+6)%7));return dkey(d)}
var WP_NAME={daily:'Күнделікті нұсқа (20 тапсырма)',cards:'Карточкалар: бүгінгі қайталау',mock:'Байқау тест: 40 тапсырма, 80 минут',wrong:'Қателер дәптерін қайталау',map:'Карта ойыны: Қазақстан',catchup:'Қуып жету: бүгінгі сабақ'};
function wpLabel(x){if(x.k==='path'){var nx=pathNext();return 'Тақырып емтиханы: '+(nx?nx.name:'барлығы меңгерілді')}if(x.k==='topic'){var t=topicById(x.id);return 'Тақырып жаттығуы: '+(t?t.name:'')}return WP_NAME[x.k]||x.k}
function genWeek(){
  var ws=weekStart(),wt=weakTopics(2),days=[];
  for(var i=0;i<7;i++){var d=parseKey(ws);d.setDate(d.getDate()+i);var it=[{k:'daily'},{k:'cards'}];
    if(i===0||i===2||i===4)it.push({k:'path'});
    if((i===1||i===3)&&wt[(i-1)/2])it.push({k:'topic',id:wt[(i-1)/2].id});
    if(i===5)it.push({k:'mock'});
    if(i===6){it.push({k:'wrong'});it.push({k:'map'})}
    if(state.cu.on)it.push({k:'catchup'});
    days.push({k:dkey(d),items:it.map(function(x){x.done=false;return x})})}
  state.wplan={wk:ws,days:days,bonus:{}};
}
function ensureWeek(){var W=state.wplan;if(!W||W.wk!==weekStart()||!Array.isArray(W.days)||W.days.length!==7){genWeek();persist()}if(!state.wplan.bonus)state.wplan.bonus={}}
function wpDone(day,x){if(x.k==='daily')return !!state.geo.daily[day.k];if(x.k==='path'&&!pathNext())return true;return !!x.done}
function wpDay(k){ensureWeek();for(var i=0;i<7;i++)if(state.wplan.days[i].k===k)return state.wplan.days[i];return null}
function planMark(kind,id){
  if(!state.profile)return;ensureWeek();var tk=todayKey(),W=state.wplan;
  /* алдымен бүгін мен өткен күндер, табылмаса — осы аптаның алдағы күндері (ертерек орындалса да есептеледі) */
  var mark=function(day){return day.items.some(function(x){if(x.k!==kind||wpDone(day,x))return false;if(kind==='topic'&&x.id&&id&&x.id!==id)return false;x.done=true;return true})};
  if(!W.days.filter(function(dd){return dd.k<=tk}).reverse().some(mark))W.days.filter(function(dd){return dd.k>tk}).some(mark);
  var td=wpDay(tk);if(td&&!W.bonus[tk]&&td.items.length&&td.items.every(function(x){return wpDone(td,x)})){W.bonus[tk]=1;state.xp+=15;queueReward('✅','Бүгінгі жоспар толық орындалды!','+15 XP')}
}
function wpItem(day,x,past){var ok=wpDone(day,x);return '<div class="wp-it'+(ok?' done':'')+'"><span class="ck" aria-hidden="true">'+(ok?'✓':'')+'</span><span class="t">'+esc(wpLabel(x))+'</span>'+(!ok&&!past?'<button class="btn sm" data-act="wp-go" data-k="'+x.k+'" data-id="'+esc(x.id||'')+'" type="button">Бастау</button>':'')+'</div>'}
function wpHtml(){
  ensureWeek();var tk=todayKey(),W=state.wplan;
  return '<div class="card"><div class="row between"><div><div class="eyebrow">Автоматты апталық жоспар</div><h2 style="margin:0">'+fmtDate(W.days[0].k)+' – '+fmtDate(W.days[6].k)+'</h2></div><button class="btn sm ghost" data-act="wp-regen" type="button">Қайта құру</button></div>'
   +'<p class="muted small" style="margin-top:6px">Жоспар әр дүйсенбіде өзі құралады: күнделікті нұсқа, карточкалар, тақырып жолы, ең әлсіз тақырыптарың және сенбідегі байқау тест. Орындаған әрекетің өзі белгіленеді. Күннің бәрін орындасаң: +15 XP.</p><div class="wp">'
   +W.days.map(function(day){var p=parseKey(day.k),past=day.k<tk,isT=day.k===tk,dn=day.items.filter(function(x){return wpDone(day,x)}).length;
     return '<div class="wp-day'+(isT?' today':'')+(past?' past':'')+'"><div class="wp-h"><b>'+DAYS[p.getDay()]+(isT?' · бүгін':'')+'</b><span class="small muted">'+fmtDate(day.k)+' · '+dn+'/'+day.items.length+'</span></div>'+day.items.map(function(x){return wpItem(day,x,past)}).join('')+'</div>'}).join('')+'</div></div>';
}
function wpTodayHtml(){var day=wpDay(todayKey());if(!day)return '';var dn=day.items.filter(function(x){return wpDone(day,x)}).length;
  return '<div class="card"><div class="row between"><div><div class="eyebrow">🗓 Бүгінгі оқу жоспары</div><b>'+dn+' / '+day.items.length+' орындалды</b></div><a class="btn sm" href="#plan" data-act="wp-week">Апталық жоспар</a></div><div class="wp-today">'+day.items.map(function(x){return wpItem(day,x,false)}).join('')+'</div></div>'}
var P={tab:'day',has:true};
var SC={day:['Күндік жоспар','Бүгін не істеймін?'],week:['Апталық жоспар','Осы аптаның нәтижелері'],month:['Айлық жоспар','Осы айдың межелері'],year:['Жылдық мақсаттар','Үлкен мақсаттарым']};
function tkey(d){return dkey(d)+'T'+pad(d.getHours())+':'+pad(d.getMinutes())}
function defDue(sc){var d=new Date();d.setSeconds(0,0);
  if(sc==='day'){if(d.getHours()<21)d.setHours(21,0);else d.setHours(23,59)}
  else if(sc==='week'){d.setDate(d.getDate()+((7-d.getDay())%7));d.setHours(20,0)}
  else if(sc==='month')d=new Date(d.getFullYear(),d.getMonth()+1,0,20,0);
  else{if(state.ubt.date&&daysFrom(state.ubt.date)>=0)return state.ubt.date+'T09:00';d=new Date(d.getFullYear(),11,31,23,59)}
  return tkey(d)}
function dueInfo(key,done){if(!key)return {t:'Дедлайнсыз',c:''};var left=dueTs(key)-Date.now();if(done)return {t:fmtDue(key),c:''};if(left<0)return {t:fmtDue(key)+' · '+leftText(left)+' бұрын өтті',c:'rose'};if(left<3*36e5)return {t:fmtDue(key)+' · '+leftText(left)+' қалды',c:'rose'};if(left<864e5)return {t:fmtDue(key)+' · '+leftText(left)+' қалды',c:'amber'};return {t:fmtDue(key)+' · '+leftText(left)+' қалды',c:''}}
var MODE_NAME={focus:'Фокус',short:'Қысқа үзіліс',long:'Ұзақ үзіліс',ubt:'Сынақ ҰБТ'};
var T={mode:'focus',total:0,remaining:0,running:false,endAt:0,iv:null},CIRC=2*Math.PI*96;
function minsOf(m){if(m==='ubt')return 240;return Math.max(1,parseInt(state.timer[m],10)||1)}
function resetTimer(){T.total=minsOf(T.mode)*60;T.remaining=T.total}
resetTimer();
function mmss(s){var h=Math.floor(s/3600),m=Math.floor((s%3600)/60);return (h?h+':'+pad(m):pad(Math.floor(s/60)))+':'+pad(s%60)}
function scopeHtml(sc){
  var all=state.tasks.filter(function(t){return t.scope===sc}),done=all.filter(function(t){return t.done}).length,pc=all.length?Math.round(done/all.length*100):0;
  var list=all.slice().sort(function(a,b){return (a.done-b.done)||String(a.due||'9999').localeCompare(String(b.due||'9999'))});
  var subj=['География','Қазақстан тарихы','Оқу сауаттылығы','Математикалық сауаттылық'].concat(PROFILE.slice(1),['ҰБТ']);
  return '<div class="card"><div class="row between"><div><div class="eyebrow">'+SC[sc][1]+'</div><h2 style="margin:0">'+SC[sc][0]+'</h2></div><div class="stat">'+done+' / '+all.length+'</div></div>'
   +'<div class="bar green" style="margin:12px 0"><i style="width:'+pc+'%"></i></div>'
   +(list.length?list.map(function(t){var di=dueInfo(t.due,t.done);return '<div class="task'+(t.done?' done':'')+'"><input type="checkbox" data-act="task-toggle" data-id="'+t.id+'"'+(t.done?' checked':'')+' aria-label="Орындалды: '+esc(t.title)+'"><div class="t"><div>'+esc(t.title)+'</div><div class="small muted">'+(t.subject?esc(t.subject)+' · ':'')+'<span class="pill '+di.c+'" style="padding:1px 8px">'+esc(di.t)+'</span></div></div><button class="icon-btn" type="button" data-act="task-del" data-id="'+t.id+'" aria-label="Тапсырманы өшіру">×</button></div>'}).join(''):'<p class="empty">Әзірге бос. Төменнен алғашқы тапсырманы қос.</p>')
   +(done?'<div style="margin-top:10px"><button class="btn sm ghost" type="button" data-act="task-clear">Орындалғандарды өшіру</button></div>':'')+'</div>'
  +'<div class="card"><h3>'+(sc==='year'?'Жаңа мақсат':'Жаңа тапсырма')+'</h3><form data-form="task-add"><div class="form-row">'
   +'<div style="grid-column:span 2"><label for="t-title">'+(sc==='year'?'Мақсат':'Тапсырма')+'</label><input id="t-title" type="text" maxlength="140" required placeholder="'+(sc==='year'?'Мысалы: географиядан 45/50 жинау':sc==='month'?'Мысалы: гидросфераны толық қайталау':'Мысалы: географиядан бүгінгі нұсқа')+'"></div>'
   +'<div><label for="t-subj">Пән</label><select id="t-subj"><option value="">Пәнсіз</option>'+subj.map(function(s){return '<option>'+esc(s)+'</option>'}).join('')+'</select></div>'
   +dlHtml(sc)
   +'<div><button class="btn primary" type="submit">Қосу</button></div></div></form></div>';
}
function timerHtml(){
  var f=state.focus[todayKey()]||{min:0,n:0};
  return '<div class="card" style="text-align:center"><div class="chips" style="justify-content:center;margin-bottom:10px" role="group" aria-label="Таймер режимі">'+['focus','short','long','ubt'].map(function(m){return '<button class="chip" type="button" data-act="tmode" data-m="'+m+'" aria-pressed="'+(T.mode===m)+'">'+MODE_NAME[m]+'</button>'}).join('')+'</div>'
   +'<div class="ring-wrap'+(T.mode==='short'||T.mode==='long'?' is-break':'')+'" id="ring"><svg viewBox="0 0 220 220" aria-hidden="true"><circle class="tr" cx="110" cy="110" r="96"/><circle class="pg" id="prog" cx="110" cy="110" r="96" stroke-dasharray="'+CIRC+'" stroke-dashoffset="'+(CIRC*(T.total?1-T.remaining/T.total:0))+'"/></svg>'
   +'<div class="ring-txt"><b id="time" class="num" role="timer">'+(T.mode==='ubt'?mmss(T.remaining):pad(Math.floor(T.remaining/60))+':'+pad(T.remaining%60))+'</b><span>'+MODE_NAME[T.mode]+'</span></div></div>'
   +'<div class="row" style="justify-content:center"><button class="btn primary" id="t-toggle" type="button" data-act="ttoggle">'+(T.running?'Кідірту':(T.remaining<T.total?'Жалғастыру':'Бастау'))+'</button><button class="btn" type="button" data-act="treset">Қайта бастау</button></div>'
   +'<p class="small muted" style="margin-top:10px">Бүгін: '+f.n+' сессия, '+f.min+' минут.</p></div>'
  +'<div class="card"><h3>Таймер баптауы (минут)</h3><div class="form-row">'+[['focus','Фокус',120],['short','Қысқа үзіліс',60],['long','Ұзақ үзіліс',90]].map(function(x){return '<div><label for="s-'+x[0]+'">'+x[1]+'</label><input id="s-'+x[0]+'" type="number" min="1" max="'+x[2]+'" value="'+state.timer[x[0]]+'" data-bind="timer.'+x[0]+'"></div>'}).join('')+'</div></div>';
}
RENDER.plan=function(){
  var tabs=[['day','📅','Күн'],['week','🗓','Апта'],['month','📆','Ай'],['year','🎯','Жыл'],['timer','⏱','Таймер']],ns=notifs().filter(function(x){return x.task});
  $('#view-plan').innerHTML='<section class="banner">'+globeSvg()+'<span class="badge-pill">🗓 Күн · апта · ай · жыл</span><h1>Жоспар</h1><p>Тапсырманы орындасаң, марапат аласың. Орындалмағандары 🔔 белгісінде көрінеді.</p></section>'
  +(ns.length&&P.tab!=='timer'?'<div class="card" style="border-color:#fecaca;background:var(--bad-soft)"><b>Орындалмаған тапсырмалар:</b><ul style="margin:6px 0 0;padding-left:20px">'+ns.slice(0,5).map(function(x){return '<li>'+esc(x.t)+'</li>'}).join('')+'</ul></div>':'')
  +'<div class="seg" role="tablist">'+tabs.map(function(x){var n=x[0]==='timer'?0:state.tasks.filter(function(t){return t.scope===x[0]&&!t.done}).length;return '<button type="button" role="tab" data-act="ptab" data-t="'+x[0]+'" aria-selected="'+(P.tab===x[0])+'"><span class="ic" aria-hidden="true">'+x[1]+'</span>'+x[2]+(n?' · '+n:'')+'</button>'}).join('')+'</div>'
  +(P.tab==='timer'?timerHtml():(P.tab==='week'?wpHtml():'')+scopeHtml(P.tab));
};
var actx=null;
function prepAudio(){try{if(!actx){var AC=window.AudioContext||window.webkitAudioContext;if(AC)actx=new AC()}if(actx&&actx.state==='suspended')actx.resume()}catch(e){}}
function beep(){try{if(!actx)return;var o=actx.createOscillator(),g=actx.createGain(),t=actx.currentTime;o.type='sine';o.frequency.value=880;g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(0.25,t+0.03);g.gain.exponentialRampToValueAtTime(0.0001,t+0.7);o.connect(g);g.connect(actx.destination);o.start(t);o.stop(t+0.75)}catch(e){}}
function stopTimer(){if(T.iv){clearInterval(T.iv);T.iv=null}T.running=false}
function paintTimer(){var tm=$('#time');if(!tm)return;tm.textContent=T.mode==='ubt'?mmss(T.remaining):pad(Math.floor(T.remaining/60))+':'+pad(T.remaining%60);var pg=$('#prog');if(pg)pg.style.strokeDashoffset=CIRC*(T.total?1-T.remaining/T.total:0);var b=$('#t-toggle');if(b)b.textContent=T.running?'Кідірту':(T.remaining<T.total?'Жалғастыру':'Бастау')}
function tick(){T.remaining=Math.max(0,Math.ceil((T.endAt-Date.now())/1000));if(T.remaining===0){completeTimer();return}paintTimer()}
function startTimer(){if(T.running)return;prepAudio();T.endAt=Date.now()+T.remaining*1000;T.running=true;T.iv=setInterval(tick,250);paintTimer()}
function pauseTimer(){if(!T.running)return;T.remaining=Math.max(0,Math.ceil((T.endAt-Date.now())/1000));stopTimer();paintTimer()}
function creditFocus(m){act('f',m);var k=todayKey(),f=state.focus[k]||{min:0,n:0};state.focus[k]={min:f.min+m,n:f.n+1}}
function completeTimer(){
  stopTimer();beep();var msg,mins=minsOf(T.mode);
  if(T.mode==='focus'){creditFocus(mins);state.cycle=(state.cycle||0)+1;state.xp+=5;var nx=(state.cycle%4===0)?'long':'short';msg='Фокус аяқталды: +'+mins+' мин. '+(nx==='long'?'Ұзақ':'Қысқа')+' үзіліс жаса.';T.mode=nx;reward('⏱','Фокус сессиясы аяқталды','+5 XP')}
  else if(T.mode==='ubt'){creditFocus(mins);msg='Сынақ ҰБТ аяқталды. Нәтижені ҰБТ бөліміне жаз.';T.mode='focus'}
  else{msg='Үзіліс аяқталды. Келесі фокус блогына дайынсың ба?';T.mode='focus'}
  save();resetTimer();toast(msg);if(cur==='plan'&&P.tab==='timer')RENDER.plan();drawTop();
}

/* ================= ДАМУ ================= */
var G={tab:'plan',gen:null,breath:false};
var GTABS=[['plan','🧭','Жоспар құру'],['motiv','🔥','Мотивация'],['disc','✅','Дисциплина'],['books','📚','Кітаптар'],['pod','🎙','Подкасттар'],['vid','🎬','Видеолар']];
function habitDone(id,k){return (state.habits.log[k]||[]).indexOf(id)>-1}
function habitStreak(id){var n=0,i=0;if(!habitDone(id,addDays(0)))i=1;for(;i<400;i++){if(habitDone(id,addDays(-i)))n++;else break}return n}
function subjWeights(){var sm=[{n:'Қазақстан тарихы',w:1.4},{n:'Оқу сауаттылығы',w:.6},{n:'Математикалық сауаттылық',w:.6},{n:state.ubt.p1,w:2},{n:state.ubt.p2,w:2}],lt=lastTest();if(lt){var maxs=[20,10,10,50,50],keys=['h','r','m','a','b'];sm.forEach(function(s,i){s.w=s.w*(1+1.5*(1-lt[keys[i]]/maxs[i]))})}return sm}
function genPlan(){
  var wd=Math.max(0,Math.min(8,parseFloat(state.planGen.wd)||0)),we=Math.max(0,Math.min(10,parseFloat(state.planGen.we)||0)),days=[];
  for(var i=0;i<7;i++){var k=addDays(i),wk=parseKey(k).getDay(),hrs=(wk===0||wk===6)?we:wd;days.push({k:k,wk:wk,n:Math.round(hrs),blocks:[],review:false})}
  var last=days[6];if(last.n>0)last.review=true;
  var total=days.reduce(function(a,d){return a+d.n},0)-(last.n>0?1:0);if(total<1)return days;
  var sm=subjWeights(),sw=sm.reduce(function(a,s){return a+s.w},0),cnt=sm.map(function(s){return Math.floor(total*s.w/sw)}),rem=total-cnt.reduce(function(a,b){return a+b},0);
  var order=sm.map(function(s,i){return {i:i,f:total*s.w/sw-Math.floor(total*s.w/sw)}}).sort(function(a,b){return b.f-a.f});
  for(var j=0;rem>0&&j<order.length;j++,rem--)cnt[order[j].i]++;
  days.forEach(function(d,di){var n=d.n-(d.review?1:0),idx=sm.map(function(s,i){return i}).sort(function(a,b){return (cnt[b]-cnt[a])||(((a+di)%5)-((b+di)%5))});
    for(var b=0;b<n&&b<idx.length;b++){var si=idx[b];if(cnt[si]>0){d.blocks.push(sm[si].n);cnt[si]--}}
    while(d.blocks.length<n){var mi=0;cnt.forEach(function(c,i){if(c>cnt[mi])mi=i});if(cnt[mi]<=0)break;d.blocks.push(sm[mi].n);cnt[mi]--}});
  return days;
}
function planTable(days){return '<div class="tbl-wrap"><table><thead><tr><th>Күн</th><th>Блоктар (әрқайсысы шамамен 1 сағат)</th></tr></thead><tbody>'+days.map(function(d){var items=d.blocks.slice();if(d.review)items.push('Қателер дәптері және апталық тест');return '<tr><td><b>'+DAYS[d.wk]+'</b><br><span class="muted small">'+fmtDate(d.k)+'</span></td><td>'+(items.length?items.map(function(b){return '<span class="pill" style="margin:2px 4px 2px 0">'+esc(b)+'</span>'}).join(''):'<span class="muted">Демалыс</span>')+'</td></tr>'}).join('')+'</tbody></table></div>'}
function vlinks(q){return '<div class="row">'+ext('Ең көп қаралған',C.yt(q,'top'))+ext('Ең жаңа',C.yt(q,'new'))+'</div>'}
function growBody(){
  var t=G.tab,tk=todayKey();
  if(t==='plan')return '<div class="card"><h2>Жоспар не үшін керек?</h2><div class="grid g2">'+(C.whyPlan||[]).map(function(m){return '<div class="card flat" style="margin:0"><h3>'+esc(m.h)+'</h3><p style="margin:0">'+esc(m.p)+'</p></div>'}).join('')+'</div></div>'
    +'<div class="card"><h2>Жоспарды қалай құру керек: 7 қадам</h2><ol class="steps">'+(C.planSteps||[]).map(function(s){return '<li><b>'+esc(s.h)+'</b>'+esc(s.p)+'</li>'}).join('')+'</ol><div class="row" style="margin-top:14px"><a class="btn primary" href="#plan">Жоспар бөліміне өту</a></div></div>'
    +'<div class="card"><h2>Жоспарлау әдістері және видео-сабақтар</h2><div class="grid g2">'+(C.methods||[]).map(function(m){return '<div class="card flat" style="margin:0"><h3>'+esc(m.t)+'</h3><p class="small">'+esc(m.p)+'</p>'+vlinks(m.q)+'</div>'}).join('')+'</div></div>'
    +'<div class="card"><h2>Апталық жоспар жасаушы</h2><p class="muted">Күніне қанша сағат оқи алатыныңды көрсет: жоспар бейіндік пәндеріңе және соңғы сынақтағы әлсіз пәндеріңе қарай бөлінеді.</p>'
    +'<div class="form-row"><div><label for="g-wd">Жұмыс күндері (сағат)</label><input id="g-wd" type="number" min="0" max="8" value="'+state.planGen.wd+'" data-bind="planGen.wd"></div><div><label for="g-we">Демалыс күндері (сағат)</label><input id="g-we" type="number" min="0" max="10" value="'+state.planGen.we+'" data-bind="planGen.we"></div><div><button class="btn primary" type="button" data-act="gen-plan">Жоспар құру</button></div></div>'
    +(G.gen?'<div style="margin-top:14px">'+planTable(G.gen)+'<div class="row" style="margin-top:12px"><button class="btn" type="button" data-act="gen-add">Апталық жоспарға қосу</button></div></div>':'')+'</div>';
  if(t==='motiv'){
    var ch=C.challenges||[],cht=ch.length?ch[hash('c'+tk)%ch.length]:'',chd=!!state.chal[tk],q=quoteOfDay();
    return '<div class="grid g2" style="margin-bottom:18px"><div class="card" style="margin:0;background:var(--hl);border-color:var(--hl-b)"><div class="eyebrow">Бүгінгі сынақ</div><h2>'+esc(cht)+'</h2>'+(chd?'<p><span class="pill green">✓ Орындалды</span></p>':'<button class="btn primary" type="button" data-act="chal-done">Орындадым (+5 XP)</button>')+'<p class="muted small" style="margin-top:10px">Сынақ күн сайын жаңарады.</p></div>'
     +'<div class="card" style="margin:0"><div class="eyebrow">Менің себебім</div><h3>Неге ҰБТ-ны жақсы тапсырғым келеді?</h3><label class="sr" for="why">Менің себебім</label><textarea id="why" maxlength="240" data-bind="why" placeholder="Мысалы: географ болып, елімнің табиғатын зерттегім келеді">'+esc(state.why)+'</textarea><p class="muted small" style="margin-top:6px">Бұл сөйлем басты бетте көрініп тұрады.</p></div></div>'
     +'<div class="quote"><div class="eyebrow">✨ Күннің сөзі</div><p>'+esc(q.t)+'</p><div class="row between"><cite>— '+esc(q.a)+'</cite><button class="btn sm" data-act="next-quote" type="button">Басқа сөз</button></div></div>'
     +'<div class="card"><h2>Мотивацияны қалай ұстау керек</h2><div class="grid g3">'+(C.motivation||[]).map(function(m){return '<div class="card flat" style="margin:0"><h3>'+esc(m.h)+'</h3><p class="small" style="margin:0">'+esc(m.p)+'</p></div>'}).join('')+'</div></div>'
     +'<div class="grid g2"><div class="card" style="margin:0;text-align:center"><h3>Ынта түссе: 1 минут тыныс</h3><div class="breath'+(G.breath?' go':'')+'">'+(G.breath?'4 дем ал · 6 шығар':'Дайынсың ба?')+'</div><button class="btn" type="button" data-act="breath">'+(G.breath?'Тоқтату':'Бастау')+'</button></div>'
     +'<div class="card" style="margin:0"><h3>Болашақ өзіме хат</h3><label class="sr" for="letter">Хат</label><textarea id="letter" maxlength="1200" data-bind="letter" placeholder="ҰБТ-дан кейінгі өзіңе не айтқың келеді? Қиын күні осы хатты қайта оқы.">'+esc(state.letter)+'</textarea></div></div>';
  }
  if(t==='disc'){
    var days=[];for(var i=6;i>=0;i--)days.push(addDays(-i));
    return '<div class="card"><h2>Әдеттер трекері</h2><div class="habit-grid" role="table" aria-label="Әдеттер кестесі"><div class="h" style="text-align:left">Әдет</div>'+days.map(function(k){return '<div class="h">'+DS[parseKey(k).getDay()]+'<br>'+k.slice(8)+'</div>'}).join('')+'<div></div>'
     +state.habits.list.map(function(hb){var st=habitStreak(hb.id);return '<div><b>'+esc(hb.name)+'</b>'+(st>1?'<div class="small muted"><span class="flame" aria-hidden="true">🔥</span> '+st+' күн</div>':'')+'</div>'+days.map(function(k){return '<button class="hb'+(k===tk?' today':'')+'" type="button" data-act="habit" data-id="'+hb.id+'" data-k="'+k+'" aria-pressed="'+habitDone(hb.id,k)+'" aria-label="'+esc(hb.name)+', '+fmtDate(k)+'">'+(habitDone(hb.id,k)?'✓':'')+'</button>'}).join('')+'<button class="icon-btn" type="button" data-act="habit-del" data-id="'+hb.id+'" aria-label="Әдетті өшіру">×</button>'}).join('')+'</div>'
     +'<form data-form="habit-add" class="row" style="margin-top:16px"><div style="flex:1;min-width:200px"><label for="h-name">Жаңа әдет</label><input id="h-name" type="text" maxlength="60" required placeholder="Мысалы: 22:30-да телефонды қою"></div><div style="align-self:flex-end"><button class="btn primary" type="submit">Қосу</button></div></form></div>'
     +'<div class="card"><h2>Тәртіпке арналған кеңестер</h2><ul class="link-list">'+(C.disciplineTips||[]).map(function(x){return '<li>'+esc(x)+'</li>'}).join('')+'</ul><h3 style="margin-top:14px">Видео-сабақтар</h3>'+vlinks('әдет қалыптастыру тәртіп дисциплина қазақша')+'</div>';
  }
  if(t==='books')return '<div class="card"><h2>Кітапты қалай оқу керек</h2><div class="grid g3">'+(C.readHow||[]).map(function(m){return '<div class="card flat" style="margin:0"><h3>'+esc(m.h)+'</h3><p class="small" style="margin:0">'+esc(m.p)+'</p></div>'}).join('')+'</div>'
     +'<h3 style="margin-top:16px">Тегін видео-сабақтар</h3>'+(C.readLessons||[]).map(function(l){return '<div class="passrow"><b>'+esc(l.t)+'</b>'+vlinks(l.q)+'</div>'}).join('')+'</div>'
     +(C.genres||[]).map(function(g){return '<div class="card"><h2><span aria-hidden="true">'+g.ic+'</span> '+esc(g.g)+'</h2><div class="grid g2">'+g.b.map(function(b){return '<div class="book"><div class="spine" aria-hidden="true"></div><div><b>'+esc(b.t)+'</b><div class="muted small">'+esc(b.a)+'</div><div class="small">'+esc(b.n)+'</div></div></div>'}).join('')+'</div></div>'}).join('')
     +'<div class="card"><h2>Заңды онлайн кітапханалар</h2><ul class="link-list">'+(C.libraries||[]).map(function(x){return '<li>'+ext(x.l,x.u)+'</li>'}).join('')+'</ul></div>';
  if(t==='pod')return '<div class="card"><h2>Қазақша мағыналы подкасттар</h2><div class="grid g2">'+(C.podcasts||[]).map(function(p){return '<div class="card flat" style="margin:0"><h3>🎙 '+esc(p.t)+'</h3><p class="small muted">'+esc(p.n)+'</p>'+vlinks(p.q)+'</div>'}).join('')+'</div></div>';
  return '<div class="card"><h2>Маңызды тақырыптар бойынша видеолар</h2><div class="grid g3">'+(C.videos||[]).map(function(v){return '<div class="card flat" style="margin:0"><h3><span aria-hidden="true">'+v.ic+'</span> '+esc(v.t)+'</h3>'+vlinks(v.q)+'</div>'}).join('')+'</div></div>';
}
RENDER.grow=function(){$('#view-grow').innerHTML='<section class="banner">'+globeSvg()+'<span class="badge-pill">🌱 Өзіңді дамыт</span><h1>Даму</h1><p>Жоспар құру, мотивация, тәртіп, кітаптар, подкасттар және видеолар.</p></section><div class="seg" role="tablist">'+GTABS.map(function(x){return '<button type="button" role="tab" data-act="gtab" data-t="'+x[0]+'" aria-selected="'+(G.tab===x[0])+'"><span class="ic" aria-hidden="true">'+x[1]+'</span>'+x[2]+'</button>'}).join('')+'</div>'+growBody()};

/* ================= ВИДЕО ================= */
RENDER.video=function(){
  var mine=state.vids;
  $('#view-video').innerHTML='<section class="banner">'+globeSvg()+'<span class="badge-pill">▶️ YouTube сабақтары</span><h1>Видеосабақтар</h1><p>География бойынша нұсқа талдаулар мен тақырыптық сабақтар. Сілтемелер YouTube іздеуін ашады, сондықтан жаңа бейнелер өзі қосылып отырады.</p></section>'
  +'<div class="sec-h"><h2>Juz40: география</h2></div><div class="grid g4" style="margin-bottom:18px">'
   +[['Нұсқа талдау','Juz40 география ҰБТ нұсқа талдау',''],['Сабақтар','Juz40 география ҰБТ сабақ',''],['Ең көп қаралған','Juz40 география ҰБТ','top'],['Жаңа бейнелер','Juz40 география ҰБТ','new']].map(function(x){return '<a class="tile" href="'+esc(C.yt(x[1],x[2]))+'" target="_blank" rel="noopener noreferrer"><span class="ico" aria-hidden="true">▶️</span><b>'+x[0]+'</b><span class="d">YouTube ↗</span></a>'}).join('')+'</div>'
  +'<div class="sec-h"><h2>Тақырыптар бойынша</h2></div><div class="grid auto" style="margin-bottom:18px">'+GEO.topics.map(function(t){return '<div class="card" style="margin:0"><h3><span aria-hidden="true">'+t.ic+'</span> '+esc(t.name)+'</h3>'+vlinks('ҰБТ география '+t.name)+'</div>'}).join('')+'</div>'
  +'<div class="card"><h2>Менің жинағым</h2><form data-form="vid-add"><div class="form-row"><div style="grid-column:span 2"><label for="j-url">YouTube сілтемесі</label><input id="j-url" type="url" required placeholder="https://www.youtube.com/..."></div><div><label for="j-title">Атауы</label><input id="j-title" type="text" maxlength="100" placeholder="Мысалы: Гидросфера, нұсқа талдау"></div><div><button class="btn primary" type="submit">Сақтау</button></div></div></form>'
   +'<ul class="link-list" style="margin-top:14px">'+(mine.length?mine.map(function(m){return '<li class="row between"><span>'+ext(m.t||m.u,m.u)+'</span><button class="icon-btn" type="button" data-act="vid-del" data-id="'+m.id+'" aria-label="Сілтемені өшіру">×</button></li>'}).join(''):'<li class="empty">Жинақ әзірге бос.</li>')+'</ul></div>'
  +'<details class="card"><summary><b>Басқа пәндер бойынша Juz40 сабақтары</b></summary><ul class="link-list" style="margin-top:10px">'+QUIZ.map(function(S){return '<li class="row between"><span>'+esc(S.name)+'</span>'+ext('YouTube',C.yt('Juz40 '+S.name+' ҰБТ нұсқа талдау'))+'</li>'}).join('')+'</ul></details>';
};

/* ================= БАСҚА ПӘНДЕР ================= */
var TS={id:null};
RENDER.other=function(){
  var el=$('#view-other');
  if(R&&R.back==='other'){el.innerHTML=R.done?resultHtml():runHtml();return}
  if(CD&&CD.back==='other'){el.innerHTML=cardsHtml();return}
  var st=state.stats,pc=st.a?Math.round(st.c/st.a*100):0,nw=state.wrong.length;
  el.innerHTML='<section class="banner">'+globeSvg()+'<span class="badge-pill">📚 Қосымша жаттығу</span><h1>Басқа пәндер</h1><p>Міндетті және басқа бейіндік пәндер бойынша қысқа жаттығулар. Негізгі бағыт — география.</p></section>'
   +'<div class="grid g3" style="margin-bottom:18px"><div class="card" style="margin:0"><div class="eyebrow">Жалпы нәтиже</div><div class="stat">'+pc+'% <small>дұрыс</small></div><p class="muted small" style="margin:6px 0 0">'+st.a+' жауап</p></div>'
   +'<div class="card" style="margin:0"><div class="eyebrow">Қателер дәптері</div><h3>'+nw+' сұрақ</h3><button class="btn sm" data-act="other-wrong" type="button"'+(nw?'':' disabled')+'>Қайталау</button></div>'
   +'<div class="card" style="margin:0"><div class="eyebrow">Бір тестте</div><div class="chips">'+[5,10,20,0].map(function(n){return '<button class="chip" type="button" data-act="tcount" data-n="'+n+'" aria-pressed="'+(state.tcount===n)+'">'+(n?n:'Барлығы')+'</button>'}).join('')+'</div></div></div>'
   +'<div class="grid auto">'+QUIZ.map(function(S){var ss=state.stats.subj[S.id],p=ss&&ss.a?Math.round(ss.c/ss.a*100):null;
     return '<div class="card" style="margin:0;padding:12px">'+coverHtml(S.id,S.ic)+'<h3 style="margin-bottom:4px">'+esc(S.name)+'</h3><p class="muted small" style="margin:0 0 10px">'+(S.kind==='m'?'Міндетті':'Бейіндік')+' · '+S.qs.length+' сұрақ'+(p!==null?' · '+p+'%':'')+'</p><div class="row"><button class="btn sm primary" data-act="other-run" data-id="'+S.id+'" type="button">Тест</button><button class="btn sm" data-act="other-cards" data-id="'+S.id+'" type="button">Карточкалар</button></div></div>'}).join('')+'</div>'
   +'<div class="card" style="margin-top:18px"><p class="small muted" style="margin:0">Бұл сұрақтар ҰБТ спецификацияларының тақырыптары бойынша құрастырылған түпнұсқа сұрақтар. Күмәнді жерін оқулықпен немесе мұғаліммен тексер.</p></div>';
};

/* ================= СЫНЫП РЕЙТИНГІ ================= */
RENDER.class=function(){
  var el=$('#view-class'),head='<section class="banner">'+globeSvg()+'<span class="badge-pill">🏆 Сынып рейтингі</span><h1>Сынып рейтингі</h1><p>Сыныптастарыңмен апталық XP бойынша жарыс. Рейтингте тек атың, аватарың, деңгейің және XP көрінеді.</p></section>';
  if(!fbReady()){el.innerHTML=head+'<div class="card"><p class="empty">Сынып рейтингі әлі бапталмаған.</p></div>';return}
  if(!CLOUD.user){el.innerHTML=head+'<div class="card" style="text-align:center"><h2>Алдымен Google арқылы кір</h2><p class="muted">Рейтинг пен бұлттық сақтау бір аккаунтпен жұмыс істейді. Кіргеннен кейін деректерің барлық құрылғыңда бірдей болады.</p>'+signInBtn()+'</div>';return}
  if(!state.cls){
    el.innerHTML=head+'<div class="grid g2"><div class="card" style="margin:0"><h2>Сыныпқа қосылу</h2><p class="muted small">Мұғалімің немесе сыныптасың берген 6 таңбалы кодты жаз.</p><form data-form="cls-join" class="row"><div style="flex:1;min-width:160px"><label for="cls-code">Сынып коды</label><input id="cls-code" type="text" maxlength="6" autocomplete="off" autocapitalize="characters" placeholder="Мысалы: K7Q2MX" style="text-transform:uppercase"></div><div style="align-self:flex-end"><button class="btn primary" type="submit">Қосылу</button></div></form></div>'
     +'<div class="card" style="margin:0"><h2>Жаңа сынып құру</h2><p class="muted small">Мұғалімге немесе сынып басшысына арналған. Құрылған кодты сыныптастарыңа жібер.</p><form data-form="cls-create" class="row"><div style="flex:1;min-width:160px"><label for="cls-name">Сынып атауы</label><input id="cls-name" type="text" maxlength="60" placeholder="Мысалы: 11 «Ә» сынып"></div><div style="align-self:flex-end"><button class="btn" type="submit">Құру</button></div></form></div></div>';
    return;
  }
  if(CLS.list===null&&!CLS.busy)classLoad();
  var wk=weekStart(),me=CLOUD.user.uid,info=CLS.info||{};
  var rows=(CLS.list||[]).map(function(m){return {m:m,v:CLS.tab==='week'?(m.wk===wk?(m.wxp||0):0):(m.xp||0)}}).sort(function(a,b){return b.v-a.v});
  el.innerHTML=head+'<div class="card"><div class="row between"><div><div class="eyebrow">Сынып</div><h2 style="margin:0">'+esc(info.name||'…')+'</h2></div><div class="row"><span class="pill sky">Код: <b>'+esc(state.cls)+'</b></span><button class="btn sm" type="button" data-act="cls-copy">Кодты көшіру</button></div></div>'
   +'<div class="chips" style="margin:14px 0"><button class="chip" type="button" data-act="cls-tab" data-v="week" aria-pressed="'+(CLS.tab==='week')+'">Осы апта</button><button class="chip" type="button" data-act="cls-tab" data-v="all" aria-pressed="'+(CLS.tab==='all')+'">Барлық уақыт</button><button class="chip" type="button" data-act="cls-refresh">Жаңарту</button></div>'
   +(CLS.err?'<p class="empty">'+esc(CLS.err)+'</p>':CLS.list===null?'<p class="empty">Жүктеліп жатыр…</p>':'<ol class="lb">'+rows.map(function(r,i){var m=r.m;return '<li class="'+(m.uid===me?'me':'')+'"><span class="pos">'+(i<3?['🥇','🥈','🥉'][i]:(i+1))+'</span><span class="lav">'+avHtml(m.av,m.ph,'sm')+'</span><span class="nm"><b>'+esc(m.name||'')+(m.uid===me?' (сен)':'')+'</b><small class="muted">'+(m.lvl?'Деңгей '+m.lvl:'')+'</small></span><b class="xp">'+r.v+' XP</b></li>'}).join('')+'</ol>')
   +'<p class="small muted" style="margin-top:12px">Апталық рейтинг әр дүйсенбіде нөлден басталады. XP сайттағы әрекеттерің үшін беріледі: тест, карточка, ойын, жоспар.</p>'
   +'<div class="row"><button class="btn sm ghost" type="button" data-act="cls-leave">'+(CLS.leaveAsk?'Растау: сыныптан шығу':'Сыныптан шығу')+'</button>'+(CLS.leaveAsk?'<button class="btn sm" type="button" data-act="cls-leave-no">Болдырмау</button>':'')+'</div></div>';
};


/* ================= КОМИКС ================= */
/* «Ұмыт тұманы» аниме-комиксі. Суреттер — cx-art.js (window.CXART), сюжет — data-comics.js (window.COMICS).
   Күйі: CMX.ep (ашық серия индексі), CMX.s (таңдалған маусым), state.comics[серия id] = кристалл алынған күн. */
var CMX={ep:null,ans:null,ord:null,s:null};
function cmxD(){return window.COMICS&&window.COMICS.eps?window.COMICS:{eps:[],seasons:[],cast:[]}}
function cmxEps(){return cmxD().eps}
function cmxKeys(){return cmxEps().filter(function(e){return state.comics[e.id]}).length}
function cmxSeason(n){return cmxD().seasons.filter(function(s){return s.n===n})[0]||{n:n,g:'',t:'',c:'#7c3aed'}}
function cxPos(i,n){return n===1?'c':n===2?(i?'r':'l'):['l','c','r'][i]||'c'}
function cxBust(spec,i,n){var p=spec.split(':'),k=p[0],e=p[1]||'n',pos=p[2]||cxPos(i,n),fl=k==='bagdar'||k==='tuman';
  return '<div class="cxc pos-'+pos+(fl?' float':'')+'"><svg viewBox="0 0 200 260" aria-hidden="true" focusable="false"'+(pos==='r'&&!fl?' class="flip"':'')+'>'+CXART.bust(k,e)+'</svg></div>'}
function cxScene(bg,cast,cls,fx){return '<svg class="cxp-bg" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">'+CXART.bg(bg)+'</svg>'
  +(fx?'<svg class="cxp-fx fx-'+fx+'" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">'+CXART.fx(fx)+'</svg>':'')
  +'<div class="cxp-cast n'+cast.length+' '+(cls||'')+'">'+cast.map(function(c,j){return cxBust(c,j,cast.length)}).join('')+'</div>'}
function cxPanel(p,i){var cast=p.c||[],n=cast.length,who=cast.map(function(c){return c.split(':')[0]});
  var bub=(p.b||[]).map(function(b){var k=b[0],t=b[1],x=who.indexOf(k),pos=x<0?'n':cxPos(x,n),th=t.charAt(0)==='~';if(th)t=t.slice(1);
    return '<div class="cxb t-'+pos+(k==='bagdar'?' holo':k==='tuman'?' dark':'')+(th?' think':'')+'"><b>'+esc(CXART.names(k))+(th?' (ойы)':'')+'</b>'+esc(t)+'</div>'}).join('');
  return '<figure class="cxp z-'+(p.z||(n>2?'far':n===2?'mid':'close'))+'" style="--d:'+i+'">'+cxScene(p.bg,cast,'',p.fx)
   +(p.sfx?'<span class="cx-sfx" aria-hidden="true">'+esc(p.sfx)+'</span>':'')
   +'<div class="cxp-top">'+(p.n?'<div class="cx-nar">'+esc(p.n)+'</div>':'')+bub+'</div><span class="cx-num" aria-hidden="true">'+(i+1)+'</span></figure>'}
function cxThumb(e){var cv=e.cv||{bg:e.p[0].bg,c:e.p[0].c};return cxScene(cv.bg,cv.c.slice(0,3),'th','')}
RENDER.comics=function(){
  var el=$('#view-comics'),D=cmxD(),E=D.eps,got=cmxKeys();
  if(!window.CXART||!E.length){el.innerHTML='<div class="card"><p class="empty">Комикс жүктелмеді. Бетті жаңартып көр.</p></div>';return}
  var defs=CXART.defs();
  if(CMX.ep!=null&&E[CMX.ep]){var ep=E[CMX.ep],i=CMX.ep,S=cmxSeason(ep.s),has=!!state.comics[ep.id],cv=ep.cv||{bg:ep.p[0].bg,c:ep.p[0].c},nx=E[i+1];
    if(!CMX.ord)CMX.ord=shuffle(ep.q.o.map(function(_,k){return k}));var ok=CMX.ans===0||has;
    el.innerHTML=defs+'<div class="cx-read" style="--sc:'+S.c+'"><div class="row between cx-bar"><button class="btn ghost sm" type="button" data-act="cx-list">← Барлық серия</button><span class="pill">'+(i+1)+' / '+E.length+'-серия</span></div>'
     +'<header class="cx-cov">'+cxScene(cv.bg,cv.c,'cov','speed')
      +'<div class="cx-cov-t"><span class="cx-ep">'+S.n+'-МАУСЫМ · '+(i+1)+'-СЕРИЯ</span><h1>'+esc(ep.t)+'</h1><span class="cx-topic">📚 '+esc(ep.tp)+' · '+S.g+'-сынып</span></div>'
      +'<span class="cx-crys'+(has?' on':'')+'">'+(has?'💎 Кристалл алынды':'💎 Кристалл күтіп тұр')+'</span></header>'
     +'<div class="cx-panels">'+ep.p.map(cxPanel).join('')+'</div>'
     +'<section class="cx-memo"><h2>📝 Есте сақта</h2><ul>'+ep.k.map(function(k){return '<li>'+esc(k)+'</li>'}).join('')+'</ul></section>'
     +'<section class="cx-quiz"><div class="cx-quiz-h"><span class="cx-gem" aria-hidden="true">💎</span><div><b>'+(i+1)+'-кристалл: Бағдардың сұрағы</b><span class="small muted">Дұрыс жауап берсең, кристалл сенікі (+10 XP).</span></div></div><p class="q-text">'+esc(ep.q.q)+'</p>'
      +'<div class="opts">'+CMX.ord.map(function(k,j){var cls='opt';if(CMX.ans!=null){if(k===0)cls+=' ok';else if(k===CMX.ans)cls+=' bad'}else if(has&&k===0)cls+=' ok';return '<button class="'+cls+'" type="button" data-act="cx-ans" data-k="'+k+'"'+(ok?' disabled':'')+'><span class="k">'+LET[j]+'</span><span>'+esc(ep.q.o[k])+'</span></button>'}).join('')+'</div>'
      +(CMX.ans!=null||has?'<div class="explain '+(ok?'good':'')+'"><b>'+(ok?'Дұрыс! Кристалл сенде. ':'Қате. Тағы бір рет ойлан. ')+'</b>'+(ok?esc(ep.q.e):'')+'</div>':'')+'</section>'
     +(nx?'<button class="cx-next" type="button" data-act="cx-go" data-i="'+(i+1)+'" style="--nc:'+cmxSeason(nx.s).c+'">'+cxThumb(nx)+'<span class="cx-next-t"><small>Келесі серия · '+(i+2)+'</small><b>'+esc(nx.t)+' →</b></span></button>'
       :'<div class="cx-end"><b>Соңы.</b> Сен «Ұмыт тұманы» хикаясын толық оқыдың! '+(got===E.length?'Барлық 24 кристалл жиналды. 🎉':'Жиналмаған кристалдарды тізімнен тауып, сұрақтарына жауап бер.')+'<button class="btn primary" type="button" data-act="cx-list">Сериялар тізімі</button></div>')
     +(i>0?'<div class="row" style="margin-top:10px"><button class="btn ghost sm" type="button" data-act="cx-go" data-i="'+(i-1)+'">← '+i+'-серия</button></div>':'')+'</div>';
    return;
  }
  var next=-1;E.some(function(e,j){if(!state.comics[e.id]){next=j;return true}return false});var cont=next<0?0:next;
  if(CMX.s==null)CMX.s=E[cont].s;var S=cmxSeason(CMX.s);
  el.innerHTML=defs+'<section class="cx-hero">'+cxScene('astana-night',['arman:d','aiym:d','dana:h'],'hero','')
    +'<div class="cx-hero-b" aria-hidden="true"><svg viewBox="0 0 200 260">'+CXART.bust('bagdar','h')+'</svg></div><div class="cx-hero-v" aria-hidden="true"><svg viewBox="0 0 200 260">'+CXART.bust('tuman','n')+'</svg></div>'
    +'<div class="cx-hero-t"><span class="cx-logo">КӨКЖИЕК · АНИМЕ-КОМИКС</span><h1>Ұмыт<br>тұманы</h1><p>Қаланы білімді ұмыттыратын Тұман басты. Айым, Арман, Дана және голограмма-компас Бағдар 24 кристалды жинап, оны тоқтатуы керек. 5 маусым · 24 серия · 7–11-сынып оқулықтарының негізгі тақырыптары.</p>'
    +'<div class="row"><button class="btn primary" type="button" data-act="cx-go" data-i="'+cont+'">▶ '+(got?'Жалғастыру · '+(cont+1)+'-серия':'Бірінші серияны бастау')+'</button><span class="cx-hero-g">💎 '+got+' / '+E.length+'</span></div></div></section>'
   +'<div class="card cx-prog"><div class="row between"><div><div class="eyebrow">💎 Көкжиек кристалдары</div><h2 style="margin:0">'+got+' / '+E.length+' кристалл жиналды</h2></div>'+(got===E.length?'<span class="pill green">Тұман жеңілді!</span>':'')+'</div>'
    +'<div class="cx-gems">'+E.map(function(e,j){var on=state.comics[e.id];return '<button type="button" class="cx-g'+(on?' on':'')+'" style="--sc:'+cmxSeason(e.s).c+'" data-act="cx-go" data-i="'+j+'" aria-label="'+(j+1)+'-серия: '+esc(e.t)+(on?', кристалл алынды':'')+'"></button>'}).join('')+'</div></div>'
   +'<h2 class="cx-h">Кейіпкерлер</h2><div class="cx-chars">'+D.cast.map(function(c){return '<div class="cx-char" style="--cc:'+c[4]+'"><svg viewBox="0 0 200 260" aria-hidden="true">'+CXART.bust(c[0],c[1])+'</svg><div><b>'+esc(c[2])+'</b><small>'+esc(c[3])+'</small></div></div>'}).join('')+'</div>'
   +'<h2 class="cx-h">Сериялар</h2><div class="cx-seasons" role="tablist">'+D.seasons.map(function(s){var n=E.filter(function(e){return e.s===s.n}),g=n.filter(function(e){return state.comics[e.id]}).length;return '<button type="button" role="tab" class="cx-st" style="--sc:'+s.c+'" data-act="cx-s" data-s="'+s.n+'" aria-selected="'+(CMX.s===s.n)+'"><b>'+s.n+'-маусым</b><span>'+esc(s.t)+' · '+s.g+'-сынып</span><em>💎 '+g+'/'+n.length+'</em></button>'}).join('')+'</div>'
   +'<div class="cx-eps" style="--sc:'+S.c+'">'+E.map(function(e,j){if(e.s!==CMX.s)return '';var on=state.comics[e.id];return '<button type="button" class="cx-epc" data-act="cx-go" data-i="'+j+'"><div class="cx-thumb">'+cxThumb(e)+'<span class="cx-epn">'+(j+1)+'-СЕРИЯ</span>'+(on?'<span class="cx-ok">💎</span>':j===cont?'<span class="cx-new">ЖАҢА</span>':'')+'</div><div class="cx-epc-b"><b>'+esc(e.t)+'</b><span>'+esc(e.tp)+'</span></div></button>'}).join('')+'</div>';
};

/* ================= ЧЕКЛИСТ ================= */
var CK={g:'all',q:'',todo:false};
function ckData(){return window.CHECKLISTS||{groups:[],items:[]}}
function ckGroup(id){var g=ckData().groups.filter(function(x){return x[0]===id})[0];return g||[id,id,'📄']}
function ckThumb(id){return 'https://drive.google.com/thumbnail?id='+encodeURIComponent(id)+'&sz=w400'}
function ckList(){var q=CK.q.trim().toLowerCase();return ckData().items.filter(function(x){return (CK.g==='all'||x[2]===CK.g)&&(!CK.todo||!state.ckDone[x[0]])&&(!q||x[1].toLowerCase().indexOf(q)>-1)})}
function ckCards(){var L=ckList();return L.length?L.map(function(x,i){var g=ckGroup(x[2]),done=!!state.ckDone[x[0]];return '<div class="ck-card'+(done?' done':'')+'" style="--d:'+Math.min(i,20)+'"><button type="button" class="ck-open" data-act="ck-open" data-id="'+esc(x[0])+'"><span class="ck-thumb"><img src="'+ckThumb(x[0])+'" alt="" loading="lazy" decoding="async" onerror="this.remove()"><span class="ck-tag">'+(x[3]==='docx'?'DOCX':'PDF')+'</span></span><span class="ck-g">'+g[2]+' '+esc(g[1])+'</span><b>'+esc(x[1])+'</b></button><button type="button" class="ck-done" data-act="ck-done" data-id="'+esc(x[0])+'" aria-pressed="'+done+'">'+(done?'✓ Оқылды':'Оқылды деп белгілеу')+'</button></div>'}).join(''):'<p class="empty">Ештеңе табылмады.</p>'}
RENDER.checklist=function(){
  var D=ckData(),n=D.items.length,dn=D.items.filter(function(x){return state.ckDone[x[0]]}).length;
  $('#view-checklist').innerHTML='<section class="banner ck-banner">'+globeSvg()+'<span class="badge-pill">✅ '+n+' чеклист</span><h1>Чеклисттер</h1><p>Тақырыптар бойынша қысқа әрі нақты чеклисттер: картография, литосфера, климат, гидросфера, пайдалы қазбалар, геосаясат, номенклатура және басқалары. Оқыған соң «Оқылды» деп белгіле.</p></section>'
   +'<div class="card"><div class="row between"><div><div class="eyebrow">Прогресс</div><h2 style="margin:0">'+dn+' / '+n+' чеклист оқылды</h2></div><a class="btn sm" href="'+esc(D.folder||'#')+'" target="_blank" rel="noopener noreferrer">Drive папкасы ↗</a></div><div class="bar green" style="margin-top:12px"><i style="width:'+Math.round(dn/Math.max(1,n)*100)+'%"></i></div></div>'
   +'<div class="ck-tools"><input id="ck-q" type="search" placeholder="Чеклистті іздеу" value="'+esc(CK.q)+'" autocomplete="off"><button class="chip" type="button" data-act="ck-todo" aria-pressed="'+CK.todo+'">Тек оқылмағандар</button></div>'
   +'<div class="chips ck-groups" style="margin:10px 0 16px"><button class="chip" type="button" data-act="ck-g" data-g="all" aria-pressed="'+(CK.g==='all')+'">Барлығы · '+n+'</button>'+D.groups.map(function(g){var c=D.items.filter(function(x){return x[2]===g[0]}).length;return '<button class="chip" type="button" data-act="ck-g" data-g="'+g[0]+'" aria-pressed="'+(CK.g===g[0])+'">'+g[2]+' '+esc(g[1])+' · '+c+'</button>'}).join('')+'</div>'
   +'<div class="ck-grid" id="ck-grid">'+ckCards()+'</div>';
};
/* Google аккаунтына кірген браузерде Drive кейде кірістірілген терезеде бос бет береді (accounts.google.com басқа сайт ішінде ашылмайды).
   Сондықтан телефонда файл бірден Drive қарау бетінде ашылады, ал компьютерде терезенің астында Drive-та ашу батырмасы тұрады. */
function dvView(eid){return 'https://drive.google.com/file/d/'+eid+'/view'}
function dvFoot(eid,w){return '<div class="ck-fb"><span>'+w+' ақ бет болып тұрса, Google Drive-та аш:</span><a class="btn sm primary" href="'+dvView(eid)+'" target="_blank" rel="noopener noreferrer">Drive-та ашу ↗</a></div>'}
function dvMobile(){return !!(window.matchMedia&&matchMedia('(max-width:700px)').matches)}
function atModal(g){var s=$('#ck-slot');if(!s){s=document.createElement('div');s.id='ck-slot';document.body.appendChild(s)}if(g==null){s.innerHTML='';return}
  var b=(window.ATLASES||{books:[]}).books.filter(function(x){return String(x.g)===String(g)})[0];if(!b||!b.drive)return;var eid=encodeURIComponent(b.drive);
  s.innerHTML='<div class="ck-modal" role="dialog" aria-modal="true" aria-label="'+esc(b.title)+'"><div class="ck-bg" data-act="ck-close"></div><div class="ck-win"><div class="ck-head"><b>'+esc(b.title)+'</b><div class="row"><a class="btn sm" href="https://drive.google.com/file/d/'+eid+'/view" target="_blank" rel="noopener noreferrer">Drive ↗</a><a class="btn sm" href="https://drive.google.com/uc?export=download&id='+eid+'" target="_blank" rel="noopener noreferrer">Жүктеу</a><button class="icon-btn" type="button" data-act="ck-close" aria-label="Жабу">×</button></div></div><iframe src="https://drive.google.com/file/d/'+eid+'/preview" title="'+esc(b.title)+'" allow="autoplay"></iframe>'+dvFoot(eid,'Атлас')+'</div></div>'}
function ckModal(id){var s=$('#ck-slot');if(!s){s=document.createElement('div');s.id='ck-slot';document.body.appendChild(s)}if(!id){s.innerHTML='';return}
  var x=ckData().items.filter(function(i){return i[0]===id})[0];if(!x)return;var done=!!state.ckDone[id],eid=encodeURIComponent(id);
  s.innerHTML='<div class="ck-modal" role="dialog" aria-modal="true" aria-label="'+esc(x[1])+'"><div class="ck-bg" data-act="ck-close"></div><div class="ck-win"><div class="ck-head"><b>'+esc(x[1])+'</b><div class="row"><button class="btn sm'+(done?' primary':'')+'" type="button" data-act="ck-done" data-id="'+esc(id)+'">'+(done?'✓ Оқылды':'Оқылды')+'</button><a class="btn sm" href="https://drive.google.com/file/d/'+eid+'/view" target="_blank" rel="noopener noreferrer">Drive ↗</a><a class="btn sm" href="https://drive.google.com/uc?export=download&id='+eid+'" target="_blank" rel="noopener noreferrer">Жүктеу</a><button class="icon-btn" type="button" data-act="ck-close" aria-label="Жабу">×</button></div></div><iframe src="https://drive.google.com/file/d/'+eid+'/preview" title="'+esc(x[1])+'" allow="autoplay"></iframe>'+dvFoot(eid,'Чеклист')+'</div></div>'}

/* ================= МАМАНДЫҚТАР ================= */
var PF={combo:null,q:'',sort:'g',open:{},fav:false};
function pfData(){return window.PROF||{combos:[]}}
function pfMine(){var s=[state.ubt.p1,state.ubt.p2];if(s.indexOf('Математика')>-1)return 'mat';if(s.indexOf('Биология')>-1)return 'bio';if(s.indexOf('Шет тілі')>-1)return 'eng';return 'djt'}
function pfLast(it){for(var i=it.y.length-1;i>=0;i--)if(it.y[i][2]!=null)return it.y[i];return null}
function pfG(it){var l=it.y[it.y.length-1];return l?l[1]:0}
function pfSal(it){if(!it.s)return 0;var m=it.s.replace(/\s/g,'').match(/\d+/g);return m?+m[m.length-1]:0}
function pfChance(it){var sc=parseInt(state.prof.score,10);if(!sc||it.nodata)return null;var l=pfLast(it);if(!l)return null;var need=state.prof.rural&&l[3]!=null?l[3]:l[2];
  if(sc>=need)return {c:'ok',t:'✓ Грантқа мүмкіндік бар ('+l[0]+': '+need+')'};
  if(sc>=need-5)return {c:'mid',t:'Шекте: '+(need-sc)+' балл жетпейді'};
  if(it.paid&&sc>=it.paid)return {c:'pay',t:'Ақылы негізде түсуге болады (шегі '+it.paid+')'};
  return {c:'no',t:'Грантқа '+(need-sc)+' балл жетпейді'}}
function pfBars(it){if(!it.y.length)return '';var mx=Math.max.apply(null,it.y.map(function(r){return r[1]||0}))||1,W=260,H=46,n=it.y.length,bw=W/n;
  return '<svg class="pf-bars" viewBox="0 0 '+W+' '+(H+15)+'" role="img" aria-label="Грант саны жылдар бойынша">'+it.y.map(function(r,i){var h=Math.max(3,(r[1]||0)/mx*H);
    return '<rect x="'+(i*bw+bw*.2).toFixed(1)+'" y="'+(H-h).toFixed(1)+'" width="'+(bw*.6).toFixed(1)+'" height="'+h.toFixed(1)+'" rx="4"'+(i===n-1?' class="on"':'')+'><title>'+r[0]+': '+r[1]+' грант</title></rect><text x="'+(i*bw+bw/2).toFixed(1)+'" y="'+(H+12)+'" text-anchor="middle">'+r[0]+'</text>'}).join('')+'</svg>'}
function pfDet(it,cb){var mx=it.y.some(function(r){return r[4]!=null});
  return '<div class="pf-det"><p>'+esc(it.d)+'</p><div class="passrow"><span>Жұмыс орындары</span><b>'+esc(it.j)+'</b></div>'
   +(it.paid?'<div class="passrow"><span>Ақылы негізде шектік балл</span><b>'+it.paid+'</b></div>':'')
   +'<div><div class="eyebrow" style="margin-bottom:6px">Топ 3 қабілет</div><div class="pf-k">'+it.k.map(function(k){return '<span class="chip">'+esc(k)+'</span>'}).join('')+'</div></div>'
   +(it.y.length?'<table class="pf-t"><thead><tr><th>Жыл</th><th>Грант</th><th>Өту балы</th><th>Ауылдық</th>'+(mx?'<th>Ең жоғары</th>':'')+'</tr></thead><tbody>'+it.y.map(function(r){return '<tr><td>'+r[0]+'</td><td>'+r[1]+'</td><td>'+(r[2]==null?'—':r[2])+'</td><td>'+(r[3]==null?'—':r[3])+'</td>'+(mx?'<td>'+(r[4]==null?'—':r[4])+'</td>':'')+'</tr>'}).join('')+'</tbody></table>':'')
   +'<a class="btn sm" href="'+esc(cb.pdf)+'#page='+it.p+'" target="_blank" rel="noopener">📖 Кітапшадан ашу</a></div>'}
function pfCard(it,cb,i){var l=pfLast(it),L=it.y[it.y.length-1],ch=pfChance(it),op=!!PF.open[it.c],fav=!!state.prof.fav[it.c];
  return '<article class="pf-card" style="--c1:'+cb.c1+';--c2:'+cb.c2+';--d:'+Math.min(i,20)+'">'
   +'<div class="pf-top"><span class="pf-code">'+esc(it.c)+'</span><span class="pf-cb">'+esc(cb.s)+'</span><button class="pf-fav" type="button" data-act="pf-fav" data-c="'+esc(it.c)+'" aria-pressed="'+fav+'" aria-label="'+(fav?'Таңдаулыдан алу':'Таңдаулыға қосу')+'" data-noic>'+(fav?'★':'☆')+'</button></div>'
   +'<h3>'+esc(it.n)+'</h3>'
   +(it.nodata?'<p class="small muted" style="margin:0">Грант статистикасы кітапшада берілмеген.</p>'
     :'<div class="pf-stats"><div><b>'+(L?L[1]:'—')+'</b><span>грант, '+(L?L[0]:'')+'</span></div><div><b>'+(l?l[2]:'—')+'</b><span>өту балы</span></div><div><b>'+(l&&l[3]!=null?l[3]:'—')+'</b><span>ауылдық квота</span></div></div>'+pfBars(it))
   +(ch?'<div class="pf-ch '+ch.c+'">'+esc(ch.t)+'</div>':'')
   +'<div class="pf-sal">💰 '+(it.s?'Орташа жалақы: '+esc(it.s):'Жалақысы кітапшада көрсетілмеген')+'</div>'
   +(op?pfDet(it,cb):'')
   +'<button class="pf-more" type="button" data-act="pf-open" data-c="'+esc(it.c)+'" aria-expanded="'+op+'">'+(op?'Жасыру ▲':'Толығырақ ▼')+'</button></article>'}
function pfList(){var D=pfData(),all=[],q=PF.q.trim().toLowerCase();
  D.combos.forEach(function(cb){cb.items.forEach(function(it){if((PF.combo==='all'||cb.id===PF.combo)&&(!PF.fav||state.prof.fav[it.c])&&(!q||it.n.toLowerCase().indexOf(q)>-1||it.c.toLowerCase().indexOf(q)>-1))all.push([it,cb])})});
  var f={g:function(a,b){return pfG(b[0])-pfG(a[0])},s:function(a,b){var x=pfLast(a[0]),y=pfLast(b[0]);return (y?y[2]:0)-(x?x[2]:0)},sal:function(a,b){return pfSal(b[0])-pfSal(a[0])},c:function(a,b){return a[0].c<b[0].c?-1:1}}[PF.sort];
  return all.sort(f)}
function pfSum(list){var sc=parseInt(state.prof.score,10);if(!sc)return '<span class="small muted">Балыңды жазсаң, әр мамандық бойынша мүмкіндігің көрсетіледі.</span>';
  var ok=0,mid=0;list.forEach(function(x){var c=pfChance(x[0]);if(c&&c.c==='ok')ok++;else if(c&&c.c==='mid')mid++});
  return '<span class="pill green">✓ '+ok+' мамандыққа грант мүмкіндігі бар</span><span class="pill amber">'+mid+' мамандық шекте</span><span class="small muted">'+(state.prof.rural?'Ауылдық квота':'Жалпы конкурс')+' бойынша, соңғы жылғы өту балымен салыстырылды.</span>'}
function pfGrid(list){return list.length?list.map(function(x,i){return pfCard(x[0],x[1],i)}).join(''):'<p class="empty">Ештеңе табылмады.</p>'}
function pfRefresh(){var l=pfList(),g=$('#pf-grid'),s=$('#pf-sum');if(g)g.innerHTML=pfGrid(l);if(s)s.innerHTML=pfSum(l)}
RENDER.prof=function(){var D=pfData(),mine=pfMine();if(!PF.combo)PF.combo=mine;var n=0;D.combos.forEach(function(c){n+=c.items.length});var list=pfList();
  $('#view-prof').innerHTML='<section class="banner pf-banner">'+globeSvg()+'<span class="badge-pill">🎓 '+D.combos.length+' бейіндік жұп · '+n+' мамандық</span><h1>Мамандықтар</h1><p>Географиямен тапсырылатын пән жұптары бойынша мамандықтар: грант саны, өту балы, жалақы және қажет қабілеттер. 2021–2025 жылдардағы грант конкурсының деректері.</p></section>'
   +'<div class="pf-combos" role="group" aria-label="Пән жұбы">'+D.combos.map(function(cb){var g25=cb.items.reduce(function(a,it){return a+pfG(it)},0);
     return '<button class="pf-combo" type="button" data-act="pf-combo" data-id="'+cb.id+'" aria-pressed="'+(PF.combo===cb.id)+'" style="--c1:'+cb.c1+';--c2:'+cb.c2+'">'+(cb.id===mine?'<em>Сенің жұбың</em>':'')+'<span class="pf-icons"><span>'+cb.ic[0]+'</span><span class="pl">+</span><span>'+cb.ic[1]+'</span></span><b>'+esc(cb.t)+'</b><small>'+cb.items.length+' мамандық · '+g25+' грант (соңғы жыл)</small></button>'}).join('')+'</div>'
   +'<div class="chips" style="margin:0 0 16px"><button class="chip" type="button" data-act="pf-combo" data-id="all" aria-pressed="'+(PF.combo==='all')+'">Барлық мамандықтар · '+n+'</button><button class="chip" type="button" data-act="pf-favf" aria-pressed="'+PF.fav+'">★ Таңдаулылар · '+Object.keys(state.prof.fav).length+'</button></div>'
   +'<div class="card pf-calc"><div><div class="eyebrow">🎯 Менің мүмкіндігім</div><h2 style="margin:4px 0">ҰБТ балыңды жаз</h2><p class="small muted" style="margin:0">140 балдық ҰБТ нәтижеңді немесе мақсатыңды жаз: әр мамандықтың соңғы жылғы өту балымен салыстырамыз.</p></div>'
    +'<div class="pf-calc-in"><input id="pf-score" type="number" min="0" max="140" inputmode="numeric" placeholder="'+(state.ubt.goal||100)+'" value="'+esc(state.prof.score||'')+'" aria-label="ҰБТ балы"><label class="pf-rural"><input type="checkbox" id="pf-rural"'+(state.prof.rural?' checked':'')+'> Ауылдық квота</label></div>'
    +'<div class="pf-sum" id="pf-sum">'+pfSum(list)+'</div></div>'
   +'<div class="pf-tools"><input id="pf-q" type="search" placeholder="Мамандықты іздеу: атауы немесе коды" value="'+esc(PF.q)+'" autocomplete="off"><div class="chips">'+[['g','Грант саны'],['s','Өту балы'],['sal','Жалақы'],['c','Коды']].map(function(s){return '<button class="chip" type="button" data-act="pf-sort" data-s="'+s[0]+'" aria-pressed="'+(PF.sort===s[0])+'">'+s[1]+'</button>'}).join('')+'</div></div>'
   +'<div class="pf-grid" id="pf-grid">'+pfGrid(list)+'</div>'
   +'<div class="card" style="margin-top:18px"><div class="eyebrow">📖 Мамандықтар кітапшалары</div><p class="small muted" style="margin:4px 0 12px">Толық нұсқасы PDF түрінде. Дереккөз: JUZ40 «Мамандықтар кітапшасы».</p><div class="pf-books">'
    +D.combos.map(function(cb){return '<a class="pf-book" href="'+esc(cb.pdf)+'" target="_blank" rel="noopener" style="--c1:'+cb.c1+';--c2:'+cb.c2+'"><span class="pf-icons sm"><span>'+cb.ic[0]+'</span><span>'+cb.ic[1]+'</span></span><span>'+esc(cb.t)+'<small>PDF · '+cb.items.length+' мамандық</small></span></a>'}).join('')+'</div></div>';
};

/* ================= ЕСКЕ САЛҒЫШ ================= */
/* Хабарлама: сайт (немесе орнатылған қолданба) ашық не фонда тұрғанда remTick() уақытты тексереді; Android-та орнатылған қолданбада
   Periodic Background Sync арқылы sw.js өзі көрсетеді. Барлық телефонда сенімді тәсіл — .ics күнтізбе оқиғасы (remIcs). */
function remSup(){return 'Notification' in window}
function remDue(){var tk=todayKey(),a=[];if(!(state.rid[tk]&&state.rid[tk].done))a.push('Күн жұмбағы');if(!state.geo.daily[tk])a.push('күндік нұсқа');return a}
function remText(a){return a.length?a.join(' мен ')+' сені күтіп тұр. 10 минут уақыт бөл, қатарыңды үзбе!':'Бүгінгі жоспар орындалды. Жарайсың!'}
function remShow(force){if(!remSup()||Notification.permission!=='granted')return;var a=remDue();if(!a.length&&!force)return;
  var opt={body:remText(a),icon:'img/icon-192.png',badge:'img/mark.png',tag:'kk-daily',data:{url:'./#home'}};
  var plain=function(){try{new Notification('Көкжиек',opt)}catch(e){}};
  if(navigator.serviceWorker&&navigator.serviceWorker.getRegistration)navigator.serviceWorker.getRegistration().then(function(r){if(r&&r.showNotification)r.showNotification('Көкжиек',opt);else plain()}).catch(plain);else plain()}
function remSync(){try{var c=navigator.serviceWorker&&navigator.serviceWorker.controller;if(c)c.postMessage({type:'rem',on:!!state.rem.on,t:state.rem.t,done:remDue().length?'':todayKey()})}catch(e){}}
function remPeriodic(){if(!navigator.serviceWorker||!navigator.serviceWorker.ready)return;navigator.serviceWorker.ready.then(function(r){if(!r.periodicSync)return;
  if(state.rem.on)return r.periodicSync.register('kk-daily',{minInterval:4*3600*1000}).catch(function(){});return r.periodicSync.unregister('kk-daily').catch(function(){})}).catch(function(){})}
function remTick(){if(!state.rem.on||!state.profile)return;var tk=todayKey();if(state.rem.last===tk)return;var p=(state.rem.t||'19:00').split(':'),d=new Date();
  if(d.getHours()*60+d.getMinutes()<(+p[0])*60+(+p[1]||0))return;state.rem.last=tk;persist();var a=remDue();if(!a.length)return;
  if(document.visibilityState==='visible')toast('🔔 '+remText(a));else remShow()}
setInterval(remTick,60000);setTimeout(function(){remTick();remSync();if(state.rem.on)remPeriodic()},5000);
function remIcs(){var p=(state.rem.t||'19:00').split(':'),d=new Date(),url=location.origin+location.pathname,
  st=function(x){return x.getUTCFullYear()+pad(x.getUTCMonth()+1)+pad(x.getUTCDate())+'T'+pad(x.getUTCHours())+pad(x.getUTCMinutes())+pad(x.getUTCSeconds())+'Z'};
  var ics=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//kokzhiek//eske-salgysh//KK','CALSCALE:GREGORIAN','METHOD:PUBLISH','BEGIN:VEVENT',
    'UID:kokzhiek-daily-'+Date.now()+'@kokzhiek','DTSTAMP:'+st(d),'DTSTART:'+d.getFullYear()+pad(d.getMonth()+1)+pad(d.getDate())+'T'+pad(+p[0])+pad(+p[1]||0)+'00','DURATION:PT15M','RRULE:FREQ=DAILY',
    'SUMMARY:Көкжиек: Күн жұмбағы және күндік нұсқа','DESCRIPTION:10 минут география: Күн жұмбағын шеш\\, күндік нұсқаны орында. '+url,'URL:'+url,
    'BEGIN:VALARM','ACTION:DISPLAY','DESCRIPTION:Көкжиек сені күтіп тұр!','TRIGGER:PT0M','END:VALARM','END:VEVENT','END:VCALENDAR'].join('\r\n');
  var a=document.createElement('a');a.href=URL.createObjectURL(new Blob([ics],{type:'text/calendar;charset=utf-8'}));a.download='kokzhiek-eske-salgysh.ics';document.body.appendChild(a);a.click();
  setTimeout(function(){URL.revokeObjectURL(a.href);a.remove()},2000);toast('📅 Файлды аш: күнтізбеге күнделікті еске салғыш қосылады')}
function remOn(){if(!remSup()){remIcs();return}
  Notification.requestPermission().then(function(r){if(r==='granted'){state.rem.on=true;state.rem.nd=true;state.rem.last='';save();remSync();remPeriodic();toast('🔔 Еске салғыш қосылды: күн сайын '+state.rem.t);remShow(true)}
    else toast('Браузер хабарламаға рұқсат бермеді. «Күнтізбеге қосу» тәсілін қолдан.');if(cur==='me'||cur==='home')RENDER[cur]()}).catch(function(){remIcs()})}
function remNudge(){if(state.rem.on||state.rem.nd)return '';
  return '<div class="card rem-nudge"><div><b>🔔 Күн сайын еске салайық па?</b><div class="small muted">Күн жұмбағы мен күндік нұсқаны ұмытпайсың: таңдаған уақытта хабарлама келеді.</div></div><div class="row"><button class="btn primary sm" type="button" data-act="rem-on">Қосу</button><button class="btn ghost sm" type="button" data-act="rem-nd">Кейін</button></div></div>'}
function remHtml(){var sup=remSup(),perm=sup?Notification.permission:'none',on=state.rem.on&&perm==='granted';
  return '<div class="card" id="rem-card"><div class="row between"><h2 style="margin:0">🔔 Еске салғыш</h2>'+(on?'<span class="pill green">Қосулы · '+esc(state.rem.t)+'</span>':'<span class="pill">Өшірулі</span>')+'</div>'
   +'<p class="muted small" style="margin-top:8px">Күн сайын таңдаған уақытта Күн жұмбағы мен күндік нұсқаны еске салады. Бәрін орындап қойсаң, мазаламайды.</p>'
   +'<div class="row rem-row"><label for="rem-t"><b>Уақыты</b></label><input id="rem-t" type="time" value="'+esc(state.rem.t)+'">'
   +(sup?(on?'<button class="btn" type="button" data-act="rem-off">Өшіру</button><button class="btn ghost" type="button" data-act="rem-test">Тексеру</button>':'<button class="btn primary" type="button" data-act="rem-on">Хабарламаларды қосу</button>'):'')
   +'<button class="btn" type="button" data-act="rem-ics">📅 Күнтізбеге қосу</button></div>'
   +(perm==='denied'?'<p class="small" style="color:var(--bad);margin:10px 0 0">Бұл браузерде сайт хабарламасына тыйым салынған. Сайт баптауларынан рұқсат бер немесе күнтізбе тәсілін қолдан.</p>':'')
   +'<p class="small muted" style="margin:10px 0 0">'+(sup?'Хабарлама сайт немесе орнатылған қолданба ашық не фонда тұрғанда келеді. Android-та сайтты «Телефонға орнату» арқылы орнатсаң, жабық кезде де келуі мүмкін. Ең сенімді тәсіл — «Күнтізбеге қосу»: телефон күнтізбесі күн сайын дабыл қағады.':'Бұл браузер сайт хабарламаларын қолдамайды (iPhone-да тек басты экранға орнатылған қолданбада жұмыс істейді). «Күнтізбеге қосу» батырмасы телефон күнтізбесіне күнделікті еске салғыш қосады.')+'</p></div>'}

/* ================= ПРОФИЛЬ ================= */
var ME={exp:false,wipe:false};
var AUTHOR={name:'Рүстем Ерхан',role:'JUZ40 EDTECH компаниясының география пәні кураторы',tg:'erkhan_geo21',channel:'https://t.me/+kjhKm8NmTCQ4MWM6'};
function aboutHtml(){
  var tgU='https://t.me/'+AUTHOR.tg;
  return '<div class="card about"><div class="about-in">'
   +'<figure class="ap"><div class="ap-stage" aria-hidden="true"><span class="ap-ring"></span><span class="ap-orbit"><i></i><i></i><i></i></span><span class="ap-disc"></span><span class="ap-circ"><img class="ap-img" src="img/author.png" alt="" width="560" height="541" decoding="async"></span><img class="ap-img ap-top" src="img/author.png" alt="" width="560" height="541" decoding="async"></div>'
    +'<figcaption class="ap-name"><b>'+esc(AUTHOR.name)+'</b><span>Жоба авторы · география кураторы</span></figcaption></figure>'
   +'<div class="about-txt"><div class="eyebrow">Жоба туралы</div><h2>Көкжиек</h2><p class="muted">ҰБТ-ға географиядан дайындалатын оқушыларға арналған тегін жоба.</p>'
    +'<dl class="about-dl"><div><dt>Жоба авторы</dt><dd>'+esc(AUTHOR.name)+'</dd></div><div><dt>Автор туралы</dt><dd>'+esc(AUTHOR.role)+'</dd></div>'
    +'<div><dt>Ұсыныс пен сұрақтар бойынша</dt><dd><a href="'+tgU+'" target="_blank" rel="noopener noreferrer">@'+esc(AUTHOR.tg)+'</a></dd></div>'
    +'<div><dt>Telegram каналы</dt><dd><a href="'+AUTHOR.channel+'" target="_blank" rel="noopener noreferrer">'+AUTHOR.channel.replace('https://','')+'</a></dd></div></dl>'
    +'<div class="row"><a class="btn primary" href="'+tgU+'" target="_blank" rel="noopener noreferrer"><i class="fi fi-rr-paper-plane" aria-hidden="true"></i> Авторға жазу</a><a class="btn" href="'+AUTHOR.channel+'" target="_blank" rel="noopener noreferrer">Telegram каналына қосылу</a></div>'
    +'<p class="about-lic">Иконкалар: <a href="https://www.flaticon.com/uicons" target="_blank" rel="noopener noreferrer">UIcons by Flaticon</a>. Сайт reCAPTCHA арқылы қорғалады: Google-дың <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">құпиялылық саясаты</a> мен <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer">шарттары</a> қолданылады.</p></div></div></div>';
}
function worldsHtml(lv){
  return '<div class="card"><h2>Әлемдер жолы</h2><p class="muted small">6 әлем, әрқайсысында 5 саты. XP жинаған сайын ауылдан планетаға дейін өрлейсің.</p><div class="worlds">'
   +WORLDS.map(function(w,i){var a=i*5+1,b=a+4,st=lv.w>i?'done':lv.w===i?'cur':'lock',pc=lv.w>i?100:lv.w===i?Math.round((((lv.n-1)%5)+lv.p/100)/5*100):0;
     return '<div class="world '+st+'"><span class="wic" aria-hidden="true">'+(st==='lock'?'🔒':w[1])+'</span><b>'+w[0]+'</b><span class="small muted">'+a+'–'+b+'-деңгей · '+lvStart(a)+' XP</span><span class="small">'+esc(w[2])+'</span><div class="bar sky"><i style="width:'+pc+'%"></i></div></div>'}).join('')+'</div></div>';
}
var PWA={ev:null};
function standalone(){return (window.matchMedia&&matchMedia('(display-mode: standalone)').matches)||window.navigator.standalone===true}
function settingsHtml(){
  var ios=/iphone|ipad|ipod/i.test(navigator.userAgent),inst=standalone();
  var cloud=fbReady()?'<div class="card"><div class="row between"><h2 style="margin:0">☁️ Бұлттық сақтау және сынып</h2>'+cloudBadge()+'</div>'
    +(CLOUD.user?'<p class="muted small" style="margin-top:8px">Кірдің: <b>'+esc(CLOUD.user.email||CLOUD.user.displayName||'')+'</b>. Деректерің әр өзгерістен кейін бұлтқа сақталады.</p><div class="row"><a class="btn primary" href="#class">Сынып рейтингі</a><button class="btn ghost" type="button" data-act="cloud-out">Аккаунттан шығу</button></div>'
     :'<p class="muted small" style="margin-top:8px">Google арқылы кірсең, профилің мен нәтижелерің бұлтқа сақталады: телефоннан да, компьютерден де бірдей ашылады. Сынып рейтингіне де осы аккаунтпен қосыласың.</p>'+signInBtn())+'</div>':'';
  return cloud+'<div class="grid g2" style="margin-bottom:18px"><div class="card" style="margin:0"><h2>Көрініс</h2><p class="muted small">Түнгі режим көзді шаршатпайды, әсіресе кешке оқығанда.</p><div class="chips" role="group" aria-label="Тақырып">'
    +[['light','☀','Күндізгі'],['dark','🌙','Түнгі'],['auto','🌗','Құрылғыға сай']].map(function(x){return '<button class="chip" type="button" data-act="theme-set" data-v="'+x[0]+'" aria-pressed="'+(state.theme===x[0])+'">'+x[1]+' '+x[2]+'</button>'}).join('')+'</div></div>'
   +'<div class="card" style="margin:0"><h2>📲 Телефонға орнату</h2>'
    +(inst?'<p><span class="pill green">✓ Орнатылған</span></p><p class="muted small">Сайт қолданба ретінде ашылып тұр. Интернет болмаса да, бұрын ашылған беттер жұмыс істейді.</p>'
     :PWA.ev?'<p class="muted small">Көкжиекті телефонның басты экранына қолданба ретінде қос: белгішесі болады, интернетсіз де ашылады.</p><button class="btn primary" type="button" data-act="pwa-install">Орнату</button>'
     :ios?'<p class="muted small">iPhone-да: Safari-де төмендегі «Бөлісу» батырмасын бас, сосын «На экран «Домой»» (Add to Home Screen) тармағын таңда.</p>'
     :'<p class="muted small">Браузер мәзірін (⋮) аш та, «Қолданбаны орнату» немесе «Басты экранға қосу» тармағын таңда. Орнатқаннан кейін сайт интернетсіз де ашылады.</p>')+'</div></div>'+remHtml();
}
RENDER.me=function(){
  var p=state.profile||{name:'',av:AVS[0]},lv=level(),g=state.geo,bd=badges();
  if(!OB.touched){OB.av=p.av;OB.photo=p.photo||'';OB.ph=p.ph||''}
  $('#view-me').innerHTML='<section class="banner">'+globeSvg()+'<span class="badge-pill">👤 Профиль</span><h1>'+esc(fullName(p))+'</h1><p>Деңгей '+lv.n+' · '+lv.name+' · '+state.xp+' XP</p></section>'
  +'<div class="grid g2" style="margin-bottom:18px"><div class="card" style="margin:0"><div class="me">'+avHtml(p.av,p.photo,'lg')+'<div style="flex:1"><b>'+(lv.top?'Ең жоғары деңгейге жеттің!':'Келесі деңгейге '+lv.need+' XP')+'</b><div class="small muted">Деңгей '+lv.n+' · '+esc(lv.name)+'</div><div class="lvl" aria-hidden="true"><i style="width:'+lv.p+'%"></i></div></div></div>'
   +'<div class="grid g3" style="margin-top:16px;text-align:center"><div><div class="stat">'+g.a+'</div><div class="small muted">география жауабы</div></div><div><div class="stat">'+tasksDone()+'</div><div class="small muted">тапсырма</div></div><div><div class="stat">'+geoStreak()+'</div><div class="small muted">күн қатар</div></div></div></div>'
  +'<div class="card" style="margin:0"><h3>Профильді өзгерту</h3><form data-form="me" class="stack"><div class="form-row"><div><label for="m-name">Атың</label><input id="m-name" type="text" maxlength="20" required autocomplete="given-name" value="'+esc(p.name)+'"></div><div><label for="m-last">Тегің</label><input id="m-last" type="text" maxlength="25" required autocomplete="family-name" value="'+esc(p.last||'')+'"></div></div><div><label>Аватар</label>'+avsBlock()+'</div><button class="btn primary" type="submit">Сақтау</button></form></div></div>'
  +worldsHtml(lv)
  +historyHtml()
  +'<div class="card"><div class="row between"><h2 style="margin:0">Жетістіктер</h2><span class="pill hl">'+bd.filter(function(b){return b.got}).length+' / '+bd.length+'</span></div>'
   +'<div class="chips" style="margin:10px 0 14px">'+RAR.map(function(r,i){return '<span class="pill rar r'+i+'">'+r[0]+' · +'+r[1]+' XP</span>'}).join('')+'</div>'
   +'<div class="badges">'+bd.map(function(b){return '<div class="badge r'+b.r+(b.got?' on':'')+'"><span aria-hidden="true">'+b.ic+'</span><b>'+esc(b.t)+'</b><small>'+esc(b.d)+'</small><em class="rr">'+RAR[b.r][0]+(b.got?' · алынды':'')+'</em></div>'}).join('')+'</div>'
   +'<p class="muted small" style="margin-top:10px">XP: дұрыс жауап +2, карточка +1, күндік нұсқа +15, байқау тест +20, тақырып емтиханы +30, бағдарлама сабағы +10, тапсырма +10, ойын +5, фокус +5, әдет +3. Жетістіктер: +20-дан +500-ге дейін.</p></div>'
  +settingsHtml()
  +'<div class="card"><h2>Деректерім және қауіпсіздік</h2><ul class="link-list">'
   +(CLOUD.user?'<li>☁️ Профилің, жоспарың, нәтижелерің мен әрекеттер күнделігің <b>Google аккаунтыңа байланған бұлтта</b> сақталады: оларды тек сен көресің, басқа құрылғыдан кірсең де орнында болады. Сынып рейтингінде тек атың, аватарың, деңгейің мен XP көрінеді. Қазіргі күйі: '+cloudBadge()+'</li>':'<li>💾 Профилің, жоспарың, нәтижелерің мен әрекеттер күнделігің <b>осы құрылғыдағы браузерде</b> сақталады.'+(fbReady()?' Google арқылы кірсең, деректерің бұлтқа сақталып, барлық құрылғыңда бірдей болады.':' Басқа құрылғыға көшіру үшін «Сақтық көшірме» батырмасын қолдан.')+' Қазіргі күйі: '+cloudBadge()+'</li>')
   +'<li>🚫 Сайтта жарнама, бақылау коды немесе бөгде скрипт жоқ. Аты-жөніңнен басқа жеке дерек сұралмайды.</li>'
   +'<li>🧹 Браузерде ғана сақталып тұрса, деректерді тазаласаң жазбалар өшеді. Сақтық көшірме жасап қой.</li>'
   +'<li>👥 Ортақ компьютерде отырсаң, жұмыс соңында «Барлық деректі өшіру» батырмасын бас.</li></ul>'
   +'<div class="row" style="margin-top:12px"><button class="btn" type="button" data-act="exp">'+(ME.exp?'Көшірмені жасыру':'Сақтық көшірме')+'</button><button class="btn ghost" type="button" data-act="wipe">'+(ME.wipe?'Растау: бәрін өшіру':'Барлық деректі өшіру')+'</button>'+(ME.wipe?'<button class="btn sm" type="button" data-act="wipe-no">Болдырмау</button>':'')+'</div>'
   +(ME.exp?'<label for="exp" class="small" style="margin-top:12px">Осы мәтінді көшіріп, сенімді жерге сақта. Қалпына келтіру үшін өріске қойып, «Қалпына келтіру» бас.</label><textarea id="exp" class="exp" spellcheck="false">'+esc(JSON.stringify(state))+'</textarea><div class="row" style="margin-top:8px"><button class="btn sm" type="button" data-act="imp">Қалпына келтіру</button></div>':'')+'</div>'
  +aboutHtml();
};

/* ================= ОҚИҒАЛАР ================= */
function setPath(path,val){var p=path.split('.'),o=state;for(var i=0;i<p.length-1;i++)o=o[p[i]];o[p[p.length-1]]=val}
function leaveRun(){stopMock();R=null;CD=null}
function openCards(title,qs,back){stopMock();R=null;CD={title:title,items:shuffle(qs),pos:0,flip:false,back:back};showRun()}
document.addEventListener('click',function(e){
  var b=e.target.closest('[data-act]');
  if(!b){if(panel&&!e.target.closest('.panel')){panel='';drawTop()}return}
  var a=b.dataset.act,d=b.dataset;
  switch(a){
   case 'panel':panel=panel===d.p?'':d.p;drawTop();break;
   case 'panel-go':panel='';break;
   case 'next-quote':qShift++;if(cur==='home'||cur==='grow')RENDER[cur]();drawTop();break;
   case 'theme':state.theme=isDark()?'light':'dark';applyTheme();save();drawTop();if(cur==='me')RENDER.me();break;
   case 'theme-set':state.theme=d.v;applyTheme();save();refresh();break;
   case 'pwa-install':if(PWA.ev){PWA.ev.prompt();PWA.ev.userChoice.then(function(){PWA.ev=null;if(cur==='me')RENDER.me()})}break;
   case 'cloud-in':cloudSignIn();break;
   case 'cloud-out':cloudSignOut();break;
   case 'cls-tab':CLS.tab=d.v;RENDER.class();break;
   case 'cls-refresh':CLS.list=null;RENDER.class();break;
   case 'cls-copy':try{navigator.clipboard.writeText(state.cls).then(function(){toast('Код көшірілді: '+state.cls)},function(){toast('Сынып коды: '+state.cls)})}catch(er){toast('Сынып коды: '+state.cls)}break;
   case 'cls-leave':if(!CLS.leaveAsk){CLS.leaveAsk=true;RENDER.class()}else classLeave();break;
   case 'cls-leave-no':CLS.leaveAsk=false;RENDER.class();break;
   case 'onb-next':if(OB.step===1){onbReadStep1();if(!OB.name||!OB.last){toast('Атың мен тегіңді жаз');var ef=!OB.name?$('#o-name'):$('#o-last');if(ef){ef.focus();ef.classList.add('err')}break}}OB.step=Math.min(2,(OB.step||0)+1);paintOnbStep(true);break;
   case 'onb-back':if(OB.step===1)onbReadStep1();OB.step=Math.max(0,(OB.step||0)-1);paintOnbStep(false);break;
   case 'onb-why':OB.why=OB.why===d.v?'':d.v;$$('.onb [data-act=onb-why]').forEach(function(x){x.setAttribute('aria-pressed',String(x.dataset.v===OB.why))});paintPass();break;
   case 'more':openMore(!$('.more-sheet'));break;
   case 'zm':zmZoom(d.id,parseFloat(d.f));break;
   case 'cx-s':CMX.s=parseInt(d.s,10);RENDER.comics();break;
   case 'cx-go':CMX.ep=parseInt(d.i,10);CMX.ans=null;CMX.ord=null;if(cur!=='comics')location.hash='#comics';else{RENDER.comics();window.scrollTo(0,0)}break;
   case 'cx-list':CMX.ep=null;RENDER.comics();window.scrollTo(0,0);break;
   case 'cx-ans':var CE=cmxEps()[CMX.ep];if(CE&&!state.comics[CE.id]){CMX.ans=parseInt(d.k,10);if(CMX.ans===0){state.comics[CE.id]=todayKey();state.xp+=10;save();reward('💎',(CMX.ep+1)+'-кристалл табылды!','+10 XP · '+cmxKeys()+'/'+cmxEps().length)}RENDER.comics();var qz=$('.cx-quiz');if(qz)qz.scrollIntoView({block:'center'})}break;
   case 'ck-g':CK.g=d.g;RENDER.checklist();break;
   case 'ck-todo':CK.todo=!CK.todo;RENDER.checklist();break;
   case 'ck-open':if(dvMobile()){window.open(dvView(encodeURIComponent(d.id)),'_blank','noopener')}else ckModal(d.id);break;
   case 'at-book':var AB=(window.ATLASES||{books:[]}).books.filter(function(x){return String(x.g)===String(d.g)})[0];if(AB&&AB.drive&&dvMobile()){window.open(dvView(encodeURIComponent(AB.drive)),'_blank','noopener')}else atModal(d.g);break;
   case 'pf-combo':PF.combo=d.id;PF.fav=false;RENDER.prof();break;
   case 'pf-favf':PF.fav=!PF.fav;RENDER.prof();break;
   case 'pf-sort':PF.sort=d.s;$$('[data-act=pf-sort]').forEach(function(b){b.setAttribute('aria-pressed',String(b.getAttribute('data-s')===d.s))});pfRefresh();break;
   case 'pf-open':PF.open[d.c]=!PF.open[d.c];pfRefresh();break;
   case 'pf-fav':if(state.prof.fav[d.c])delete state.prof.fav[d.c];else state.prof.fav[d.c]=1;save();pfRefresh();var fc=$('[data-act=pf-favf]');if(fc)fc.textContent='★ Таңдаулылар · '+Object.keys(state.prof.fav).length;break;
   case 'rem-on':remOn();break;
   case 'rem-off':state.rem.on=false;save();remPeriodic();toast('Еске салғыш өшірілді');if(cur==='me')RENDER.me();break;
   case 'rem-test':remShow(true);break;
   case 'rem-ics':remIcs();break;
   case 'rem-nd':state.rem.nd=true;save();var rn=$('.rem-nudge');if(rn)rn.remove();break;
   case 'ck-close':ckModal(null);break;
   case 'ck-done':if(state.ckDone[d.id])delete state.ckDone[d.id];else{state.ckDone[d.id]=todayKey();state.xp+=3}save();if($('.ck-modal'))ckModal(d.id);if(cur==='checklist'){var gy=window.scrollY;RENDER.checklist();window.scrollTo(0,gy)}break;
   case 'at-tab':AT.tab=d.t;AT.sel=null;AT.q='';RENDER.atlas();break;
   case 'at-lay':var LL=AT.tab==='kz'?AT.klay:AT.lay;LL[d.k]=!LL[d.k];b.setAttribute('aria-pressed',String(!!LL[d.k]));if(AT.sel&&AT.sel.c===d.k&&!LL[d.k])AT.sel=null;zmApply('atmap');break;
   case 'at-pick':atlasPick(d.n);break;
   case 'nom-cat':GM.cat=d.v;RENDER.games();break;
   case 'nom-mode':GM.mode=d.v;RENDER.games();break;
   case 'nom-start':nomStart();break;
   case 'nom-next':nomNext();break;
   case 'nom-pick':if(GM&&GM.id==='nom'&&!GM.guess){var NT=GM.list[GM.round],okp=d.v===NT.n;GM.pick=d.v;GM.guess=true;GM.n++;if(okp)GM.score++;else GM.mistakes.push(NT.n+' (сен: '+d.v+')');GM.fb=okp?'<b class="okc">Дұрыс!</b>':'<b class="badc">Қате.</b> Дұрысы: '+esc(NT.n);RENDER.games()}break;
   case 'rid-open':startGame('rid');if(cur!=='games')location.hash='#games';break;
   case 'rid-share':var stx=ridShare();if(navigator.share){navigator.share({text:stx}).catch(function(){})}else{try{navigator.clipboard.writeText(stx).then(function(){toast('Нәтиже көшірілді: Telegram-ға қой')})}catch(er){toast(stx)}}break;
   case 'more-close':openMore(false);break;
   case 'more-go':openMore(false);break;
   case 'pick-av':OB.av=d.v;OB.photo='';OB.ph='';OB.touched=true;paintAvs();break;
   case 'av-photo-del':OB.photo='';OB.ph='';OB.touched=true;paintAvs();break;
   /* география */
   case 'gtab2':GV.tab=d.t;GV.topic=null;RENDER.geo();break;
   case 'open-topic':leaveRun();GV.tab='topics';GV.topic=d.id||null;if(cur!=='geo')location.hash='#geo';else{RENDER.geo();window.scrollTo(0,0)}break;
   case 'topics-back':GV.topic=null;RENDER.geo();break;
   case 'geo-daily':startDaily();break;
   case 'geo-mock':startMock();break;
   case 'fmt-s':startRun('Бір дұрыс жауап','geo-fmt',geoVariant('s'+Date.now(),10,0,0,0),'geo');break;
   case 'fmt-c':startRun('Контекст негізіндегі тапсырма','geo-fmt',geoVariant('c'+Date.now(),0,1,0,0),'geo');break;
   case 'fmt-m':startRun('Бір немесе бірнеше дұрыс жауап','geo-fmt',geoVariant('m'+Date.now(),0,0,5,0),'geo');break;
   case 'fmt-x':startRun('Сәйкестендіру','geo-fmt',geoVariant('x'+Date.now(),0,0,0,5),'geo');break;
   case 'geo-cards':case 'srs-open':openSRS(d.t);break;
   case 'topic-run':startTopic(d.id);break;
   case 'path-run':startPath(d.id);break;
   case 'topic-cards':openSRS(d.id);break;
   case 'geo-wrong':startWrong(d.t);break;
   case 'cu-on':state.cu.on=true;state.cu.since=todayKey();ensureWeek();state.wplan.days.forEach(function(dd){if(dd.k>=todayKey()&&!dd.items.some(function(x){return x.k==='catchup'}))dd.items.push({k:'catchup',done:false})});save();refresh();toast('Бағдарлама қосылды: күн сайын бір сабақ');break;
   case 'cu-off':state.cu.on=false;state.cu.snooze=addDays(14);ensureWeek();state.wplan.days.forEach(function(dd){if(dd.k>=todayKey())dd.items=dd.items.filter(function(x){return x.k!=='catchup'||x.done})});save();refresh();break;
   case 'cu-snooze':state.cu.snooze=addDays(7);save();refresh();break;
   case 'cu-run':startCatchup();break;
   case 'srs-rate':if(CD&&CD.srs&&!CD.done){var sq=CD.items[CD.pos],sr=parseInt(d.r,10);srsRate(sq,sr);CD.stat[sr]++;if(sr===0&&!CD.again[sq.id]){CD.again[sq.id]=1;CD.items.push(sq)}CD.pos++;CD.flip=false;if(CD.pos>=CD.items.length){CD.done=true;planMark('cards');save()}RENDER[CD.back]();window.scrollTo(0,0)}break;
   /* байқау тест */
   case 'ex-go':if(R&&R.exam){R.pos=parseInt(d.i,10);R.confirm=false;RENDER[R.back]()}break;
   case 'ex-prev':if(R&&R.exam&&R.pos>0){R.pos--;R.confirm=false;RENDER[R.back]();window.scrollTo(0,0)}break;
   case 'ex-next':if(R&&R.exam&&R.pos<R.items.length-1){R.pos++;R.confirm=false;RENDER[R.back]();window.scrollTo(0,0)}break;
   case 'ex-flag':if(R&&R.exam){var fi=R.items[R.pos];fi.flag=!fi.flag;RENDER[R.back]()}break;
   case 'ex-cancel':if(R){R.confirm=false;var fu=-1;R.items.some(function(x,i){if(!isAnswered(x)){fu=i;return true}return false});if(fu>-1)R.pos=fu;RENDER[R.back]()}break;
   case 'ex-finish':if(R&&R.exam&&!R.done){var un=R.items.filter(function(x){return !isAnswered(x)}).length;if(un&&!d.f){R.confirm=true;RENDER[R.back]();var fb2=$('.ex-foot');if(fb2)fb2.scrollIntoView({block:'center'});break}finishExam()}break;
   case 'rv':if(R){R.rv=d.v;RENDER[R.back]()}break;
   /* тест қозғалтқышы */
   case 'ans':if(R&&!R.done){var it=R.items[R.pos];if(!it.chk){it.ans=parseInt(d.i,10);if(R.exam){R.confirm=false;RENDER[R.back]();break}evalItem(it);RENDER[R.back]()}}break;
   case 'mtog':if(R){var im=R.items[R.pos],v=parseInt(d.v,10),ix=im.ans.indexOf(v);if(!im.chk){if(ix>-1)im.ans.splice(ix,1);else im.ans.push(v);RENDER[R.back]()}}break;
   case 'check':if(R){var ic=R.items[R.pos];if(!ic.chk){evalItem(ic);RENDER[R.back]()}}break;
   case 'next':if(R){R.pos++;if(R.pos>=R.items.length)finishRun();else{RENDER[R.back]();window.scrollTo(0,0)}}break;
   case 'quit':if(R&&R.exam&&!R.done&&!R.quitAsk){R.quitAsk=true;toast('Шығу үшін тағы бір рет бас: байқау тесттің жауаптары сақталмайды');break}var bk=R?R.back:(CD?CD.back:cur);leaveRun();RENDER[bk]();drawTop();window.scrollTo(0,0);break;
   case 'retry-missed':var ms=R.items.filter(function(x){return x.chk&&x.pts<maxPts(x)}).map(function(x){return x.k==='m'?itemM(x.q,Math.random):x.k==='x'?itemX(x.q,Math.random):itemS(x.q,Math.random,x.ctx,x.g,x.sid)});startRun('Қателерді қайталау','retry',ms,R.back);break;
   case 'flip':CD.flip=!CD.flip;RENDER[CD.back]();break;
   case 'card-next':CD.pos=(CD.pos+1>=CD.items.length)?0:CD.pos+1;CD.flip=false;RENDER[CD.back]();break;
   case 'card-prev':if(CD.pos>0){CD.pos--;CD.flip=false;RENDER[CD.back]()}break;
   /* басқа пәндер */
   case 'tcount':state.tcount=parseInt(d.n,10);save();refresh();break;
   case 'other-run':var S=subjById(d.id);if(S){var qs=S.qs.slice();if(!S.passages){qs=shuffle(qs);if(state.tcount>0)qs=qs.slice(0,state.tcount)}startRun(S.name,'subj',qs.map(function(q){return itemS(q,Math.random,null,false,S.id)}),'other')}break;
   case 'other-cards':var S2=subjById(d.id);if(S2)openCards(S2.name,S2.qs,'other');break;
   case 'other-wrong':var ow=[];state.wrong.forEach(function(w){var q=findQ(w.s,w.q);if(q)ow.push(itemS(q,Math.random,null,false,w.s))});if(ow.length)startRun('Қателер дәптері','wrong',shuffle(ow).slice(0,15),'other');break;
   /* ойындар */
   case 'game':startGame(d.id);break;
   case 'game-quit':stopGame();GM=null;RENDER.games();break;
   case 'rapid':rapidAnswer(d.v);break;
   case 'map-click':mapClick(e,b);break;
   case 'map-country':mapCountry(d.id);break;
   case 'map-next':mapNext();break;
   case 'mem':
     if(!GM||GM.over)break;var mi=parseInt(d.i,10);if(GM.done.indexOf(mi)>-1||GM.open.indexOf(mi)>-1)break;
     if(GM.open.length===2){GM.open=[];GM.bad=false}
     GM.open.push(mi);
     if(GM.open.length===2){GM.moves++;var c1=GM.cards[GM.open[0]],c2=GM.cards[GM.open[1]];if(c1.p===c2.p){GM.done=GM.done.concat(GM.open);GM.open=[];GM.bad=false}else{GM.bad=true}}
     if(GM.done.length===GM.cards.length){GM.score=Math.max(1,30-GM.moves+Math.max(0,20-Math.round((Date.now()-GM.start)/6000)));endGame();break}
     RENDER.games();break;
   case 'ord':var oi=parseInt(d.i,10),od=parseInt(d.d,10),tmp=GM.list[oi];GM.list[oi]=GM.list[oi+od];GM.list[oi+od]=tmp;RENDER.games();break;
   case 'ord-check':GM.chk=true;var okc=GM.list.filter(function(x,i){return x===GM.set.items[i]}).length;GM.score=okc;act('g');chalCheck();if(okc===GM.list.length){state.geo.best.ord=(state.geo.best.ord||0)+1;state.xp+=5;save();reward('🔢','Барлығы дұрыс!','+5 XP')}RENDER.games();break;
   /* ҰБТ */
   case 'ubt-del':state.ubt.tests=state.ubt.tests.filter(function(t){return t.id!==d.id});save();refresh();break;
   /* жоспар */
   case 'ptab':P.tab=d.t;refresh();break;
   case 'wp-week':P.tab='week';break;
   case 'wp-regen':genWeek();save();refresh();toast('Апталық жоспар қайта құрылды');break;
   case 'wp-go':var wk=d.k;if(wk==='daily')startDaily();else if(wk==='cards')openSRS();else if(wk==='path'){var pn=pathNext();if(pn)startPath(pn.id);else toast('Барлық тақырып меңгерілді!')}else if(wk==='topic')startTopic(d.id);else if(wk==='mock')startMock();else if(wk==='wrong')startWrong();else if(wk==='map'){startGame('mapkz');if(cur!=='games')location.hash='#games'}else if(wk==='catchup')startCatchup();break;
   case 'has-due':P.has=b.checked;$$('#dl-box input,#dl-box select,#dl-box button').forEach(function(x){x.disabled=!P.has});var bx=$('#dl-box');if(bx)bx.classList.toggle('off',!P.has);dlPaint();break;
   case 'task-toggle':
     var tt=null;state.tasks.forEach(function(t){if(t.id===d.id)tt=t});if(!tt)break;
     tt.done=b.checked;
     if(tt.done){state.xp+=10;act('t');var sc=state.tasks.filter(function(t){return t.scope===tt.scope});if(sc.length>1&&sc.every(function(t){return t.done}))reward('🏆',SC[tt.scope][0]+' толық орындалды!','+10 XP · Жарайсың!');else reward('🎉','Тапсырма орындалды!','+10 XP')}
     else state.xp=Math.max(0,state.xp-10);
     save();refresh();break;
   case 'task-del':state.tasks=state.tasks.filter(function(t){return t.id!==d.id});save();refresh();break;
   case 'task-clear':state.tasks=state.tasks.filter(function(t){return !(t.done&&t.scope===P.tab)});save();refresh();break;
   case 'tmode':stopTimer();T.mode=d.m;resetTimer();refresh();break;
   case 'ttoggle':T.running?pauseTimer():startTimer();break;
   case 'treset':stopTimer();resetTimer();refresh();break;
   /* даму */
   case 'gtab':G.tab=d.t;refresh();break;
   case 'gen-plan':G.gen=genPlan();refresh();break;
   case 'gen-add':if(G.gen){G.gen.forEach(function(day){var items=day.blocks.slice();if(day.review)items.push('Қателер дәптері және апталық тест');if(items.length)state.tasks.push({id:uid(),title:DAYS[day.wk]+': '+items.join(', '),subject:'',scope:'week',due:day.k,done:false})});save();drawTop();toast('Апталық жоспарға қосылды')}break;
   case 'chal-done':if(!state.chal[todayKey()]){state.chal[todayKey()]=true;state.xp+=5;save();reward('💪','Бүгінгі сынақ орындалды!','+5 XP');refresh()}break;
   case 'breath':G.breath=!G.breath;refresh();break;
   case 'habit':var log=state.habits.log[d.k]||(state.habits.log[d.k]=[]),hx=log.indexOf(d.id);if(hx>-1){log.splice(hx,1);state.xp=Math.max(0,state.xp-3)}else{log.push(d.id);state.xp+=3;if(d.k===todayKey()&&log.length>=state.habits.list.length)reward('🌱','Бүгінгі әдеттер толық!','Тәртіп осылай қалыптасады')}save();refresh();break;
   case 'habit-del':state.habits.list=state.habits.list.filter(function(h){return h.id!==d.id});save();refresh();break;
   /* видео */
   case 'vid-del':state.vids=state.vids.filter(function(m){return m.id!==d.id});save();refresh();break;
   /* профиль */
   case 'exp':ME.exp=!ME.exp;refresh();break;
   case 'wipe':if(!ME.wipe){ME.wipe=true;refresh()}else{try{localStorage.removeItem(KEY)}catch(er){}location.hash='#home';location.reload()}break;
   case 'wipe-no':ME.wipe=false;refresh();break;
   case 'imp':try{var o=JSON.parse($('#exp').value);if(!o||typeof o!=='object'||!o.ubt||!Array.isArray(o.tasks))throw 0;localStorage.setItem(KEY,JSON.stringify(o));location.reload()}catch(er){toast('Көшірме мәтіні дұрыс емес')}break;
  }
});
document.addEventListener('keydown',function(e){
  if((e.key==='Enter'||e.key===' ')&&e.target.matches&&e.target.matches('[role=button][data-act]')){e.preventDefault();e.target.click()}
  if(e.key==='Escape'&&panel){panel='';drawTop()}
  if(e.key==='Escape'){if($('.ck-modal'))ckModal(null);if($('.more-sheet'))openMore(false)}
});
document.addEventListener('change',function(e){
  var el=e.target;
  if(el.id==='av-file'){readPhoto(el.files&&el.files[0],function(big,small){OB.photo=big;OB.ph=small;OB.touched=true;paintAvs()});return}
  if(el.dataset&&el.dataset.act==='xsel'&&R){var it=R.items[R.pos];if(!it.chk){it.ans[parseInt(el.dataset.i,10)]=parseInt(el.value,10);var cb=$('[data-act=check]');if(cb)cb.disabled=!it.ans.every(function(v){return v>-1})}return}
  if(!el.dataset||!el.dataset.bind)return;var path=el.dataset.bind,v=el.value;
  if(path==='ubt.goal'){v=parseInt(v,10);if(!isFinite(v))return;v=Math.max(0,Math.min(140,v))}
  else if(path.indexOf('timer.')===0){v=parseInt(v,10);if(!isFinite(v)||v<1)v=1;var mx={focus:120,short:60,long:90}[path.slice(6)];if(v>mx)v=mx}
  else if(path.indexOf('planGen.')===0){v=parseFloat(v);if(!isFinite(v)||v<0)v=0;G.gen=null}
  else if(path==='why')v=cut(v,240);else if(path==='letter')v=cut(v,1200);
  setPath(path,v);save();
  if(path.indexOf('timer.')===0){if(!T.running&&T.mode===path.slice(6))resetTimer();refresh()}
  else if(path==='why'||path==='letter')toast('Сақталды');else refresh();
});
document.addEventListener('submit',function(e){
  var f=e.target.closest('[data-form]');if(!f)return;e.preventDefault();var k=f.dataset.form;
  if(k==='onb'){
    var nm=cut(OB.name,20),ln=cut(OB.last,25);if(!nm||!ln){OB.step=1;paintOnbStep(true);toast('Атың мен тегіңді жаз');return}var g=parseInt(OB.goal,10);
    state.profile={name:nm,last:ln,av:OB.av,photo:OB.photo,ph:OB.ph,created:todayKey()};state.ubt.p1=OB.p1;state.ubt.p2=OB.p2;if(isFinite(g))state.ubt.goal=Math.max(0,Math.min(140,g));state.ubt.date=OB.date||'';if(OB.why)state.why=cut(OB.why,240);OB.step=null;
    if(!state.tasks.length)state.tasks=[{id:uid(),title:'Бүгінгі география нұсқасын шешу',subject:'География',scope:'day',due:defDue('day'),done:false},{id:uid(),title:'Бір ойын ойнау',subject:'География',scope:'day',due:'',done:false},{id:uid(),title:'Географиядан толық сынақ тапсыру',subject:'География',scope:'week',due:defDue('week'),done:false},{id:uid(),title:'ҰБТ-дан '+state.ubt.goal+' балл жинау',subject:'ҰБТ',scope:'year',due:state.ubt.date||'',done:false}];
    OB.touched=false;save();drawOnb();route();reward('🧭','Қош келдің, '+nm+'!','Сапарың басталды');
  }else if(k==='me'){
    var n2=cut($('#m-name').value,20),l2=cut($('#m-last').value,25);if(!n2||!l2)return;state.profile=state.profile||{created:todayKey()};state.profile.name=n2;state.profile.last=l2;state.profile.av=OB.av;state.profile.photo=OB.photo;state.profile.ph=OB.ph;OB.touched=false;save();refresh();toast('Профиль сақталды');
  }else if(k==='ubt-add'){
    var rec={id:uid(),date:$('#u-d').value||todayKey()};subjMeta().forEach(function(s){var v=parseInt($('#u-'+s.k).value,10);if(!isFinite(v))v=0;rec[s.k]=Math.max(0,Math.min(s.max,v))});
    state.ubt.tests.push(rec);save();refresh();if(tot(rec)>=state.ubt.goal)reward('🎯','Мақсат балға жеттің!',tot(rec)+' / 140');else toast('Нәтиже қосылды: '+tot(rec)+' / 140');
  }else if(k==='task-add'){
    var t=cut($('#t-title').value,140);if(!t)return;var due=P.has?dlValue():'';state.tasks.push({id:uid(),title:t,subject:$('#t-subj').value,scope:P.tab,due:due,done:false});save();refresh();if(due&&dueTs(due)<Date.now())toast('Ескерту: бұл дедлайн өтіп кеткен уақыт');
  }else if(k==='habit-add'){var n=cut($('#h-name').value,60);if(!n)return;state.habits.list.push({id:uid(),name:n});save();refresh()}
  else if(k==='cls-join'){if(CLOUD.user&&FB)classJoin($('#cls-code').value)}
  else if(k==='cls-create'){if(CLOUD.user&&FB)classCreate($('#cls-name').value)}
  else if(k==='vid-add'){
    var u=$('#j-url').value.trim(),ok=false;try{var uu=new URL(u);ok=uu.protocol==='https:'&&/(^|\.)(youtube\.com|youtu\.be)$/.test(uu.hostname)}catch(er){}
    if(!ok){toast('Тек https://youtube.com немесе youtu.be сілтемесін қос');return}
    state.vids.unshift({id:uid(),u:u,t:cut($('#j-title').value,100)});save();refresh();toast('Жинаққа қосылды');
  }
});

/* ---------- іске қосу ---------- */
drawNav();drawOnb();logStart();checkProgress();route();persist();cloudInit();
/* Анонимді санағыш: тек сандар (құрылғылар саны, күндік бірегей кірушілер, сессиялар). Жеке дерек жіберілмейді.
   Оқуға тек сайт иесінің аккаунтына рұқсат (firestore.rules), көру — admin.html немесе Firebase Console. */
function statsPing(){
  /* Жергілікті тексеріс (localhost) санаққа кірмейді. */
  if(!fbReady()||!window.fetch||/^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname))return;var c=window.FIREBASE_CONFIG,tk=todayKey(),key='kk-st',s={};try{s=JSON.parse(localStorage.getItem(key)||'{}')||{}}catch(e){}
  var day=[],tot=[];if(s.d!==tk)day.push('u');var ss=false;try{ss=!!sessionStorage.getItem('kk-ss')}catch(e){}if(!ss)day.push('v');if(!s.dev)tot.push('devices');
  if(!day.length&&!tot.length)return;var base='projects/'+c.projectId+'/databases/(default)/documents/',W=[];
  var tr=function(path,fs){return {transform:{document:base+path,fieldTransforms:fs.map(function(f){return {fieldPath:f,increment:{integerValue:'1'}}})}}};
  if(day.length)W.push(tr('stats_days/'+tk,day));if(tot.length)W.push(tr('stats/total',tot));
  var send=function(tok){var h={'Content-Type':'application/json'};if(tok)h['X-Firebase-AppCheck']=tok;
  return fetch('https://firestore.googleapis.com/v1/'+base.replace(/\/$/,'')+':commit?key='+encodeURIComponent(c.apiKey),{method:'POST',headers:h,body:JSON.stringify({writes:W}),keepalive:true})};
  (window.APPCHECK_SITE_KEY?acToken().then(send):send(null))
   .then(function(r){if(!r.ok)return;s.d=tk;s.dev=1;try{localStorage.setItem(key,JSON.stringify(s));sessionStorage.setItem('kk-ss','1')}catch(e){}}).catch(function(){});
}
setTimeout(statsPing,2500);
document.addEventListener('input',function(e){var id=e.target&&e.target.id;
  if(id==='pf-score'){var v=e.target.value.replace(/\D/g,'').slice(0,3);if(+v>140)v='140';state.prof.score=v;persist();pfRefresh()}
  else if(id==='pf-q'){PF.q=e.target.value;var g=$('#pf-grid');if(g)g.innerHTML=pfGrid(pfList())}});
document.addEventListener('change',function(e){var id=e.target&&e.target.id;
  if(id==='pf-rural'){state.prof.rural=!!e.target.checked;save();pfRefresh()}
  else if(id==='rem-t'&&/^\d{2}:\d{2}$/.test(e.target.value)){state.rem.t=e.target.value;state.rem.last='';save();remSync();toast('🔔 Еске салу уақыты: '+state.rem.t)}});

/* PWA: телефонға орнату және интернетсіз жұмыс */
if('serviceWorker' in navigator&&(location.protocol==='https:'||location.hostname==='localhost')){window.addEventListener('load',function(){navigator.serviceWorker.register('sw.js').catch(function(){})})}
window.addEventListener('beforeinstallprompt',function(e){e.preventDefault();PWA.ev=e;if(cur==='me')RENDER.me()});
window.addEventListener('appinstalled',function(){PWA.ev=null;toast('Көкжиек телефонға орнатылды');if(cur==='me')RENDER.me()});
window.addEventListener('offline',function(){toast('Интернет жоқ: бұрын ашылған беттер жұмыс істей береді')});
window.addEventListener('online',function(){toast('Интернет қайта қосылды')});
if(state.profile){var nn=notifs().filter(function(x){return x.task}).length;if(nn)setTimeout(function(){toast('🔔 '+nn+' орындалмаған тапсырма бар')},900)}
})();
