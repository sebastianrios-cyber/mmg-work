import * as THREE from 'three';
import { lerp, smooth, easeOut, range, clamp, V, cam, place, shake } from './anim.js';
import { LINES, ENV, CAPS, TOTAL } from './data.js';

export const DURATION = TOTAL;
export const CAPTIONS = CAPS.map(c => c.length > 3 ? [c[0], c[1], c[3]] : [c[0], c[1]]);
export const FADES = [];

const M = (c, o = {}) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.62, ...o });
const box = (w, h, d, m, x = 0, y = 0, z = 0) => { const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); b.position.set(x, y, z); b.castShadow = b.receiveShadow = true; return b; };

// ---------- personaje de bloques ----------
function makeBlock(o) {
  const root = new THREE.Group();
  const skin = M(0xe8b48f, { roughness: 0.55 }), dark = M(0x1e130c), top = M(o.top), legs = M(o.legs), white = M(0xffffff, { roughness: 0.3 });
  // piernas
  for (const s of [-1, 1]) root.add(box(0.2, 0.62, 0.22, legs, s * 0.12, 0.31, 0));
  // torso
  const torso = new THREE.Group(); torso.position.y = 0.62; root.add(torso);
  torso.add(box(0.56, 0.62, 0.32, top, 0, 0.31, 0));
  if (o.strings) for (const s of [-1, 1]) torso.add(box(0.025, 0.18, 0.02, white, s * 0.06, 0.45, 0.17));
  if (o.collar) torso.add(box(0.5, 0.08, 0.34, M(o.collar), 0, 0.6, 0));
  // brazos con pivote en el hombro
  const arms = {};
  for (const s of [-1, 1]) {
    const piv = new THREE.Group(); piv.position.set(s * 0.37, 0.56, 0); torso.add(piv);
    piv.add(box(0.17, 0.55, 0.2, top, 0, -0.26, 0));
    piv.add(box(0.15, 0.13, 0.17, skin, 0, -0.58, 0));
    arms[s] = piv;
  }
  // cabeza
  const neck = new THREE.Group(); neck.position.y = 0.66; torso.add(neck);
  neck.add(box(0.14, 0.08, 0.14, skin, 0, 0.02, 0));
  const head = new THREE.Group(); head.position.y = 0.06; neck.add(head);
  const H = 0.52;
  head.add(box(H, H, H, skin, 0, H / 2, 0));
  // pelo
  const hairM = M(o.hair, { roughness: 0.8 });
  if (o.bun) {
    head.add(box(H + 0.04, 0.12, H + 0.04, hairM, 0, H + 0.02, -0.01));
    head.add(box(H + 0.04, 0.22, 0.1, hairM, 0, H - 0.06, -H / 2 + 0.02));
    head.add(box(0.2, 0.18, 0.2, hairM, 0, H + 0.15, -0.08));
  } else {
    const r = [[-0.18, 0.02, 0.18, 0.2], [0, 0.04, 0.2, 0.15], [0.17, 0.0, 0.16, -0.25], [-0.1, 0.0, -0.05, 0.1], [0.12, 0.02, -0.1, -0.1], [0, 0.0, -0.2, 0], [-0.2, -0.06, -0.15, 0.3], [0.21, -0.07, 0.05, -0.3]];
    for (const [x, y, z, rz] of r) { const b = box(0.2, 0.13, 0.2, hairM, x, H + 0.04 + y, z); b.rotation.set(0.08, 0, rz); head.add(b); }
    head.add(box(H + 0.03, 0.08, H + 0.03, hairM, 0, H - 0.01, -0.005));
  }
  // cara
  const browM = M(o.brow);
  const bL = box(0.13, 0.035, 0.03, browM, -0.1, 0.36, H / 2 + 0.01), bR = box(0.13, 0.035, 0.03, browM, 0.1, 0.36, H / 2 + 0.01);
  head.add(bL, bR);
  const eyeM = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const eL = box(0.03, 0.035, 0.01, eyeM, -0.1, 0.29, H / 2 + 0.006), eR = box(0.03, 0.035, 0.01, eyeM, 0.1, 0.29, H / 2 + 0.006);
  head.add(eL, eR);
  head.add(box(0.06, 0.075, 0.05, skin, 0, 0.22, H / 2 + 0.02));
  const mouth = box(0.16, 0.025, 0.012, M(0x2a0a0a), 0, 0.12, H / 2 + 0.005); head.add(mouth);
  if (o.glasses) { const g = M(0x222222, { metalness: 0.4, roughness: 0.3 }); for (const s of [-1, 1]) { head.add(box(0.13, 0.012, 0.012, g, s * 0.1, 0.33, H / 2 + 0.02)); head.add(box(0.13, 0.012, 0.012, g, s * 0.1, 0.25, H / 2 + 0.02)); head.add(box(0.012, 0.09, 0.012, g, s * 0.1 - 0.06, 0.29, H / 2 + 0.02)); head.add(box(0.012, 0.09, 0.012, g, s * 0.1 + 0.06, 0.29, H / 2 + 0.02)); } }
  if (o.blush) for (const s of [-1, 1]) head.add(box(0.07, 0.03, 0.005, M(0xff8aa0, { transparent: true, opacity: 0.6 }), s * 0.16, 0.19, H / 2 + 0.004));
  return { root, torso, head, neck, arms, mouth, bL, bR, eL, eR };
}

