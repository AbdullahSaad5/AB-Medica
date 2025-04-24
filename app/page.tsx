"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import Scene from "./_components/Scene";
import UIOverlay from "./_components/UIOverlay";
import LoadingScreen from "./_components/LoadingScreen";
import LoadingSpinner from "./_components/LoadingSpinner";

export default function Home() {
  return (
    <div className="h-screen bg-white relative">
      <Suspense
        fallback={
          <LoadingSpinner>
            <LoadingScreen />
          </LoadingSpinner>
        }
        unstable_expectedLoadTime={3000}
      >
        <UIOverlay />

        <Canvas
          shadows
          gl={{
            antialias: true,
            powerPreference: "high-performance",
            alpha: false,
            preserveDrawingBuffer: true,
          }}
          dpr={[1, 2]}
        >
          <Scene />
        </Canvas>
      </Suspense>
    </div>
  );
}
