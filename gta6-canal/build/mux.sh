#!/bin/bash
# mux.sh <id> <slug>
set -e; cd "$(dirname "$0")/.."; id=$1; slug=$2
dur=$(python3 -c "import json;print(json.load(open('build/v$id.json'))['dur'])")
cuts=$(python3 -c "import json;print(' '.join(str(int(max(0,c-0.12)*1000)) for c in json.load(open('build/v$id.json'))['cuts']))")
inputs=(); filt=""; n=3; mix="[v][m]"
for c in $cuts; do inputs+=(-i assets/whoosh.wav); filt+="[$n:a]adelay=${c}:all=1,volume=0.5[w$n];"; mix+="[w$n]"; n=$((n+1)); done
fo=$(python3 -c "print($dur-1.2)")
ffmpeg -y -loglevel error -i build/v$id.mp4 -i assets/$id.mp3 -stream_loop -1 -i assets/music.mp3 "${inputs[@]}" -filter_complex \
"[1:a]loudnorm=I=-15:TP=-1.5:LRA=11,aresample=48000,apad[v];[2:a]aresample=48000,volume=0.13,afade=t=out:st=$fo:d=1.2[m];${filt}${mix}amix=inputs=$((n-1)):normalize=0:duration=longest,alimiter=limit=0.95[a]" \
 -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 192k -ar 48000 -t $dur -movflags +faststart "out/GTA6_${id}_${slug}.mp4"
echo "ok $id"
