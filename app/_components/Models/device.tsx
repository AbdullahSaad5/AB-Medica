import { useGLTF } from "@react-three/drei";
import React, { useRef } from "react";
import { Group } from "three";
import { useActiveComponent } from "@/app/providers/ActiveComponentProvider";
import { useAnimationMixer } from "@/app/hooks/useAnimationMixer";
import { useHotspotPositions } from "@/app/hooks/useHotspotPositions";
import { useFrame } from "@react-three/fiber";
import LabelHostpot from "../Hotspots/LabelHospot";

const MODEL_PATH = "./models/dolphin_cartuccia.glb";

const Device = ({ isVisible }: { isVisible: boolean }) => {
  const result = useGLTF(MODEL_PATH);
  const groupRef = useRef<Group>(null);
  const modelRef = useRef<Group>(null);
  const { activeComponent } = useActiveComponent();
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
        label: "Galleggiante",
        positionAdjustments: [0, 0, 0],
      },
      {
        name: "VENTOLA_1",
        label: "Girante Della Pompa",
        positionAdjustments: [0, 0, 0],
      },
      {
        name: "TRASMISSIONE",
        label: "Trascinatore",
        positionAdjustments: [0, 0, 0],
      },
    ],
  });

  useFrame(() => {
    if (mixer.current && isAnimationPlaying) {
      mixer.current.update(1 / 60);
    }
  });

  return isVisible ? (
    <group ref={groupRef}>
      <primitive ref={modelRef} object={result.scene} />

      {hotspots.map((hotspot) => (
        <LabelHostpot
          show={isActive}
          key={hotspot.name}
          label={hotspot.name}
          position={hotspot.position}
          positionAdjustments={hotspot.positionAdjustments}
          groupRef={groupRef}
        />
      ))}
    </group>
  ) : null;
};

export default Device;

// Preload model
useGLTF.preload(MODEL_PATH);
