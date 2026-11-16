// Renders one Short: node render.js <id> [--still t1,t2,...]
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const FPS = 30, TAIL = 0.5;
const T = {
  '01': [0, 4.08, 8.77, 15.76, 20.77, 27.2, 32.03, 35.36],
  '02': [0, 4.88, 8.92, 14.72, 20.32, 24.8, 27.52, 31.28],
  '03': [0, 3.44, 7.76, 14.24, 18.24, 25.92, 29.44, 32.24],
  '04': [0, 4.8, 8.28, 12.4, 16.21, 21.71, 26.29, 30.8],
  '05': [0, 4.32, 8.0, 11.84, 16.48, 21.56, 24.32, 28.88],
  '06': [0, 4.72, 11.16, 13.92, 20.44, 24.08, 29.12, 32.24],
  '07': [0, 3.84, 6.96, 11.68, 16.16, 20.08, 24.2, 27.04],
  '08': [0, 4.08, 9.12, 13.92, 19.0, 21.24, 25.2, 27.68],
  '09': [0, 4.44, 8.32, 12.36, 15.96, 20.04, 24.08, 29.48, 32.32],
  '10': [0, 4.32, 7.24, 10.08, 13.2, 14.92, 21.32, 23.63, 25.76],
  '11': [0, 4.08, 10.08, 14.4, 17.16, 21.8, 25.32, 28.72],
  '12': [0, 4.4, 8.2, 12.61, 16.52, 21.88, 27.4, 30.88],
  '13': [0, 5.0, 11.04, 13.2, 15.36, 20.64, 25.88, 29.44],
  '14': [0, 5.2, 12.08, 16.92, 18.68, 21.92, 24.32, 27.84],
};
const TAG = { '01': 'LANZAMIENTO', '02': 'PRECARGA', '03': 'PRECIO', '04': 'PC', '05': 'CONSOLAS', '06': 'RENDIMIENTO', '07': 'ONLINE', '08': 'HISTORIA', '09': 'MAPA', '10': 'ACTIVIDADES', '11': 'PRECARGA', '12': 'TRUCO', '13': 'EDICIONES', '14': 'ÚLTIMO DÍA' };

function build(id) {
  const v = JSON.parse(fs.readFileSync(path.join(ROOT, 'videos.json'), 'utf8')).find(x => x.id === id);
  const t = T[id]; const end = t[t.length - 1];
  v.segs.forEach((s, i) => {
    s.t0 = t[i]; s.t1 = i < v.segs.length - 1 ? t[i + 1] : end + TAIL;
    const spokenEnd = (i < v.segs.length - 1 ? t[i + 1] : end) - 0.12;
    const ws = s.say.split(/\s+/);
    const wt = ws.map(w => w.length + 1.5 + (/[.?!]$/.test(w) ? 4 : /[,:]$/.test(w) ? 2 : 0) + (/\d/.test(w) ? 4 : 0));
    const tot = wt.reduce((a, b) => a + b, 0); let acc = 0;
    s.words = ws.map((w, j) => { const a = s.t0 + (acc / tot) * (spokenEnd - s.t0); acc += wt[j]; const b = s.t0 + (acc / tot) * (spokenEnd - s.t0); return { w, a, b }; });
  });
  v.dur = end + TAIL; v.tagline = TAG[id];
  v.img = 'data:image/jpeg;base64,' + fs.readFileSync(path.join(ROOT, 'assets', id + '.jpg')).toString('base64');
  return v;
}

(async () => {
  const id = process.argv[2]; const stillArg = process.argv.indexOf('--still');
  const v = build(id);
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  await page.addInitScript(vv => { window.__VIDEO__ = vv; }, v);
  await page.goto('file://' + path.join(__dirname, 'template.html'));
  await page.waitForFunction('window.__READY__===true');
  await page.evaluate(() => document.fonts.ready);
  if (stillArg > 0) {
    for (const ts of process.argv[stillArg + 1].split(',')) {
      await page.evaluate(t => window.renderAt(t), +ts);
      await page.screenshot({ path: path.join(__dirname, `still_${id}_${ts}.jpg`), type: 'jpeg', quality: 80 });
    }
    await browser.close(); return;
  }
  const silent = path.join(__dirname, `v${id}.mp4`);
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', '-r', String(FPS), silent], { stdio: ['pipe', 'inherit', 'inherit'] });
  const n = Math.ceil(v.dur * FPS);
  for (let f = 0; f < n; f++) {
    await page.evaluate(t => window.renderAt(t), f / FPS);
    const buf = await page.screenshot({ type: 'jpeg', quality: 93 });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
  }
  ff.stdin.end(); await new Promise(r => ff.on('close', r));
  await browser.close();
  fs.writeFileSync(path.join(__dirname, `v${id}.json`), JSON.stringify({ dur: v.dur, cuts: T[id].slice(1, -1) }));
  console.log('done', id, n, 'frames');
})();
