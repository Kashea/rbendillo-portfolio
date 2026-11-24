"use client";

import { useEffect, useMemo, useRef, useSyncExternalStore } from "react";
import { Canvas, useFrame, useThree, type ThreeElements } from "@react-three/fiber";
import * as THREE from "three";

// ---------------------------------------------------------------------------
// Signal field: the terrain the peregrine hunts over. All motion runs on the GPU.
// ---------------------------------------------------------------------------
const COLS = 160;
const ROWS = 80;
const SPACING = 0.15;

const vertex = /* glsl */ `
  uniform float uTime;
  uniform float uSize;
  uniform float uScan;
  varying float vMix;
  varying float vGlow;
  varying float vFade;

  void main() {
    vec3 p = position;
    float t = uTime * 0.55;
    p.y = sin(p.x * 0.45 + t) * 0.35
        + cos(p.z * 0.6 + t * 0.8) * 0.25
        + sin((p.x + p.z) * 0.25 + t * 0.5) * 0.2;

    // scan line sweeping toward the viewer
    float scanZ = mod(uTime * 1.4, 18.0) - 9.0;
    float band = exp(-pow(p.z - scanZ, 2.0) * 3.0) * uScan;

    vMix = smoothstep(-9.0, 9.0, p.x + sin(p.z * 0.3) * 2.0);
    vGlow = 0.7 + smoothstep(-0.4, 0.8, p.y) * 0.6 + band * 1.8;
    // smoothstep needs edge0 < edge1 in GLSL, so fade with 1 - smoothstep
    vFade = (1.0 - smoothstep(1.5, 6.0, abs(p.z + 0.5))) * (1.0 - smoothstep(6.0, 12.0, abs(p.x)));

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * (1.0 + band * 0.9) * (6.0 / -mv.z);
  }
`;

const fragment = /* glsl */ `
  uniform vec3 uA;
  uniform vec3 uB;
  uniform float uOpacity;
  varying float vMix;
  varying float vGlow;
  varying float vFade;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float core = 1.0 - smoothstep(0.12, 0.5, d);
    float a = core * vFade * uOpacity;
    if (a < 0.01) discard;
    vec3 col = mix(uA, uB, vMix) * vGlow;
    gl_FragColor = vec4(col, a);
  }
`;

// Rival Peregrine palette: neon on ink in Rival Mode, deep tones on paper in light mode.
const palette = {
  dark: {
    a: "#00E5FF",
    b: "#FF2BD6",
    field: 0.7,
    body: "#1A1D26",
    plate: "#2B3040",
    // Rival Mode: the peregrine rises as a phoenix in golden fire over the neon field.
    edge: "#FFC23A",
    eye: "#FFF4C2",
    additive: true,
    fire: true,
    trailA: "#FFF1A8",
    trailB: "#FF3D00",
  },
  light: {
    a: "#0091A8",
    b: "#C2189B",
    field: 0.55,
    body: "#262A35",
    plate: "#3A4152",
    edge: "#0091A8",
    eye: "#C2189B",
    additive: false,
    fire: false,
    trailA: "#0091A8",
    trailB: "#C2189B",
  },
};
type Palette = (typeof palette)["dark"] | (typeof palette)["light"];

