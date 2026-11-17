import * as THREE from 'three';
import { makeHuman } from './human.js';
import { materials } from './materials.js';
import { kf, lerp, smooth, easeOut, easeInOut, range, clamp, V, cam, place, shake } from './anim.js';
import { LINES, ENV, CAPS, TOTAL } from './data.js';

export const DURATION = TOTAL;
export const CAPTIONS = CAPS.map(c => c.length > 3 ? [c[0], c[1], c[3]] : [c[0], c[1]]);
export const FADES = [];

// ---------- characters ----------
const std = (c, o = {}) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.85, ...o });
function dress(h, { top, legs, hair, beardless = true }) {
  const M = materials();
  const topM = std(top), legM = std(legs), hairM = std(hair, { roughness: 0.9 });
  const legRoots = [h.j.lHip, h.j.rHip];
  h.root.traverse(o => {
    if (!o.isMesh) return;
    let p = o, isLeg = false;
    while (p) { if (legRoots.includes(p)) { isLeg = true; break; } p = p.parent; }
    if (o.material === M.cloth) o.material = isLeg ? legM : topM;
    else if (o.material === M.hair) o.material = hairM;
    else if (beardless && (o.material === M.beard || (o.material.transparent && Math.abs(o.material.opacity - 0.2) < 1e-3))) o.visible = false;
  });
  return { topM, hairM };
}
function makeNieto() {
  const h = makeHuman('casual');
  dress(h, { top: 0x7c4dff, legs: 0x2d3e6b, hair: 0x2a1a10 });
  // gorra hacia atrás
  const capM = std(0xff3d9a);
  const cap = new THREE.Mesh(new THREE.SphereGeometry(0.116, 40, 20, 0, Math.PI * 2, 0, 1.25), capM);
  cap.scale.set(0.97, 1.0, 1.06); cap.position.set(0, 0.14, -0.01); h.j.head.add(cap);
  const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.01, 32, 1, false, 0, Math.PI), capM);
  brim.position.set(0, 0.15, -0.09); brim.rotation.set(0.12, Math.PI / 2, 0); brim.scale.set(1, 1, 1.25); h.j.head.add(brim);
  cap.castShadow = brim.castShadow = true;
  h.root.position.set(-0.4, 0, 0.1);
  h.baseYaw = 0.72;
  return h;
}
function makeAbuela() {
  const h = makeHuman('casual');
  const { hairM } = dress(h, { top: 0xe0708a, legs: 0x5a4a6e, hair: 0xd8d8de });
  const bun = new THREE.Mesh(new THREE.SphereGeometry(0.055, 32, 16), hairM);
  bun.position.set(0, 0.2, -0.07); h.j.head.add(bun);
  // gafas
  const gM = std(0x222222, { roughness: 0.4, metalness: 0.4 });
  for (const s of [-1, 1]) {
    const r = new THREE.Mesh(new THREE.TorusGeometry(0.022, 0.0035, 8, 28), gM);
    r.position.set(s * 0.035, 0.11, 0.1); h.j.head.add(r);
  }
  const bridge = new THREE.Mesh(new THREE.BoxGeometry(0.026, 0.004, 0.004), gM); bridge.position.set(0, 0.114, 0.103); h.j.head.add(bridge);
  // chal
  const shawl = new THREE.Mesh(new THREE.TorusGeometry(0.17, 0.035, 12, 40), std(0xf5e6c8));
  shawl.rotation.x = Math.PI / 2; shawl.position.set(0, 0.33, 0.0); shawl.scale.set(1.05, 0.8, 1); h.j.chest.add(shawl);
  h.root.scale.setScalar(0.93);
  h.root.position.set(0.42, 0, 0.1);
  h.baseYaw = -0.72;
  return h;
}

