# Traspaso: canal "Miami Game" (GTA 6) — para seguir desde la compu

## 1. Mensaje para pegar en el chat nuevo de Claude Code

> Trabajas en mi canal de YouTube y TikTok "Miami Game" sobre GTA 6. Todo el proyecto está en el repo `sebastianrios-cyber/mmg-work`, rama `claude/youtube-installation-j84682`. Lee primero `gta6-canal/TRASPASO.md`: ahí está qué hay hecho, cómo se renderizan los vídeos y qué falta. Háblame en español, corto y sin tecnicismos, y hazlo sin preguntarme salvo que de verdad dependa de mí. Lo primero: prepara la compu (sección 3) y publica los 10 vídeos de datos que fallaron (sección 5).

## 2. Qué es y en qué estado está

- **Canal:** "Miami Game", sobre GTA 6, en español. Hay marca en `gta6-canal/marca/` (banner y foto de perfil).
- **Lanzamiento del juego:** jueves 19 de noviembre de 2026 a medianoche, hora local, en PS5 y Xbox Series.
- **Publicación:** con **Metricool** (marca/blogId `8143728`, zona horaria `America/Los_Angeles`), en YouTube y TikTok.
  - ⚠️ **El 18 de noviembre Metricool rechazó todo con "You have reached your Metricool account limit".** Hay que subir el plan o publicar por otra vía (ver sección 5).
- **Último vídeo que sí se publicó:** "Faltan 2 días para GTA 6", el 17 de noviembre.
  - YouTube: https://www.youtube.com/shorts/8EaX7djPfC0
  - TikTok: https://www.tiktok.com/@susbarazo/video/7709325970485890318
- **Creative Claw** (voces de ElevenLabs, imágenes y vídeo con IA): queda **1 crédito**. Cada voz cuesta unos 8.
- **Tareas programadas en la nube** (Claude):
  - "Miami Game: revisión diaria" (`trig_01P2vRknVj2Ru9V3PoMWZWj3`) revisa cada noche qué se publicó.
  - Una tarea para el día del lanzamiento (`trig_01QfQKww7Rzn9tKvRAmDTk74`).

## 3. Preparar la compu (Mac)

```bash
brew install ffmpeg node python git
git clone https://github.com/sebastianrios-cyber/mmg-work.git
cd mmg-work && git checkout claude/youtube-installation-j84682
bash .claude/kit/setup.sh --voice      # Playwright + Chromium + voz Kokoro (~1 GB, una sola vez)
```

- Los scripts usaban `NODE_PATH=/opt/node-tools/node_modules`, que era la ruta de la nube. En la Mac, usa `NODE_PATH=$PWD/.claude/kit/node_modules`.
- Los vídeos terminados (`gta6-canal/out/`) **no están en git**. Descárgalos de los enlaces de la sección 5.

## 4. Cómo se hacen los vídeos de datos (el estilo actual)

**Estilo:** horizontal 1920×1080, como la referencia de TikTok que mandó el usuario. Fondo negro con cuadrícula fina, etiqueta blanca tipo píldora, cifras grandes que cuentan, líneas de tiempo, barras y tarjetas en trazo blanco. El acento usa los colores de GTA 6 (naranja → rosa, morado y turquesa). Lleva subtítulos palabra por palabra, voz, música y efectos.

Todo está en `gta6-canal/datos/`:

| Archivo | Para qué |
|---|---|
| `stories.js` | Las 10 historias: escenas `title / count / timeline / bars / cards / vs / meter`, texto `cap` (narración), `*palabra*` = resaltado. |
| `datos.html` | El motor de animación (`?i=N`). Si recibe `window.__VO__`, ajusta cada escena a lo que dura su frase. |
| `render.js` | `node render.js <índice 0-9> tmp/dNN.mp4 [--still t1,t2]`. Con `VO=1` usa `voz/vo_NN.json`. |
| `voz.py` | Voz Kokoro por escena: `VOICE=em_santa SPEED=1.05 .claude/kit/.venv/bin/python voz.py .claude/kit NN`. |
| `mix_vo.py` | Mezcla voz + `assets/music.mp3` (baja sola cuando habla la voz) + efectos → `../out/GTA6_dNN_slug.mp4` a −14 LUFS. |
| `mix.py` | La misma mezcla sin voz. |
| `run_vo.sh` | Todo seguido para los 10. Ajusta las rutas a tu compu antes de usarlo. |

- **Voz elegida por el usuario:** Kokoro `em_santa`.
  - A la voz se le cambian palabras para que las pronuncie bien: "GTA" → "ge te a", "PS5" → "pe ese cinco", "Jason" → "Yéison", "Vice City" → "Vais Siti"… (lista `R` en `voz.py`).
  - Al usuario **no le gustaron** las voces de Kokoro en los diálogos de antes. Su favorita era la de ElevenLabs de los primeros vídeos (Creative Claw, voz `U9TSK9KHMlMU2qkeXlQP`), pero eso cuesta créditos.
- **Efectos de sonido:** CC0, en `.claude/skills/sound-effects/sfx/kit/{whoosh,impact,riser,pop,click,tick}.ogg`.

## 5. Lo pendiente más urgente: publicar los 10 vídeos de datos (con voz de Santa)

Fallaron en Metricool el 18 de noviembre por el límite de la cuenta. Están en estos enlaces públicos:

