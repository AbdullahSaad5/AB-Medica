import { useGLTF } from "@react-three/drei";
import React, { useRef } from "react";
import { Group } from "three";
import Hotspot from "../Hotspot";

const Nozel = () => {
  const result = useGLTF("./models/dolphin_manipolo-1.glb");
  const groupRef = useRef<Group>(null);

  return (
    <group ref={groupRef}>
      <primitive object={result.scene} />
      <Hotspot position={[0, 1, 0.3]} groupRef={groupRef} />
    </group>
  );
};

export default Nozel;

// Preload model
useGLTF.preload("./models/dolphin_manipolo-1.glb");
