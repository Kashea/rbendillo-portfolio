"use client";

import { useEffect, useMemo, useRef, useSyncExternalStore } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const COLS = 160;
const ROWS = 80;
const SPACING = 0.15;

// Restrained cyberpunk: a signal field graded cyan to magenta, soft glowing points,
// and one slow scan line. All motion runs on the GPU.
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

const palette = {
  dark: { a: "#3ff2e6", b: "#ff3ec8", opacity: 0.95, blending: THREE.NormalBlending },
  light: { a: "#0b8a92", b: "#b3247f", opacity: 0.9, blending: THREE.NormalBlending },
};

function Field({ dark, still }: { dark: boolean; still: boolean }) {
  const pointer = useRef(new THREE.Vector2(0, 0));
  const p = dark ? palette.dark : palette.light;

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
      uSize: { value: 4.5 },
      uScan: { value: still ? 0 : 1 },
      uA: { value: new THREE.Color(p.a) },
      uB: { value: new THREE.Color(p.b) },
      uOpacity: { value: p.opacity },
    }),
    [p, still],
  );
  const mat = useRef<THREE.ShaderMaterial>(null);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.set((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((state) => {
    if (still) return;
    if (mat.current) mat.current.uniforms.uTime!.value = state.clock.getElapsedTime();
    const cam = state.camera.position;
    cam.setX(cam.x + (pointer.current.x * 0.8 - cam.x) * 0.03);
    cam.setY(cam.y + (2.6 - pointer.current.y * 0.4 - cam.y) * 0.03);
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <points rotation={[0, -0.25, 0]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <shaderMaterial
        key={dark ? "dark" : "light"}
        vertexShader={vertex}
        fragmentShader={fragment}
        ref={mat}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={p.blending}
      />
    </points>
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

export default function HeroScene() {
  const dark = useSyncExternalStore(subscribe, () => document.documentElement.classList.contains("dark"), () => true);
  const still = useSyncExternalStore(subscribe, () => window.matchMedia(REDUCE).matches, () => false);

  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 2.6, 6.5], fov: 50 }}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      frameloop={still ? "demand" : "always"}
      aria-hidden
    >
      <Field dark={dark} still={still} />
    </Canvas>
  );
}