function Field({ p, still }: { p: Palette; still: boolean }) {
  const mat = useRef<THREE.ShaderMaterial>(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(COLS * ROWS * 3);
    let i = 0;
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        arr[i++] = (c - COLS / 2) * SPACING;
        arr[i++] = 0;
        arr[i++] = (r - ROWS / 2) * SPACING;
      }
    }
    return arr;
  }, []);

  // Initial uniforms only. Every later change goes through the material ref.
  const uniforms = useMemo(
    () => ({
      uTime: { value: 2 },
      uSize: { value: 4 },
      uScan: { value: still ? 0 : 1 },
      uA: { value: new THREE.Color(p.a) },
      uB: { value: new THREE.Color(p.b) },
      uOpacity: { value: p.field },
    }),
    [p, still],
  );

  useFrame((state) => {
    if (!still && mat.current) mat.current.uniforms.uTime!.value = state.clock.getElapsedTime();
  });

  return (
    <points rotation={[0, -0.25, 0]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <shaderMaterial
        key={p.a}
        ref={mat}
        vertexShader={vertex}
        fragmentShader={fragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </points>
  );
}

// ---------------------------------------------------------------------------
// The mech peregrine: faceted gunmetal plates traced with neon circuit edges.
// Built from primitives, so there is no model file to download.
// ---------------------------------------------------------------------------

// A flat wing or tail panel drawn in the x/z plane (x = span, z = chord, +z = forward).
function panel(pts: [number, number][], depth = 0.03) {
  const shape = new THREE.Shape(pts.map(([x, z]) => new THREE.Vector2(x, z)));
  const g = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: false });
  g.rotateX(Math.PI / 2);
  g.translate(0, depth / 2, 0);
  return g;
}

function buildGeometry() {
  const body = new THREE.OctahedronGeometry(1, 0);
  body.scale(0.26, 0.2, 0.95);
  const keel = new THREE.OctahedronGeometry(1, 0);
  keel.scale(0.13, 0.12, 0.55);
  keel.translate(0, -0.13, 0.12);
  const head = new THREE.OctahedronGeometry(1, 0);
  head.scale(0.17, 0.16, 0.25);
  head.translate(0, 0.07, 0.92);
  const beak = new THREE.ConeGeometry(0.06, 0.2, 4);
  beak.rotateX(Math.PI / 2);
  beak.translate(0, 0.01, 1.2);
  const visor = new THREE.BoxGeometry(0.3, 0.035, 0.07);
  visor.translate(0, 0.12, 1.0);
  const seg1 = panel([
    [0, 0.3],
    [0.72, 0.24],
    [0.72, -0.2],
    [0, -0.28],
  ]);
  const seg2 = panel([
    [0, 0.24],
    [0.72, 0.16],
    [0.7, -0.16],
    [0, -0.2],
  ]);
  const seg3 = panel([
    [0, 0.16],
    [0.7, -0.06],
    [0.62, -0.2],
    [0, -0.16],
  ]);
  const blade = new THREE.BoxGeometry(0.5, 0.018, 0.06);
  blade.translate(0.25, 0, 0);
  const trim = new THREE.BoxGeometry(0.72, 0.022, 0.026);
  trim.translate(0.36, 0.022, 0.27);
  const tail = new THREE.BoxGeometry(0.07, 0.018, 0.52);
  tail.translate(0, 0, -0.26);

  const parts = { body, keel, head, beak, visor, seg1, seg2, seg3, blade, trim, tail };
  const edges = Object.fromEntries(
    Object.entries(parts).map(([k, g]) => [k, new THREE.EdgesGeometry(g, 18)]),
  ) as unknown as Record<keyof typeof parts, THREE.EdgesGeometry>;
  return { ...parts, edges };
}
type Geo = ReturnType<typeof buildGeometry>;
type Mats = {
  body: THREE.Material;
  plate: THREE.Material;
  edge: THREE.Material;
  glow: THREE.Material;
  eye: THREE.Material;
};

function Plate({
  g,
  k,
  m,
  material,
  ...props
}: { g: Geo; k: Exclude<keyof Geo, "edges">; m: Mats; material?: THREE.Material } & ThreeElements["group"]) {
  return (
    <group {...props}>
      <mesh geometry={g[k]} material={material ?? m.plate} />
      <lineSegments geometry={g.edges[k]} material={m.edge} />
    </group>
  );
}


