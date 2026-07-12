"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import type { Group, Mesh } from "three";

type BustSceneProps = {
  animate: boolean;
  wireframeColor?: string;
  isDark?: boolean;
  isMobile?: boolean;
};

function DanceModel({
  color,
  animate,
  isMobile,
  onReady,
}: {
  color: string;
  animate: boolean;
  isMobile: boolean;
  onReady: () => void;
}) {
  const group = useRef<Group>(null);
  const { scene, animations } = useGLTF("/models/Dance.glb");
  const { actions } = useAnimations(animations, group);
  const materialsRef = useRef<THREE.MeshStandardMaterial[]>([]);
  const depthMeshesRef = useRef<THREE.Mesh[]>([]);

  useEffect(() => {
    const mats: THREE.MeshStandardMaterial[] = [];
    const depthMeshes: THREE.Mesh[] = [];

    const meshes: THREE.Mesh[] = [];
    scene.traverse((child) => { if ((child as Mesh).isMesh) meshes.push(child as Mesh); });

    for (const mesh of meshes) {
      // Invisible depth mesh — must be SkinnedMesh for animated characters
      // so it deforms with the bones and doesn't produce artifacts
      const depthMat = new THREE.MeshBasicMaterial({
        colorWrite: false,
        side: THREE.FrontSide,
      });

      let depthMesh: THREE.Mesh;
      if (mesh instanceof THREE.SkinnedMesh) {
        const sm = new THREE.SkinnedMesh(mesh.geometry, depthMat);
        sm.skeleton = mesh.skeleton;
        sm.bindMatrix.copy(mesh.bindMatrix);
        sm.bindMatrixInverse.copy(mesh.bindMatrixInverse);
        sm.bindMode = mesh.bindMode;
        depthMesh = sm;
      } else {
        depthMesh = new THREE.Mesh(mesh.geometry, depthMat);
      }
      depthMesh.renderOrder = 0;
      mesh.add(depthMesh);
      depthMeshes.push(depthMesh);

      const wireMat = new THREE.MeshStandardMaterial({
        wireframe: true,
        color,
        emissive: color,
        emissiveIntensity: 0.9,
        roughness: 0.5,
        metalness: 0,
        polygonOffset: true,
        polygonOffsetFactor: -1,
        polygonOffsetUnits: -1,
      });
      mesh.material = wireMat;
      mesh.renderOrder = 1;
      mats.push(wireMat);
    }

    materialsRef.current = mats;
    depthMeshesRef.current = depthMeshes;
    onReady();

    return () => {
      mats.forEach((m) => m.dispose());
      depthMeshes.forEach((m) => {
        m.parent?.remove(m);
        (m.material as THREE.Material).dispose();
      });
    };
  }, [scene]); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync color on theme switch
  useEffect(() => {
    materialsRef.current.forEach((m) => {
      m.color.set(color);
      m.emissive.set(color);
    });
  }, [color]);

  // Play the first embedded animation
  useEffect(() => {
    const firstKey = Object.keys(actions)[0];
    const action = firstKey ? actions[firstKey] : null;
    if (action) {
      action.reset().play();
      action.setLoop(THREE.LoopRepeat, Infinity);
    }
    return () => { action?.stop(); };
  }, [actions]);

  // Slow Y-axis rotation
  useFrame((_, delta) => {
    if (!animate || !group.current) return;
    group.current.rotation.y += delta * 0.04;
  });

  return (
    <group
      ref={group}
      position={isMobile ? [0, -10.8, 0] : [0, -1, 0]}
      scale={isMobile ? 0.34 : 0.3}
      rotation={[0, Math.PI, 0]}
    >
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload("/models/Dance.glb");

export default function BustScene({ animate, wireframeColor = "#2391ff", isMobile = false }: BustSceneProps) {
  const [modelReady, setModelReady] = useState(false);
  const visible = animate && modelReady;
  const canvasStyle = {
    width: "100%",
    height: "100%",
    opacity: visible ? 1 : 0,
    transition: "opacity 0.8s ease-out",
  };

  return (
    <Canvas
      camera={{ position: isMobile ? [0, 4, 23] : [0, 7, 40], fov: isMobile ? 58 : 55 }}
      dpr={[1, 1.5]}
      gl={{
        alpha: true,
        antialias: false,
        powerPreference: "high-performance",
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.2,
      }}
      style={canvasStyle}
    >
      {/* Ambient basse pour maximiser le contraste clair/sombre */}
      <ambientLight intensity={0.12} />
      {/* Point lights colorés — maintiennent la teinte bleue dans les zones d'ombre */}
      <pointLight position={[-6, 12, 10]} intensity={1.4} color={wireframeColor} distance={60} decay={2} />
      <pointLight position={[8, -4, 8]} intensity={0.8} color={wireframeColor} distance={60} decay={2} />
      {/* Key light blanche forte — crée les zones très claires (presque blanc) sur le dessus */}
      <directionalLight position={[-6, 16, 14]} intensity={3.5} color="#ffffff" />
      {/* Fill light blanche secondaire — éclaircit légèrement le côté droit */}
      <directionalLight position={[10, 4, 8]} intensity={1.2} color="#ffffff" />
      <DanceModel
        color={wireframeColor}
        animate={animate}
        isMobile={isMobile}
        onReady={() => setModelReady(true)}
      />
      <EffectComposer multisampling={0}>
        <Bloom
          luminanceThreshold={0.4}
          luminanceSmoothing={1}
          intensity={4}
          radius={0.7}
        />
      </EffectComposer>
    </Canvas>
  );
}
