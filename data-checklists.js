/* КӨКЖИЕК: чеклисттер (Google Drive папкасындағы файлдар) және мектеп атластарының каталогы.
   Чеклист: [Drive файл id, атауы, топ id, түрі ('pdf' немесе 'docx')]. Файлдар сайтқа көшірілмейді:
   мұқабасы мен қарау терезесі Drive арқылы ашылады. Жаңа чеклист қосу үшін файлды папкаға салып,
   «Кім көре алады: сілтемесі бар кез келген адам» деп қойып, id-сін осы тізімге қос. */
window.CHECKLISTS = {
folder: 'https://drive.google.com/drive/folders/1_3ODeS4Fc4aHlj3ue6Rpl0-UV5II9xaZ',
groups: [
  ['karto','Картография және ГАЖ','🗺'],['lito','Литосфера және жер бедері','⛰'],['atmo','Атмосфера және климат','☁'],
  ['hydro','Гидросфера','🌊'],['res','Пайдалы қазбалар және өнеркәсіп','🏭'],['eco','Табиғатты пайдалану және экология','♻'],
  ['pop','Халық және елтану','👥'],['pol','Саяси және экономикалық география','🌍'],['nom','Номенклатура, топонимика, ғалымдар','📍'],
  ['gen','Жалпы чеклисттер және жоспар','🗓']
],
items: [
 ['1ygU_JFoqLL79__G6Hd5roRS6vWyEVdJ-','Картаға түсіру тәсілдері, ГАЖ және жер бедері','karto'],
 ['1svvMO1ptebWoMz2pT7oBIcdqoxbzEjap','Геоинформатика','karto'],
 ['1rOgxTtO-maptF94tXgbrI54AF7VtHQCQ','Картография және геоинформатика','karto'],
 ['1SB6xUWg1tgm8muTEUbUd5VqBSC69BVYc','Геохронологиялық кесте','lito'],
 ['1xYHfnN2GaRZpNv83Ryx1cTjRenBQ5jwO','Геохронология','lito'],
 ['1NzLB30HMf15OJAPhdRj5y-u7WdhqsjVi','Тау жыныстары','lito'],
 ['19UIlYVA4Hw90B-nxjLl5uSNjHWo-ZpHB','Литосфералық тақталар','lito'],
 ['1wcitObBINKr4YOKlsa0Y_rlQOa9cCgl9','Қазақстанның жер бедері','lito'],
 ['1noq7toPzs-WgrrbbzXJqqeGrbQx5gne7','Атмосфера','atmo'],
 ['1Fd7KLZoQgSFHylCBZ-rAhJjza-4IjwzZ','Климаттық белдеулер (1-нұсқа)','atmo'],
 ['1vFwU2D9nVdEnqtyzYONTnSS3DU6DvmTL','Климаттық белдеулер (2-нұсқа)','atmo'],
 ['1IfGC-eR4SnCQkEke5T7y5z-CBGsNffsV','Қазақстан желдері және қолайсыз құбылыстар','atmo'],
 ['1RkFo1LuLP6xLc-7anvxcctAwcLkVBSpV','Дүниежүзілік мұхит түбінің құрылысы','hydro'],
 ['1IU0oIaGVYGIJ1jbE9WtdSftwIQ3L5R2M','Гидросфера нысандарының карталары','hydro'],
 ['1EHj23Vp0-y9bmoowKzPX3V6chDPAxI9Z','Гидросфера: Қазақстанның ішкі сулары','hydro'],
 ['1td7k_PcRIOrHtTbF1hZl_bv2KTsinc3p','Қазақстанның ішкі сулары','hydro'],
 ['1SrQ_MobwSUTdiLF6sCp1AW3HU777L8oj','Өзендер','hydro'],
 ['1NC7tWo2R2QOXwd6fsUFNxE9CZVgk5Cem','Қазақстан өзендері (OGE)','hydro'],
 ['1u_8Xp0eODBQDXYx1gm9kebmPjYeEx_0h','Пайдалы қазбалар (1-нұсқа)','res'],
 ['1cVig4IJiY1PyQeFOZIBPtt0I7y-iMz-A','Пайдалы қазбалар (2-нұсқа)','res'],
 ['1tLOSJej9g-ncjnC8gXFSM_BZqJr3hhmF','Пайдалы қазбалар (3-нұсқа)','res'],
 ['1znB3jwYrcrFThUxq_WDaz9BVgV9bJV0O','Кен орындары','res'],
 ['1sgeD90A7w-7BnrV1k3wVt3DWvp23ZzYK','Кен орындары мен зауыттар (1-нұсқа)','res'],
 ['1r45IOf-os1fHBRuP8cTQR3bK1kxYQjCw','Кен орындары мен зауыттар (2-нұсқа)','res'],
 ['1DmuJiKwIhdU91yOucEpOQR3VrFQiYrIA','Машина жасау және химия кешені зауыттары','res'],
 ['19bsMZPCPnaYqjpwb5ua8FEMpKXjndqYc','Көлік түрлері','res'],
 ['1IwFCnLbLK9ZcJpvfkMb-R6OTysng6uKY','Табиғатты пайдалану түрлері','eco'],
 ['1a9DauTL7euQ0Ka8rpfYz4npwHRmXEd_t','Мелиорация, рекультивация, ландшафт дизайны','eco'],
 ['1_S5GWxy2prkrKK8B_6a0KhOFqxewS0UH','ЕҚАА','eco'],
 ['11Dn2r0nCXrfajwWn_2IuqnOrNaVmWGyW','Демография','pop'],
 ['1vQ5gJSj69xtVUYSqyatViNKhD1sWmv4V','Елтану: 7-сынып','pop'],
 ['1Di31rPWtaQvPdxHy21Py6YmU03QXnE_z','Елтану: 8-сынып','pop'],
 ['1oORg07mh1G9VBTc-MQDxO8t5w50OdrwW','Геосаясат (1-нұсқа)','pol'],
 ['1JIGgL-Rh_pu4wtzqzYbdTggy4H3k-00d','Геосаясат (2-нұсқа)','pol'],
 ['157yPH784xZax44Y3l00VP5m_UlqzTrhZ','Геосаясат: мемлекеттік шекара','pol'],
 ['1msWEcTXBh5BYt-nUiQPSnT-NHL5U6KrB','Елдердің саяси типологиясы','pol'],
 ['1npncgNrs44uvgFNQztd8Tls16McYvU9C','Елдердің даму деңгейі бойынша (Береке апай)','pol'],
 ['1aBFEmBJVR5vcsRwMum2Utptj2tQdIRz4','Дүниежүзі елдерінің экономикалық даму деңгейі','pol','docx'],
 ['1go9troHVePLaHYiqKrHBFn3u11t4OBCi','Ұйымдар','pol'],
 ['14quJD1ojuClJt80xHxPvf1kmuZ_V9sHd','Номенклатура','nom'],
 ['1RrlgV9ehlnkBOMnJydjjYll0i5XKnMbO','Топонимика','nom'],
 ['1w9HvM_Zyw4KgSCSdRSUubJ4vSi_qCbSE','Зерттеушілер және топонимика','nom'],
 ['1zf6BSO13qnltI5v_UJoxFmxA4isThUYL','Ғалымдар','nom'],
 ['1hnfBz0uqWd9f8Y5okEyAStmULpD70OYA','Чек-лист: 3 ай — 4 апта','gen'],
 ['1rRrHklULi1ngy8AHc8-BhS2smnM_ti7M','Географ кітапшасы','gen'],
 ['12kJznLAO9ECSsuTw35gHEkmdJQGkIFlE','География чеклисті (Нұрхан ағай)','gen'],
 ['198o5zkO7r9o9R70Jh5bXWNNmPpqH0r3o','Жалпы чеклист (1)','gen'],
 ['1iAF2yNyfV1aIW66awsmxX9sYmMHsK3QT','Жалпы чеклист (2)','gen']
]
};