// ---------------------------------------------------------------------------
// Phoenix fire: embers shed from the wingtips and tail, cooling from white-gold to ember red.
// ---------------------------------------------------------------------------
const EMBERS = 900;
const emberVertex = /* glsl */ `
  attribute float aLife;
  attribute float aSize;
  varying float vLife;
  void main() {
    vLife = aLife;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aSize * (0.35 + aLife * 0.9) * (6.0 / -mv.z);
  }
`;
const emberFragment = /* glsl */ `
  varying float vLife;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float soft = 1.0 - smoothstep(0.0, 0.5, d);
    if (soft * vLife < 0.01) discard;
    vec3 white = vec3(1.0, 0.97, 0.82);
    vec3 gold = vec3(1.0, 0.74, 0.16);
    vec3 orange = vec3(1.0, 0.36, 0.04);
    vec3 red = vec3(0.55, 0.06, 0.02);
    vec3 col = vLife > 0.66 ? mix(gold, white, (vLife - 0.66) / 0.34)
             : vLife > 0.33 ? mix(orange, gold, (vLife - 0.33) / 0.33)
             : mix(red, orange, vLife / 0.33);
    gl_FragColor = vec4(col, soft * pow(vLife, 0.7));
  }
`;

function haloTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const x = c.getContext("2d")!;
  const g = x.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, "rgba(255,236,170,0.9)");
  g.addColorStop(0.25, "rgba(255,176,40,0.55)");
  g.addColorStop(0.6, "rgba(255,80,0,0.18)");
  g.addColorStop(1, "rgba(255,40,0,0)");
  x.fillStyle = g;
  x.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
}

// Flight loop, 18 seconds: flap, soar, stoop dive, pull up, soar.
const CYCLE = 18;
function phaseAt(t: number) {
  const c = t % CYCLE;
  if (c < 3) return { amp: 0.55, freq: 7, tuck: 0 };
  if (c < 10) return { amp: 0.07, freq: 1.6, tuck: 0 };
  if (c < 12.4) return { amp: 0, freq: 0, tuck: 1 };
  if (c < 14.6) return { amp: 0.62, freq: 8, tuck: 0 };
  return { amp: 0.07, freq: 1.6, tuck: 0 };
}
function diveOffset(t: number) {
  const c = t % CYCLE;
  if (c < 10 || c > 14.6) return 0;
  const s = (c - 10) / 4.6;
  return -1.05 * Math.sin(Math.PI * s) * (1 - s * 0.35);
}

const TRAIL = 56;

