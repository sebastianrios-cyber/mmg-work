import { chromium } from 'playwright'; import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path'; import { spawn } from 'node:child_process';
const ROOT=path.dirname(new URL(import.meta.url).pathname);
const T={'.html':'text/html','.js':'text/javascript'};
const srv=http.createServer((q,r)=>{const p=path.join(ROOT,decodeURIComponent(q.url.split('?')[0]));fs.readFile(p,(e,d)=>{if(e){r.writeHead(404);r.end();return;}r.writeHead(200,{'content-type':T[path.extname(p)]||'application/octet-stream'});r.end(d);});}).listen(0);
const b=await chromium.launch({args:['--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const pg=await b.newPage({viewport:{width:720,height:1280}}); pg.on('pageerror',e=>console.log('ERR',e.message));
await pg.goto(`http://localhost:${srv.address().port}/index.html`); await pg.waitForFunction(()=>window.renderAt&&window.ready); await pg.evaluate(()=>document.fonts.ready);
const [mode,a,b2,c,d]=process.argv.slice(2);
if(mode==='stills'){fs.mkdirSync(b2,{recursive:true});for(const t of a.split(',')){await pg.evaluate(t=>renderAt(+t),t);await pg.screenshot({path:`${b2}/t_${t}.png`});console.log('still',t);}}
else{const fps=30,dur=await pg.evaluate(()=>window.DURATION);const from=+(c||0),to=Math.min(+(d||dur),dur);
 const ff=spawn('ffmpeg',['-y','-v','error','-f','image2pipe','-framerate','30','-c:v','png','-i','-','-c:v','libx264','-crf','17','-pix_fmt','yuv420p',a],{stdio:['pipe','inherit','inherit']});
 for(let n=Math.round(from*fps);n<Math.floor(to*fps);n++){await pg.evaluate(t=>renderAt(t),n/fps);const buf=await pg.screenshot({type:'png'});if(!ff.stdin.write(buf))await new Promise(r=>ff.stdin.once('drain',r));}
 ff.stdin.end();await new Promise(r=>ff.on('close',r));console.log('dur',dur);}
await b.close();srv.close();