| # | Título | Vídeo |
|---|---|---|
| 1 | 13 años esperando GTA 6: la historia completa | https://cdn.creativeclaw.co/u/4d7356ed/videos/2b83632f-5814-462f-8e57-03ff92e59444.mp4 |
| 2 | GTA 5 en números: por qué GTA 6 da miedo | https://cdn.creativeclaw.co/u/4d7356ed/videos/c9367c3e-de5a-4d8b-9220-58e1f4a597b9.mp4 |
| 3 | 212 GB: lo que GTA 6 le hace a tu consola | https://cdn.creativeclaw.co/u/4d7356ed/videos/d60ea149-a096-4391-9e32-bdcbd4246726.mp4 |
| 4 | Lo que cuesta GTA 6 comparado con GTA 5 | https://cdn.creativeclaw.co/u/4d7356ed/videos/0acf0998-7167-40c1-8dd8-0f7f139bad32.mp4 |
| 5 | GTA 6 a 30 FPS: lo que nadie te explica | https://cdn.creativeclaw.co/u/4d7356ed/videos/eb84351f-3a26-48ff-a727-cda463fb5ddb.mp4 |
| 6 | GTA 6 sin online: lo que pasa el jueves | https://cdn.creativeclaw.co/u/4d7356ed/videos/7f63ec5a-bae3-42d1-b327-4df498b6fee8.mp4 |
| 7 | Leonida: las 6 zonas del mapa de GTA 6 | https://cdn.creativeclaw.co/u/4d7356ed/videos/52514040-8d57-4f79-9c56-a36c7dc5c826.mp4 |
| 8 | Jason y Lucia: la historia de GTA 6 | https://cdn.creativeclaw.co/u/4d7356ed/videos/b85d90d7-a880-48ef-84ad-8bb968748562.mp4 |
| 9 | El tráiler de GTA 6 que rompió internet | https://cdn.creativeclaw.co/u/4d7356ed/videos/eec7fc01-406c-45a3-8047-a118cb81d828.mp4 |
| 10 | GTA 6 sale a medianoche: así funciona | https://cdn.creativeclaw.co/u/4d7356ed/videos/c73c08c4-9f4a-4d2c-89a1-7f154f7bc430.mp4 |

**Ojo con las fechas:**
- El 1 dice "falta 1 día" y el 10 habla de "esta noche a medianoche". Si se publican **después** del lanzamiento, hay que cambiar ese texto en `stories.js` y volver a renderizarlos.
- El 6 dice "el jueves"; después del lanzamiento conviene cambiarlo a "hoy no hay online".

**Textos que se usaron en Metricool:** descripción con 1–2 frases, "Canal no oficial." y 5 hashtags (`#GTA6 #GTAVI …`).
- YouTube: `type video` (son horizontales), categoría `GAMING`, `madeForKids false`, `isAiGeneratedContent true`.
- TikTok: `isAigc true`, título obligatorio.

**Cómo publicarlos, de más fácil a más trabajo:**
1. Subir el plan de Metricool y reprogramarlos (los posts con error siguen ahí, se pueden editar).
2. Upload-Post (upload-post.com): tiene plan gratis y API. Conectar YouTube y TikTok y pasarle la clave a Claude.
3. Desde la compu: abrir YouTube Studio y TikTok en el navegador con la sesión iniciada y subirlos.

Otros posts de Metricool:
- "HOY sale GTA 6" (19 nov, 00:05) y "Último día del pack gratis" (19 nov, 09:00) probablemente también fallen por el límite.
- Hay un borrador del vídeo de la abuela (sin publicar, a propósito).

## 6. Lo que le gusta (y no) al usuario

- **Le gusta:** el estilo de datos (sección 4); los colores de GTA 6; las voces profesionales "como las de los primeros vídeos"; los muñecos o personajes que interactúan (dibujo animado 2D).
- **No le gusta:** los humanos en 3D; las voces feas; las animaciones simples ("basura"). Quiere algo que impresione.
- **Cómo trabaja:**
  - Escribe desde el celular y en español.
  - Quiere que se haga sin preguntar ("solo hazlo").
  - **Pero** canceló a mitad varias publicaciones y una vez dijo "súbelos mañana": antes de publicar algo nuevo, confírmale la hora.
  - Prefiere un vídeo cada hora.
- **Límites que se respetan:**
  - No usar material de Rockstar (tráilers, logos, capturas).
  - Marcar el contenido como hecho con IA.
  - No inventar datos.
  - No descargar vídeos de TikTok de otros.

## 7. Otras cosas del repo

- `gta6-canal/videos.json` + `build/`: los primeros 17 Shorts (voz ElevenLabs, imágenes con IA).
- `countdown/`: cuenta atrás. `dialogo/` e `historias/`: abuela y nieto en 2D, con 10 historias escritas, sin voz. `cine/`: recorrido en 3D por Vice City.
- `PLAN.md` (estrategia para ganar dinero) y `METADATOS.md` (títulos y descripciones).
- **Skills instaladas en `.claude/skills/`:** youtube y yt-* (guiones, SEO, Shorts…), elevenlabs-* (necesitan una clave de ElevenLabs; tiene plan gratis), openshorts (para cortar vídeos largos en Shorts cuando haya gameplay), animación y sound-effects.
- **Idea siguiente:** cuando el usuario tenga GTA 6, grabar gameplay propio (OBS o una capturadora). Es lo que más ayuda a monetizar y lo que hace útil a OpenShorts.