function Peregrine({ p, still }: { p: Palette; still: boolean }) {
  const aspect = useThree((s) => s.size.width / Math.max(1, s.size.height));
  const wide = aspect > 1.1;
  const center = useMemo(
    () => (wide ? new THREE.Vector3(3.35, 1.75, -0.6) : new THREE.Vector3(0.2, 2.35, -0.7)),
    [wide],
  );
  const radius = wide ? 1.0 : 0.7;
  const scale = wide ? 0.55 : 0.4;

  const g = useMemo(() => buildGeometry(), []);
  const m = useMemo<Mats>(
    () => ({
      body: new THREE.MeshStandardMaterial({
        color: p.fire ? "#2A1A0C" : p.body,
        metalness: 0.85,
        roughness: 0.32,
        flatShading: true,
        emissive: p.fire ? "#FF8A1A" : "#000000",
        emissiveIntensity: p.fire ? 0.3 : 0,
      }),
      plate: new THREE.MeshStandardMaterial({
        color: p.fire ? "#3A2410" : p.plate,
        metalness: 0.8,
        roughness: 0.36,
        flatShading: true,
        side: THREE.DoubleSide,
        emissive: p.fire ? "#FF6A00" : "#000000",
        emissiveIntensity: p.fire ? 0.38 : 0,
      }),
      edge: new THREE.LineBasicMaterial({
        color: p.edge,
        transparent: true,
        opacity: 0.95,
        blending: p.additive ? THREE.AdditiveBlending : THREE.NormalBlending,
      }),
      glow: new THREE.MeshBasicMaterial({ color: p.edge }),
      eye: new THREE.MeshBasicMaterial({ color: p.eye }),
    }),
    [p],
  );

  const trail = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(TRAIL * 3), 3));
    const colors = new Float32Array(TRAIL * 3);
    const a = new THREE.Color(p.trailA);
    const b = new THREE.Color(p.trailB);
    const c = new THREE.Color();
    for (let i = 0; i < TRAIL; i++) {
      c.copy(a).lerp(b, i / (TRAIL - 1));
      colors.set([c.r, c.g, c.b], i * 3);
    }
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return geo;
  }, [p]);
  const trailMat = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 0.55,
        blending: p.additive ? THREE.AdditiveBlending : THREE.NormalBlending,
      }),
    [p],
  );

  const embers = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(EMBERS * 3), 3));
    geo.setAttribute("aLife", new THREE.BufferAttribute(new Float32Array(EMBERS), 1));
    const sizes = new Float32Array(EMBERS);
    for (let i = 0; i < EMBERS; i++) sizes[i] = 3 + Math.random() * 8;
    geo.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    return geo;
  }, []);
  const emberMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: emberVertex,
        fragmentShader: emberFragment,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [],
  );
  const halo = useMemo(
    () =>
      p.fire
        ? new THREE.SpriteMaterial({ map: haloTexture(), blending: THREE.AdditiveBlending, depthWrite: false, transparent: true })
        : null,
    [p],
  );
  const emberPoints = useRef<THREE.Points>(null);
  const haloSprite = useRef<THREE.Sprite>(null);
  // Mutable particle state lives in a ref, outside React's render data.
  const sim = useRef({
    vel: new Float32Array(EMBERS * 3),
    age: new Float32Array(EMBERS),
    max: new Float32Array(EMBERS).fill(1),
    next: 0,
    p: new THREE.Vector3(),
  });

  const bird = useRef<THREE.Group>(null);
  const trailLine = useRef<THREE.Line>(null);
  const rs = useRef<THREE.Group>(null);
  const re = useRef<THREE.Group>(null);
  const rw = useRef<THREE.Group>(null);
  const ls = useRef<THREE.Group>(null);
  const le = useRef<THREE.Group>(null);
  const lw = useRef<THREE.Group>(null);
  const motion = useRef({ amp: 0.07, tuck: 0, freq: 1.6, phase: 0, primed: false });
  const tmp = useRef({ a: new THREE.Vector3(), b: new THREE.Vector3(), c: new THREE.Vector3() });

  const pathAt = (t: number, out: THREE.Vector3) => {
    const ang = t * 0.33;
    return out.set(
      center.x + radius * Math.cos(ang),
      center.y + 0.22 * Math.sin(t * 0.9) + diveOffset(t),
      center.z + radius * 0.6 * Math.sin(ang),
    );
  };

  useFrame((state, delta) => {
    const b = bird.current;
    if (!b) return;
    const t = still ? 5 : state.clock.getElapsedTime();
    const dt = still ? 1 : Math.min(delta, 0.05);
    const mo = motion.current;
    const target = phaseAt(t);
    mo.amp = THREE.MathUtils.damp(mo.amp, target.amp, 5, dt);
    mo.tuck = THREE.MathUtils.damp(mo.tuck, target.tuck, 4, dt);
    mo.freq = THREE.MathUtils.damp(mo.freq, target.freq, 4, dt);
    mo.phase += dt * mo.freq;

    // Wings: shoulder leads, elbow and wrist follow with a lag; tuck sweeps them back for the dive.
    const dihedral = 0.12 * (1 - mo.tuck);
    const flap = Math.sin(mo.phase) * mo.amp;
    for (const [s, e, w] of [
      [rs.current, re.current, rw.current],
      [ls.current, le.current, lw.current],
    ]) {
      if (!s || !e || !w) continue;
      s.rotation.set(0, 0.55 * mo.tuck, flap + dihedral + 0.12 * mo.tuck);
      e.rotation.set(0, 0.95 * mo.tuck, Math.sin(mo.phase - 0.6) * mo.amp * 0.6 - 0.05);
      w.rotation.set(0, 0.55 * mo.tuck, Math.sin(mo.phase - 1.1) * mo.amp * 0.5);
    }

    // Body: follow the path, face along it, and bank into the turn.
    const { a, b: ahead, c: behind } = tmp.current;
    pathAt(t, a);
    pathAt(t + 0.06, ahead);
    pathAt(t - 0.06, behind);
    b.position.copy(a);
    b.lookAt(ahead);
    const v0x = a.x - behind.x;
    const v0z = a.z - behind.z;
    const v1x = ahead.x - a.x;
    const v1z = ahead.z - a.z;
    const turn = v0x * v1z - v0z * v1x;
    b.rotateZ(THREE.MathUtils.clamp(turn * 900, -0.75, 0.75));

    // Contrail from the tail, newest point first.
    const line = trailLine.current;
    if (line) {
      // In phoenix mode the embers are the wake, so the thin contrail stays hidden.
      line.visible = !still && !p.fire;
      const pos = line.geometry.getAttribute("position") as THREE.BufferAttribute;
      const arr = pos.array as Float32Array;
      const tailX = a.x - (ahead.x - a.x) * 4;
      const tailY = a.y - (ahead.y - a.y) * 4;
      const tailZ = a.z - (ahead.z - a.z) * 4;
      if (!mo.primed) {
        for (let i = 0; i < TRAIL; i++) arr.set([tailX, tailY, tailZ], i * 3);
        mo.primed = true;
      }
      arr.copyWithin(3, 0, (TRAIL - 1) * 3);
      arr.set([tailX, tailY, tailZ], 0);
      pos.needsUpdate = true;
      line.geometry.computeBoundingSphere();
    }

    // Phoenix embers: spawn on wingtips and tail, rise, drift back and cool.
    const pts = emberPoints.current;
    if (pts) {
      pts.visible = p.fire && !still;
      if (pts.visible) {
        const S = sim.current;
        const pos = pts.geometry.getAttribute("position") as THREE.BufferAttribute;
        const life = pts.geometry.getAttribute("aLife") as THREE.BufferAttribute;
        const parr = pos.array as Float32Array;
        const larr = life.array as Float32Array;
        // Emit along the trailing edge of every wing segment and from the tail fan,
        // so the flame reads as one continuous wake rather than puffs.
        const segs = [rs.current, re.current, rw.current, ls.current, le.current, lw.current];
        const spawn = Math.round(16 + mo.amp * 14);
        for (let n = 0; n < spawn; n++) {
          const onTail = Math.random() < 0.28;
          const src = onTail ? b : segs[Math.floor(Math.random() * segs.length)]!;
          if (!src) continue;
          const i = S.next;
          S.next = (S.next + 1) % EMBERS;
          if (onTail) S.p.set((Math.random() - 0.5) * 0.25, 0.02, -1.05 - Math.random() * 0.35);
          else S.p.set(Math.random() * 0.72, (Math.random() - 0.5) * 0.04, -0.12 - Math.random() * 0.12);
          src.localToWorld(S.p);
          parr.set([S.p.x, S.p.y, S.p.z], i * 3);
          S.vel.set(
            [
              (Math.random() - 0.5) * 0.18 - (ahead.x - a.x) * 9,
              0.12 + Math.random() * 0.28,
              (Math.random() - 0.5) * 0.18 - (ahead.z - a.z) * 9,
            ],
            i * 3,
          );
          S.age[i] = 0;
          S.max[i] = 0.35 + Math.random() * 0.75;
        }
        for (let i = 0; i < EMBERS; i++) {
          if (S.age[i]! >= S.max[i]!) {
            larr[i] = 0;
            continue;
          }
          S.age[i]! += dt;
          const k = i * 3;
          S.vel[k + 1]! += dt * 0.25;
          parr[k]! += S.vel[k]! * dt;
          parr[k + 1]! += S.vel[k + 1]! * dt;
          parr[k + 2]! += S.vel[k + 2]! * dt;
          larr[i] = Math.max(0, 1 - S.age[i]! / S.max[i]!);
        }
        pos.needsUpdate = true;
        life.needsUpdate = true;
        pts.geometry.computeBoundingSphere();
      }
    }
    const hs = haloSprite.current;
    if (hs) {
      hs.position.copy(a);
      const flick = 0.82 + Math.sin(t * 9) * 0.06 + Math.sin(t * 23) * 0.04;
      hs.scale.setScalar(scale * 3.4 * flick);
      (hs.material as THREE.SpriteMaterial).opacity = still ? 0.6 : flick;
    }

    // Gentle parallax from the pointer.
    if (!still) {
      const cam = state.camera.position;
      cam.setX(cam.x + (state.pointer.x * 0.6 - cam.x) * 0.03);
      cam.setY(cam.y + (2.6 - state.pointer.y * 0.3 - cam.y) * 0.03);
      state.camera.lookAt(0, 0.4, 0);
    }
  });

  const wing = (
    side: 1 | -1,
    s: React.RefObject<THREE.Group | null>,
    e: React.RefObject<THREE.Group | null>,
    w: React.RefObject<THREE.Group | null>,
  ) => (
    <group position={[0.2 * side, 0.04, 0.05]} scale={[side, 1, 1]}>
      <group ref={s}>
        <Plate g={g} k="seg1" m={m} />
        <mesh geometry={g.trim} material={m.glow} />
        <group ref={e} position={[0.72, 0, 0]}>
          <Plate g={g} k="seg2" m={m} />
          <group ref={w} position={[0.72, 0, 0]}>
            <Plate g={g} k="seg3" m={m} />
            {[0.12, 0.27, 0.42, 0.55].map((x, i) => (
              <Plate key={x} g={g} k="blade" m={m} position={[x, 0, -0.14 + i * 0.03]} rotation={[0, 0.42 + i * 0.12, 0]} />
            ))}
          </group>
        </group>
      </group>
    </group>
  );

  return (
    <>
      <line ref={trailLine as never}>
        <primitive object={trail} attach="geometry" />
        <primitive object={trailMat} attach="material" />
      </line>
      {halo && <sprite ref={haloSprite} material={halo} />}
      <points ref={emberPoints} frustumCulled={false}>
        <primitive object={embers} attach="geometry" />
        <primitive object={emberMat} attach="material" />
      </points>
      <group ref={bird} scale={scale}>
        <Plate g={g} k="body" m={m} material={m.body} />
        <Plate g={g} k="keel" m={m} material={m.body} />
        <Plate g={g} k="head" m={m} material={m.body} />
        <Plate g={g} k="beak" m={m} />
        <mesh geometry={g.visor} material={m.eye} />
        {wing(1, rs, re, rw)}
        {wing(-1, ls, le, lw)}
        {[-2, -1, 0, 1, 2].map((i) => (
          <Plate key={i} g={g} k="tail" m={m} position={[i * 0.045, 0.02, -0.72]} rotation={[0.05, i * 0.17, 0]} />
        ))}
      </group>
    </>
  );
}