// ---------- mundo ----------
let W = null;
function world(makeStage) {
  if (W) return W;
  const scene = makeStage({ shadowSize: 3, sunDir: [-2.5, 4, 5], sun: 1.3 });
  scene.userData.key.color.set(0xb9c6ff);
  // luz de pantalla (el nieto mira la tele) y luz cálida de pasillo (abuela)
  const tvLight = new THREE.PointLight(0x4fd7ff, 1.6, 4); tvLight.position.set(-0.6, 1.4, 1.6); scene.add(tvLight);
  const warm = new THREE.PointLight(0xffb36b, 1.1, 4); warm.position.set(1.8, 2.3, 0.2); scene.add(warm);
  // suelo con cuadrícula brillante
  const grid = new THREE.GridHelper(20, 40, 0x3b5bff, 0x24307a); grid.position.y = 0.002; grid.material.transparent = true; grid.material.opacity = 0.55; scene.add(grid);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), M(0x0b1038, { roughness: 0.9 })); floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; scene.add(floor);
  // luces desenfocadas al fondo
  const cols = [0xffd27a, 0xff6fa8, 0x8fb4ff, 0xffffff, 0x9cf2ff];
  const tex = (() => { const c = document.createElement('canvas'); c.width = c.height = 64; const g = c.getContext('2d'); const r = g.createRadialGradient(32, 32, 0, 32, 32, 32); r.addColorStop(0, 'rgba(255,255,255,1)'); r.addColorStop(0.55, 'rgba(255,255,255,.7)'); r.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = r; g.fillRect(0, 0, 64, 64); return new THREE.CanvasTexture(c); })();
  let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  for (let i = 0; i < 70; i++) {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, color: cols[i % cols.length], transparent: true, opacity: 0.35 + rnd() * 0.45, depthWrite: false }));
    s.position.set((rnd() - 0.5) * 14, 0.8 + rnd() * 5, -4 - rnd() * 6); s.scale.setScalar(0.15 + rnd() * 0.35); scene.add(s);
  }
  // sofá de bloques y tele con consola
  const sofaM = M(0x2b3a8f);
  scene.add(box(2.2, 0.45, 0.8, sofaM, 0, 0.22, -1.2), box(2.2, 0.7, 0.25, sofaM, 0, 0.6, -1.55));
  const N = makeBlock({ top: 0xf2c21b, legs: 0x2a3550, hair: 0x2a180e, brow: 0x1e130c, strings: 1 });
  N.root.position.set(-0.42, 0, 0.15); N.root.rotation.y = 0.55; scene.add(N.root);
  const A = makeBlock({ top: 0xd9668a, legs: 0x5a4a6e, hair: 0xcfd0d8, brow: 0x8d8d96, bun: 1, glasses: 1, blush: 1, collar: 0xf5e6c8 });
  A.root.position.set(0.45, 0, 0.1); A.root.rotation.y = -0.55; A.root.scale.setScalar(0.94); scene.add(A.root);
  W = { scene, N, A };
  return W;
}

const lineAt = t => LINES.findIndex(L => t >= L.start && t < L.end);
const lastLine = t => { let k = -1; LINES.forEach((L, i) => { if (t >= L.start - 0.1) k = i; }); return k; };
function mouthAmt(who, t) { const i = lineAt(t); if (i < 0 || LINES[i].who !== who) return 0; const f = t * 30, a = ENV[Math.floor(f)] || 0, b = ENV[Math.floor(f) + 1] || 0; return clamp(lerp(a, b, f % 1) * 1.2); }

