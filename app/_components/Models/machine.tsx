import { useGLTF } from "@react-three/drei";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import ClickableHotspot from "../Hotspots/ButtonHotspot";
import LabelHostpot from "../Hotspots/LabelHospot";
import { useActiveComponent } from "@/app/providers/ActiveComponentProvider";
import { useAnimationMixer } from "@/app/hooks/useAnimationMixer";
import { useHotspotPositions } from "@/app/hooks/useHotspotPositions";

const Machine = () => {
  const result = useGLTF("./models/Corpo Dolphin.glb");
  const modelRef = useRef<Group>(null);
  const groupRef = useRef<Group>(null);
  const { handleSetActiveComponent, activeComponent } = useActiveComponent();
  const isActive = activeComponent === "machine";

  const { mixer, isAnimationPlaying } = useAnimationMixer({
    modelRef,
    animations: result.animations,
    isActive,
  });

  const { hotspots } = useHotspotPositions({
    scene: result.scene,
    meshNamesToLabel: [
      { name: "SCERMO_LED", label: "Schermo LED" },
      { name: "SCOCCA_POSTERIORE_1", label: "Scocca Posteriore" },
      { name: "SPORTELLO_SCOCCA", label: "Sportello Scocca" },
      { name: "Tastiera_RetroIlluminata", label: "Tastiera Retroilluminata" },
      { name: "AGGANCIO_2", label: "Aggancio 2" },
      { name: "BASE_MOTORE", label: "Base Motore" },
      { name: "SCHEDA001_5", label: "Scheda 001.5" },
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
      {!activeComponent && (
        <>
          <ClickableHotspot
            position={[0.1, 1, 0.1]}
            groupRef={groupRef}
            onClick={() => handleSetActiveComponent("machine")}
          />
          <ClickableHotspot
            position={[-0.1, 1, 0.1]}
            groupRef={groupRef}
            onClick={() => handleSetActiveComponent("device")}
          />
        </>
      )}

      {hotspots.map((hotspot) => (
        <LabelHostpot
          key={hotspot.name}
          label={hotspot.name}
          position={hotspot.position}
          groupRef={groupRef}
          onClick={() => handleSetActiveComponent("machine")}
        />
      ))}
    </group>
  );
};

// Preload the model
useGLTF.preload("./models/Corpo Dolphin.glb");

export default Machine;
