"use client";

import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Suspense, useEffect, useRef } from "react";
import type { Group } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

function Model({ onReady }: { onReady: () => void }) {
  const gltf = useLoader(GLTFLoader, "/models/topology.glb");
  const group = useRef<Group>(null);
  useEffect(onReady, [onReady]);
  useFrame((_, dt) => {
    if (group.current) group.current.rotation.y += dt * 0.25;
  });
  return (
    <group ref={group}>
      <primitive object={gltf.scene} />
    </group>
  );
}

export function Topology3D({ onReady }: { onReady: () => void }) {
  return (
    <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 7.5], fov: 45 }} gl={{ antialias: true }}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 4, 5]} intensity={1.4} />
      <Suspense fallback={null}>
        <Model onReady={onReady} />
      </Suspense>
    </Canvas>
  );
}
