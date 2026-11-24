"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

// The falcon that guards the reactor. Feathered and metallic, not folded paper:
// a lathe-turned body, a hooked beak, and ~70 individual feathers on articulated wings.
// It orbits the dial, dives into the core when a module is chosen, and flies back out.

export type FalconPhase = "orbit" | "dive" | "emerge";
export type Stage = { x: number; y: number; r: number; compact?: boolean }; // dial centre and radius in canvas pixels; compact = a panel is open

type Look = {
  base: string; // feather root
  tip: string; // feather tip
  body: string;
  emissive: string;
  emissiveIntensity: number;
  fire: boolean;
};

const looks: Record<"dark" | "light", Look> = {
  // Rival Mode: gold titanium, glowing like a phoenix.
  dark: { base: "#6b3a12", tip: "#ffd27a", body: "#8a5a22", emissive: "#ff7a1a", emissiveIntensity: 0.22, fire: true },
  // Light mode: gunmetal with cyan feather tips.
  light: { base: "#2a2f3a", tip: "#8fd8e6", body: "#3a404d", emissive: "#000000", emissiveIntensity: 0, fire: false },
};

// ---------- geometry ----------

// One feather along +x: rounded root, widest near the middle, tapered tip, a slight camber.
function featherGeometry(len: number, width: number, base: THREE.Color, tip: THREE.Color) {
  const s = new THREE.Shape();
  s.moveTo(0, -width * 0.18);
  s.bezierCurveTo(len * 0.3, -width * 0.55, len * 0.75, -width * 0.5, len, 0);
  s.bezierCurveTo(len * 0.78, width * 0.42, len * 0.35, width * 0.5, 0, width * 0.18);
  s.lineTo(0, -width * 0.18);
  const g = new THREE.ShapeGeometry(s, 10);
  g.rotateX(-Math.PI / 2); // lie flat in x/z
  const pos = g.getAttribute("position") as THREE.BufferAttribute;
  const colors = new Float32Array(pos.count * 3);
  const c = new THREE.Color();
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const k = Math.min(1, Math.max(0, x / len));
    pos.setY(i, Math.sin(k * Math.PI) * width * 0.08 - k * k * width * 0.05); // camber and droop
    c.copy(base).lerp(tip, Math.pow(k, 1.6));
    colors.set([c.r, c.g, c.b], i * 3);
  }
  g.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  g.computeVertexNormals();
  return g;
}

function bodyGeometry() {
  // Teardrop profile turned around the long axis, then laid along +z (head forward).
  const prof = [
    [0.0, -1.0],
    [0.07, -0.9],
    [0.15, -0.62],
    [0.22, -0.28],
    [0.245, 0.0],
    [0.23, 0.26],
    [0.18, 0.5],
    [0.12, 0.64],
    [0.0, 0.7],
  ].map(([r, y]) => new THREE.Vector2(r, y));
  const g = new THREE.LatheGeometry(prof, 28);
  g.rotateX(Math.PI / 2);
  g.scale(1, 0.82, 1);
  return g;
}

function headGeometry() {
  const g = new THREE.SphereGeometry(0.16, 24, 18);
  g.scale(1, 0.92, 1.18);
  g.translate(0, 0.07, 0.8);
  return g;
}

function beakGeometry() {
  // Hooked raptor beak: a cone bent downward at the tip.
  const g = new THREE.ConeGeometry(0.055, 0.2, 12, 6);
  g.rotateX(Math.PI / 2);
  const pos = g.getAttribute("position") as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) {
    const z = Math.max(0, pos.getZ(i) + 0.1); // 0 at root, 0.2 at tip (clamped: pow of a tiny negative is NaN)
    pos.setY(i, pos.getY(i) - Math.pow(z / 0.2, 2.2) * 0.07);
  }
  g.computeVertexNormals();
  g.translate(0, 0.04, 1.0);
  return g;
}

type Feather = { g: THREE.BufferGeometry; x: number; y: number; z: number; yaw: number; roll: number };

