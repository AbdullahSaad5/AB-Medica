import { useGLTF } from "@react-three/drei";
import React, { useRef } from "react";
import { Group } from "three";
import ClickableHotSpot from "../Hotspots/ButtonHotspot";
import { useActiveComponent } from "@/app/providers/ActiveComponentProvider";
import { useAnimationMixer } from "@/app/hooks/useAnimationMixer";
import { useHotspotPositions } from "@/app/hooks/useHotspotPositions";
import { useFrame } from "@react-three/fiber";
import LabelHostpot from "../Hotspots/LabelHospot";

const MODEL_PATH = "/models/dolphin-manipolo-1.glb";

const Nozel = ({ isVisible, path }: { isVisible: boolean; path: string }) => {
  const groupRef = useRef<Group>(null);
  const modelRef = useRef<Group>(null);
  const { handleSetActiveComponent, activeComponent } = useActiveComponent();
  const isActive = activeComponent === "nozel";
  const result = useGLTF(path);

  const { mixer, isAnimationPlaying } = useAnimationMixer({
    modelRef,
    animations: result.animations,
    isActive,
  });

  const { hotspots } = useHotspotPositions({
    scene: result.scene,
    meshNamesToLabel: [
      {
        name: "FERMO_SCOCCA",
        label: "Innesto Cannula Con Anello Di Espansione",
      },
      {
        name: "COMPONENTI_INTERNI003",
        label: "Valvole a cassetto",
      },
      {
        name: "COMPONENTI_INTERNI004",
        label: "Tasti di azionamento",
        positionAdjustments: [-0.01, -0.015, 0],
      },

      {
        name: "CANULA_2002",
        label: "Cannula",
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

      {!activeComponent && (
        <ClickableHotSpot
          position={[0.17, 0.96, 0.3]}
          groupRef={groupRef}
          onClick={() => handleSetActiveComponent("nozel")}
        />
      )}

      {hotspots.map((hotspot) => (
        <LabelHostpot
          show={isActive}
          key={hotspot.name}
          label={hotspot.name}
          position={hotspot.position}
          groupRef={groupRef}
          positionAdjustments={hotspot.positionAdjustments}
        />
      ))}
    </group>
  ) : null;
};

export default Nozel;

// Preload model
useGLTF.preload(MODEL_PATH);
