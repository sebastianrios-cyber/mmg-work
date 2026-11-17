// node render.js <i> <out.mp4> [--still t1,t2]
const { chromium } = require('playwright'); const { spawn } = require('child_process'); const http = require('http'), fs = require('fs'), path = require('path');
(async () => {
  const srv = http.createServer((q, r) => { const p = path.join(__dirname, q.url.split('?')[0]); fs.readFile(p, (e, d) => { if (e) { r.writeHead(404); r.end(); return; } r.writeHead(200, { 'content-type': p.endsWith('.js') ? 'text/javascript' : 'text/html' }); r.end(d); }); }).listen(0);
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  p.on('pageerror', e => console.log('ERR', e.message));
  const i = process.argv[2], out = process.argv[3], si = process.argv.indexOf('--still');
  await p.goto(`http://localhost:${srv.address().port}/datos.html?i=${i}`); await p.waitForFunction('window.__READY__'); await p.evaluate(() => document.fonts.ready);
  const dur = await p.evaluate(() => TOTAL); const cues = await p.evaluate(() => CUES);
  if (si > 0) { for (const t of process.argv[si + 1].split(',')) { await p.evaluate(t => renderAt(t), +t); await p.screenshot({ path: `${out}_${t}.jpg`, type: 'jpeg', quality: 80 }); } }
  else {
    fs.writeFileSync(out.replace(/\.mp4$/, '.json'), JSON.stringify({ dur, cues }));
    const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', '30', '-c:v', 'mjpeg', '-i', '-', '-c:v', 'libx264', '-crf', '18', '-pix_fmt', 'yuv420p', out], { stdio: ['pipe', 'inherit', 'inherit'] });
    for (let f = 0; f < Math.round(dur * 30); f++) { await p.evaluate(t => renderAt(t), f / 30); const buf = await p.screenshot({ type: 'jpeg', quality: 92 }); if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r)); }
    ff.stdin.end(); await new Promise(r => ff.on('close', r));
  }
  await b.close(); srv.close(); console.log('done', i, dur.toFixed(2));
})();