// ---------- room ----------
let WORLD = null;
function world(makeStage) {
  if (WORLD) return WORLD;
  const scene = makeStage({ shadowSize: 3, sunDir: [-2, 5, 4], sun: 1.9 });
  const wall = new THREE.Mesh(new THREE.PlaneGeometry(12, 6), std(0xf2d7b6, { roughness: 1 }));
  wall.position.set(0, 3, -1.6); wall.receiveShadow = true; scene.add(wall);
  const strip = new THREE.Mesh(new THREE.PlaneGeometry(12, 0.12), std(0xc9a27e)); strip.position.set(0, 0.06, -1.59); scene.add(strip);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(12, 12), std(0x9a6a45, { roughness: 0.7 }));
  floor.rotation.x = -Math.PI / 2; floor.position.y = -0.002; floor.receiveShadow = true; scene.add(floor);
  const rug = new THREE.Mesh(new THREE.CircleGeometry(1.1, 48), std(0x3aa6a0)); rug.rotation.x = -Math.PI / 2; rug.position.set(0, 0.003, 0.1); rug.receiveShadow = true; scene.add(rug);
  // sofá
  const sofaM = std(0x5e7f9e);
  const sofa = new THREE.Group();
  const base = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.42, 0.75), sofaM); base.position.y = 0.21; sofa.add(base);
  const back = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.6, 0.2), sofaM); back.position.set(0, 0.62, -0.28); sofa.add(back);
  for (const s of [-1, 1]) { const arm = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.62, 0.75), sofaM); arm.position.set(s * 1.0, 0.31, 0); sofa.add(arm); }
  for (const s of [-1, 1]) { const c = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.4, 0.12), std(s > 0 ? 0xffd23f : 0xff8a5c)); c.position.set(s * 0.6, 0.62, -0.13); c.rotation.z = s * 0.15; sofa.add(c); }
  sofa.position.set(0, 0, -1.1); sofa.traverse(o => { if (o.isMesh) { o.castShadow = o.receiveShadow = true; } }); scene.add(sofa);
  // tele en la pared con atardecer
  const tv = new THREE.Group();
  const frame = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.68, 0.05), std(0x111111, { roughness: 0.4 })); tv.add(frame);
  const cv = document.createElement('canvas'); cv.width = 256; cv.height = 150; const g = cv.getContext('2d');
  const gr = g.createLinearGradient(0, 0, 0, 150); gr.addColorStop(0, '#2b1b5a'); gr.addColorStop(0.55, '#ff3d9a'); gr.addColorStop(0.75, '#ffb347'); gr.addColorStop(1, '#13324a');
  g.fillStyle = gr; g.fillRect(0, 0, 256, 150); g.fillStyle = '#ffd23f'; g.beginPath(); g.arc(128, 102, 30, Math.PI, 0); g.fill();
  g.fillStyle = '#120c22'; for (const x of [40, 70, 200, 225]) { g.fillRect(x, 70, 4, 50); g.beginPath(); g.ellipse(x + 2, 70, 18, 7, 0, 0, Math.PI * 2); g.fill(); }
  const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace;
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(1.07, 0.6), new THREE.MeshBasicMaterial({ map: tex, toneMapped: false })); screen.position.z = 0.03; tv.add(screen);
  tv.position.set(0, 1.75, -1.57); scene.add(tv);
  // lámpara
  const lamp = new THREE.Group();
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 1.5, 12), std(0x333333)); pole.position.y = 0.75; lamp.add(pole);
  const shade = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.2, 0.25, 24, 1, true), std(0xfff1d0, { side: THREE.DoubleSide, emissive: 0xffd9a0, emissiveIntensity: 0.6 })); shade.position.y = 1.55; lamp.add(shade);
  lamp.position.set(1.35, 0, -1.2); scene.add(lamp);
  const warm = new THREE.PointLight(0xffc98a, 1.2, 4); warm.position.set(1.35, 1.5, -1.0); scene.add(warm);
  const N = makeNieto(), A = makeAbuela(); scene.add(N.root, A.root);
  WORLD = { scene, N, A };
  return WORLD;
}

