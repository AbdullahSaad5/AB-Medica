"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import Scene from "./_components/Scene";
import ActiveComponentProvider from "./providers/ActiveComponentProvider";
import UIOverlay from "./_components/UIOverlay";
import LoadingScreen from "./_components/LoadingScreen";

export default function Home() {
  return (
    <div className="h-screen bg-white relative">
      <Suspense fallback={<LoadingScreen />}>
        <ActiveComponentProvider>
          <UIOverlay />
          <Canvas shadows>
            <Scene />
          </Canvas>
        </ActiveComponentProvider>
      </Suspense>
    </div>
  );
}
