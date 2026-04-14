"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

// ── GLSL noise — injected into the standard vertex shader ────────────────────
// Classic value-noise + 3-octave fBm, all runs on GPU.

const NOISE_GLSL = /* glsl */`
  float _h(vec3 p) {
    p = fract(p * vec3(127.1, 311.7, 74.7));
    p += dot(p, p.yzx + 19.19);
    return fract((p.x + p.y) * p.z);
  }
  float _vn(vec3 x) {
    vec3 i = floor(x);
    vec3 f = fract(x);
    vec3 u = f*f*f*(f*(f*6.0-15.0)+10.0);
    return mix(
      mix(mix(_h(i),             _h(i+vec3(1,0,0)), u.x),
          mix(_h(i+vec3(0,1,0)), _h(i+vec3(1,1,0)), u.x), u.y),
      mix(mix(_h(i+vec3(0,0,1)), _h(i+vec3(1,0,1)), u.x),
          mix(_h(i+vec3(0,1,1)), _h(i+vec3(1,1,1)), u.x), u.y),
      u.z
    ) * 2.0 - 1.0;
  }
  float _fbm(vec3 p) {
    return _vn(p)*0.50 + _vn(p*2.1)*0.25 + _vn(p*4.3)*0.125;
  }
`;

// ── Soft sprite glow texture ─────────────────────────────────────────────────

function makeGlowTex(): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = 256; c.height = 256;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  g.addColorStop(0.00, "rgba(255,255,255,0.45)");
  g.addColorStop(0.30, "rgba(255,255,255,0.12)");
  g.addColorStop(0.60, "rgba(255,255,255,0.03)");
  g.addColorStop(0.85, "rgba(255,255,255,0.005)");
  g.addColorStop(1.00, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 256);
  return new THREE.CanvasTexture(c);
}

// ── Animated Blob ─────────────────────────────────────────────────────────────

interface BlobProps {
  color: string;
  position: [number, number, number];
  baseScale: number;
  speed: number;
  seed: number;
  amplitude: number;
  noiseFreq: number;
  rotAxis: [number, number, number];
  rotSpeed: number;
  glowSize: number;
  glowOpacity: number;
}

function AnimatedBlob({
  color, position, baseScale, speed, seed, amplitude, noiseFreq,
  rotAxis, rotSpeed, glowSize, glowOpacity,
}: BlobProps) {
  const groupRef = useRef<THREE.Group>(null);

  // detail=6 → 81 920 faces; deformation runs entirely on GPU
  const geo = useMemo(() => new THREE.IcosahedronGeometry(1, 6), []);

  // Standard material with vertex-shader injection for blob deformation
  const mat = useMemo(() => {
    const m = new THREE.MeshStandardMaterial({
      wireframe: true,
      color,
      emissive: color,
      emissiveIntensity: 1.5,
      roughness: 0.45,
      metalness: 0,
    });

    m.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = { value: 0 };
      shader.uniforms.uAmp  = { value: amplitude };
      shader.uniforms.uFreq = { value: noiseFreq };
      shader.uniforms.uSeed = { value: seed };
      // Stash so useFrame can update uTime without recompile
      m.userData.uniforms = shader.uniforms;

      // Prepend noise functions
      shader.vertexShader =
        `uniform float uTime;\nuniform float uAmp;\nuniform float uFreq;\nuniform float uSeed;\n` +
        NOISE_GLSL +
        shader.vertexShader;

      // Replace the Three.js begin_vertex chunk with deformed position
      shader.vertexShader = shader.vertexShader.replace(
        "#include <begin_vertex>",
        /* glsl */`
        vec3 _p  = position * uFreq;
        float _n = _fbm(vec3(
          _p.x + uTime * 0.26 + uSeed,
          _p.y + uTime * 0.20 + uSeed * 1.73,
          _p.z + uTime * 0.23 + uSeed * 0.61
        ));
        float _off      = clamp(_n * uAmp, -uAmp, uAmp);
        vec3 transformed = position * (1.0 + _off);
        `,
      );
    };

    return m;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Glow sprite — perfect circle, zero polygon artefacts
  const glowTex = useMemo(() => makeGlowTex(), []);
  const glowMat = useMemo(
    () =>
      new THREE.SpriteMaterial({
        map: glowTex,
        color,
        transparent: true,
        opacity: glowOpacity,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    [], // eslint-disable-line react-hooks/exhaustive-deps
  );

  // Sync color on theme switch (no shader recompile needed — Three.js handles
  // color/emissive as internal uniforms)
  useEffect(() => {
    mat.color.set(color);
    mat.emissive.set(color);
    glowMat.color.set(color);
    glowMat.needsUpdate = true;
  }, [color, mat, glowMat]);

  useEffect(
    () => () => { geo.dispose(); mat.dispose(); glowTex.dispose(); glowMat.dispose(); },
    [geo, mat, glowTex, glowMat],
  );

  const axis = useMemo(
    () => new THREE.Vector3(...rotAxis).normalize(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    rotAxis,
  );

  useFrame(({ clock }, delta) => {
    // Only update the time uniform — no vertex buffer touch
    const unis = mat.userData.uniforms as Record<string, THREE.IUniform> | undefined;
    if (unis) unis.uTime.value = clock.getElapsedTime() * speed;
    groupRef.current?.rotateOnAxis(axis, delta * rotSpeed);
  });

  return (
    <group ref={groupRef} position={position} scale={baseScale}>
      <mesh geometry={geo} material={mat} />
      <sprite material={glowMat} scale={[glowSize, glowSize, 1]} />
    </group>
  );
}

// ── Scene ─────────────────────────────────────────────────────────────────────

interface BlobSceneProps {
  wireframeColor: string;
  isDark: boolean;
}

export default function BlobScene({ wireframeColor, isDark }: BlobSceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 65 }}
      gl={{ alpha: true, antialias: true }}
      style={{ width: "100%", height: "100%" }}
    >
      <ambientLight intensity={isDark ? 0.2 : 0.35} />
      <pointLight position={[-8, 5, 4]}  intensity={isDark ? 1.8 : 1.4} color={wireframeColor} distance={16} decay={2} />
      <pointLight position={[ 8, -5, 4]} intensity={isDark ? 1.6 : 1.2} color={wireframeColor} distance={16} decay={2} />

      {/* Top-left — smaller */}
      <AnimatedBlob
        color={wireframeColor}
        position={[-6.2, 2.6, -1.0]}
        baseScale={2.5}
        speed={0.38}
        seed={0}
        amplitude={0.46}
        noiseFreq={0.88}
        rotAxis={[0.3, 1, 0.15]}
        rotSpeed={0.05}
        glowSize={3.2}
        glowOpacity={0.03}
      />

      {/* Bottom-right — noticeably larger */}
      <AnimatedBlob
        color={wireframeColor}
        position={[6.8, -2.8, -0.5]}
        baseScale={3.3}
        speed={0.28}
        seed={137}
        amplitude={0.44}
        noiseFreq={0.84}
        rotAxis={[-0.15, 1, 0.35]}
        rotSpeed={0.04}
        glowSize={3.0}
        glowOpacity={0.025}
      />

      <EffectComposer>
        <Bloom
          intensity={isDark ? 1.5 : 0.9}
          luminanceThreshold={0.04}
          luminanceSmoothing={0.88}
          radius={0.68}
        />
      </EffectComposer>
    </Canvas>
  );
}
