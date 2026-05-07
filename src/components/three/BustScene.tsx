"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import type { Group, Mesh } from "three";

type BustSceneProps = {
  animate: boolean;
  wireframeColor?: string;
  isDark?: boolean;
};

// Render the bust as edge-only line segments. EdgesGeometry filters by angle
// (30°), keeping only structural ridges — far fewer segments than a native
// wireframe, with a more editorial silhouette.
function BustEdges({ color, animate }: { color: string; animate: boolean }) {
  const group = useRef<Group>(null);
  const { scene } = useGLTF("/models/bust-compressed.glb");

  // Build the edges scene once (per GLB load). Re-runs only if the source
  // scene changes; color is updated separately to avoid re-traversal.
  const { lineSegments, materials } = useMemo(() => {
    const segments: THREE.LineSegments[] = [];
    const mats: THREE.LineBasicMaterial[] = [];
    scene.traverse((child) => {
      if ((child as Mesh).isMesh) {
        const mesh = child as Mesh;
        const edges = new THREE.EdgesGeometry(mesh.geometry, 30);
        const lineMat = new THREE.LineBasicMaterial({ color });
        const lines = new THREE.LineSegments(edges, lineMat);
        lines.position.copy(mesh.position);
        lines.rotation.copy(mesh.rotation);
        lines.scale.copy(mesh.scale);
        mesh.visible = false;
        mesh.parent?.add(lines);
        segments.push(lines);
        mats.push(lineMat);
      }
    });
    return { lineSegments: segments, materials: mats };
  }, [scene]);

  useEffect(() => {
    materials.forEach((m) => m.color.set(color));
  }, [color, materials]);

  useEffect(
    () => () => {
      lineSegments.forEach((ls) => {
        ls.parent?.remove(ls);
        ls.geometry.dispose();
      });
      materials.forEach((m) => m.dispose());
    },
    [lineSegments, materials],
  );

  useFrame((_, delta) => {
    if (!animate || !group.current) return;
    group.current.rotation.y += delta * 0.07;
  });

  return (
    <group ref={group} position={[0, -0.45, 0]} scale={1.35}>
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload("/models/bust-compressed.glb");

export default function BustScene({ animate, wireframeColor = "#ff9349", isDark = false }: BustSceneProps) {
  const canvasStyle = useMemo(
    () => ({ width: "100%", height: "100%", opacity: animate ? 1 : 0, transition: "opacity 0.8s ease-out" }),
    [animate],
  );

  return (
    <Canvas
      camera={{ position: [0, 0.4, 1.7], fov: 42 }}
      dpr={[1, 1.5]}
      gl={{ alpha: true, antialias: false, powerPreference: "high-performance" }}
      style={canvasStyle}
    >
      <ambientLight intensity={isDark ? 0.7 : 0.6} />
      <directionalLight position={[2, 4, 3]} intensity={isDark ? 0.6 : 1.1} />
      {!isDark && <directionalLight position={[-3, -2, -2]} intensity={0.4} />}
      <BustEdges color={wireframeColor} animate={animate} />
    </Canvas>
  );
}
