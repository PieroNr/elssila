"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

type KnotSceneProps = {
  wireframeColor: string;
};

function KnotMesh({ color }: { color: string }) {
  const knotRef = useRef<THREE.Mesh>(null);
  const orbRef = useRef<THREE.Mesh>(null);

  const knotGeo = useMemo(() => new THREE.TorusKnotGeometry(1.45, 0.46, 110, 12, 2, 3), []);
  const orbGeo = useMemo(() => new THREE.IcosahedronGeometry(0.22, 1), []);

  const knotMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        wireframe: true,
        color,
        emissive: color,
        emissiveIntensity: 0.9,
        roughness: 0.5,
        metalness: 0,
      }),
    [], // eslint-disable-line react-hooks/exhaustive-deps
  );

  const orbMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        wireframe: true,
        color,
        emissive: color,
        emissiveIntensity: 1.2,
        roughness: 0.4,
        metalness: 0,
      }),
    [], // eslint-disable-line react-hooks/exhaustive-deps
  );

  useEffect(() => {
    knotMat.color.set(color);
    knotMat.emissive.set(color);
    orbMat.color.set(color);
    orbMat.emissive.set(color);
  }, [color, knotMat, orbMat]);

  useEffect(
    () => () => {
      knotGeo.dispose();
      knotMat.dispose();
      orbGeo.dispose();
      orbMat.dispose();
    },
    [knotGeo, knotMat, orbGeo, orbMat],
  );

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (knotRef.current) {
      knotRef.current.rotation.y = t * 0.07;
      knotRef.current.rotation.x = Math.sin(t * 0.1) * 0.25;
    }
    if (orbRef.current) {
      orbRef.current.position.set(
        Math.cos(t * 0.28) * 2.4,
        Math.sin(t * 0.28) * 2.4,
        Math.sin(t * 0.18) * 0.8,
      );
    }
  });

  return (
    <>
      <mesh ref={knotRef} geometry={knotGeo} material={knotMat} />
      <mesh ref={orbRef} geometry={orbGeo} material={orbMat} />
    </>
  );
}

export default function KnotScene({ wireframeColor }: KnotSceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 48 }}
      dpr={[1, 1.5]}
      gl={{ alpha: true, antialias: true }}
      style={{ width: "100%", height: "100%" }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[-4, 3, 4]} intensity={1.6} color={wireframeColor} distance={18} decay={2} />
      <pointLight position={[4, -3, 4]} intensity={1.0} color={wireframeColor} distance={18} decay={2} />
      <KnotMesh color={wireframeColor} />
    </Canvas>
  );
}
