# Genera las voces con Kokoro (gratis), una por línea, y escribe audio/vo.wav + src/data.js
import json, os, sys, numpy as np, soundfile as sf
from kokoro_onnx import Kokoro, EspeakConfig
import espeakng_loader
KIT = sys.argv[1]
esp = EspeakConfig(lib_path=espeakng_loader.get_library_path(), data_path=espeakng_loader.get_data_path())
k = Kokoro(os.path.join(KIT, "models/kokoro-v1.0.onnx"), os.path.join(KIT, "models/voices-v1.0.bin"), espeak_config=esp)
VOICE = {"N": ("em_alex", 1.08), "A": ("ef_dora", 0.92)}
lines = json.load(open("dialogue.json"))
os.makedirs("audio", exist_ok=True)
out, meta, t, sr = [], [], 0.5, 24000
out.append(np.zeros(int(0.5 * sr), dtype=np.float32))
for i, (who, text) in enumerate(lines):
    v, sp = VOICE[who]
    s, sr = k.create(text, voice=v, speed=sp, lang="es")
    a = np.abs(s); idx = np.where(a > 0.01)[0]
    s = s[max(0, idx[0] - int(0.02 * sr)): idx[-1] + int(0.06 * sr)].astype(np.float32)
    meta.append({"who": who, "text": text, "start": round(t, 3), "end": round(t + len(s) / sr, 3)})
    out.append(s); t += len(s) / sr
    gap = 0.75 if i == len(lines) - 2 else 0.32
    out.append(np.zeros(int(gap * sr), dtype=np.float32)); t += gap
out.append(np.zeros(int(0.9 * sr), dtype=np.float32)); t += 0.9
vo = np.concatenate(out); sf.write("audio/vo.wav", vo, sr)
fps = 30; hop = sr // fps
env = [float(np.sqrt(np.mean(vo[i:i + hop] ** 2))) for i in range(0, len(vo), hop)]
m = max(env) or 1; env = [round(min(1, (e / m) * 1.8), 3) for e in env]
caps = []
for L in meta:
    w = L["text"].split(); n = len(w); groups = []
    i = 0
    while i < n:
        g = w[i:i + 3]
        if len(g) == 3 and len(" ".join(g)) > 18: g = w[i:i + 2]
        groups.append(g); i += len(g)
    tot = sum(len(" ".join(g)) + 2 for g in groups); acc = 0
    for g in groups:
        st = L["start"] + (L["end"] - L["start"]) * acc / tot
        acc += len(" ".join(g)) + 2
        caps.append([round(st, 2), " ".join(g), L["who"]])
    caps[-1].append(round(L["end"] + 0.15, 2))
open("src/data.js", "w").write(
    "export const LINES = " + json.dumps(meta, ensure_ascii=False) + ";\n"
    "export const ENV = " + json.dumps(env) + ";\n"
    "export const CAPS = " + json.dumps(caps, ensure_ascii=False) + ";\n"
    f"export const TOTAL = {round(t, 2)};\n")
print(round(t, 2)); [print(m) for m in meta]
