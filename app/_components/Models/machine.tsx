import { useGLTF } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
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
  const originalMaterialRef = useRef<THREE.Material | null>(null);
  const highlightedMeshRef = useRef<THREE.Mesh | null>(null);
  const [hotspotPosition, setHotspotPosition] = useState<[number, number, number]>([0, 0, 0]);
  const worldPosition = new THREE.Vector3();

  const { handleSetActiveComponent, activeComponent } = useActiveComponent();
  const groupRef = useRef<Group>(null);

  // Initialize animation mixer and actions
  useEffect(() => {
    if (!result.animations.length || !modelRef.current) {
      console.error("No animations found in model");
      return;
    }

    mixerRef.current = new THREE.AnimationMixer(modelRef.current);

    // Store all actions in ref for later control
    actionsRef.current = result.animations.map((clip) => {
      const action = mixerRef.current!.clipAction(clip);
      action.setLoop(THREE.LoopOnce, 1);
      action.clampWhenFinished = true;
      return action;
    });

    // Find and highlight the first mesh
    let firstMeshFound = false;
    result.scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh && !firstMeshFound) {
        const mesh = child as THREE.Mesh;
        highlightedMeshRef.current = mesh;
        firstMeshFound = true;

        console.log("Found first mesh:", mesh.name); // Debug log

        // Store the original material
        // @ts-expect-error Property 'material' does not exist on type 'Object3D'
        originalMaterialRef.current = mesh.material;

        // Create and apply highlight material
        const highlightMaterial = new THREE.MeshStandardMaterial({
          color: new THREE.Color(0xffff00),
          emissive: new THREE.Color(0x444400),
          metalness: 0.5,
          roughness: 0.5,
          transparent: true,
          opacity: 0.8,
        });

        mesh.material = highlightMaterial;

        // Initialize hotspot position
        mesh.getWorldPosition(worldPosition);
        setHotspotPosition([worldPosition.x, worldPosition.y, worldPosition.z]);
      }
    });

    // Cleanup function
    return () => {
      mixerRef.current?.stopAllAction();
      actionsRef.current.forEach((action) => action.stop());

      if (highlightedMeshRef.current && originalMaterialRef.current) {
        highlightedMeshRef.current.material = originalMaterialRef.current;
      }
    };
  }, [result.animations, result.scene]);

  // Handle animation playback when activeComponent changes
  useEffect(() => {
    if (activeComponent === "machine") {
      if (previousComponentRef.current !== "machine") {
        actionsRef.current.forEach((action) => {
          action.reset();
          action.play();
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
    }

    if (highlightedMeshRef.current) {
      // Update matrix world to ensure correct position
      highlightedMeshRef.current.updateMatrixWorld(true);
      highlightedMeshRef.current.getWorldPosition(worldPosition);

      // Add a small offset to make the hotspot more visible
      const offset = 0.2; // Adjust this value as needed
      setHotspotPosition([worldPosition.x, worldPosition.y, worldPosition.z]);
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
      {/* Dynamic hotspot that follows the first mesh */}
      <LabelHostpot
        position={hotspotPosition}
        groupRef={groupRef}
        onClick={() => {
          handleSetActiveComponent("machine");
        }}
      />
    </group>
  );
};

// Preload the model
useGLTF.preload("./models/Corpo Dolphin.glb");

export default Machine;
