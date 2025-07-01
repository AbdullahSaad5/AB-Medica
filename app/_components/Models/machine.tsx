import { useAnimationMixer } from "@/app/hooks/useAnimationMixer";
import { useHotspotPositions } from "@/app/hooks/useHotspotPositions";
import { useActiveComponent } from "@/app/providers/ActiveComponentProvider";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group } from "three";
import ClickableHotSpot from "../Hotspots/ButtonHotspot";
import LabelHostpot from "../Hotspots/LabelHospot";

const Machine = ({ isVisible, path }: { isVisible: boolean; path: string }) => {
  const modelRef = useRef<Group>(null);
  const groupRef = useRef<Group>(null);
  const { handleSetActiveComponent, activeComponent } = useActiveComponent();
  const isActive = activeComponent === "machine";

  const result = useGLTF(path);

  const { mixer, isAnimationPlaying } = useAnimationMixer({
    modelRef,
    animations: result.animations,
    isActive,
  });

  const { hotspots } = useHotspotPositions({
    scene: result.scene,
    meshNamesToLabel: [
      { name: "SCERMO_LED", label: "Schermo LED" },
      { name: "SCOCCA_POSTERIORE_1", label: "Alimentatore A 24V", positionAdjustments: [-0.05, 0.01, 0] },
      { name: "SPORTELLO_SCOCCA", label: "Sportello Vano Pompa" },
      { name: "Tastiera_RetroIlluminata", label: "Tastiera Soft in Silicone" },
      { name: "AGGANCIO_2", label: "Leva Di Blocaggio" },
      { name: "BASE_MOTORE", label: "Motore Brushless ad Alta Efficienza" },
      { name: "SCHEDA001_5", label: "Scheda Elettronica di Controllo" },
    ],
  });

  useFrame(() => {
    if (mixer.current && isAnimationPlaying) {
      mixer.current.update(1 / 60);
    }
  });

  if (!result.scene) {
    console.warn("Machine model scene not loaded");
    return null;
  }

  return isVisible ? (
    <group ref={groupRef}>
      <primitive ref={modelRef} object={result.scene} />
      {!activeComponent && (
        <>
          <ClickableHotSpot
            position={[0.125, 1.04, 0.1]}
            groupRef={groupRef}
            onClick={() => handleSetActiveComponent("machine")}
          />
          <ClickableHotSpot
            position={[-0.095, 1.032, 0.07]}
            groupRef={groupRef}
            onClick={() => handleSetActiveComponent("device")}
          />
        </>
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

export default Machine;
