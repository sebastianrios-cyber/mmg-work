// node render_dlg.js <out.mp4> <dur> [--still t1,t2]
const { chromium } = require('playwright'); const { spawn } = require('child_process'); const http = require('http'), fs = require('fs'), path = require('path');
(async () => {
  const srv = http.createServer((q, r) => { const p = path.join(__dirname, q.url.split('?')[0]); fs.readFile(p, (e, d) => { if (e) { r.writeHead(404); r.end(); return; } r.writeHead(200, { 'content-type': p.endsWith('.js') ? 'text/javascript' : p.endsWith('.jpg') ? 'image/jpeg' : 'text/html' }); r.end(d); }); }).listen(0);
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  p.on('pageerror', e => console.log('ERR', e.message));
  await p.goto(`http://localhost:${srv.address().port}/dialogo.html?style=${process.env.STYLE||''}`); await p.waitForFunction('window.__READY__'); await p.evaluate(() => document.fonts.ready);
  const out = process.argv[2], dur = +process.argv[3], si = process.argv.indexOf('--still');
  if (si > 0) { for (const t of process.argv[si + 1].split(',')) { await p.evaluate(t => renderAt(t), +t); await p.screenshot({ path: `${out}_${t}.jpg`, type: 'jpeg', quality: 80 }); } }
  else {
    const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', '30', '-c:v', 'mjpeg', '-i', '-', '-c:v', 'libx264', '-crf', '18', '-pix_fmt', 'yuv420p', out], { stdio: ['pipe', 'inherit', 'inherit'] });
    for (let f = 0; f < Math.round(dur * 30); f++) { await p.evaluate(t => renderAt(t), f / 30); const buf = await p.screenshot({ type: 'jpeg', quality: 92 }); if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r)); }
    ff.stdin.end(); await new Promise(r => ff.on('close', r));
  }
  await b.close(); srv.close(); console.log('done');
})();