function act(c, who, t) {
  const li = Math.max(0, lastLine(t)), L = LINES[li], lt = t - L.start, r = easeOut(range(lt, 0, 0.3));
  const spk = lineAt(t) >= 0 && LINES[lineAt(t)].who === who;
  const m = mouthAmt(who, t);
  c.mouth.scale.set(1 - m * 0.3, 1 + m * 5, 1); c.mouth.position.y = 0.12 - m * 0.03;
  let brow = 0, browY = 0, armL = 0.05, armR = -0.05, armFwd = 0, nod = Math.sin(t * 1.4 + (who === 'A' ? 1 : 0)) * 0.02, tilt = 0, slump = 0, look = who === 'N' ? 0.28 : -0.28;
  if (spk) { nod += Math.sin(t * 8) * 0.04; armFwd = -0.4 + Math.sin(lt * 5) * 0.15; }
  if (who === 'N' && li === 0) { brow = -0.25; slump = 0.12; look = 0; }            // "ugh"
  if (who === 'N' && li === 1) { brow = 0.2; browY = 0.02; }                          // sorprendido
  if (who === 'A' && (li === 1 || li === 5)) { brow = -0.22; armFwd = -0.9 * r; }     // regaña
  if (who === 'A' && li === 3) { tilt = 0.12 * r; }
  if (who === 'N' && li === 4) { armL = 1.2 * r; armR = -1.2 * r; browY = 0.02; }     // orgulloso
  if (who === 'N' && li === 6) { armFwd = -1.2 * r; brow = 0.18; }                    // suplica
  if (who === 'A' && li === 8) { brow = 0.25; browY = 0.03; }                          // incrédula
  if (who === 'A' && li === 9) { tilt = -0.1 * r; }
  if (who === 'N' && li === 9) { const k = easeOut(range(lt, 0.4, 1.0)); slump = 0.15 * k; brow = -0.2 * k; }
  c.bL.rotation.z = -brow; c.bR.rotation.z = brow; c.bL.position.y = c.bR.position.y = 0.36 + browY;
  const bl = ((t + (who === 'A' ? 1.7 : 0)) % 3.4) < 0.11 ? 0.1 : 1; c.eL.scale.y = c.eR.scale.y = bl;
  c.arms[1].rotation.set(armFwd, 0, armL + Math.sin(t * 1.2) * 0.02); c.arms[-1].rotation.set(armFwd * (who === 'A' && armFwd < -0.5 ? 0.2 : 1), 0, armR - Math.sin(t * 1.2) * 0.02);
  c.neck.rotation.set(nod + slump, look, tilt);
  c.torso.rotation.x = slump * 0.6; c.root.position.y = Math.abs(Math.sin(t * 2)) * 0.004;
}

const HEAD = { N: V(-0.42, 1.62, 0.15), A: V(0.45, 1.55, 0.1) };
function shotFor(i) {
  const L = LINES[i];
  const wide = i === 0 || i === 4 || i === 9;
  return ({ makeStage }) => {
    const Wd = world(makeStage); const c = cam(wide ? 30 : 26);
    return {
      scene: Wd.scene, camera: c,
      update(lt, t) {
        act(Wd.N, 'N', t); act(Wd.A, 'A', t);
        const s = shake(t, 1.0, i);
        if (wide) { const z = lerp(5.4, 5.0, smooth(lt / 4)); place(c, [s[0], 1.5 + s[1], z], [0, 1.15, 0]); return { bloom: 0.5, dof: { focus: z, aperture: 0.0016, maxblur: 0.012 } }; }
        const me = HEAD[L.who], sgn = L.who === 'N' ? 1 : -1;
        const d = lerp(2.9, 2.6, smooth(lt / 3));
        const pos = me.clone().add(V(sgn * 0.75, 0.0, d));
        place(c, [pos.x + s[0], pos.y + s[1], pos.z + s[2]], [me.x - sgn * 0.05, me.y - 0.12, me.z]);
        return { bloom: 0.5, dof: { focus: pos.distanceTo(me), aperture: 0.0022, maxblur: 0.014 } };
      },
    };
  };
}
export const SHOTS = LINES.map((L, i) => ({ start: i === 0 ? 0 : L.start - 0.1, end: i === LINES.length - 1 ? TOTAL + 1 : LINES[i + 1].start - 0.1, build: shotFor(i) }));
