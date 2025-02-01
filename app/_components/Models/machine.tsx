import { useGLTF } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { Group } from "three";
import Hotspot from "../Hotspot";

const Machine = () => {
  const result = useGLTF("./models/Corpo Dolphin.glb");
  const modelRef = useRef<Group>();
  const mixerRef = useRef<THREE.AnimationMixer>();
  const [isAnimationPlaying] = useState(false);
  const actionsRef = useRef<THREE.AnimationAction[]>([]);

  const groupRef = useRef<Group>(null);

  // Initialize animation mixer and actions
  useEffect(() => {
    if (!result.animations.length || !modelRef.current) return;

    mixerRef.current = new THREE.AnimationMixer(modelRef.current);

    // Store all actions in ref for later control
    actionsRef.current = result.animations.map((clip) => {
      const action = mixerRef.current!.clipAction(clip);
      action.setLoop(THREE.LoopOnce, 1); // Play only once
      action.clampWhenFinished = true; // Freeze on last frame
      if (isAnimationPlaying) {
        action.play();
      }
      return action;
    });

    // Cleanup function
    return () => {
      mixerRef.current?.stopAllAction();
      actionsRef.current.forEach((action) => action.stop());
    };
  }, [result.animations, isAnimationPlaying]);

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

      <Hotspot position={[0.1, 1, 0.1]} groupRef={groupRef} />
      <Hotspot position={[-0.1, 1, 0.1]} groupRef={groupRef} />
    </group>
  );
};

// Preload the model
useGLTF.preload("./models/Corpo Dolphin.glb");

export default Machine;
