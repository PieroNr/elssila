// src/components/three/BustScene.tsx
"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, OrbitControls, useGLTF } from "@react-three/drei";
import { useRef, useEffect } from "react";
import * as THREE from "three";
import type { Group, Mesh } from "three";

type BustSceneProps = {
    animate: boolean;
};

function BustWireframe() {
    const group = useRef<Group>(null);
    const { scene } = useGLTF("/models/bust.glb");

    useEffect(() => {
        scene.traverse((child) => {
            if ((child as Mesh).isMesh) {
                const mesh = child as Mesh;
                mesh.material = new THREE.MeshStandardMaterial({
                    wireframe: true,
                    color: "#f97316",
                    opacity: 1,
                    transparent: false,
                });
            }
        });
    }, [scene]);

    useFrame((_, delta) => {
        if (group.current) {
            group.current.rotation.y += delta * 0.15;
        }
    });

    return (
        <group ref={group} position={[0, -0.8, 0]} scale={1.8}>
            <primitive object={scene} />
        </group>
    );
}

useGLTF.preload("/models/bust.glb");

export default function BustScene({ animate }: BustSceneProps) {
    return (
        <Canvas
            camera={{ position: [0, 0.7, 2.4], fov: 30 }}
            style={{
                width: "100%",
                height: "100%",
                opacity: animate ? 1 : 0,
                transition: "opacity 0.8s ease-out",
            }}
        >
            {/* Lumières */}
            <ambientLight intensity={0.6} />
            <directionalLight position={[2, 4, 3]} intensity={1.1} />
            <directionalLight position={[-3, -2, -2]} intensity={0.4} />

            <BustWireframe />

            <Environment preset="studio" />

            <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
        </Canvas>
    );
}
