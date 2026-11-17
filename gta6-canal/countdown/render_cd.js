// node render_cd.js <cfg.json> <out.mp4> [--still t1,t2]
const { chromium } = require('playwright'); const { spawn } = require('child_process'); const fs = require('fs'), path = require('path');
(async () => {
  const cfg = JSON.parse(fs.readFileSync(process.argv[2], 'utf8')); const out = process.argv[3];
  cfg.imgs = cfg.imgs.map(f => 'data:image/jpeg;base64,' + fs.readFileSync(path.join(__dirname, '..', 'assets', f)).toString('base64'));
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  await p.addInitScript(c => { window.__CFG__ = c; }, cfg);
  await p.goto('file://' + path.join(__dirname, 'countdown.html')); await p.waitForFunction('window.__READY__'); await p.evaluate(() => document.fonts.ready);
  const si = process.argv.indexOf('--still');
  if (si > 0) { for (const t of process.argv[si + 1].split(',')) { await p.evaluate(t => renderAt(t), +t); await p.screenshot({ path: `${out}_${t}.jpg`, type: 'jpeg', quality: 80 }); } await b.close(); return; }
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', '30', '-c:v', 'mjpeg', '-i', '-', '-c:v', 'libx264', '-crf', '18', '-pix_fmt', 'yuv420p', out], { stdio: ['pipe', 'inherit', 'inherit'] });
  const n = Math.round(cfg.dur * 30);
  for (let f = 0; f < n; f++) { await p.evaluate(t => renderAt(t), f / 30); const buf = await p.screenshot({ type: 'jpeg', quality: 92 }); if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r)); }
  ff.stdin.end(); await new Promise(r => ff.on('close', r)); await b.close(); console.log('done', out, n);
})();
