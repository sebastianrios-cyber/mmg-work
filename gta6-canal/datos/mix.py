# python3 mix.py NN slug  -> ../out/GTA6_dNN_slug.mp4
import json, subprocess, sys
n, slug = sys.argv[1], sys.argv[2]
K = '/home/user/mmg-work/.claude/skills/sound-effects/sfx/kit/'
VOL = {'whoosh':0.45,'impact':0.7,'riser':0.35,'pop':0.55,'click':0.5,'tick':0.45}
j = json.load(open(f'tmp/d{n}.json')); dur = j['dur']
cues = [c for c in j['cues'] if c['t'] < dur - 0.2]
args = ['ffmpeg','-y','-loglevel','error','-i',f'tmp/d{n}.mp4','-stream_loop','-1','-i','../assets/music.mp3']
for c in cues: args += ['-i', K + c['k'] + '.ogg']
f = [f'[1:a]atrim=0:{dur},volume=0.42,afade=t=in:d=0.4,afade=t=out:st={dur-1.2}:d=1.2[m]']
for i, c in enumerate(cues):
    f.append(f'[{i+2}:a]volume={VOL[c["k"]]},adelay={int(c["t"]*1000)}|{int(c["t"]*1000)}[s{i}]')
f.append('[m]' + ''.join(f'[s{i}]' for i in range(len(cues))) + f'amix=inputs={len(cues)+1}:normalize=0:duration=first,loudnorm=I=-14:TP=-1.5:LRA=11,alimiter=limit=0.84:level=false[a]')
args += ['-filter_complex', ';'.join(f), '-map', '0:v', '-map', '[a]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-shortest', '-movflags', '+faststart', f'../out/GTA6_d{n}_{slug}.mp4']
subprocess.run(args, check=True); print('ok', n, slug, round(dur, 2))
