import { useGLTF } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { Group } from "three";
import ClickableHotspot from "../Hotspots/ButtonHotspot";
import LabelHostpot from "../Hotspots/LabelHospot";

import { useActiveComponent } from "@/app/providers/ActiveComponentProvider";

const Machine = () => {
  const result = useGLTF("./models/Corpo Dolphin.glb");
  const modelRef = useRef<Group>();
  const mixerRef = useRef<THREE.AnimationMixer>();
  const [isAnimationPlaying, setIsAnimationPlaying] = useState(false);
  const actionsRef = useRef<THREE.AnimationAction[]>([]);
  const previousComponentRef = useRef<string | null>(null);
  const [hotspots, setHotspots] = useState<{ name: string; position: [number, number, number] }[]>([]);
  const worldPosition = useMemo(() => new THREE.Vector3(), []);
  const { handleSetActiveComponent, activeComponent } = useActiveComponent();
  const groupRef = useRef<Group>(null);

  const meshNamesToLabel = useMemo(
    () => [
      // "SCERMO_LED",
      // "SCOCCA_POSTERIORE_1",
      // "SPORTELLO_SCOCCA",
      // "Tastiera_RetroIlluminata",
      // "AGGANCIO_2",
      // "BASE_MOTORE",
      // "SCHEDA001_5",
      {
        name: "SCERMO_LED",
        label: "Schermo LED",
      },
      {
        name: "SCOCCA_POSTERIORE_1",
        label: "Scocca Posteriore",
      },
      {
        name: "SPORTELLO_SCOCCA",
        label: "Sportello Scocca",
      },
      {
        name: "Tastiera_RetroIlluminata",
        label: "Tastiera Retroilluminata",
      },
      {
        name: "AGGANCIO_2",
        label: "Aggancio 2",
      },
      {
        name: "BASE_MOTORE",
        label: "Base Motore",
      },
      {
        name: "SCHEDA001_5",
        label: "Scheda 001.5",
      },
    ],
    []
  ); //ovide the names of the meshes to label

  useEffect(() => {
    if (!result.animations.length || !modelRef.current) {
      console.error("No animations found in model");
      return;
    }

    mixerRef.current = new THREE.AnimationMixer(modelRef.current);
    actionsRef.current = result.animations.map((clip) => {
      const action = mixerRef.current!.clipAction(clip);
      action.setLoop(THREE.LoopOnce, 1);
      action.clampWhenFinished = true;
      return action;
    });

    const foundHotspots: { name: string; position: [number, number, number] }[] = [];
    result.scene.traverse((child) => {
      const foundEntity = meshNamesToLabel.find((mesh) => mesh.name === child.name);
      if ((child as THREE.Mesh).isMesh && foundEntity) {
        child.getWorldPosition(worldPosition);
        foundHotspots.push({
          name: foundEntity.label,
          position: [worldPosition.x, worldPosition.y, worldPosition.z],
        });
      }
    });
    setHotspots(foundHotspots);

    // Cleanup function
    return () => {
      mixerRef.current?.stopAllAction();
      actionsRef.current.forEach((action) => action.stop());
    };
  }, [result.animations, result.scene, meshNamesToLabel, worldPosition]);

  // Handle animation playback when activeComponent changes
  useEffect(() => {
    if (activeComponent === "machine") {
      if (previousComponentRef.current !== "machine") {
        actionsRef.current.forEach((action) => {
          action.reset();
          action.play();
          action.clampWhenFinished = true;
          action.loop = THREE.LoopOnce;

          // Add event listener to log when animation stops
          action.getMixer().addEventListener("finished", () => {
            setIsAnimationPlaying(false);
          });
        });
        setIsAnimationPlaying(true);
      }
    } else {
      actionsRef.current.forEach((action) => action.stop());
      setIsAnimationPlaying(false);
    }

    previousComponentRef.current = activeComponent;
  }, [activeComponent]);

  // Update animation frame and hotspot position
  useFrame(() => {
    if (mixerRef.current && isAnimationPlaying) {
      mixerRef.current.update(1 / 60);

      // Update the position of the hotspots

      const newHotspots = [...hotspots];
      result.scene.traverse((child) => {
        if ((child as THREE.Mesh).isMesh && meshNamesToLabel.map((mesh) => mesh.name).includes(child.name)) {
          child.getWorldPosition(worldPosition);
          const hotspot = newHotspots.find((hotspot) => hotspot.name === child.name);
          if (hotspot) {
            hotspot.position = [worldPosition.x, worldPosition.y, worldPosition.z];
          }
        }
      });

      console.log("Updating hotspots");
      setHotspots(newHotspots);
    }
  });

  // Set up shadows and material properties
  useEffect(() => {
    result.scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        if (mesh.material) {
          // @ts-expect-error Property 'side' does not exist on type 'Material'
          mesh.material.side = THREE.FrontSide;
        }
      }
    });
  }, [result.scene]);

  return (
    <group ref={groupRef}>
      <primitive ref={modelRef} object={result.scene} />

      <ClickableHotspot
        position={[0.1, 1, 0.1]}
        groupRef={groupRef}
        onClick={() => {
          handleSetActiveComponent("machine");
        }}
      />
      <ClickableHotspot
        position={[-0.1, 1, 0.1]}
        groupRef={groupRef}
        onClick={() => {
          handleSetActiveComponent("machine");
        }}
      />
      {hotspots.map((hotspot) => (
        <LabelHostpot
          key={hotspot.name}
          label={hotspot.name}
          position={hotspot.position}
          groupRef={groupRef}
          onClick={() => {
            handleSetActiveComponent("machine");
          }}
        />
      ))}
    </group>
  );
};

// Preload the model
useGLTF.preload("./models/Corpo Dolphin.glb");

export default Machine;
