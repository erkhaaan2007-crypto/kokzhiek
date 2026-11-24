/* КӨКЖИЕК: комикс суреттері (аниме стилі, таза SVG).
   CXART.bust(кейіпкер, эмоция)  — кейіпкердің кеуде бейнесі (viewBox 0 0 200 260)
   CXART.bg(атауы)               — фон (viewBox 0 0 400 300, preserveAspectRatio slice)
   CXART.fx(атауы)               — эффект қабаты (жылдамдық сызықтары, ұшқын, т.б.)
   CXART.defs()                  — ортақ градиенттер (бетке бір рет қойылады)
   Эмоциялар: n — сабырлы, h — қуанышты, s — таңғалған, d — батыл, w — алаңдаулы, t — ойланған, a — ашулы. */
(function(){
var CH={
 aiym:{n:'Айым',skin:'#fde4d0',sh:'#f2c4a8',line:'#7a4434',hair:'#1c1633',hi:'#5a4c8c',i1:'#3a1c0c',i2:'#c27c3e',brow:'#1c1633'},
 arman:{n:'Арман',eyeK:.86,skin:'#f6d4b4',sh:'#e6b48e',line:'#7a4434',hair:'#2b1c14',hi:'#7b5638',i1:'#261309',i2:'#9a6430',brow:'#2b1c14'},
 dana:{n:'Дана',skin:'#fde6d6',sh:'#f0c6ae',line:'#7a4434',hair:'#3a1f4a',hi:'#8a5aa6',i1:'#2e1065',i2:'#9b6cf5',brow:'#3a1f4a'},
 ata:{n:'Ата',eyeK:.7,skin:'#f0caa6',sh:'#d9a982',line:'#6b3a26',hair:'#eef2f7',hi:'#ffffff',i1:'#2a160c',i2:'#7a4a24',brow:'#e5e7eb'},
 erlan:{n:'Ерлан',eyeK:.84,skin:'#f3d3b8',sh:'#ddb293',line:'#6b4434',hair:'#3a3f4b',hi:'#7d8796',i1:'#1e293b',i2:'#64748b',brow:'#3a3f4b'},
 bagdar:{n:'Бағдар'},
 tuman:{n:'Тұман'}
};
function P(d,f,x){return '<path d="'+d+'" fill="'+f+'"'+(x||'')+'/>'}
function S(d,c,w,x){return '<path d="'+d+'" fill="none" stroke="'+c+'" stroke-width="'+w+'" stroke-linecap="round" stroke-linejoin="round"'+(x||'')+'/>'}
var MIR=' transform="matrix(-1 0 0 1 200 0)"';

/* ---------- көз, қас, ауыз ---------- */
function eye(c,e,dx){var o='',k=c.key;dx=dx||0;var K=c.eyeK||1,T=function(x){return '<g transform="translate(78 120) scale(.86 '+(.86*K).toFixed(3)+') translate(-84 -120)">'+x+'</g>'};
  if(e==='h')return T(S('M65 124 Q81 106 98 123','#1a1020',5)+S('M64 124 L59 121','#1a1020',2.6));
  var white='M66 120 C66 108 74 101 84 101 C93 101 98 108 98 117 C98 127 91 134 82 134 C73 134 66 128 66 120 Z',
      lash='M61 117 C65 102 80 95 96 100 C100 102 102 106 102 111 C97 106 90 103 82 104 C74 105 68 110 64 119 Z',
      rx=10,ry=13,cy=119,pr=4.6,hl=3.8;
  if(e==='s'){white='M64 119 C64 104 73 97 84 97 C95 97 100 106 100 116 C100 128 92 136 82 136 C71 136 64 129 64 119 Z';lash='M60 114 C64 98 80 91 97 96 C101 98 103 103 103 108 C98 102 90 99 82 100 C73 101 67 106 63 116 Z';rx=7.5;ry=9.5;pr=2.6;hl=2.4}
  o+=P(white,'#fff');
  o+='<ellipse cx="'+(83+dx)+'" cy="'+cy+'" rx="'+rx+'" ry="'+ry+'" fill="url(#cxI_'+k+')"/>';
  o+='<ellipse cx="'+(83+dx)+'" cy="'+(cy+1)+'" rx="'+pr+'" ry="'+(pr*1.35)+'" fill="#120a14"/>';
  o+='<circle cx="'+(87.5+dx)+'" cy="'+(cy-6)+'" r="'+hl+'" fill="#fff"/><circle cx="'+(78.5+dx)+'" cy="'+(cy+7)+'" r="1.7" fill="#fff" opacity=".9"/>';
  if(e==='d'||e==='a')o+=P('M58 92 H104 V113 C97 108 90 107 82 108 C74 109 68 113 62 121 L58 121 Z',c.skin)+P('M60 121 C66 111 80 106 97 109 C100 110 102 112 103 115 C97 112 89 111 82 112 C74 113 68 116 63 123 Z','#1a1020');
  else o+=P(lash,'#1a1020')+P('M62 115 L55 109 L64 112 Z','#1a1020');
  o+=S('M68 128 Q71 132 75 133',c.line,1.2,' opacity=".7"');
  return T(o)}
function brow(c,e,right){var d={n:'M66 98 Q79 92 92 96',h:'M66 96 Q79 89 92 94',s:'M66 91 Q79 83 92 88',d:'M66 94 Q80 96 95 102',w:'M66 100 Q78 97 93 90',t:right?'M66 92 Q79 85 92 89':'M66 99 Q79 95 92 98',a:'M64 92 L96 104'}[e]||'M66 98 Q79 92 92 96';
  return S(d,c.brow,c.old?4.5:2.8)}
function mouth(c,e){var m='#7a2335';switch(e){
  case 'h':return P('M88 149 Q100 152 112 149 Q110 164 100 165 Q90 164 88 149 Z',m)+P('M93 159 Q100 155 107 159 Q104 164 100 164 Q96 164 93 159 Z','#f87171');
  case 's':return '<ellipse cx="100" cy="156" rx="4.4" ry="5.8" fill="'+m+'"/>';
  case 'd':return S('M91 152 Q101 158 110 149',m,2.4);
  case 'w':return S('M90 156 q3.5 -3 7 0 t7 0 t7 0',m,2);
  case 't':return S('M94 154 L107 151',m,2.2);
  case 'a':return P('M87 147 L113 147 Q111 164 100 165 Q89 164 87 147 Z',m)+P('M89 147 L111 147 L110 151 L90 151 Z','#fff');
  default:return S('M92 152 Q100 157.5 108 152',m,2.2)}}
function blush(e){var o='<ellipse cx="74" cy="142" rx="8.5" ry="3.6" fill="#f99fb4" opacity="'+(e==='h'?.6:.35)+'"/><ellipse cx="126" cy="142" rx="8.5" ry="3.6" fill="#f99fb4" opacity="'+(e==='h'?.6:.35)+'"/>';
  if(e==='h'||e==='s')o+=S('M70 140 l-2 4 M75 140 l-2 4 M80 140 l-2 4 M122 140 l-2 4 M127 140 l-2 4 M132 140 l-2 4','#e2687f',1);return o}
function marks(e){if(e==='w')return P('M141 90 Q135 100 138 105 Q142 108 145 104 Q147 99 141 90 Z','#bae6fd',' stroke="#0284c7" stroke-width="1.4"');
  if(e==='a')return S('M134 66 q4 4 0 8 M138 62 q4 4 8 0 M146 66 q-4 4 0 8 M138 78 q4 -4 8 0','#dc2626',2.6);
  if(e==='s')return S('M48 70 l-8 -6 M46 84 l-10 -1 M152 70 l8 -6 M154 84 l10 -1','#111',2.2);
  if(e==='t')return '<circle cx="150" cy="70" r="3" fill="#fff" stroke="#111" stroke-width="1.4"/><circle cx="160" cy="56" r="4.5" fill="#fff" stroke="#111" stroke-width="1.4"/>';
  return ''}

/* ---------- бет пен мойын ---------- */
function face(c,e){var o='';
  o+=P('M88 158 L87 198 L113 198 L112 158 Z',c.skin,' stroke="'+c.line+'" stroke-width="1.6"')+P('M88 164 Q100 182 112 164 L112 177 Q100 189 88 177 Z',c.sh);
  o+=P('M61 108 C52 104 50 123 61 131 Z',c.skin,' stroke="'+c.line+'" stroke-width="1.8"')+P('M139 108 C148 104 150 123 139 131 Z',c.skin,' stroke="'+c.line+'" stroke-width="1.8"');
  o+=P('M60 100 C60 62 82 46 100 46 C118 46 140 62 140 100 C140 128 132 150 118 164 C110 172 104 176 100 176 C96 176 90 172 82 164 C68 150 60 128 60 100 Z',c.skin,' stroke="'+c.line+'" stroke-width="2"');
  o+=P('M62 100 C64 92 76 86 100 86 C124 86 136 92 138 100 C134 96 122 94 100 95 C78 94 66 96 62 100 Z',c.sh,' opacity=".55"');
  if(c.old)o+=S('M62 124 q4 3 2 7 M138 124 q-4 3 -2 7 M84 144 q-4 6 -2 12 M116 144 q4 6 2 12 M86 100 q14 -4 28 0',c.line,1,' opacity=".45"');
  o+=S('M101 135 L99 141 L102.5 141.5','#c98f74',1.3);
  var t=e==='t'?4:0;
  o+='<g>'+eye(c,e,t)+brow(c,e,false)+'</g><g'+MIR+'>'+eye(c,e,-t)+brow(c,e,true)+'</g>';
  o+=blush(e)+mouth(c,e)+marks(e);
  return o}

/* ---------- киім ---------- */
var OUT={
 aiym:function(){return P('M28 260 C30 222 50 204 82 196 L100 214 L118 196 C150 204 170 222 172 260 Z','#1f2b5e',' stroke="#0d1430" stroke-width="2"')
   +P('M82 196 L100 214 L118 196 L113 190 L100 201 L87 190 Z','#fff',' stroke="#94a3b8" stroke-width="1"')+P('M100 205 L90 213 L100 218 L110 213 Z','#38bdf8')+P('M100 214 L95 232 L100 236 L105 232 Z','#38bdf8')
   +S('M82 196 L94 236 M118 196 L106 236','#0d1430',1.6)+S('M60 214 Q64 236 62 260 M140 214 Q136 236 138 260','#0d1430',1.2,' opacity=".6"')
   +'<circle cx="128" cy="232" r="6.5" fill="#fbbf24" stroke="#92400e" stroke-width="1.6"/><path d="M128 227 L126 233 L130 233 Z" fill="#dc2626"/>'},
 arman:function(){return P('M26 260 C28 220 52 202 84 196 Q100 206 116 196 C148 202 172 220 174 260 Z','#f97316',' stroke="#7c2d12" stroke-width="2"')
   +P('M78 196 Q100 224 122 196 Q118 214 100 219 Q82 214 78 196 Z','#ea580c',' stroke="#7c2d12" stroke-width="1.4"')
   +S('M92 216 L90 244 M108 216 L110 244','#fff7ed',2.4)+'<circle cx="90" cy="246" r="2.6" fill="#fff7ed"/><circle cx="110" cy="246" r="2.6" fill="#fff7ed"/>'
   +S('M64 200 Q100 230 136 200','#334155',6.5)+'<circle cx="64" cy="199" r="11" fill="#475569" stroke="#1e293b" stroke-width="2"/><circle cx="64" cy="199" r="5" fill="#22d3ee"/><circle cx="136" cy="199" r="11" fill="#475569" stroke="#1e293b" stroke-width="2"/><circle cx="136" cy="199" r="5" fill="#22d3ee"/>'},
 dana:function(){return P('M28 260 C30 222 52 204 84 196 L100 212 L116 196 C148 204 170 222 172 260 Z','#d9bb8b',' stroke="#7c5a2c" stroke-width="2"')
   +P('M84 196 L100 212 L116 196 L111 260 L89 260 Z','#fff',' stroke="#cbd5e1" stroke-width="1"')+P('M86 195 L100 206 L114 195 L109 190 L100 198 L91 190 Z','#fff',' stroke="#94a3b8" stroke-width="1"')
   +'<circle cx="100" cy="226" r="2" fill="#94a3b8"/><circle cx="100" cy="244" r="2" fill="#94a3b8"/>'+S('M60 220 l6 30 M140 220 l-6 30','#b08f5c',1.4)},
 ata:function(){return P('M26 260 C28 220 52 202 82 196 L100 228 L118 196 C148 202 172 220 174 260 Z','#14532d',' stroke="#052e16" stroke-width="2"')
   +P('M82 196 L100 228 L118 196 L112 192 L100 210 L88 192 Z','#f8fafc')+S('M82 196 L100 228 L118 196','#fbbf24',3.2)+S('M86 204 L100 230 L114 204','#fbbf24',1.2,' stroke-dasharray="2 3"')},
 erlan:function(){return P('M26 260 C28 220 52 202 84 196 Q100 206 116 196 C148 202 172 220 174 260 Z','#64748b',' stroke="#1e293b" stroke-width="2"')
   +P('M76 196 Q100 226 124 196 Q120 216 100 221 Q80 216 76 196 Z','#475569',' stroke="#1e293b" stroke-width="1.4"')+S('M93 218 L92 242 M107 218 L108 242','#e2e8f0',2.2)}
};

/* ---------- шаш ---------- */
var HAIR={
 aiym:{back:function(c){return P('M140 54 C170 40 186 74 174 112 C168 132 158 144 150 152 C158 118 156 84 138 72 Z',c.hair,' stroke="#000" stroke-width="1.6"')
     +P('M52 100 C46 60 70 34 100 34 C130 34 154 60 148 100 L152 150 C154 186 150 214 146 236 L126 226 L132 180 L130 140 L70 140 L68 180 L74 226 L54 236 C50 214 46 186 48 150 Z',c.hair,' stroke="#000" stroke-width="1.6"')},
   front:function(c){return P('M56 106 C52 70 72 38 100 36 C128 38 148 70 144 106 C140 94 136 86 131 81 L129 99 C123 87 116 79 108 75 L104 93 C98 81 90 75 82 73 L80 95 C74 87 68 85 64 83 L62 106 Z',c.hair,' stroke="#000" stroke-width="1.6"')
     +P('M58 98 C51 126 53 152 60 172 C63 152 65 128 67 104 Z',c.hair,' stroke="#000" stroke-width="1.4"')+P('M142 98 C149 126 147 152 140 172 C137 152 135 128 133 104 Z',c.hair,' stroke="#000" stroke-width="1.4"')
     +S('M74 56 Q100 44 126 56',c.hi,3.4,' opacity=".75"')+S('M82 64 l4 10 M110 60 l3 10 M96 58 l1 9',c.hi,2,' opacity=".6"')
     +P('M136 52 l-12 -10 l2 16 Z','#38bdf8',' stroke="#0369a1" stroke-width="1.4"')+P('M136 52 l14 -12 l-1 18 Z','#38bdf8',' stroke="#0369a1" stroke-width="1.4"')+'<circle cx="136" cy="52" r="3.4" fill="#0ea5e9"/>'}},
 arman:{back:function(c){return P('M56 102 C50 66 68 36 100 34 C132 36 150 64 144 102 Z',c.hair)},
   front:function(c){return P('M54 106 L44 80 L63 84 L56 56 L78 66 L80 38 L95 58 L104 30 L113 57 L130 40 L127 66 L148 56 L140 82 L157 80 L146 106 C140 94 134 88 128 86 L124 98 C118 88 110 82 102 82 L98 98 C92 88 84 84 76 84 L72 100 C66 94 60 94 58 98 Z',c.hair,' stroke="#000" stroke-width="1.6"')
     +S('M70 70 L84 78 M104 48 L106 62 M126 58 L118 72',c.hi,2.6,' opacity=".7"')}},
 dana:{back:function(c){return P('M52 104 C46 62 70 36 100 36 C130 36 154 62 148 104 C150 130 150 150 146 170 L129 172 L127 124 L73 124 L71 172 L54 170 C50 150 50 130 52 104 Z',c.hair,' stroke="#000" stroke-width="1.6"')},
   front:function(c){return P('M57 100 C55 62 77 40 100 40 C123 40 145 62 143 100 C136 96 128 92 120 92 L116 84 L110 92 C104 91 96 91 90 92 L84 84 L80 93 C72 94 64 96 57 100 Z',c.hair,' stroke="#000" stroke-width="1.6"')
     +S('M76 54 Q100 44 124 54',c.hi,3,' opacity=".7"')+'<path d="M132 72 l3 6 6 1 -4.5 4 1 6 -5.5 -3 -5.5 3 1 -6 -4.5 -4 6 -1 Z" fill="#fbbf24" stroke="#92400e" stroke-width="1"/>'},
   glasses:function(){return '<g fill="#fff" fill-opacity=".1" stroke="#1f2937" stroke-width="2"><rect x="63" y="104" width="36" height="30" rx="12"/><rect x="101" y="104" width="36" height="30" rx="12"/></g>'+S('M98 116 Q100 113 102 116','#1f2937',2)+S('M70 110 l8 -4 M108 110 l8 -4','#fff',2,' opacity=".75"')}},
 ata:{back:function(c){return P('M58 112 C52 98 56 84 66 80 L68 112 Z M142 112 C148 98 144 84 134 80 L132 112 Z',c.hair,' stroke="#94a3b8" stroke-width="1"')},
   front:function(c){return P('M64 76 C62 42 80 14 100 12 C120 14 138 42 136 76 Z','#f8fafc',' stroke="#94a3b8" stroke-width="1.6"')+S('M78 30 Q100 18 122 30','#e2e8f0',2)
     +P('M55 82 C58 66 80 62 100 64 C120 62 142 66 145 82 C140 88 128 86 118 84 L110 90 L100 84 L90 90 L82 84 C72 86 60 88 55 82 Z','#111827',' stroke="#000" stroke-width="1.2"')+S('M62 78 C80 72 120 72 138 78','#fbbf24',1.6,' stroke-dasharray="3 3"')}},
 erlan:{back:function(c){return P('M54 104 C48 66 68 38 100 36 C132 38 152 66 146 104 Z',c.hair)},
   front:function(c){return P('M54 108 L50 86 L62 90 L60 66 L76 74 L82 48 L94 66 L108 44 L114 66 L132 52 L128 74 L146 70 L140 92 L150 96 L146 108 C140 98 132 92 124 90 L120 100 C112 92 104 88 96 88 L92 100 C86 94 78 92 70 92 L66 104 C62 100 58 100 56 104 Z',c.hair,' stroke="#000" stroke-width="1.6"')
     +S('M74 80 L86 86 M116 62 L112 76',c.hi,2.4,' opacity=".7"')+P('M120 140 l10 -4 l2 5 l-10 4 Z','#fde68a',' stroke="#b45309" stroke-width="1"')}}
};
function ataBeard(c,e){var m=e==='h'||e==='s'||e==='a'?'':'';return P('M84 149 Q92 142 100 147 Q108 142 116 149 Q108 153 100 151 Q92 153 84 149 Z','#f8fafc',' stroke="#cbd5e1" stroke-width="1.2"')
  +P('M78 156 C82 182 92 198 100 202 C108 198 118 182 122 156 C112 167 106 169 100 169 C94 169 88 167 78 156 Z','#f1f5f9',' stroke="#cbd5e1" stroke-width="1.2"')+S('M92 176 l2 12 M100 178 v14 M108 176 l-2 12','#cbd5e1',1)}

function human(k,e){var c=CH[k];c.key=k;if(k==='ata')c.old=true;var h=HAIR[k],o='';
  o+=h.back(c)+OUT[k]()+face(c,e);
  if(k==='ata'){o+=ataBeard(c,e)}
  o+=h.front(c);if(h.glasses)o+=h.glasses();
  return o}

/* ---------- Бағдар: голограмма-компас ---------- */
function bagdar(e){var o='';
  o+='<circle cx="100" cy="138" r="90" fill="url(#cxHolo)"/>';
  o+='<g class="cx-spin" style="transform-origin:100px 138px"><circle cx="100" cy="138" r="78" fill="none" stroke="#67e8f9" stroke-width="1.6" stroke-dasharray="4 7" opacity=".9"/><path d="M100 56 l4 8 h-8 Z M100 220 l4 -8 h-8 Z M18 138 l8 4 v-8 Z M182 138 l-8 4 v-8 Z" fill="#67e8f9"/></g>';
  o+=P('M100 52 L92 78 L100 73 L108 78 Z','#ef4444',' stroke="#7f1d1d" stroke-width="1.6"')+P('M100 73 L94 80 L100 84 L106 80 Z','#fff',' stroke="#7f1d1d" stroke-width="1.2"');
  o+='<circle cx="100" cy="140" r="62" fill="url(#cxBrass)" stroke="#78350f" stroke-width="3"/><circle cx="100" cy="140" r="51" fill="url(#cxFace)" stroke="#92400e" stroke-width="2"/>';
  o+=S('M100 94 v8 M100 178 v8 M54 140 h8 M138 140 h8 M68 108 l5 5 M132 108 l-5 5 M68 172 l5 -5 M132 172 l-5 -5','#0e7490',2,' opacity=".7"');
  o+=S('M62 128 H138 M58 146 H142 M66 162 H134','#22d3ee',1,' opacity=".35"');
  var c={key:'bagdar',line:'#0e7490',brow:'#0e7490',skin:'#d9fbff'};
  var g='<g transform="translate(100 140) scale(.74) translate(-100 -122)">';
  if(e==='h')g+=S('M66 123 Q80 109 95 122','#083344',4.4)+'<g'+MIR+'>'+S('M66 123 Q80 109 95 122','#083344',4.4)+'</g>';
  else{var ey=eye(c,e,0);g+=ey+'<g'+MIR+'>'+ey+'</g>'}
  g+='</g>';o+=g;
  o+=e==='h'?P('M91 158 Q100 161 109 158 Q107 168 100 169 Q93 168 91 158 Z','#0e7490'):e==='s'?'<ellipse cx="100" cy="162" rx="4" ry="5" fill="#0e7490"/>':e==='w'?S('M91 162 q3 -3 6 0 t6 0 t6 0','#0e7490',2):S('M93 160 Q100 165 107 160','#0e7490',2.4);
  o+='<ellipse cx="76" cy="152" rx="7" ry="3" fill="#f472b6" opacity=".35"/><ellipse cx="124" cy="152" rx="7" ry="3" fill="#f472b6" opacity=".35"/>';
  o+='<path d="M64 112 Q76 96 96 92" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".55"/>';
  o+='<g fill="#a5f3fc"><path d="M30 90 l2 6 6 2 -6 2 -2 6 -2 -6 -6 -2 6 -2 Z"/><path d="M168 196 l1.6 5 5 1.6 -5 1.6 -1.6 5 -1.6 -5 -5 -1.6 5 -1.6 Z"/></g>';
  return o}

/* ---------- Тұман ---------- */
function tuman(e){var o='';
  o+='<g class="cx-drift" fill="#c4b5fd" opacity=".35"><ellipse cx="40" cy="240" rx="50" ry="18"/><ellipse cx="160" cy="236" rx="56" ry="20"/><ellipse cx="100" cy="254" rx="80" ry="16"/></g>';
  o+=P('M38 260 C34 184 42 112 64 72 C80 44 120 44 136 72 C158 112 166 184 162 260 Z','url(#cxHood)',' stroke="#1e0838" stroke-width="2.4"');
  o+=S('M64 72 C76 112 74 170 70 260 M136 72 C124 112 126 170 130 260','#1e0838',1.6,' opacity=".6"');
  o+=P('M70 98 C76 70 124 70 130 98 C136 132 126 168 100 178 C74 168 64 132 70 98 Z','#0b0618');
  var ey='';
  if(e==='h')ey=S('M76 120 Q86 112 96 120','#f0abfc',4.4)+'<g'+MIR+'>'+S('M76 120 Q86 112 96 120','#f0abfc',4.4)+'</g>'+P('M80 146 L88 152 L94 146 L100 153 L106 146 L112 152 L120 146 Q100 170 80 146 Z','#f0abfc',' opacity=".9"');
  else if(e==='s')ey='<circle cx="86" cy="120" r="7" fill="#f0abfc"/><circle cx="114" cy="120" r="7" fill="#f0abfc"/><circle cx="86" cy="120" r="2.5" fill="#fff"/><circle cx="114" cy="120" r="2.5" fill="#fff"/>';
  else if(e==='w')ey=P('M76 122 Q86 114 96 120 Q86 126 76 122 Z','#e9d5ff')+'<g'+MIR+'>'+P('M76 122 Q86 114 96 120 Q86 126 76 122 Z','#e9d5ff')+'</g>'+S('M90 150 q3 -3 6 0 t6 0 t6 0','#e9d5ff',2);
  else ey=P('M74 116 L98 124 Q86 130 76 124 Z','#f0abfc')+'<g'+MIR+'>'+P('M74 116 L98 124 Q86 130 76 124 Z','#f0abfc')+'</g>'+(e==='a'?P('M84 148 L116 148 Q110 162 100 162 Q90 162 84 148 Z','#f0abfc',' opacity=".85"'):'');
  o+='<g filter="url(#cxGlow)">'+ey+'</g>';
  o+='<g class="cx-drift2" fill="#ddd6fe" opacity=".22"><ellipse cx="60" cy="250" rx="60" ry="12"/><ellipse cx="150" cy="246" rx="64" ry="12"/></g>';
  return o}

function bust(k,e){e=e||'n';if(k==='bagdar')return bagdar(e);if(k==='tuman')return tuman(e);if(!CH[k])return '';return human(k,e)}

/* ---------- ортақ градиенттер ---------- */
function defs(){var g='';Object.keys(CH).forEach(function(k){var c=CH[k];if(!c.i1)return;g+='<linearGradient id="cxI_'+k+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="'+c.i1+'"/><stop offset=".55" stop-color="'+c.i2+'"/><stop offset="1" stop-color="#fde7c8"/></linearGradient>'});
  g+='<linearGradient id="cxI_bagdar" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#083344"/><stop offset=".6" stop-color="#06b6d4"/><stop offset="1" stop-color="#cffafe"/></linearGradient>';
  g+='<radialGradient id="cxHolo"><stop offset="0" stop-color="#67e8f9" stop-opacity=".55"/><stop offset=".6" stop-color="#22d3ee" stop-opacity=".18"/><stop offset="1" stop-color="#22d3ee" stop-opacity="0"/></radialGradient>';
  g+='<linearGradient id="cxBrass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fde68a"/><stop offset=".45" stop-color="#f59e0b"/><stop offset="1" stop-color="#92400e"/></linearGradient>';
  g+='<radialGradient id="cxFace" cx=".4" cy=".35"><stop offset="0" stop-color="#ffffff"/><stop offset=".7" stop-color="#cffafe"/><stop offset="1" stop-color="#a5f3fc"/></radialGradient>';
  g+='<linearGradient id="cxHood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#581c87"/><stop offset=".6" stop-color="#2e1065"/><stop offset="1" stop-color="#1e0838"/></linearGradient>';
  g+='<filter id="cxGlow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>';
  g+='<pattern id="cxDots" width="6" height="6" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r="1.1" fill="#000" opacity=".22"/></pattern>';
  return '<svg class="cx-defs" width="0" height="0" aria-hidden="true" focusable="false" style="position:absolute;width:0;height:0;overflow:hidden"><defs>'+g+'</defs></svg>'}

/* ---------- фондар (400×300) ---------- */
function sky(a,b,c){return '<defs><linearGradient id="SKY" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="'+a+'"/><stop offset=".6" stop-color="'+b+'"/><stop offset="1" stop-color="'+(c||b)+'"/></linearGradient></defs><rect width="400" height="300" fill="url(#SKY)"/>'}
function stars(n,seed){var s='',r=seed||7;for(var i=0;i<n;i++){r=(r*9301+49297)%233280;var x=r/233280*400;r=(r*9301+49297)%233280;var y=r/233280*170;r=(r*9301+49297)%233280;s+='<circle cx="'+x.toFixed(0)+'" cy="'+y.toFixed(0)+'" r="'+(0.6+r/233280*1.4).toFixed(1)+'" fill="#fff" opacity="'+(0.4+r/233280*.6).toFixed(2)+'"/>'}return s}
function skyline(col,y){y=y||230;return '<path d="M0 '+y+' h20 v-30 h18 v20 h14 v-46 h22 v40 h12 v-22 h16 v-60 h4 v-14 h6 v14 h4 v60 h14 v-28 h20 v36 h10 v-52 h24 v58 h12 v-34 h18 v20 h22 v-44 h20 v40 h16 v-26 h18 v30 h16 v-18 h22 v40 h20 V300 H0 Z" fill="'+col+'"/>'}
function bayterek(x,y,col,gold){return '<g transform="translate('+x+' '+y+')"><path d="M-4 0 L-3 -96 L3 -96 L4 0 Z" fill="'+col+'"/><path d="M-3 -96 C-22 -104 -26 -124 -14 -136 M3 -96 C22 -104 26 -124 14 -136 M0 -96 L0 -128" stroke="'+col+'" stroke-width="3" fill="none"/><circle cx="0" cy="-128" r="12" fill="'+gold+'"/><circle cx="-4" cy="-132" r="4" fill="#fff" opacity=".6"/></g>'}
function hills(col,y,amp){return '<path d="M0 '+y+' C60 '+(y-amp)+' 120 '+(y+amp*.4)+' 200 '+(y-amp*.6)+' S330 '+(y-amp)+' 400 '+(y-amp*.2)+' V300 H0 Z" fill="'+col+'"/>'}
function peaks(col,snow,y){y=y||210;return '<path d="M-10 '+y+' L60 '+(y-110)+' L100 '+(y-70)+' L150 '+(y-140)+' L210 '+(y-60)+' L260 '+(y-120)+' L320 '+(y-50)+' L360 '+(y-96)+' L420 '+(y-30)+' V300 H-10 Z" fill="'+col+'"/>'+(snow?'<path d="M60 '+(y-110)+' L44 '+(y-86)+' L58 '+(y-90)+' L66 '+(y-80)+' L76 '+(y-92)+' Z M150 '+(y-140)+' L130 '+(y-108)+' L146 '+(y-112)+' L156 '+(y-100)+' L168 '+(y-114)+' Z M260 '+(y-120)+' L244 '+(y-96)+' L258 '+(y-100)+' L266 '+(y-90)+' L276 '+(y-102)+' Z" fill="'+snow+'"/>':'')}
function cloud(x,y,s,c){return '<g transform="translate('+x+' '+y+') scale('+s+')" fill="'+(c||'#fff')+'"><ellipse cx="0" cy="0" rx="30" ry="14"/><ellipse cx="-20" cy="4" rx="18" ry="10"/><ellipse cx="22" cy="5" rx="20" ry="10"/><ellipse cx="4" cy="-9" rx="16" ry="12"/></g>'}
function grid(col,op){var s='';for(var x=0;x<=400;x+=40)s+='<path d="M'+x+' 0 V300" stroke="'+col+'" stroke-width="1" opacity="'+op+'"/>';for(var y=0;y<=300;y+=40)s+='<path d="M0 '+y+' H400" stroke="'+col+'" stroke-width="1" opacity="'+op+'"/>';return s}
function fogBand(y,op){return '<g class="cx-drift" fill="#a78bfa" opacity="'+(op||.35)+'"><ellipse cx="60" cy="'+y+'" rx="120" ry="26"/><ellipse cx="250" cy="'+(y+8)+'" rx="150" ry="30"/><ellipse cx="400" cy="'+(y-6)+'" rx="110" ry="24"/></g>'}
var BG={
 'room-night':function(){return sky('#1e1b4b','#312e81')+'<rect x="230" y="30" width="140" height="130" rx="6" fill="#0b1026" stroke="#a5b4fc" stroke-width="5"/>'+'<g>'+stars(18,3).replace(/cx="(\d+)"/g,function(m,x){return 'cx="'+(232+(+x)%136)+'"'}).replace(/cy="(\d+)"/g,function(m,y){return 'cy="'+(34+(+y)%60)+'"'})+'</g>'+bayterek(300,156,'#4338ca','#fbbf24')+skyline('#312e81',160).replace('M0 160','M232 160').replace(/h22 v40 h20 V300 H0 Z/,'V158 Z')+'<path d="M300 30 V160 M230 95 H370" stroke="#a5b4fc" stroke-width="3"/>'
   +'<rect x="0" y="210" width="400" height="90" fill="#4c1d95"/><rect x="0" y="206" width="400" height="8" fill="#6d28d9"/><path d="M40 206 l26 -60 l10 4 l-20 56 Z" fill="#fbbf24"/><ellipse cx="62" cy="150" rx="22" ry="10" fill="#fde68a" opacity=".85"/><path d="M0 206 L130 120 L170 206 Z" fill="#fde68a" opacity=".12"/>'
   +'<rect x="20" y="40" width="70" height="120" fill="#3730a3"/><rect x="26" y="50" width="10" height="34" fill="#f472b6"/><rect x="38" y="46" width="12" height="38" fill="#38bdf8"/><rect x="52" y="54" width="9" height="30" fill="#fbbf24"/><rect x="64" y="48" width="14" height="36" fill="#34d399"/><rect x="26" y="96" width="14" height="34" fill="#60a5fa"/><rect x="42" y="100" width="10" height="30" fill="#f87171"/><path d="M20 86 H90 M20 132 H90" stroke="#1e1b4b" stroke-width="3"/>'},
 'astana-night':function(){return sky('#0f0a2e','#3b1d6e','#6d28d9')+stars(40,11)+'<circle cx="330" cy="54" r="22" fill="#fef3c7"/><circle cx="322" cy="48" r="20" fill="#3b1d6e" opacity=".35"/>'
   +'<path d="M40 232 C70 140 120 140 150 232 Z" fill="#4c1d95" opacity=".9"/>'+skyline('#1e1047',240)+bayterek(210,240,'#120a33','#fbbf24')+'<path d="M90 240 L130 150 L170 240 Z" fill="#1e1047"/>'+fogBand(250,.45)+'<rect y="262" width="400" height="38" fill="#120a33"/>'},
 'city-day':function(){return sky('#7dd3fc','#bae6fd','#e0f2fe')+cloud(80,60,1,'#fff')+cloud(300,44,.8,'#fff')+skyline('#60a5fa',240)+bayterek(210,240,'#3b82f6','#fbbf24')+'<rect y="250" width="400" height="50" fill="#94a3b8"/><path d="M0 268 H400" stroke="#fff" stroke-width="3" stroke-dasharray="20 14"/>'},
 'class':function(){return '<rect width="400" height="300" fill="#fef3c7"/><rect x="0" y="230" width="400" height="70" fill="#d6a06a"/><rect x="40" y="40" width="230" height="130" rx="4" fill="#14532d" stroke="#92400e" stroke-width="8"/>'
   +S('M60 70 h60 M60 92 q20 -14 40 0 t40 0 M60 120 l30 -16 l30 16 l30 -16 M180 70 a20 20 0 1 0 40 0 a20 20 0 1 0 -40 0 M200 50 v40 M180 70 h40','#ecfdf5',2.2,' opacity=".8"')
   +'<rect x="300" y="40" width="80" height="120" fill="#bae6fd" stroke="#fff" stroke-width="6"/><path d="M340 40 V160 M300 100 H380" stroke="#fff" stroke-width="4"/><rect x="60" y="246" width="120" height="14" fill="#92400e"/><rect x="230" y="246" width="120" height="14" fill="#92400e"/>'},
 'map':function(){var s='<rect width="400" height="300" fill="#f5e6c4"/>'+grid('#b45309',.25)+'<path d="M40 120 C70 80 130 90 150 130 C170 170 120 210 90 200 C60 190 20 160 40 120 Z" fill="#a3c585" stroke="#6b8e4e" stroke-width="2"/><path d="M220 60 C270 40 350 70 360 120 C370 170 320 180 290 160 C260 140 200 100 220 60 Z" fill="#c9b37a" stroke="#8b7340" stroke-width="2"/><path d="M200 200 C230 180 280 200 280 230 C280 260 230 270 210 250 C190 235 185 210 200 200 Z" fill="#a3c585" stroke="#6b8e4e" stroke-width="2"/>';
   s+='<g transform="translate(330 240)"><circle r="26" fill="#fff7e0" stroke="#92400e" stroke-width="2"/><path d="M0 -24 L6 0 L0 24 L-6 0 Z" fill="#dc2626"/><path d="M-24 0 L0 6 L24 0 L0 -6 Z" fill="#92400e"/></g>';return s+'<path d="M0 0 H400 V300 H0 Z" fill="none" stroke="#92400e" stroke-width="10" opacity=".4"/>'},
 'grid':function(){return sky('#020617','#0c4a6e','#155e75')+grid('#22d3ee',.35)+'<g fill="none" stroke="#67e8f9" stroke-width="2" opacity=".8"><ellipse cx="200" cy="160" rx="120" ry="120"/><ellipse cx="200" cy="160" rx="60" ry="120"/><path d="M80 160 H320 M96 100 H304 M96 220 H304"/></g>'+stars(20,5)},
 'core':function(){return '<rect width="400" height="300" fill="#1c0a00"/><g transform="translate(200 320)"><circle r="300" fill="#92400e"/><circle r="270" fill="#ea580c"/><circle r="200" fill="#f97316"/><circle r="140" fill="#fbbf24"/><circle r="80" fill="#fef9c3"/></g><path d="M0 40 C80 30 160 50 240 36 S360 30 400 44 V0 H0 Z" fill="#78350f"/>'+S('M30 60 q20 30 0 60 M370 70 q-20 30 0 60','#fde68a',2,' opacity=".5"')},
 'sky':function(){return sky('#0b1026','#1d4ed8','#7dd3fc')+stars(16,9)+'<rect y="60" width="400" height="14" fill="#a78bfa" opacity=".25"/><rect y="96" width="400" height="6" fill="#f0abfc" opacity=".35"/>'+cloud(70,220,1.3)+cloud(300,240,1.1)+cloud(200,270,1.6)+'<g transform="translate(300 150)"><ellipse rx="26" ry="30" fill="#f43f5e"/><path d="M-26 0 Q0 40 26 0" fill="#e11d48"/><path d="M-10 28 L-8 46 M10 28 L8 46" stroke="#78350f" stroke-width="2"/><rect x="-10" y="46" width="20" height="12" fill="#92400e"/></g>'},
 'ocean':function(){return sky('#38bdf8','#0ea5e9','#0369a1')+'<rect y="96" width="400" height="204" fill="#0c4a6e"/><path d="M0 96 q25 -8 50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 V110 H0 Z" fill="#7dd3fc"/>'
   +'<g fill="#e0f2fe" opacity=".18"><path d="M60 110 L30 300 H70 Z"/><path d="M200 110 L170 300 H230 Z"/><path d="M330 110 L310 300 H350 Z"/></g><g fill="#0369a1"><path d="M90 200 q14 -10 28 0 q-14 10 -28 0 l-8 -6 v12 Z"/><path d="M260 240 q14 -10 28 0 q-14 10 -28 0 l-8 -6 v12 Z"/></g>'},
 'deep':function(){return sky('#082f49','#020617')+'<path d="M0 300 L0 200 C60 180 120 240 160 300 Z M400 300 L400 180 C340 170 270 240 250 300 Z" fill="#000814"/>'+'<g fill="#67e8f9">'+[[60,90],[120,150],[300,80],[340,140],[220,60],[180,200],[90,240]].map(function(p){return '<circle cx="'+p[0]+'" cy="'+p[1]+'" r="2.4" opacity=".8"/>'}).join('')+'</g>'},
 'forest':function(){var s=sky('#bbf7d0','#86efac','#4ade80');for(var i=0;i<12;i++){var x=i*36+(i%2?10:0),h=110+(i%3)*30;s+='<path d="M'+x+' 260 L'+(x+22)+' '+(260-h)+' L'+(x+44)+' 260 Z" fill="'+(i%2?'#166534':'#15803d')+'"/>'}return s+'<rect y="256" width="400" height="44" fill="#14532d"/>'},
 'steppe':function(){return sky('#fb923c','#fde68a','#fef3c7')+'<circle cx="300" cy="150" r="40" fill="#fff7ed" opacity=".9"/>'+hills('#d97706',200,20)+hills('#eab308',230,14)+'<g fill="#78350f">'+[[80,224],[110,228],[140,222]].map(function(p){return '<path d="M'+p[0]+' '+p[1]+' q8 -8 18 -2 l6 -8 l2 8 q4 6 -2 10 h-22 Z"/>'}).join('')+'</g>'+S('M0 260 q40 -6 80 0 t80 0 t80 0 t80 0 t80 0','#a16207',2,' opacity=".5"')},
 'mount':function(){return sky('#60a5fa','#bfdbfe','#eff6ff')+cloud(320,60,.9)+peaks('#475569','#f8fafc',220)+hills('#16a34a',250,16)+'<rect y="270" width="400" height="30" fill="#15803d"/>'},
 'desert':function(){return sky('#f59e0b','#fde68a')+'<circle cx="320" cy="70" r="28" fill="#fff7ed"/>'+hills('#f59e0b',210,30)+hills('#d97706',240,20)+hills('#b45309',272,12)},
 'volcano':function(){return sky('#450a0a','#b91c1c','#f97316')+'<path d="M60 300 L170 120 L230 120 L340 300 Z" fill="#292524"/><path d="M170 120 L230 120 L222 136 L212 128 L200 142 L188 128 L178 136 Z" fill="#f97316"/><path d="M196 140 Q180 210 160 300 M208 140 Q226 220 250 300" stroke="#fb923c" stroke-width="6" fill="none"/><g fill="#78716c" opacity=".85"><circle cx="200" cy="90" r="26"/><circle cx="176" cy="60" r="20"/><circle cx="226" cy="54" r="24"/><circle cx="204" cy="26" r="20"/></g><g fill="#fbbf24"><circle cx="150" cy="80" r="4"/><circle cx="260" cy="96" r="3"/><circle cx="240" cy="40" r="3"/></g>'},
 'pangea':function(){return sky('#020617','#0b1026')+stars(40,13)+'<circle cx="200" cy="160" r="120" fill="#1d4ed8"/><path d="M130 90 C170 70 230 80 250 110 C270 140 300 150 290 190 C280 230 230 240 200 220 C170 200 120 210 110 170 C100 140 100 110 130 90 Z" fill="#65a30d" stroke="#3f6212" stroke-width="2"/><path d="M196 120 C210 150 200 180 220 205" stroke="#ea580c" stroke-width="3" stroke-dasharray="6 5" fill="none"/><circle cx="160" cy="110" r="120" fill="none" stroke="#93c5fd" stroke-width="3" opacity=".3"/>'},
 'space':function(){return sky('#000','#0b1026','#1e1b4b')+stars(70,21)+'<circle cx="300" cy="260" r="150" fill="#1d4ed8"/><path d="M190 200 C230 170 290 190 300 230 C310 270 250 290 220 270 Z M330 150 C360 140 400 170 400 200 V250 C370 230 340 200 330 150 Z" fill="#16a34a"/><circle cx="300" cy="260" r="150" fill="none" stroke="#7dd3fc" stroke-width="6" opacity=".4"/>'},
 'wind':function(){return sky('#1e3a8a','#3b82f6','#93c5fd')+S('M-10 80 C80 40 160 120 260 70 S380 60 420 90 M-10 150 C90 110 170 190 270 140 S380 130 420 160 M-10 220 C90 180 170 260 270 210 S380 200 420 230','#e0f2fe',5,' opacity=".55"')+cloud(90,250,1.2,'#e0f2fe')+cloud(320,40,.9,'#e0f2fe')},
 'crowd':function(){var s=sky('#fdba74','#fed7aa','#ffedd5')+skyline('#fb923c',200);for(var i=0;i<22;i++){var x=i*19,h=24+(i%4)*6,c=['#7c2d12','#9a3412','#c2410c','#431407'][i%4];s+='<circle cx="'+(x+9)+'" cy="'+(272-h-8)+'" r="7" fill="'+c+'"/><rect x="'+(x+2)+'" y="'+(272-h)+'" width="14" height="'+(h+28)+'" rx="6" fill="'+c+'"/>'}return s},
 'factory':function(){return sky('#94a3b8','#cbd5e1','#e2e8f0')+'<g fill="#64748b" opacity=".7"><circle cx="90" cy="60" r="20"/><circle cx="116" cy="44" r="16"/><circle cx="250" cy="50" r="22"/></g><rect x="80" y="80" width="20" height="120" fill="#475569"/><rect x="240" y="70" width="22" height="130" fill="#475569"/><path d="M0 300 V180 L60 150 V180 L120 150 V180 L180 150 V180 L240 150 V180 L300 150 V180 L360 150 V180 L400 160 V300 Z" fill="#334155"/><rect y="250" width="400" height="50" fill="#1e293b"/><g fill="#fbbf24"><rect x="40" y="200" width="16" height="12"/><rect x="150" y="200" width="16" height="12"/><rect x="270" y="200" width="16" height="12"/></g>'},
 'port':function(){return sky('#38bdf8','#7dd3fc','#bae6fd')+'<rect y="200" width="400" height="100" fill="#0369a1"/><path d="M60 200 L80 240 H320 L340 200 Z" fill="#1e293b"/>'+[['#ef4444',90],['#f59e0b',130],['#22c55e',170],['#3b82f6',210],['#a855f7',250],['#ef4444',290]].map(function(c){return '<rect x="'+c[1]+'" y="176" width="36" height="24" fill="'+c[0]+'" stroke="#0f172a" stroke-width="1.5"/>'}).join('')+'<rect x="110" y="152" width="36" height="24" fill="#f59e0b" stroke="#0f172a" stroke-width="1.5"/><rect x="230" y="152" width="36" height="24" fill="#3b82f6" stroke="#0f172a" stroke-width="1.5"/><path d="M350 200 V60 H390 M350 70 L300 150" stroke="#f97316" stroke-width="6" fill="none"/>'},
 'caspian':function(){return sky('#fde68a','#fdba74','#fb923c')+'<rect y="170" width="400" height="130" fill="#0e7490"/><path d="M0 170 q30 -6 60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 V180 H0 Z" fill="#67e8f9" opacity=".6"/><g transform="translate(250 170)"><rect x="-40" y="-40" width="80" height="14" fill="#334155"/><path d="M-34 -26 V40 M34 -26 V40 M-34 10 L34 -20 M34 10 L-34 -20" stroke="#475569" stroke-width="4"/><path d="M10 -40 L16 -110 L22 -40 Z" fill="#64748b"/><path d="M16 -110 q8 -14 0 -24 q-8 10 0 24" fill="#f97316"/></g>'},
 'aral':function(){return sky('#fde68a','#fef3c7')+'<rect y="170" width="400" height="130" fill="#e7c98f"/>'+S('M0 200 q50 -10 100 0 t100 0 t100 0 t100 0 M0 240 q50 -10 100 0 t100 0 t100 0 t100 0','#c9a465',2,' opacity=".6"')+'<path d="M300 172 h90 q-10 6 -14 0 Z" fill="#38bdf8" opacity=".7"/><g transform="translate(150 230) rotate(-6)"><path d="M-70 0 L70 0 L50 26 L-50 26 Z" fill="#7c2d12" stroke="#431407" stroke-width="2"/><rect x="-30" y="-24" width="40" height="24" fill="#a16207"/><rect x="4" y="-40" width="8" height="18" fill="#57534e"/></g><g stroke="#a8a29e" stroke-width="2" fill="none" opacity=".7"><path d="M60 280 l20 -6 M300 270 l18 -8 M240 290 l24 -4"/></g>'},
 'canyon':function(){return sky('#38bdf8','#bae6fd')+'<path d="M0 300 V120 L40 110 L60 150 L90 130 L120 170 L150 160 L170 300 Z" fill="#c2410c"/><path d="M400 300 V100 L360 120 L340 150 L310 140 L280 180 L250 170 L230 300 Z" fill="#9a3412"/><path d="M170 300 L190 230 L210 230 L230 300 Z" fill="#7dd3fc"/>'+S('M10 180 h60 M20 220 h80 M330 170 h60 M300 220 h80','#7c2d12',3,' opacity=".5"')},
 'lake':function(){var s=sky('#93c5fd','#dbeafe')+peaks('#334155','#f8fafc',170)+'<rect y="190" width="400" height="110" fill="#0e7490"/><rect y="190" width="400" height="20" fill="#22d3ee" opacity=".4"/>';for(var i=0;i<9;i++){var x=i*48-10;s+='<path d="M'+x+' 196 L'+(x+16)+' 120 L'+(x+32)+' 196 Z" fill="#14532d"/>'}return s},
 'launch':function(){return sky('#0b1026','#1e3a8a','#f97316')+stars(24,17)+'<path d="M196 190 L200 60 L204 190 Z" fill="#e2e8f0"/><path d="M188 200 L200 70 L212 200 Z" fill="#f8fafc" stroke="#94a3b8" stroke-width="2"/><path d="M188 200 L180 222 L196 210 Z M212 200 L220 222 L204 210 Z" fill="#dc2626"/><path d="M192 214 Q200 290 208 214 Z" fill="#fbbf24"/><g fill="#e5e7eb" opacity=".8"><circle cx="160" cy="270" r="30"/><circle cx="240" cy="270" r="34"/><circle cx="200" cy="290" r="30"/></g>'},
 'hall':function(){var s='<rect width="400" height="300" fill="#1e3a8a"/><path d="M0 0 H400 V40 Q200 90 0 40 Z" fill="#172554"/><rect y="220" width="400" height="80" fill="#0f172a"/><ellipse cx="200" cy="130" rx="60" ry="60" fill="#3b82f6" opacity=".35"/><circle cx="200" cy="130" r="40" fill="none" stroke="#bfdbfe" stroke-width="3"/><path d="M160 130 H240 M200 90 V170" stroke="#bfdbfe" stroke-width="2"/>';
   var fl=['#ef4444','#22c55e','#3b82f6','#f59e0b','#06b6d4','#a855f7','#f97316','#14b8a6'];for(var i=0;i<8;i++){var x=20+i*48;s+='<path d="M'+x+' 220 V150" stroke="#cbd5e1" stroke-width="2"/><rect x="'+x+'" y="150" width="28" height="18" fill="'+fl[i]+'"/>'}return s},
 'fog':function(){return sky('#1e0838','#4c1d95','#7c3aed')+fogBand(80,.4)+fogBand(160,.5)+fogBand(240,.6)},
 'portal':function(){return '<rect width="400" height="300" fill="#0b1026"/><g transform="translate(200 150)">'+[130,105,80,58,38].map(function(r,i){return '<ellipse rx="'+r+'" ry="'+(r*.72)+'" fill="none" stroke="'+['#22d3ee','#a78bfa','#f0abfc','#67e8f9','#fff'][i]+'" stroke-width="'+(8-i)+'" opacity=".85"/>'}).join('')+'<ellipse rx="26" ry="18" fill="#fff"/></g>'+stars(30,29)},
 'exam':function(){var s='<rect width="400" height="300" fill="#e0f2fe"/><rect y="210" width="400" height="90" fill="#cbd5e1"/>';for(var r=0;r<2;r++)for(var i=0;i<5;i++){var x=20+i*78,y=150+r*60;s+='<rect x="'+x+'" y="'+y+'" width="58" height="36" rx="4" fill="#1e293b"/><rect x="'+(x+4)+'" y="'+(y+4)+'" width="50" height="26" fill="#38bdf8"/><rect x="'+(x+24)+'" y="'+(y+36)+'" width="10" height="10" fill="#475569"/>'}return s+'<rect x="120" y="30" width="160" height="60" rx="8" fill="#064b84"/><path d="M150 60 h100" stroke="#fff" stroke-width="6"/>'},
 'sunrise':function(){return sky('#7c3aed','#f472b6','#fde68a')+'<circle cx="200" cy="210" r="70" fill="#fff7ed"/><circle cx="200" cy="210" r="90" fill="#fde68a" opacity=".35"/>'+hills('#7c2d12',220,18)+hills('#9a3412',250,10)+S('M200 110 V80 M140 130 l-18 -22 M260 130 l18 -22 M110 180 l-26 -8 M290 180 l26 -8','#fff7ed',4,' opacity=".8"')},
 'ice':function(){return sky('#e0f2fe','#bae6fd','#7dd3fc')+'<path d="M0 220 L60 160 L110 200 L170 130 L240 190 L300 140 L400 210 V300 H0 Z" fill="#f8fafc" stroke="#93c5fd" stroke-width="2"/><rect y="250" width="400" height="50" fill="#0ea5e9"/>'},
 'field':function(){var s=sky('#93c5fd','#e0f2fe')+'<rect y="180" width="400" height="120" fill="#eab308"/>';for(var i=0;i<14;i++)s+='<path d="M'+(i*30)+' 300 L'+(i*30+40)+' 180" stroke="#ca8a04" stroke-width="3" opacity=".6"/>';return s+'<g transform="translate(300 190)"><rect x="-30" y="-30" width="50" height="30" fill="#dc2626"/><circle cx="-20" cy="4" r="12" fill="#111"/><circle cx="14" cy="6" r="8" fill="#111"/></g>'},
 'globe':function(){return sky('#0c4a6e','#0e7490','#164e63')+stars(20,31)+'<circle cx="200" cy="150" r="110" fill="#0ea5e9" stroke="#e0f2fe" stroke-width="4"/><path d="M130 90 C160 70 200 90 196 120 C192 150 150 150 140 130 Z M220 150 C260 130 300 160 290 200 C280 230 240 230 230 200 Z M150 190 C170 180 190 200 180 220 C170 240 140 230 150 190 Z" fill="#22c55e"/><ellipse cx="200" cy="150" rx="110" ry="40" fill="none" stroke="#fff" stroke-width="2" opacity=".5"/><ellipse cx="200" cy="150" rx="40" ry="110" fill="none" stroke="#fff" stroke-width="2" opacity=".5"/>'}
};
function bg(n){var f=BG[n]||BG['map'];var s=f();return s.replace(/id="SKY"/g,'id="SKY_'+n+'"').replace(/url\(#SKY\)/g,'url(#SKY_'+n+')')}

/* ---------- эффектілер ---------- */
function fx(n){var s='';
  if(n==='speed'){var r=11;for(var i=0;i<54;i++){r=(r*9301+49297)%233280;var a=i/54*Math.PI*2+r/233280*.08,R1=150+r/233280*40,w=.012+r/233280*.02;
     s+='<path d="M'+(200+Math.cos(a)*420).toFixed(0)+' '+(150+Math.sin(a)*420).toFixed(0)+' L'+(200+Math.cos(a-w)*R1).toFixed(0)+' '+(150+Math.sin(a-w)*R1).toFixed(0)+' L'+(200+Math.cos(a+w)*R1).toFixed(0)+' '+(150+Math.sin(a+w)*R1).toFixed(0)+' Z" fill="#111" opacity=".75"/>'}}
  else if(n==='lines'){for(var j=0;j<16;j++){var y=12+j*18;s+='<path d="M'+(j%3*40)+' '+y+' H'+(260+j%4*30)+'" stroke="#fff" stroke-width="'+(1+j%3)+'" opacity=".7"/>'}}
  else if(n==='spark'){[[60,60,1],[340,80,.8],[300,220,1.2],[90,230,.7],[200,40,.6]].forEach(function(p){s+='<path transform="translate('+p[0]+' '+p[1]+') scale('+p[2]+')" d="M0 -16 L4 -4 L16 0 L4 4 L0 16 L-4 4 L-16 0 L-4 -4 Z" fill="#fff" opacity=".95"/>'})}
  else if(n==='glow')s='<radialGradient id="FXG"><stop offset="0" stop-color="#fff" stop-opacity=".85"/><stop offset=".5" stop-color="#a5f3fc" stop-opacity=".35"/><stop offset="1" stop-color="#a5f3fc" stop-opacity="0"/></radialGradient><rect width="400" height="300" fill="url(#FXG)"/>';
  else if(n==='fog')s=fogBand(260,.55)+fogBand(30,.3);
  else if(n==='flash')s='<path d="M200 150 L230 20 L240 120 L330 30 L270 140 L390 120 L280 170 L380 260 L250 190 L240 290 L200 200 L150 290 L160 190 L20 250 L130 160 L10 110 L150 130 L80 20 L180 110 Z" fill="#fff" opacity=".85"/>';
  else if(n==='tone')s='<rect width="400" height="300" fill="url(#cxDots)"/>';
  return s}

window.CXART={bust:bust,bg:bg,fx:fx,defs:defs,names:function(k){return CH[k]?CH[k].n:k},list:Object.keys(CH),bgs:Object.keys(BG)};
})();
