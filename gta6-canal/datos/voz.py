# python voz.py KIT NN  -> voz/vo_NN.wav + voz/vo_NN.json (duración por escena)
import json, os, re, sys, subprocess, numpy as np, soundfile as sf
from kokoro_onnx import Kokoro, EspeakConfig
import espeakng_loader
KIT, n = sys.argv[1], sys.argv[2]; VOICE = os.environ.get('VOICE', 'em_alex'); SP = float(os.environ.get('SPEED', '1.08'))
esp = EspeakConfig(lib_path=espeakng_loader.get_library_path(), data_path=espeakng_loader.get_data_path())
k = Kokoro(os.path.join(KIT, "models/kokoro-v1.0.onnx"), os.path.join(KIT, "models/voices-v1.0.bin"), espeak_config=esp)
caps = json.loads(subprocess.check_output(['node', '-e', f"import('./stories.js').then(m=>console.log(JSON.stringify(m.STORIES[{int(n)-1}].scenes.map(s=>s.cap))))"]))
R = [(r'GTA ?6', 'ge te a seis'), (r'GTA ?5', 'ge te a cinco'), (r'GTA', 'ge te a'), (r'PS5 Pro', 'pe ese cinco pro'), (r'PS5', 'pe ese cinco'), (r'PS4', 'pe ese cuatro'),
     (r'\bPC\b', 'pe ce'), (r'Xbox', 'equis box'), (r'Series S', 'Series ese'), (r'Ultimate', 'áltimeit'), (r'\bFPS\b', 'efe pe ese'), (r'1\.ª', 'primera'),
     (r'\b2013\b', 'dos mil trece'), (r'\b2018\b', 'dos mil dieciocho'), (r'\b2023\b', 'dos mil veintitrés'), (r'\b2025\b', 'dos mil veinticinco'), (r'\b2026\b', 'dos mil veintiséis'), (r'\b2027\b', 'dos mil veintisiete'),
     (r'\b212\b', 'doscientos doce'), (r'\b667\b', 'seiscientos sesenta y siete'), (r'Jason', 'Yéison'), (r'Leonida', 'Leónida'), (r'Kalaga', 'Kalága'), (r'Gellhorn', 'Guélhorn'), (r'Grassrivers', 'Gras ríversss'), (r'Vice City', 'Vais Siti'), (r'\bVS\b', 'contra')]
sr = 24000; durs = []; clips = []
for c in caps:
    t = c.replace('*', '')
    for a, b in R: t = re.sub(a, b, t)
    s, sr = k.create(t, voice=VOICE, speed=SP, lang="es")
    a = np.abs(s); idx = np.where(a > 0.01)[0]; s = s[max(0, idx[0]-480): idx[-1]+1400].astype(np.float32)
    clips.append(s); durs.append(round(len(s)/sr, 3))
os.makedirs('voz', exist_ok=True)
json.dump({'voice': durs}, open(f'voz/vo_{n}.json', 'w'))
for i, s in enumerate(clips): sf.write(f'voz/c_{n}_{i}.wav', s, sr)
print(n, durs)