// ---------- acting ----------
const STAND = { lSh: [0.05, 0, 0.16], rSh: [0.05, 0, -0.16], lEl: [-0.25, 0, 0], rEl: [-0.25, 0, 0], lHip: [0, 0, 0.07], rHip: [0, 0, -0.07], lAn: [0, 0, -0.07], rAn: [0, 0, 0.07] };
const lineAt = t => LINES.findIndex(L => t >= L.start && t < L.end);
const lastLine = t => { let k = -1; LINES.forEach((L, i) => { if (t >= L.start) k = i; }); return k; };
function mouthFor(who, t) {
  const i = lineAt(t); if (i < 0 || LINES[i].who !== who) return 0;
  const f = t * 30, a = ENV[Math.floor(f)] || 0, b = ENV[Math.floor(f) + 1] || 0;
  return clamp(lerp(a, b, f % 1) * 1.15);
}
function act(h, who, t) {
  const other = who === 'N' ? 'A' : 'N';
  const li = lastLine(t), L = LINES[li] || LINES[0], lt = t - L.start;
  const speaking = lineAt(t) >= 0 && LINES[lineAt(t)].who === who;
  const p = JSON.parse(JSON.stringify(STAND));
  const idle = Math.sin(t * 1.7 + (who === 'A' ? 1 : 0)) * 0.015;
  p.chest = [idle, 0, 0]; p.neck = [0, 0, 0]; p.head = [0, 0, 0];
  // mirar al otro
  const look = who === 'N' ? 0.35 : -0.35;
  p.neck[1] = look * 0.5; p.head[1] = look * 0.5;
  if (speaking) {
    const w = Math.sin(lt * 5.5) * 0.12;
    p.rSh = [-0.55 + w, 0, -0.28]; p.rEl = [-1.25 + w, 0, 0];
    p.head[0] = Math.sin(lt * 7) * 0.04; p.head[2] = Math.sin(lt * 3.1) * 0.05;
  }
  const r = range(lt, 0, 0.35);
  // reacciones por línea
  if (who === 'N' && li === 0) { p.lSh = [-0.9, 0, 0.3]; p.lEl = [-1.6, 0, 0]; p.rSh = [-0.9, 0, -0.3]; p.rEl = [-1.6, 0, 0]; p.head[0] = -0.12; } // suplicando
  if (who === 'A' && li === 1) { p.head[2] = 0.18 * r; p.chest[0] -= 0.08 * r; }
  if (who === 'N' && li === 4) { const k = easeOut(r); p.lSh = [-0.2, 0, 2.3 * k + 0.16]; p.rSh = [-0.2, 0, -2.3 * k - 0.16]; p.lEl = [-0.5, 0, 0]; p.rEl = [-0.5, 0, 0]; }
  if (who === 'N' && li === 5) { const k = easeOut(r); p.chest[0] += 0.22 * k; p.neck[0] += 0.25 * k; p.head[0] += 0.15 * k; }
  if (who === 'A' && (li === 5 || li === 9)) { const k = easeOut(r); p.lSh = [0.2, 0, 0.75 * k + 0.16]; p.lEl = [-1.9 * k - 0.25, 0, 0]; p.rSh = [0.2, 0, -0.75 * k - 0.16]; p.rEl = [-1.9 * k - 0.25, 0, 0]; } // manos en la cintura
  if (who === 'N' && li === 9) { const k = easeOut(range(lt, 0.6, 1.2)); p.chest[0] += 0.25 * k; p.neck[0] += 0.3 * k; p.lSh = [0.15, 0, 0.1]; p.rSh = [0.15, 0, -0.1]; p.lEl = [-0.1, 0, 0]; p.rEl = [-0.1, 0, 0]; }
  if (who === 'A' && li === 8) { p.head[1] += -0.25 * easeOut(r); p.neck[0] -= 0.08; }
  h.setPose(p);
  h.root.rotation.y = h.baseYaw;
  h.setMouth(mouthFor(who, t));
}

// ---------- cámaras ----------
const HEAD = { N: V(-0.4, 1.62, 0.1), A: V(0.42, 1.52, 0.1) };
function shotFor(i) {
  const L = LINES[i];
  const wide = i === 0 || i === 4 || i === 9;
  return ({ makeStage }) => {
    const W = world(makeStage);
    const c = cam(wide ? 30 : 24);
    return {
      scene: W.scene, camera: c,
      update(lt, t) {
        act(W.N, 'N', t); act(W.A, 'A', t);
        const s = shake(t, 1.2, i);
        if (wide) {
          const z = lerp(4.9, 4.5, smooth(lt / 4));
          place(c, [0.0 + s[0], 1.42 + s[1], z], [0.01, 1.12, 0]);
        } else {
          const me = HEAD[L.who], other = HEAD[L.who === 'N' ? 'A' : 'N'];
          const dir = me.clone().sub(other).normalize();
          const pos = other.clone().addScaledVector(dir, -1.25).add(V(0, 0.02, 1.6));
          const push = lerp(0, 0.18, smooth(lt / 2.5));
          pos.lerp(me, push * 0.4);
          place(c, [pos.x + s[0], pos.y + s[1], pos.z + s[2]], [me.x * 0.85 + other.x * 0.15, me.y - 0.2, me.z]);
        }
        return { bloom: 0.25, dof: wide ? undefined : { focus: 2.0, aperture: 0.0012, maxblur: 0.008 } };
      },
    };
  };
}
export const SHOTS = LINES.map((L, i) => ({
  start: i === 0 ? 0 : L.start - 0.12,
  end: i === LINES.length - 1 ? TOTAL + 1 : LINES[i + 1].start - 0.12,
  build: shotFor(i),
}));
