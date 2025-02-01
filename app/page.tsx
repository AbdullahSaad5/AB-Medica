"use client";

import { Environment, OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import Stand from "./_components/Models/stand";
import { Suspense, useRef } from "react";
import Nozel from "./_components/Models/nozel";
import Device from "./_components/Models/device";
import Machine from "./_components/Models/machine";

const Scene = () => {
  const controlsRef = useRef(null);

  return (
    <>
      <PerspectiveCamera
        makeDefault
        position={[4, 4, 4]} // Adjusted initial camera position
        fov={50}
      />
      <ambientLight intensity={0.2} />
      <color attach="background" args={["#31a2d6"]} />
      <Stand />
      <Nozel />
      <Machine />
      <Device />
      <OrbitControls
        ref={controlsRef}
        minDistance={2}
        maxDistance={10}
        // minPolarAngle={Math.PI / 4} // Limit bottom angle
        // maxPolarAngle={Math.PI / 1.5} // Limit top angle
        enablePan={false} // Optional: disable panning to keep focus
      />
      <Environment preset="city" />
    </>
  );
};

export default function Home() {
  return (
    <div className="h-screen bg-white">
      <Canvas shadows>
        <Suspense fallback="Loading...">
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}
