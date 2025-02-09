"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import Scene from "./_components/Scene";
import ActiveComponentProvider from "./providers/ActiveComponentProvider";

export default function Home() {
  return (
    <div className="h-screen bg-white">
      <ActiveComponentProvider>
        <Canvas shadows>
          <Suspense fallback="Loading...">
            <Scene />
          </Suspense>
        </Canvas>
      </ActiveComponentProvider>
    </div>
  );
}