function buildBird(look: Look) {
  const base = new THREE.Color(look.base);
  const tip = new THREE.Color(look.tip);
  const geos: Record<string, THREE.BufferGeometry> = {
    covert: featherGeometry(0.32, 0.2, base, tip),
    secondary: featherGeometry(0.6, 0.24, base, tip),
    primaryS: featherGeometry(0.72, 0.2, base, tip),
    primaryL: featherGeometry(0.98, 0.2, base, tip),
    tail: featherGeometry(0.62, 0.22, base, tip),
  };
  // Shoulder segment: coverts on top, inner secondaries underneath.
  const shoulder: Feather[] = [];
  for (let i = 0; i < 6; i++)
    shoulder.push({ g: geos.covert!, x: 0.05 + i * 0.11, y: 0.03, z: 0.08, yaw: Math.PI / 2 - 0.08, roll: 0 });
  for (let i = 0; i < 5; i++)
    shoulder.push({ g: geos.secondary!, x: 0.06 + i * 0.13, y: 0, z: 0.02, yaw: Math.PI / 2 + 0.05 - i * 0.02, roll: 0 });
  // Elbow segment: outer secondaries and a second covert row.
  const elbow: Feather[] = [];
  for (let i = 0; i < 6; i++)
    elbow.push({ g: geos.secondary!, x: 0.02 + i * 0.11, y: -0.004 * i, z: 0.0, yaw: Math.PI / 2 - 0.05 - i * 0.05, roll: 0 });
  for (let i = 0; i < 6; i++)
    elbow.push({ g: geos.covert!, x: 0.02 + i * 0.11, y: 0.03, z: 0.07, yaw: Math.PI / 2 - 0.15 - i * 0.04, roll: 0 });
  // Wrist: the primary fan, from swept-back to pointing out along the span.
  const wrist: Feather[] = [];
  for (let i = 0; i < 10; i++) {
    const k = i / 9;
    wrist.push({ g: k > 0.45 ? geos.primaryL! : geos.primaryS!, x: 0.02 + k * 0.12, y: -0.006 * i, z: 0, yaw: Math.PI / 2 - 0.35 - k * 1.05, roll: 0 });
  }
  const tail: Feather[] = [];
  for (let i = 0; i < 10; i++) {
    const k = i / 9 - 0.5;
    tail.push({ g: geos.tail!, x: k * 0.08, y: -0.01 + Math.abs(k) * -0.02, z: -0.85, yaw: Math.PI / 2 + k * 0.55, roll: 0 });
  }
  return { body: bodyGeometry(), head: headGeometry(), beak: beakGeometry(), shoulder, elbow, wrist, tail, geos };
}