const REDUCE = "(prefers-reduced-motion: reduce)";

function subscribe(cb: () => void) {
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  const mq = window.matchMedia(REDUCE);
  mq.addEventListener("change", cb);
  return () => {
    mo.disconnect();
    mq.removeEventListener("change", cb);
  };
}

function Lights({ p }: { p: Palette }) {
  return (
    <>
      <ambientLight intensity={p.additive ? 0.35 : 0.9} />
      <directionalLight position={[3, 5, 4]} intensity={p.additive ? 1.4 : 2.2} />
      <pointLight position={[3, 2.5, 2]} color={p.fire ? "#FFB020" : p.a} intensity={p.additive ? 16 : 6} distance={9} />
      <pointLight position={[0, 1, -2]} color={p.b} intensity={p.additive ? 10 : 4} distance={8} />
    </>
  );
}

export default function HeroScene() {
  const dark = useSyncExternalStore(subscribe, () => document.documentElement.classList.contains("dark"), () => false);
  const still = useSyncExternalStore(subscribe, () => window.matchMedia(REDUCE).matches, () => false);
  const p = dark ? palette.dark : palette.light;

  // Release the GPU context cleanly when the hero unmounts.
  useEffect(() => () => THREE.Cache.clear(), []);

  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 2.6, 6.5], fov: 50 }}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      frameloop={still ? "demand" : "always"}
      aria-hidden
    >
      <Lights p={p} />
      <Field p={p} still={still} />
      <Peregrine p={p} still={still} />
    </Canvas>
  );
}
