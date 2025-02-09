import { useGLTF } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { Group } from "three";
import Hotspot from "../Hotspot";
import { useActiveComponent } from "@/app/providers/ActiveComponentProvider";

const Machine = () => {
  const result = useGLTF("./models/Corpo Dolphin.glb");
  const modelRef = useRef<Group>();
  const mixerRef = useRef<THREE.AnimationMixer>();
  const [isAnimationPlaying, setIsAnimationPlaying] = useState(false);
  const actionsRef = useRef<THREE.AnimationAction[]>([]);
  const previousComponentRef = useRef<string | null>(null);

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

    // Cleanup function
    return () => {
      mixerRef.current?.stopAllAction();
      actionsRef.current.forEach((action) => action.stop());
    };
  }, [result.animations]);

  // Handle animation playback when activeComponent changes
  useEffect(() => {
    if (activeComponent === "machine") {
      // Reset and replay animations only if we're newly selecting the machine
      if (previousComponentRef.current !== "machine") {
        actionsRef.current.forEach((action) => {
          action.reset(); // Reset to starting position
          action.play(); // Start playing from beginning
        });
        setIsAnimationPlaying(true);
      }
    } else {
      // Stop animations if we're no longer on machine
      actionsRef.current.forEach((action) => action.stop());
      setIsAnimationPlaying(false);
    }

    previousComponentRef.current = activeComponent;
  }, [activeComponent]);

  // Update animation frame
  useFrame((state, delta) => {
    if (isAnimationPlaying && mixerRef.current) {
      mixerRef.current.update(delta);
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

      <Hotspot
        position={[0.1, 1, 0.1]}
        groupRef={groupRef}
        onClick={() => {
          handleSetActiveComponent("machine");
        }}
      />
      <Hotspot
        position={[-0.1, 1, 0.1]}
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
