# python3 mix_vo.py NN slug -> ../out/GTA6_d{NN}_{slug}.mp4 (voz + música + efectos)
import json, subprocess, sys
n, slug = sys.argv[1], sys.argv[2]
K = '/home/user/mmg-work/.claude/skills/sound-effects/sfx/kit/'
VOL = {'whoosh':0.3,'impact':0.45,'riser':0.22,'pop':0.35,'click':0.3,'tick':0.28}
j = json.load(open(f'tmp/d{n}.json')); dur = j['dur']; starts = j['starts']
cues = [c for c in j['cues'] if c['t'] < dur - 0.2]
VF = 'highpass=f=90,equalizer=f=3200:t=q:w=1.2:g=4,equalizer=f=180:t=q:w=1:g=2,acompressor=threshold=-20dB:ratio=3:attack=5:release=80'
args = ['ffmpeg','-y','-loglevel','error','-i',f'tmp/d{n}.mp4','-stream_loop','-1','-i','../assets/music.mp3']
for c in cues: args += ['-i', K + c['k'] + '.ogg']
nv = len(starts)
for i in range(nv): args += ['-i', f'voz/c_{n}_{i}.wav']
f = []
for i, st in enumerate(starts):
    ms = int((st + 0.2) * 1000); f.append(f'[{2+len(cues)+i}:a]aresample=48000,{VF},volume=2.2,adelay={ms}|{ms}[v{i}]')
f.append(''.join(f'[v{i}]' for i in range(nv)) + f'amix=inputs={nv}:normalize=0[vo]')
f.append('[vo]asplit=2[vo1][vo2]')
f.append(f'[1:a]atrim=0:{dur},volume=0.5,afade=t=in:d=0.4,afade=t=out:st={dur-1.2}:d=1.2[m0]')
f.append('[m0][vo2]sidechaincompress=threshold=0.03:ratio=6:attack=20:release=300[m]')
for i, c in enumerate(cues):
    ms = int(c['t'] * 1000); f.append(f'[{i+2}:a]volume={VOL[c["k"]]},adelay={ms}|{ms}[s{i}]')
f.append('[m][vo1]' + ''.join(f'[s{i}]' for i in range(len(cues))) + f'amix=inputs={len(cues)+2}:normalize=0:duration=first,loudnorm=I=-14:TP=-1.5:LRA=11,alimiter=limit=0.84:level=false[a]')
args += ['-filter_complex', ';'.join(f), '-map', '0:v', '-map', '[a]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-shortest', '-movflags', '+faststart', f'../out/GTA6_d{n}_{slug}.mp4']
subprocess.run(args, check=True); print('ok', n, slug, round(dur, 2))
