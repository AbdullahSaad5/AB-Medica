import { useGLTF } from "@react-three/drei";
import React, { useRef } from "react";
import { Group } from "three";
import { useActiveComponent } from "@/app/providers/ActiveComponentProvider";
import { useAnimationMixer } from "@/app/hooks/useAnimationMixer";
import { useHotspotPositions } from "@/app/hooks/useHotspotPositions";
import { useFrame } from "@react-three/fiber";
import LabelHostpot from "../Hotspots/LabelHospot";

const Device = () => {
  const result = useGLTF("./models/dolphin_cartuccia.glb");
  const groupRef = useRef<Group>(null);
  const modelRef = useRef<Group>(null);
  const { handleSetActiveComponent, activeComponent } = useActiveComponent();
  const isActive = activeComponent === "device";

  const { mixer, isAnimationPlaying } = useAnimationMixer({
    modelRef,
    animations: result.animations,
    isActive,
  });

  const { hotspots } = useHotspotPositions({
    scene: result.scene,
    meshNamesToLabel: [
      {
        name: "SFERA",
        label: "Sfera",
      },
      {
        name: "VENTOLA_1",
        label: "Ventola 1",
      },
      {
        name: "TRASMISSIONE",
        label: "Trasmissione",
      },
    ],
  });

  useFrame(() => {
    if (mixer.current && isAnimationPlaying) {
      mixer.current.update(1 / 60);
    }
  });

  return (
    <group ref={groupRef}>
      <primitive ref={modelRef} object={result.scene} />

      {hotspots.map((hotspot) => (
        <LabelHostpot
        show={isActive}
          key={hotspot.name}
          label={hotspot.name}
          position={hotspot.position}
          groupRef={groupRef}
          onClick={() => handleSetActiveComponent("device")}
        />
      ))}
    </group>
  );
};

export default Device;

// Preload model
useGLTF.preload("./models/dolphin_cartuccia.glb");
