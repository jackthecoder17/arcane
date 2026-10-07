"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import { seeded, useMediaQuery } from "@/lib/use-media-query";

/*
 * Performance notes:
 * - No post-processing. Glow comes from additive sprites, which are nearly free.
 * - Particle motion runs entirely in the vertex shader (one draw call per system,
 *   zero per-frame CPU work besides a uniform update).
 * - DPR adapts down via PerformanceMonitor, and rendering stops when the hero
 *   is off-screen or the user prefers reduced motion.
 */

const pointer = { x: 0, y: 0 };

function usePointer() {
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);
}

/** Soft radial texture shared by every glow sprite. */
function useGlowTexture() {
  return useMemo(() => {
    const size = 128;
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    g.addColorStop(0, "rgba(255,255,255,1)");
    g.addColorStop(0.25, "rgba(255,255,255,0.45)");
    g.addColorStop(0.6, "rgba(255,255,255,0.08)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);
}

const crystalVertex = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vView;
  varying vec3 vPos;
  void main() {
    vPos = position;
    vNormal = normalize(normalMatrix * normal);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vView = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;

const crystalFragment = /* glsl */ `
  uniform float uTime;
  varying vec3 vNormal;
  varying vec3 vView;
  varying vec3 vPos;
  void main() {
    float fres = pow(1.0 - max(dot(vNormal, vView), 0.0), 2.2);
    float bands = 0.5 + 0.5 * sin(vPos.y * 9.0 - uTime * 2.4);
    float facet = 0.55 + 0.45 * dot(vNormal, normalize(vec3(0.4, 0.8, 0.5)));
    vec3 deep = vec3(0.02, 0.12, 0.35);
    vec3 cyan = vec3(0.30, 0.86, 1.0);
    vec3 col = mix(deep, cyan, 0.25 + 0.55 * bands * facet);
    col += vec3(0.85, 1.0, 1.0) * fres * 1.3;
    gl_FragColor = vec4(col, 0.94);
  }
`;

const particleVertex = /* glsl */ `
  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uKind; // 0 = orbiting the crystal, 1 = drifting dust
  attribute float aRadius;
  attribute float aAngle;
  attribute float aSpeed;
  attribute float aY;
  attribute float aSize;
  attribute vec3 aColor;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    vec3 p;
    float alpha;
    if (uKind < 0.5) {
      float a = aAngle + uTime * aSpeed;
      float r = aRadius + sin(uTime * 0.8 + aAngle * 3.0) * 0.08;
      p = vec3(cos(a) * r, aY + sin(uTime * 0.6 + aAngle) * 0.12, sin(a) * r);
      alpha = 0.95;
    } else {
      float y = mod(aY + uTime * aSpeed, 12.0) - 6.0;
      p = vec3(cos(aAngle) * aRadius, y, sin(aAngle) * aRadius - 3.0);
      alpha = (0.35 + 0.35 * sin(uTime * 1.7 + aAngle * 13.0)) * smoothstep(6.0, 4.0, abs(y));
    }
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aSize * uPixelRatio * (9.0 / -mv.z);
    vColor = aColor;
    vAlpha = alpha;
  }
`;

const particleFragment = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d);
    gl_FragColor = vec4(vColor, a * a * vAlpha);
  }
`;

const palette = [new THREE.Color("#4fd8ff"), new THREE.Color("#e8b866"), new THREE.Color("#ff3fa4"), new THREE.Color("#9b5cff")];

function Particles({ count, kind }: { count: number; kind: 0 | 1 }) {
  const { gl } = useThree();
  const material = useRef<THREE.ShaderMaterial>(null);

  const geometry = useMemo(() => {
    const rand = seeded(kind === 0 ? 11 : 23);
    const radius = new Float32Array(count);
    const angle = new Float32Array(count);
    const speed = new Float32Array(count);
    const y = new Float32Array(count);
    const size = new Float32Array(count);
    const color = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      if (kind === 0) {
        radius[i] = 1.2 + Math.pow(rand(), 1.6) * 2.2;
        speed[i] = (0.15 + rand() * 0.35) * (rand() > 0.5 ? 1 : -1) * (1.6 / radius[i]);
        y[i] = (rand() - 0.5) * 0.9 * (1.0 - (radius[i] - 1.2) / 3);
        size[i] = 1.5 + rand() * 3.5;
      } else {
        radius[i] = 2 + rand() * 9;
        speed[i] = 0.08 + rand() * 0.25;
        y[i] = rand() * 12;
        size[i] = 1 + rand() * 3;
      }
      angle[i] = rand() * Math.PI * 2;
      const c = palette[Math.floor(rand() * (kind === 0 ? 2.6 : 4))];
      color.set([c.r, c.g, c.b], i * 3);
    }
    const g = new THREE.BufferGeometry();
    // positions are computed in the shader; this attribute only sets the vertex count
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(count * 3), 3));
    g.setAttribute("aRadius", new THREE.BufferAttribute(radius, 1));
    g.setAttribute("aAngle", new THREE.BufferAttribute(angle, 1));
    g.setAttribute("aSpeed", new THREE.BufferAttribute(speed, 1));
    g.setAttribute("aY", new THREE.BufferAttribute(y, 1));
    g.setAttribute("aSize", new THREE.BufferAttribute(size, 1));
    g.setAttribute("aColor", new THREE.BufferAttribute(color, 3));
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 20);
    return g;
  }, [count, kind]);

  const uniforms = useMemo(
    () => ({ uTime: { value: 0 }, uPixelRatio: { value: 1 }, uKind: { value: kind } }),
    [kind]
  );

  useFrame((state) => {
    if (!material.current) return;
    material.current.uniforms.uTime.value = state.clock.elapsedTime;
    material.current.uniforms.uPixelRatio.value = gl.getPixelRatio();
  });

  return (
    <points geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={material}
        vertexShader={particleVertex}
        fragmentShader={particleFragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function Glow({ texture, color, scale, opacity }: { texture: THREE.Texture; color: string; scale: number; opacity: number }) {
  return (
    <sprite scale={scale}>
      <spriteMaterial
        map={texture}
        color={color}
        transparent
        opacity={opacity}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </sprite>
  );
}

function HextechCore({ orbiters }: { orbiters: number }) {
  const root = useRef<THREE.Group>(null);
  const crystal = useRef<THREE.Mesh>(null);
  const cage = useRef<THREE.LineSegments>(null);
  const ringA = useRef<THREE.Mesh>(null);
  const ringB = useRef<THREE.Mesh>(null);
  const halo = useRef<THREE.Group>(null);
  const material = useRef<THREE.ShaderMaterial>(null);
  const glow = useGlowTexture();
  const { viewport } = useThree();

  const portrait = viewport.width < viewport.height;
  const scale = portrait ? Math.min(0.55, viewport.width / 5) : Math.min(0.62, viewport.width / 16);
  // Sit the crystal in the space above the headline rather than behind it.
  const baseY = viewport.height * (portrait ? 0.25 : 0.265);

  const cageGeometry = useMemo(
    () => new THREE.EdgesGeometry(new THREE.OctahedronGeometry(1, 0)),
    []
  );
  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), []);

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    if (material.current) material.current.uniforms.uTime.value = t;
    if (root.current) {
      root.current.rotation.y = THREE.MathUtils.lerp(root.current.rotation.y, pointer.x * 0.45, 0.04);
      root.current.rotation.x = THREE.MathUtils.lerp(root.current.rotation.x, -pointer.y * 0.25, 0.04);
      root.current.position.y = baseY + Math.sin(t * 0.9) * 0.08;
    }
    if (crystal.current) crystal.current.rotation.y += dt * 0.5;
    if (cage.current) {
      cage.current.rotation.y -= dt * 0.2;
      cage.current.rotation.z = Math.sin(t * 0.3) * 0.15;
    }
    if (ringA.current) ringA.current.rotation.z += dt * 0.35;
    if (ringB.current) ringB.current.rotation.z -= dt * 0.25;
    if (halo.current) halo.current.scale.setScalar(1 + Math.sin(t * 2) * 0.06);
  });

  return (
    <group ref={root} scale={scale}>
      <group ref={halo}>
        <Glow texture={glow} color="#2fb8ff" scale={6.5} opacity={0.55} />
        <Glow texture={glow} color="#ff3fa4" scale={9} opacity={0.18} />
        <Glow texture={glow} color="#e6fbff" scale={1.6} opacity={0.9} />
      </group>

      <mesh ref={crystal} scale={[0.62, 1.05, 0.62]}>
        <octahedronGeometry args={[1, 0]} />
        <shaderMaterial
          ref={material}
          vertexShader={crystalVertex}
          fragmentShader={crystalFragment}
          uniforms={uniforms}
          transparent
        />
      </mesh>

      <lineSegments ref={cage} geometry={cageGeometry} scale={[1.05, 1.55, 1.05]}>
        <lineBasicMaterial color="#e8b866" transparent opacity={0.55} />
      </lineSegments>

      <mesh ref={ringA} rotation={[Math.PI / 2.15, 0, 0]}>
        <torusGeometry args={[1.75, 0.008, 8, 128]} />
        <meshBasicMaterial color="#e8b866" transparent opacity={0.6} />
      </mesh>
      <mesh ref={ringB} rotation={[Math.PI / 2.6, Math.PI / 7, 0]}>
        <torusGeometry args={[2.2, 0.006, 8, 128]} />
        <meshBasicMaterial color="#4fd8ff" transparent opacity={0.35} />
      </mesh>

      <Particles count={orbiters} kind={0} />
    </group>
  );
}

function CameraRig() {
  useFrame((state) => {
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, pointer.x * 0.35, 0.03);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, pointer.y * 0.2, 0.03);
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

export default function HeroScene() {
  usePointer();
  const wrap = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const [dpr, setDpr] = useState(1.5);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrap} className="absolute inset-0">
      <Canvas
        frameloop={reducedMotion ? "demand" : visible ? "always" : "never"}
        dpr={dpr}
        camera={{ position: [0, 0, 7], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <PerformanceMonitor
          onIncline={() => setDpr(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2))}
          onDecline={() => setDpr(1)}
        />
        <HextechCore orbiters={isMobile ? 260 : 520} />
        <Particles count={isMobile ? 220 : 480} kind={1} />
        <CameraRig />
      </Canvas>
    </div>
  );
}