// ---------- embers (Rival Mode) ----------
const EMBERS = 700;
const emberVertex = /* glsl */ `
  attribute float aLife;
  attribute float aSize;
  varying float vLife;
  void main() {
    vLife = aLife;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aSize * (0.35 + aLife * 0.9) * (10.0 / -mv.z);
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

// Studio reflections so the metal reads as metal. Attached to the scene as its environment map.
function Environment() {
  const gl = useThree((s) => s.gl);
  const env = useMemo(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const tex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();
    return tex;
  }, [gl]);
  useEffect(() => () => env.dispose(), [env]);
  return <primitive object={env} attach="environment" />;
}

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

function Falcon({ look, phase, stage, still }: { look: Look; phase: FalconPhase; stage: Stage; still: boolean }) {
  const size = useThree((s) => s.size);
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const bird = useMemo(() => buildBird(look), [look]);
  const mats = useMemo(
    () => ({
      feather: new THREE.MeshStandardMaterial({
        vertexColors: true,
        metalness: 0.92,
        roughness: 0.3,
        side: THREE.DoubleSide,
        emissive: look.emissive,
        emissiveIntensity: look.emissiveIntensity,
        envMapIntensity: 1.4,
      }),
      body: new THREE.MeshStandardMaterial({
        color: look.body,
        metalness: 0.95,
        roughness: 0.24,
        emissive: look.emissive,
        emissiveIntensity: look.emissiveIntensity * 0.8,
        envMapIntensity: 1.5,
      }),
      beak: new THREE.MeshStandardMaterial({ color: "#1b1d22", metalness: 0.6, roughness: 0.35 }),
      eye: new THREE.MeshBasicMaterial({ color: look.fire ? "#fff1b0" : "#00e5ff" }),
    }),
    [look],
  );

  const root = useRef<THREE.Group>(null);
  const rs = useRef<THREE.Group>(null);
  const re = useRef<THREE.Group>(null);
  const rw = useRef<THREE.Group>(null);
  const ls = useRef<THREE.Group>(null);
  const le = useRef<THREE.Group>(null);
  const lw = useRef<THREE.Group>(null);
  const embersRef = useRef<THREE.Points>(null);

  const embers = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(EMBERS * 3), 3));
    geo.setAttribute("aLife", new THREE.BufferAttribute(new Float32Array(EMBERS), 1));
    const sizes = new Float32Array(EMBERS);
    for (let i = 0; i < EMBERS; i++) sizes[i] = 3 + Math.random() * 7;
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

  // Mutable flight state lives in refs.
  const st = useRef({
    phase: phase as FalconPhase,
    since: 0,
    from: new THREE.Vector3(),
    pos: new THREE.Vector3(),
    prev: new THREE.Vector3(),
    flap: 0,
    amp: 0.3,
    tuck: 0,
    ang: 0,
    vel: new Float32Array(EMBERS * 3),
    age: new Float32Array(EMBERS),
    max: new Float32Array(EMBERS).fill(1),
    next: 0,
    tmp: new THREE.Vector3(),
    look: new THREE.Vector3(),
  });

  useFrame((state, delta) => {
    const g = root.current;
    if (!g) return;
    const S = st.current;
    const dt = still ? 0 : Math.min(delta, 0.05);
    const t = state.clock.getElapsedTime();

    // Pixel → world on the z = 0 plane (the dial's plane).
    const h = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z;
    const upp = h / size.height;
    const cx = (stage.x - size.width / 2) * upp;
    const cy = -(stage.y - size.height / 2) * upp;
    const R = stage.r * upp;
    const scale = R * 0.3;

    if (S.phase !== phase) {
      S.phase = phase;
      S.since = t;
      S.from.copy(S.pos);
    }
    const p = t - S.since;

    // Orbit: a tilted ellipse just outside the module ring, passing in front of the dial.
    S.ang += dt * 0.42;
    // With a panel open, keep the circuit tight to the dial so the bird never slips behind the panel.
    const rx = stage.compact ? R * 0.98 : R * 1.12;
    const orbit = S.tmp.set(cx + Math.cos(S.ang) * rx, cy + Math.sin(S.ang) * R * 0.5 + R * 0.08, 0.6 + Math.sin(S.ang) * R * 0.35);

    let vis = 1;
    let targetAmp = 0.22;
    let targetTuck = 0;
    let flapSpeed = 5.5;
    S.prev.copy(S.pos);
    if (phase === "orbit") {
      if (S.pos.lengthSq() === 0 || still) S.pos.copy(orbit);
      else S.pos.lerp(orbit, 1 - Math.exp(-dt * 3));
      // Glide most of the lap, beat the wings on the climb.
      const climbing = Math.cos(S.ang) > 0;
      targetAmp = climbing ? 0.55 : 0.08;
      flapSpeed = climbing ? 9 : 3;
    } else if (phase === "dive") {
      // Stoop: wings folded, accelerate into the core, shrink into it.
      const k = ease(Math.min(1, p / 0.85));
      S.pos.lerpVectors(S.from, new THREE.Vector3(cx, cy, -0.4), k);
      targetTuck = 1;
      targetAmp = 0;
      vis = 1 - Math.max(0, (p - 0.65) / 0.25);
      g.scale.setScalar(scale * (1 - k * 0.75));
    } else {
      // Burst out of the core, wings hammering, back up to the orbit.
      const k = ease(Math.min(1, p / 1.1));
      const start = S.look.set(cx, cy, -0.4);
      S.pos.lerpVectors(start, orbit, k);
      targetAmp = 0.75;
      flapSpeed = 12;
      g.scale.setScalar(scale * (0.25 + k * 0.75));
    }
    if (phase === "orbit") g.scale.setScalar(scale);
    g.visible = vis > 0.02;
    g.position.copy(S.pos);

    // Face the direction of travel. The bird's back faces the viewer, like a raptor circling below you,
    // so the full wingspan reads instead of a side-on sliver. Bank a little into the turn.
    const dir = S.look.copy(S.pos).sub(S.prev);
    if (dir.lengthSq() > 1e-8) {
      dir.normalize();
      if (Math.abs(dir.z) > 0.92) g.up.set(0, 1, 0);
      else g.up.set(0, 0, 1);
      const target = S.tmp.copy(S.pos).add(dir);
      g.lookAt(target);
      g.rotateZ(phase === "orbit" ? -Math.cos(S.ang) * 0.35 : 0);
    }

    // Wings.
    S.amp = THREE.MathUtils.damp(S.amp, targetAmp, 4, dt || 0.016);
    S.tuck = THREE.MathUtils.damp(S.tuck, targetTuck, 6, dt || 0.016);
    S.flap += dt * flapSpeed;
    const flap = Math.sin(S.flap) * S.amp;
    for (const [s, e, w] of [
      [rs.current, re.current, rw.current],
      [ls.current, le.current, lw.current],
    ]) {
      if (!s || !e || !w) continue;
      s.rotation.set(0, 0.5 * S.tuck, flap + 0.1 * (1 - S.tuck));
      e.rotation.set(0, 0.9 * S.tuck, Math.sin(S.flap - 0.6) * S.amp * 0.55);
      w.rotation.set(0, 0.75 * S.tuck, Math.sin(S.flap - 1.1) * S.amp * 0.45 - 0.05);
    }

    // Embers from the wings and tail in Rival Mode.
    const pts = embersRef.current;
    if (pts) {
      pts.visible = look.fire && !still;
      if (pts.visible) {
        const pos = pts.geometry.getAttribute("position") as THREE.BufferAttribute;
        const life = pts.geometry.getAttribute("aLife") as THREE.BufferAttribute;
        const pa = pos.array as Float32Array;
        const la = life.array as Float32Array;
        const segs = [rs.current, re.current, rw.current, ls.current, le.current, lw.current];
        const spawn = g.visible ? Math.round(10 + S.amp * 16) : 0;
        for (let n = 0; n < spawn; n++) {
          const onTail = Math.random() < 0.25;
          const src = onTail ? g : segs[Math.floor(Math.random() * segs.length)];
          if (!src) continue;
          const i = S.next;
          S.next = (S.next + 1) % EMBERS;
          if (onTail) S.tmp.set((Math.random() - 0.5) * 0.2, 0, -1.2 - Math.random() * 0.4);
          else S.tmp.set(Math.random() * 0.7, 0, -0.35 - Math.random() * 0.3);
          src.localToWorld(S.tmp);
          pa.set([S.tmp.x, S.tmp.y, S.tmp.z], i * 3);
          S.vel.set([(Math.random() - 0.5) * 0.15 - dir.x * 0.3, 0.1 + Math.random() * 0.25, (Math.random() - 0.5) * 0.15], i * 3);
          S.age[i] = 0;
          S.max[i] = 0.35 + Math.random() * 0.7;
        }
        for (let i = 0; i < EMBERS; i++) {
          if (S.age[i]! >= S.max[i]!) {
            la[i] = 0;
            continue;
          }
          S.age[i]! += dt;
          const k = i * 3;
          pa[k]! += S.vel[k]! * dt;
          pa[k + 1]! += S.vel[k + 1]! * dt;
          pa[k + 2]! += S.vel[k + 2]! * dt;
          la[i] = Math.max(0, 1 - S.age[i]! / S.max[i]!);
        }
        pos.needsUpdate = true;
        life.needsUpdate = true;
      }
    }
  });

  const feathers = (list: Feather[]) =>
    list.map((f, i) => (
      <mesh key={i} geometry={f.g} material={mats.feather} position={[f.x, f.y, f.z]} rotation={[0, f.yaw, f.roll]} />
    ));

  const wing = (side: 1 | -1, s: React.RefObject<THREE.Group | null>, e: React.RefObject<THREE.Group | null>, w: React.RefObject<THREE.Group | null>) => (
    <group position={[0.17 * side, 0.05, 0.12]} scale={[side, 1, 1]}>
      <group ref={s}>
        {feathers(bird.shoulder)}
        <group ref={e} position={[0.68, 0, 0]}>
          {feathers(bird.elbow)}
          <group ref={w} position={[0.66, 0, -0.02]}>
            {feathers(bird.wrist)}
          </group>
        </group>
      </group>
    </group>
  );

  return (
    <>
      <points ref={embersRef} frustumCulled={false}>
        <primitive object={embers} attach="geometry" />
        <primitive object={emberMat} attach="material" />
      </points>
      <group ref={root}>
        <mesh geometry={bird.body} material={mats.body} />
        <mesh geometry={bird.head} material={mats.body} />
        <mesh geometry={bird.beak} material={mats.beak} />
        <mesh position={[0.095, 0.11, 0.88]} material={mats.eye}>
          <sphereGeometry args={[0.022, 12, 10]} />
        </mesh>
        <mesh position={[-0.095, 0.11, 0.88]} material={mats.eye}>
          <sphereGeometry args={[0.022, 12, 10]} />
        </mesh>
        {wing(1, rs, re, rw)}
        {wing(-1, ls, le, lw)}
        {feathers(bird.tail)}
      </group>
    </>
  );
}

export default function FalconScene({
  dark,
  phase,
  stage,
  still,
}: {
  dark: boolean;
  phase: FalconPhase;
  stage: Stage;
  still: boolean;
}) {
  const look = dark ? looks.dark : looks.light;
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 10], fov: 35 }}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      frameloop={still ? "demand" : "always"}
      // The falcon flies over the dial but must never catch clicks meant for it.
      style={{ pointerEvents: "none" }}
      aria-hidden
    >
      <Environment />
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 6, 5]} intensity={dark ? 2.2 : 2.8} />
      <pointLight position={[0, 0, 2]} color={dark ? "#ffb020" : "#00e5ff"} intensity={dark ? 18 : 8} distance={12} />
      <Falcon look={look} phase={phase} stage={stage} still={still} />
    </Canvas>
  );
}
