"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment, useAnimations } from "@react-three/drei";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import type { Group, Mesh } from "three";

type BustSceneProps = {
  animate: boolean;
  wireframeColor?: string;
  isDark?: boolean;
};

function DanceModel({ color, animate }: { color: string; animate: boolean }) {
  const group = useRef<Group>(null);
  const { scene, animations } = useGLTF("/models/Dance.glb");
  const { actions } = useAnimations(animations, group);
  const materialsRef = useRef<THREE.MeshStandardMaterial[]>([]);

  // Apply wireframe materials once on mount
  useEffect(() => {
    const mats: THREE.MeshStandardMaterial[] = [];
    scene.traverse((child) => {
      if ((child as Mesh).isMesh) {
        const mesh = child as Mesh;
        const mat = new THREE.MeshStandardMaterial({
          wireframe: true,
          color,
          emissive: color,
          emissiveIntensity: 0.3,
          roughness: 0.4,
          metalness: 0.1,
        });
        mesh.material = mat;
        mats.push(mat);
      }
    });
    materialsRef.current = mats;
    return () => { mats.forEach((m) => m.dispose()); };
  }, [scene]); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync color on theme switch
  useEffect(() => {
    materialsRef.current.forEach((m) => {
      m.color.set(color);
      m.emissive.set(color);
    });
  }, [color]);

  // Play the first embedded animation (the dance clip)
  useEffect(() => {
    const firstKey = Object.keys(actions)[0];
    const action = firstKey ? actions[firstKey] : null;
    if (action) {
      action.reset().play();
      action.setLoop(THREE.LoopRepeat, Infinity);
    }
    return () => { action?.stop(); };
  }, [actions]);

  // Slow Y-axis rotation complements the dance animation
  useFrame((_, delta) => {
    if (!animate || !group.current) return;
    group.current.rotation.y += delta * 0.04;
  });

  return (
    <group ref={group} position={[0, -1, 0]} scale={0.3}>
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload("/models/Dance.glb");

export default function BustScene({ animate, wireframeColor = "#3aa9ff" }: BustSceneProps) {
  const canvasStyle = { width: "100%", height: "100%", opacity: animate ? 1 : 0, transition: "opacity 0.8s ease-out" };

  return (
    <Canvas
      camera={{ position: [0, 7, 40], fov: 55 }}
      dpr={[1, 1.5]}
      gl={{ alpha: true, antialias: false, powerPreference: "high-performance" }}
      style={canvasStyle}
    >
      <ambientLight intensity={0.4} />
      <Environment preset="studio" environmentIntensity={0.3} />
      <DanceModel color={wireframeColor} animate={animate} />
    </Canvas>
  );
}
