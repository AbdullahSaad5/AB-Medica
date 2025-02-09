import { useGLTF } from "@react-three/drei";
import React, { useRef } from "react";
import { Group } from "three";
import Hotspot from "../Hotspots/ButtonHotspot";
import { useActiveComponent } from "@/app/providers/ActiveComponentProvider";

const Nozel = () => {
  const result = useGLTF("./models/dolphin_manipolo-1.glb");
  const groupRef = useRef<Group>(null);

  const { handleSetActiveComponent } = useActiveComponent();

  return (
    <group ref={groupRef}>
      <primitive object={result.scene} />
      <Hotspot position={[0, 1, 0.3]} groupRef={groupRef} onClick={() => handleSetActiveComponent("nozel")} />
    </group>
  );
};

export default Nozel;

// Preload model
useGLTF.preload("./models/dolphin_manipolo-1.glb");
