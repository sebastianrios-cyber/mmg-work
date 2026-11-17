cd /home/user/mmg-work/gta6-canal/datos
export NODE_PATH=/opt/node-tools/node_modules
slugs=$(node -e "import('./stories.js').then(m=>console.log(m.STORIES.map(s=>s.slug).join(' ')))")
i=0; for s in $slugs; do n=$(printf %02d $((i+1))); node render.js $i tmp/d$n.mp4 > tmp/log$n.txt 2>&1 & i=$((i+1)); if [ $((i%4)) = 0 ]; then wait; fi; done; wait; echo ALLDONE
