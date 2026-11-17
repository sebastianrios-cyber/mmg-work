cd /home/user/mmg-work/gta6-canal/datos
export NODE_PATH=/opt/node-tools/node_modules VO=1
PY=/home/user/mmg-work/.claude/kit/.venv/bin/python; KIT=/home/user/mmg-work/.claude/kit
SP=/tmp/claude-0/-home-user-mmg-work/5bfcc089-b8fe-5e66-9773-6fc385407c24/scratchpad; for n in 01 02 03 04 05 06 07 08 09 10; do python3 -I $SP/tools/voz_piper.py $SP/piper/bin/python $SP/pv/es_MX-claude-high.onnx $n || echo VOFAIL $n; done
slugs=($(node -e "import('./stories.js').then(m=>console.log(m.STORIES.map(s=>s.slug).join(' ')))"))
for i in 0 1 2 3 4 5 6 7 8 9; do n=$(printf %02d $((i+1))); node render.js $i tmp/d$n.mp4 > tmp/log$n.txt 2>&1 & if [ $(((i+1)%4)) = 0 ]; then wait; fi; done; wait
for i in 0 1 2 3 4 5 6 7 8 9; do n=$(printf %02d $((i+1))); python3 mix_vo.py $n ${slugs[$i]} || echo MIXFAIL $n; done
echo ALLDONE
