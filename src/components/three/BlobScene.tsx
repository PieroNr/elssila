"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

// GPU value-noise + 3-octave fBm. Drives blob deformation in the vertex shader.
const NOISE_GLSL = /* glsl */ `
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

interface BlobProps {
  color: string;
  position: [number, number, number];
  baseScale: number;
  speed: number;
  seed: number;
}

function Blob({ color, position, baseScale, speed, seed }: BlobProps) {
  // detail=5 → ~5 120 faces, light enough for two blobs without postprocessing.
  const geo = useMemo(() => new THREE.IcosahedronGeometry(1, 5), []);

  const mat = useMemo(() => {
    const m = new THREE.MeshStandardMaterial({
      wireframe: true,
      color,
      emissive: color,
      emissiveIntensity: 0.9,
      roughness: 0.5,
      metalness: 0,
    });

    m.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = { value: 0 };
      shader.uniforms.uSeed = { value: seed };
      m.userData.uniforms = shader.uniforms;
      shader.vertexShader =
        `uniform float uTime;\nuniform float uSeed;\n` +
        NOISE_GLSL +
        shader.vertexShader;
      shader.vertexShader = shader.vertexShader.replace(
        "#include <begin_vertex>",
        /* glsl */ `
        vec3 _p = position * 0.85;
        float _n = _fbm(vec3(
          _p.x + uTime * 0.26 + uSeed,
          _p.y + uTime * 0.20 + uSeed * 1.73,
          _p.z + uTime * 0.23 + uSeed * 0.61
        ));
        vec3 transformed = position * (1.0 + clamp(_n, -1.0, 1.0));
        `,
      );
    };
    return m;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    mat.color.set(color);
    mat.emissive.set(color);
  }, [color, mat]);

  useEffect(
    () => () => {
      geo.dispose();
      mat.dispose();
    },
    [geo, mat],
  );

  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }, delta) => {
    const u = mat.userData.uniforms as Record<string, THREE.IUniform> | undefined;
    if (u) u.uTime.value = clock.getElapsedTime() * speed;
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.05;
      meshRef.current.rotation.x += delta * 0.025;
    }
  });

  return <mesh ref={meshRef} geometry={geo} material={mat} position={position} scale={baseScale} />;
}

interface BlobSceneProps {
  wireframeColor: string;
  isDark?: boolean;
}

// Visual style aligned with KnotScene: same wireframe density feel, same
// emissive treatment, no glow sprite, no postprocessing.
export default function BlobScene({ wireframeColor }: BlobSceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 60 }}
      dpr={[1, 1.5]}
      gl={{ alpha: true, antialias: true }}
      style={{ width: "100%", height: "100%" }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[-6, 4, 4]} intensity={1.4} color={wireframeColor} distance={18} decay={2} />
      <pointLight position={[6, -4, 4]} intensity={1.0} color={wireframeColor} distance={18} decay={2} />
      <Blob color={wireframeColor} position={[-5.5, 2.4, -1]} baseScale={2.5} speed={0.38} seed={0} />
      <Blob color={wireframeColor} position={[6.5, -2.6, -0.5]} baseScale={3.2} speed={0.28} seed={137} />
    </Canvas>
  );
}
