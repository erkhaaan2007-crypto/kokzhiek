/* КӨКЖИЕК: service worker — сайтты интернетсіз ашуға мүмкіндік береді.
   Сайттың өз файлдары: алдымен желіден (жаңа нұсқа бірден келеді), желі болмаса — кэштен.
   Сыртқы ресурстар (шрифт, иконкалар, карта, pdf.js): кэштен бірден, фонда жаңартылады.
   Жаңа файл қоссаң, CORE тізіміне де қос және V нұсқасын өзгерт. */
var V='kokzhiek-v10',EXT='kokzhiek-ext-v1',CONF='kokzhiek-conf';
var CORE=["./", "index.html", "styles.css", "manifest.webmanifest", "img/logo.png", "img/logo-white.png", "img/mark.png", "img/icon-192.png", "img/author.png", "data-quiz.js", "data-quiz2.js", "data-geo.js", "data-books.js", "q-g7at.js", "q-g7a1.js", "q-g7a2.js", "q-g8a1.js", "q-g8a2.js", "q-g9m1.js", "q-g9m2.js", "q-g9t1.js", "q-g9t2.js", "q-g9a1.js", "q-g9a2.js", "q-g8m.js", "q-g10m.js", "q-g10a1.js", "q-g10a2.js", "q-g11m.js", "q-context.js", "data-content.js", "data-nomen.js", "cx-art.js", "data-comics.js", "data-checklists.js", "data-prof.js", "img/atlas-7.jpg", "img/atlas-8.jpg", "img/atlas-9.jpg", "firebase-config.js", "app.js"];
var EXT_HOSTS=/(^|\.)(fonts\.googleapis\.com|fonts\.gstatic\.com|cdn-uicons\.flaticon\.com|cdn\.jsdelivr\.net|cdnjs\.cloudflare\.com)$/;
self.addEventListener('install',function(e){e.waitUntil(caches.open(V).then(function(c){return c.addAll(CORE)}).then(function(){return self.skipWaiting()}))});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!==V&&k!==EXT&&k!==CONF}).map(function(k){return caches.delete(k)}))}).then(function(){return self.clients.claim()}))});
self.addEventListener('fetch',function(e){
  var r=e.request;if(r.method!=='GET')return;var u=new URL(r.url);
  if(u.pathname.indexOf('/__/')>-1)return; /* Firebase кіру беттері кэштелмейді */
  if(u.origin===self.location.origin){
    e.respondWith(fetch(r).then(function(res){if(res&&res.ok){var cp=res.clone();caches.open(V).then(function(c){c.put(r,cp)})}return res}).catch(function(){
      return caches.match(r,{ignoreSearch:true}).then(function(m){return m||(r.mode==='navigate'?caches.match('index.html'):Response.error())})}));
  }else if(EXT_HOSTS.test(u.hostname)){
    e.respondWith(caches.open(EXT).then(function(c){return c.match(r).then(function(m){
      var f=fetch(r).then(function(res){if(res&&(res.ok||res.type==='opaque'))c.put(r,res.clone());return res}).catch(function(){return m||Response.error()});
      return m||f})}));
  }
});

/* Еске салғыш: бет баптауды жібереді (type:'rem'), Android-тағы орнатылған қолданбада periodicsync күн сайын тексереді. */
function dk(d){return d.getFullYear()+'-'+('0'+(d.getMonth()+1)).slice(-2)+'-'+('0'+d.getDate()).slice(-2)}
function confGet(){return caches.open(CONF).then(function(c){return c.match('rem.json')}).then(function(r){return r?r.json():{}}).catch(function(){return {}})}
function confPut(o){return caches.open(CONF).then(function(c){return c.put('rem.json',new Response(JSON.stringify(o),{headers:{'Content-Type':'application/json'}}))})}
self.addEventListener('message',function(e){var d=e.data||{};if(d.type!=='rem')return;e.waitUntil(confGet().then(function(o){d.shown=o.shown||'';return confPut(d)}))});
self.addEventListener('periodicsync',function(e){if(e.tag!=='kk-daily')return;e.waitUntil(confGet().then(function(d){
  var now=new Date(),tk=dk(now);if(!d||!d.on||d.done===tk||d.shown===tk)return;var p=String(d.t||'19:00').split(':');
  if(now.getHours()*60+now.getMinutes()<(+p[0])*60+(+p[1]||0))return;
  return self.clients.matchAll({type:'window'}).then(function(cl){if(cl.some(function(c){return c.visibilityState==='visible'}))return;d.shown=tk;
    return confPut(d).then(function(){return self.registration.showNotification('Көкжиек',{body:'Күн жұмбағы мен күндік нұсқа сені күтіп тұр. 10 минут уақыт бөл, қатарыңды үзбе!',icon:'img/icon-192.png',badge:'img/mark.png',tag:'kk-daily',data:{url:'./#home'}})})})}))});
self.addEventListener('notificationclick',function(e){e.notification.close();var u=(e.notification.data&&e.notification.data.url)||'./';
  e.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(function(cl){for(var i=0;i<cl.length;i++){if('focus' in cl[i])return cl[i].focus()}return self.clients.openWindow(u)}))});
