// src/components/three/BustScene.tsx
"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, OrbitControls, useGLTF } from "@react-three/drei";
import { useRef, useEffect, useMemo } from "react";
import * as THREE from "three";
import type { Group, Mesh } from "three";

type BustSceneProps = {
  animate: boolean;
  wireframeColor?: string;
  isDark?: boolean;
};

function BustWireframe({ color, isDark }: { color: string; isDark: boolean }) {
  const group = useRef<Group>(null);
  const { scene } = useGLTF("/models/bust-compressed.glb");

  useEffect(() => {
    scene.traverse((child) => {
      if ((child as Mesh).isMesh) {
        const mesh = child as Mesh;
        const mat = mesh.material;
        if (mat instanceof THREE.MeshStandardMaterial && mat.wireframe) {
          mat.color.set(color);
          mat.roughness = isDark ? 0.65 : 1;
          mat.envMapIntensity = isDark ? 0.25 : 1;
          mat.needsUpdate = true;
        } else {
          mesh.material = new THREE.MeshStandardMaterial({
            wireframe: true,
            color,
            roughness: isDark ? 0.65 : 1,
            metalness: 0,
            envMapIntensity: isDark ? 0.25 : 1,
          });
        }
      }
    });
  }, [scene, color, isDark]);

  useFrame((_, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.07;
    }
  });

  return (
    <group ref={group} position={[0, -0.8, 0]} scale={1.8}>
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload("/models/bust-compressed.glb");

export default function BustScene({ animate, wireframeColor = "#ff9349", isDark = false }: BustSceneProps) {
  const canvasStyle = useMemo(
    () => ({ width: "100%", height: "100%", opacity: animate ? 1 : 0, transition: "opacity 0.8s ease-out" }),
    [animate]
  );
  return (
    <Canvas
      camera={{ position: [0, 0.4, 1.7], fov: 42 }}
      style={canvasStyle}
    >
      {isDark ? (
        /* Dark — HDRI très atténué + lumières douces pour ne pas blanchir le bleu */
        <>
          <ambientLight intensity={0.7} />
          <directionalLight position={[-2, 3, 2]} intensity={0.6} />
          <Environment preset="studio" environmentIntensity={0.12} />
        </>
      ) : (
        /* Light — setup original : HDRI plein + 3 sources, orange vif et contrasté */
        <>
          <ambientLight intensity={0.6} />
          <directionalLight position={[2, 4, 3]} intensity={1.1} />
          <directionalLight position={[-3, -2, -2]} intensity={0.4} />
          <Environment preset="studio" />
        </>
      )}

      <BustWireframe color={wireframeColor} isDark={isDark} />
      <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
    </Canvas>
  );
}