/* Мектеп атластары: мұғалім берген PDF файлдар Google Drive-та сақталады (сайтқа көшірілмейді).
   drive — Drive файл id-сі («Сілтемесі бар кез келген адам» деп ашық болуы керек). Бос болса, батырма «Жақында ашылады» деп тұрады.
   cover — мұқабаның шағын суреті (img/ ішінде). */
window.ATLASES = {
folder: 'https://drive.google.com/drive/folders/1El-trvD83MGhZCSBc1j0QO9wyWkILHhq',
books: [
 {g:7,lang:'ru',title:'Атлас. География. 7 класс',author:'С. В. Кругликова',year:2020,pages:48,pub:'8&8, Алматы',cover:'img/atlas-7.jpg',drive:'1XBz52lPdPSY0o6-JTvpfJkUrmLArUelv',
  note:'Физикалық география негіздері: зерттеулер тарихы, карта түрлері, литосфера, атмосфера, гидросфера, биосфера, табиғат зоналары.'},
 {g:8,lang:'ru',title:'Атлас. География. 8 класс',author:'С. В. Кругликова',year:2019,pages:52,pub:'8&8, Алматы',cover:'img/atlas-8.jpg',drive:'14TMrg2QQ_yEE-CFwaxwCsjviq44Hlz3f',
  note:'Құрлықтар мен мұхиттардың физикалық географиясы, климат, табиғат зоналары, халық пен шаруашылық, елтану.'},
 {g:9,lang:'kk',title:'Атлас. Қазақстан географиясы. 9 сынып',author:'С. В. Кругликова',year:2020,pages:44,pub:'8&8, Алматы',cover:'img/atlas-9.jpg',drive:'1xmqcHASOFXZFb9U2b5zw-V3QMsSrSTSx',
  note:'Қазақстанның физикалық және экономикалық географиясы: жер бедері, пайдалы қазбалар, климат, ішкі сулар, халқы, өнеркәсібі.'}
]
};
