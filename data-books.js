/* КӨКЖИЕК — оқулықтар каталогы және оқулық сұрақтарын жүктеу.
   Жаңа оқулық қосу: BOOKS тізіміне жол қосып, q-<id>.js файлында GQ / GM_ / GX_ шақыру жеткілікті.
   GQ(кітап,[[бет,тақырып,сұрақ,дұрыс,[қате×3],түсіндірме],...])
   GM_(кітап,[[бет,тақырып,сұрақ,[6 нұсқа],[дұрыс индекстер],түсіндірме],...])
   GX_(кітап,[[бет,тақырып,сұрақ,[сол],[оң],[сәйкестік],түсіндірме],...]) */
(function(){
var G=window.GEO;if(!G)return;
G.version='2026-11-18';
G.drive='https://drive.google.com/drive/folders/16GE3aiLF-X0TqP9EfQaGsDqSgWC7ZH2z?usp=sharing';
var DRIVE={"g7at": "1IzYzjz0Zz6UL2Jn9LIgaEuGIu2a_8eAX", "g7a1": "12KdrCMyw8-xKwr27gEsZyOt7QImMvHVs", "g7a2": "1HudoHYrDNHMOEiOIFawRU-Dh0g11PBR-", "g8m": "1E-3sA2GNYI-ADM32inoqnHrp198I_8Sd", "g8a2": "1nrp1H1EdxJh9Ufs5MqfwKNR489yCKR13", "g8a1": "1OxJg1ncneqswuhMjsJGteVOrjzvu9Aga", "g9t2": "19RdiU6VfoWSV0PrsBstZApF7hMr6yncI", "g9a1": "1uUBfx2WiHIE0NWLykYJsVNFc89gO-yKq", "g9a2": "1D4nG4N6NOPnHWUvgTZvkivw0eOhr_naX", "g9t1": "1tOYas_sOjdDQbi9YA6MN__0fT6UEqAyX", "g9m1": "1YJLl9x8wwvHRw7Pw6fzaMWyavrpLA8Hs", "g9m2": "1LHKchjP38AstNxPtzFpaRkgXit-_d9rO", "g10a2": "1JIw2JsKyu5Oz0cNqkjnH1m4Ct40Uco7R", "g10a1": "1_GYg0bhcJBcs7y4so_5r9lBKzhn1FL1f", "g10m": "1QaS5C4Ls67_a-hU3e3B7CiypvlI_BXkM", "g11m": "1wzH_oMNFQEQlbUBN4-B1pHp1ks4GoP1y"};
var B=function(id,gr,part,title,authors,pub,year,pages){return {id:id,grade:gr,part:part,title:title,authors:authors,publisher:pub,year:year,pages:pages,img:'img/'+id+'.jpg'}};
G.books=[
 B('g7at',7,0,'География','Егорина, Нүркенова, Шимина','Атамұра',2017,224),
 B('g7a1',7,1,'География','Қаратабанов, Байметова','Алматыкітап',2017,264),
 B('g7a2',7,2,'География','Қаратабанов, Байметова','Алматыкітап',2017,192),
 B('g8m',8,0,'География','Әбілмәжінова, Каймулдинова','Мектеп',2018,255),
 B('g8a1',8,1,'География','Қаратабанов, Қуанышева, Байметова, Джаналеева','Алматыкітап',2018,276),
 B('g8a2',8,2,'География','Қаратабанов, Қуанышева, Байметова, Джаналеева','Алматыкітап',2018,152),
 B('g9m1',9,1,'Қазақстан географиясы','Толыбекова, Головина, Козина, Ахметов','Мектеп',2019,192),
 B('g9m2',9,2,'Қазақстан географиясы','Толыбекова, Головина, Козина, Ахметов','Мектеп',2019,169),
 B('g9t1',9,1,'Қазақстан географиясы','Усиков, Егорина, Усикова, Зәбенова','Атамұра',2019,256),
 B('g9t2',9,2,'Қазақстан географиясы','Усиков, Егорина, Усикова, Зәбенова','Атамұра',2019,256),
 B('g9a1',9,1,'Қазақстан географиясы','Қаратабанов, Саипов, Балғабаева, Сапаров','Алматыкітап',2019,176),
 B('g9a2',9,2,'Қазақстан географиясы','Қаратабанов, Саипов, Балғабаева, Сапаров','Алматыкітап',2019,240),
 B('g10m',10,0,'География','Каймулдинова, Әбілмәжінова','Мектеп',2019,387),
 B('g10a1',10,1,'География','Төлепбекова, Аманжолов, Жылқайдарова','Алматыкітап',2019,192),
 B('g10a2',10,2,'География','Төлепбекова, Аманжолов, Жылқайдарова','Алматыкітап',2019,192),
 B('g11m',11,0,'География','Каймулдинова, Абдиманапов, Әбілмәжінова','Мектеп',2020,285)
];
G.books.forEach(function(b){if(DRIVE[b.id]){b.view='https://drive.google.com/file/d/'+DRIVE[b.id]+'/view?usp=sharing';b.dl='https://drive.google.com/uc?export=download&id='+DRIVE[b.id]}});
if(!G.topics.some(function(t){return t.id==='method'}))G.topics.unshift({id:'method',name:'География ғылымы және зерттеу әдістері',ic:'🔭',notes:[
 'География — табиғат пен қоғамды бірге зерттейтін ғылым: физикалық, әлеуметтік-экономикалық және саяси география салалары бар.',
 'Ғылыми зерттеу әдістері: эмпирикалық (бақылау, эксперимент) және теориялық (гипотеза, теория, заң құру).',
 'Зерттеу нәтижесі ауызша (баяндама, хабарлама), жазбаша (мақала, тезис, монография) және электрондық таныстырылым түрінде ұсынылады.',
 'Жерді қашықтықтан зерделеу (ЖҚЗ) мен ГАЖ — қазіргі географияның негізгі құралдары. Алғашқы ГАЖ 1950-жылдардың соңында АҚШ-та, ұлттық ГАЖ 1960-жылдары Канадада жасалды.',
 'Географиялық атауларды топонимика ғылымы зерттейді; белгілі аумақтағы атаулар жиынтығы — топонимия.',
 'Қазақстан географиясына Ш. Уәлиханов, Қ. Сәтбаев, У. Ахмедсафин, Л. Берг, Н. Баранский сияқты ғалымдар зор үлес қосты.']});
G.byBook={};
function src(b,p){return {b:b,p:p}}
function seen(q){return G._q||(G._q={})}
function add(list,o){var k=o.q+'|'+(o.o?o.o[0]:'')+(o.L?o.L.join():'');var m=seen();if(m[k])return;m[k]=1;list.push(o);G.byBook[o.src.b]=(G.byBook[o.src.b]||0)+1}
window.GQ=function(b,rows){rows.forEach(function(r){add(G.single,{t:r[1],q:r[2],o:[r[3]].concat(r[4]),e:r[5],src:src(b,r[0])})})};
window.GM_=function(b,rows){rows.forEach(function(r){add(G.multi,{t:r[1],q:r[2],o:r[3],a:r[4],e:r[5],src:src(b,r[0])})})};
window.GC_=function(b,p,id,t,title,text,qs){if(G.context.some(function(c){return c.id===id}))return;G.context.push({id:id,t:t,title:title,text:text,src:src(b,p),qs:qs.map(function(r){return {q:r[0],o:[r[1]].concat(r[2]),e:r[3],src:src(b,p)}})});G.byBook[b]=(G.byBook[b]||0)+qs.length};
window.GX_=function(b,rows){rows.forEach(function(r){add(G.match,{t:r[1],q:r[2],L:r[3],R:r[4],a:r[5],e:r[6],src:src(b,r[0])})})};
})();
