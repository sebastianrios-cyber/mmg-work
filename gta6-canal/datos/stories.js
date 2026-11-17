// 10 historias con datos de GTA 6, estilo motion graphics (fondo cuadrícula oscura, cifras en amarillo).
// *texto* = resaltado en amarillo. Datos públicos al 17 nov 2026.
export const STORIES = [
{ slug:'13-anos', title:'13 años esperando GTA 6: la historia completa', tag:'LA ESPERA', scenes:[
 {t:'title', pill:'LA HISTORIA DE UNA ESPERA', big:'*13* AÑOS', sub:'esperando un juego', cap:'Esta es la historia de la espera más larga de los videojuegos.'},
 {t:'timeline', pill:'2013', pts:[['2013','GTA 5'],['2018','RDR 2'],['2023','Tráiler 1'],['2026','GTA 6']], hi:0, cap:'En 2013 salió GTA 5. Y nadie imaginaba lo que venía.'},
 {t:'count', pill:'AÑOS SIN UN GTA NUEVO', from:0, to:13, suf:'', label:'años', note:'2013 → 2026', cap:'Pasaron *13 años* sin un GTA nuevo. Una generación entera creció jugando el mismo.'},
 {t:'timeline', pill:'DICIEMBRE 2023', pts:[['2013','GTA 5'],['2018','RDR 2'],['2023','Tráiler 1'],['2026','GTA 6']], hi:2, cap:'En 2023 llegó el primer tráiler. Rompió récords en un día.'},
 {t:'cards', pill:'LOS RETRASOS', items:[['2025','fecha original','x'],['26 MAY 2026','primer retraso','x'],['19 NOV 2026','fecha final','ok']], cap:'Luego vinieron los retrasos. *Dos veces.*'},
 {t:'count', pill:'CUENTA ATRÁS', from:99, to:2, suf:'', label:'días', note:'jueves 19 de noviembre · medianoche', cap:'Y ahora, después de todo eso, faltan solo *2 días*.'},
 {t:'title', pill:'MIAMI GAME', big:'¿TÚ LO *ESPERASTE*?', sub:'cuéntamelo en los comentarios', cap:'¿Cuántos años lo esperaste tú?'}]},
{ slug:'gta5-numeros', title:'GTA 5 en números: por qué GTA 6 da miedo', tag:'RÉCORDS', scenes:[
 {t:'title', pill:'LO QUE GTA 6 TIENE QUE SUPERAR', big:'GTA 5 en *números*', sub:'', cap:'Para entender GTA 6, primero mira lo que hizo GTA 5.'},
 {t:'count', pill:'VENTAS EN 3 DÍAS', from:0, to:1000, pre:'$', suf:' M', label:'millones de dólares', note:'récord Guinness · 2013', cap:'En *3 días* vendió más de mil millones de dólares.'},
 {t:'count', pill:'COPIAS VENDIDAS', from:0, to:200, pre:'+', suf:' M', label:'millones de copias', note:'datos de Take-Two', cap:'Hoy lleva *más de 200 millones* de copias.'},
 {t:'cards', pill:'CONSOLAS DONDE SALIÓ', items:[['1','PS3 · Xbox 360','ok'],['2','PS4 · Xbox One','ok'],['3','PS5 · Series X|S','ok']], cap:'Salió en *tres generaciones* de consolas. Nadie hizo eso antes.'},
 {t:'count', pill:'AÑOS VENDIENDO', from:0, to:13, label:'años', note:'2013 → 2026', cap:'Y siguió vendiendo durante *13 años*.'},
 {t:'title', pill:'EL JUEVES', big:'GTA 6 va por *todo*', sub:'19 de noviembre', cap:'Ahora GTA 6 tiene que superar todo eso. El jueves empieza.'}]},
{ slug:'tamano', title:'212 GB: lo que GTA 6 le hace a tu consola', tag:'ESPACIO', scenes:[
 {t:'title', pill:'TU CONSOLA VS GTA 6', big:'*212* GB', sub:'lo que pesa GTA 6', cap:'GTA 6 pesa *212 gigas*. Mira lo que eso significa.'},
 {t:'meter', pill:'PS5 · 825 GB', total:667, used:212, label:'espacio libre real: ~667 GB', cap:'Una PS5 normal tiene unos *667 gigas* libres de verdad.'},
 {t:'meter', pill:'XBOX SERIES S · 512 GB', total:364, used:212, label:'espacio libre real: ~364 GB', cap:'En una Series S, GTA 6 se come *más de la mitad*.'},
 {t:'count', pill:'GTA 5 EN PS5', from:0, to:100, pre:'~', suf:' GB', label:'lo que ocupa GTA 5', note:'aprox.', cap:'Es *más del doble* de lo que ocupa GTA 5.'},
 {t:'cards', pill:'QUÉ HACER HOY', items:[['1','Borra lo que no juegas','ok'],['2','Activa la precarga','ok'],['3','Déjala toda la noche','ok']], cap:'Haz espacio hoy. El jueves no querrás esperar una barra.'},
 {t:'title', pill:'MIAMI GAME', big:'¿Cuánto *espacio* tienes?', sub:'dímelo abajo', cap:'¿A ti cuánto te queda libre?'}]},
{ slug:'precio', title:'Lo que cuesta GTA 6 comparado con GTA 5', tag:'PRECIO', scenes:[
 {t:'title', pill:'EL PRECIO DE GTA 6', big:'*$80*', sub:'edición estándar', cap:'GTA 6 cuesta *80 dólares*. Pero hay una historia detrás.'},
 {t:'bars', pill:'PRECIO DE LANZAMIENTO', items:[['GTA 5 · 2013','60'],['GTA 6 · 2026','80']], hi:1, cap:'GTA 5 salió en 2013 a *60*. GTA 6 sube a *80*.'},
 {t:'vs', pill:'DOS EDICIONES', a:['$80','ESTÁNDAR'], b:['$100','ULTIMATE'], cap:'La Ultimate cuesta *100*, con coches y extras.'},
 {t:'cards', pill:'LO QUE TRAE LA ULTIMATE', items:[['2','coches exclusivos','ok'],['+','talleres propios','ok'],['+','variantes de armas','ok']], cap:'Pero todo se desbloquea *jugando la historia*.'},
 {t:'count', pill:'LA DIFERENCIA', from:0, to:20, pre:'$', label:'dólares más', note:'mismo juego', cap:'La historia es *la misma*. Son 20 dólares por extras.'},
 {t:'title', pill:'MIAMI GAME', big:'¿Estándar o *Ultimate*?', sub:'vota en comentarios', cap:'¿Tú cuál vas a comprar?'}]},
{ slug:'30-fps', title:'GTA 6 a 30 FPS: la historia que nadie te explica', tag:'RENDIMIENTO', scenes:[
 {t:'title', pill:'RENDIMIENTO', big:'*30* FPS', sub:'en todas las consolas', cap:'GTA 6 va a *30 cuadros* por segundo. En todas las consolas.'},
 {t:'bars', pill:'CUADROS POR SEGUNDO', items:[['Series S','30'],['Series X','30'],['PS5','30'],['PS5 Pro','30']], hi:3, cap:'Incluso en la *PS5 Pro*. No hay modo de 60.'},
 {t:'cards', pill:'LO QUE GANA LA PRO', items:[['+','Imagen más nítida','ok'],['+','Trazado de rayos','ok'],['×','60 FPS','x']], cap:'La Pro gana nitidez y luces. Pero *no* gana fluidez.'},
 {t:'timeline', pill:'NO ES LA PRIMERA VEZ', pts:[['2013','GTA 5'],['2018','RDR 2'],['2026','GTA 6']], hi:1, cap:'Red Dead Redemption 2 también salió a *30*. Y se veía increíble.'},
 {t:'title', pill:'MIAMI GAME', big:'¿Te *importan* los FPS?', sub:'opina abajo', cap:'¿A ti te importa? Te leo.'}]},
{ slug:'online', title:'GTA 6 sin online: lo que pasa el jueves', tag:'ONLINE', scenes:[
 {t:'title', pill:'EL DÍA DE LANZAMIENTO', big:'Online: *0*', sub:'modos multijugador', cap:'El jueves, GTA 6 *no tiene online*.'},
 {t:'cards', pill:'LO QUE SÍ HAY', items:[['1','Historia para un jugador','ok'],['×','Modo online','x'],['?','Fecha del online','x']], cap:'Es una historia para *un jugador*. Sin fecha para el online.'},
 {t:'timeline', pill:'EL PATRÓN', pts:[['SEP 2013','GTA 5'],['OCT 2013','GTA Online']], hi:1, cap:'Con GTA 5 pasó parecido: el online llegó *después*.'},
 {t:'count', pill:'SE HABLA DE', from:2026, to:2027, label:'reportes, no oficial', note:'Rockstar no ha dado fecha', cap:'Hay reportes que hablan de *2027*. Rockstar no lo confirma.'},
 {t:'title', pill:'MIAMI GAME', big:'Disfruta la *historia*', sub:'sin prisa', cap:'Así que el jueves, a disfrutar la historia de Jason y Lucia.'}]},
{ slug:'mapa', title:'Leonida: las 6 zonas del mapa de GTA 6', tag:'MAPA', scenes:[
 {t:'title', pill:'EL MAPA DE GTA 6', big:'*Leonida*', sub:'un estado inspirado en Florida', cap:'GTA 6 pasa en *Leonida*, un estado inspirado en Florida.'},
 {t:'count', pill:'ZONAS CONFIRMADAS', from:0, to:6, label:'zonas', note:'según Rockstar', cap:'Hay *6 zonas* confirmadas. Estas son.'},
 {t:'cards', pill:'ZONAS 1–3', items:[['1','Vice City · neón','ok'],['2','Cayos de Leonida · islas','ok'],['3','Grassrivers · pantanos','ok']], cap:'Vice City, los *Cayos* y los pantanos de *Grassrivers*.'},
 {t:'cards', pill:'ZONAS 4–6', items:[['4','Port Gellhorn · costa','ok'],['5','Ambrosia · moteros','ok'],['6','Monte Kalaga · bosque','ok']], cap:'Port Gellhorn, Ambrosia y el *Monte Kalaga*.'},
 {t:'timeline', pill:'VUELTA A CASA', pts:[['2002','Vice City'],['2006','Vice City Stories'],['2026','GTA 6']], hi:2, cap:'Y volvemos a *Vice City*, 24 años después.'},
 {t:'title', pill:'MIAMI GAME', big:'¿Cuál *primero*?', sub:'dímelo abajo', cap:'¿Cuál vas a explorar primero?'}]},
{ slug:'jason-lucia', title:'Jason y Lucia: la historia de GTA 6', tag:'PERSONAJES', scenes:[
 {t:'title', pill:'LOS PROTAGONISTAS', big:'Jason *&* Lucia', sub:'la pareja de GTA 6', cap:'GTA 6 tiene *dos* protagonistas. Esta es su historia.'},
 {t:'vs', pill:'QUIÉNES SON', a:['JASON','exmilitar'], b:['LUCIA','salió de prisión'], cap:'Jason, un *exmilitar*. Lucia, recién salida de *prisión*.'},
 {t:'cards', pill:'LA HISTORIA', items:[['1','Son pareja','ok'],['2','Un golpe sale mal','x'],['3','Una conspiración por todo el estado','ok']], cap:'Un golpe sale mal… y los mete en una *conspiración*.'},
 {t:'title', pill:'UN DATO', big:'*1.ª*', sub:'protagonista mujer de un GTA moderno', cap:'Lucia es la *primera protagonista mujer* de un GTA moderno.'},
 {t:'title', pill:'MIAMI GAME', big:'¿Equipo *Jason* o *Lucia*?', sub:'vota abajo', cap:'¿Tú con quién vas?'}]},
{ slug:'trailer-record', title:'El tráiler de GTA 6 que rompió internet', tag:'RÉCORD', scenes:[
 {t:'title', pill:'DICIEMBRE 2023', big:'Un *tráiler*', sub:'y internet explotó', cap:'En diciembre de 2023, Rockstar subió un tráiler de *90 segundos*.'},
 {t:'count', pill:'VISTAS EN 24 HORAS', from:0, to:90, suf:' M', label:'millones en YouTube', note:'según Rockstar', cap:'En *24 horas* tuvo unos *90 millones* de vistas en YouTube.'},
 {t:'count', pill:'RÉCORD', from:0, to:1, pre:'#', label:'video no musical más visto en 24 h', note:'en su momento', cap:'Fue el video no musical *más visto* en un día.'},
 {t:'timeline', pill:'Y LUEGO', pts:[['DIC 2023','Tráiler 1'],['MAY 2025','Tráiler 2'],['NOV 2026','Lanzamiento']], hi:1, cap:'En 2025 llegó el *segundo* tráiler. Otra vez récord.'},
 {t:'title', pill:'MIAMI GAME', big:'Ahora sale el *juego*', sub:'jueves 19 de noviembre', cap:'Y este jueves, por fin, sale el juego.'}]},
{ slug:'medianoche', title:'GTA 6 sale a medianoche: así funciona', tag:'LANZAMIENTO', scenes:[
 {t:'title', pill:'JUEVES 19 DE NOVIEMBRE', big:'*00:00*', sub:'hora local de tu país', cap:'GTA 6 se desbloquea a la *medianoche* de tu país.'},
 {t:'cards', pill:'EN QUÉ CONSOLAS', items:[['✓','PlayStation 5','ok'],['✓','Xbox Series X|S','ok'],['×','PC y PS4','x']], cap:'En *PS5* y *Xbox Series*. En PC y PS4, no.'},
 {t:'count', pill:'LO QUE NECESITAS LIBRE', from:0, to:212, suf:' GB', label:'gigas', note:'precarga abierta si reservaste', cap:'Necesitas *212 gigas*. Deja la precarga lista hoy.'},
 {t:'cards', pill:'EL TRUCO DE NUEVA ZELANDA', items:[['?','No confirmado','x'],['!','Riesgo en Xbox','x'],['×','En PS5 no sirve','x']], cap:'¿El truco de Nueva Zelanda? *No* está confirmado.'},
 {t:'count', pill:'CUENTA ATRÁS', from:60, to:2, label:'días', note:'miércoles a medianoche', cap:'Faltan *2 días*. Activa la notificación y nos vemos ahí.'}]}
];
