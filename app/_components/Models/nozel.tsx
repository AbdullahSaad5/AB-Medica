import { useGLTF } from "@react-three/drei";
import React, { useRef } from "react";
import { Group } from "three";
import Hotspot from "../Hotspots/ButtonHotspot";
import { useActiveComponent } from "@/app/providers/ActiveComponentProvider";
import { useAnimationMixer } from "@/app/hooks/useAnimationMixer";
import { useHotspotPositions } from "@/app/hooks/useHotspotPositions";
import { useFrame } from "@react-three/fiber";
import LabelHostpot from "../Hotspots/LabelHospot";

const Nozel = () => {
  const result = useGLTF("./models/dolphin_manipolo-1.glb");
  const groupRef = useRef<Group>(null);
  const modelRef = useRef<Group>(null);
  const { handleSetActiveComponent, activeComponent } = useActiveComponent();
  const isActive = activeComponent === "nozel";

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
        label: "Fermo Scocca",
      },

      {
        name: "SDOPPIATORE_TUBI",
        label: "Sdoppiatore Tubi",
      },
      {
        name: "SDOPPIATORE_TUBI_1",
        label: "Sdoppiatore Tubi 1",
      },
      {
        name: "SDOPPIATORE_TUBI_2",
        label: "Sdoppiatore Tubi 2",
      },
      {
        name: "SDOPPIATORE_TUBI_3",
        label: "Sdoppiatore Tubi 3",
      },
      {
        name: "SDOPPIATORE_TUBI_4",
        label: "Sdoppiatore Tubi 4",
      },
      {
        name: "SDOPPIATORE_TUBI_5",
        label: "Sdoppiatore Tubi 5",
      },
      {
        name: "SDOPPIATORE_TUBI_6",
        label: "Sdoppiatore Tubi 6",
      },
      {
        name: "SDOPPIATORE_TUBI_7",
        label: "Sdoppiatore Tubi 7",
      },
      {
        name: "SDOPPIATORE_TUBI_8",
        label: "Sdoppiatore Tubi 8",
      },
      {
        name: "CANULA_2",
        label: "Canula 2",
      },
      {
        name: "COMPONENTI_INTERNI001",
        label: "Componenti Interni 001",
      },
      {
        name: "COMPONENTI_INTERNI002",
        label: "Componenti Interni 002",
      },
      {
        name: "COMPONENTI_INTERNI003",
        label: "Componenti Interni 003",
      },
      {
        name: "COMPONENTI_INTERNI004",
        label: "Componenti Interni 004",
      },
      {
        name: "CANULA_2001",
        label: "Canula 2001",
      },
      {
        name: "CANULA_2002",
        label: "Canula 2002",
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

      {!activeComponent && (
        <Hotspot position={[0, 1, 0.3]} groupRef={groupRef} onClick={() => handleSetActiveComponent("nozel")} />
      )}

      {hotspots.map((hotspot) => (
        <LabelHostpot
          show={isActive}
          key={hotspot.name}
          label={hotspot.name}
          position={hotspot.position}
          groupRef={groupRef}
          onClick={() => handleSetActiveComponent("nozel")}
        />
      ))}
    </group>
  );
};

export default Nozel;

// Preload model
useGLTF.preload("./models/dolphin_manipolo-1.glb");
