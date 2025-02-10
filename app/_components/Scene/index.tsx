import { Environment, OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { useRef, useEffect } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import Stand from "../Models/stand";
import Nozel from "../Models/nozel";
import Machine from "../Models/machine";
import Device from "../Models/device";
import { useActiveComponent } from "@/app/providers/ActiveComponentProvider";

const Scene = () => {
  const controlsRef = useRef(null);
  const groupRef = useRef<THREE.Group | null>(null);
  const { camera } = useThree();
  const { activeComponent } = useActiveComponent();

  useEffect(() => {
    if (groupRef.current) {
      // Compute bounding box
      const box = new THREE.Box3().setFromObject(groupRef.current);
      const center = new THREE.Vector3();
      box.getCenter(center);

      // Update OrbitControls target
      if (controlsRef.current) {
        // @ts-expect-error target is private
        controlsRef.current.target.set(center.x, center.y, center.z);
        // @ts-expect-error update is private
        controlsRef.current.update();
      }

      // Adjust camera position relative to model size
      const size = box.getSize(new THREE.Vector3());
      const maxSize = Math.max(size.x, size.y, size.z);

      // Dynamically adjust zoom levels
      const zoomFactor =
        activeComponent === "stand"
          ? 1.5
          : activeComponent === "nozel"
          ? 1.2
          : activeComponent === "machine"
          ? 1.5
          : activeComponent === "device"
          ? 1.8
          : 1;

      camera.position.set(
        center.x + maxSize * zoomFactor,
        center.y + maxSize * zoomFactor,
        center.z + maxSize * zoomFactor
      );
      camera.lookAt(center);

      // Adjust OrbitControls zoom constraints dynamically
      if (controlsRef.current) {
        // @ts-expect-error minDistance is private
        controlsRef.current.minDistance = maxSize * 0.8;
        // @ts-expect-error maxDistance is private
        controlsRef.current.maxDistance = maxSize * 2.5;
      }
    }
  }, [activeComponent, camera]);

  return (
    <>
      <PerspectiveCamera makeDefault fov={50} />
      <ambientLight intensity={0.2} />
      <color attach="background" args={["#31a2d6"]} />

      <group ref={groupRef}>
        {!activeComponent ? (
          <>
            <Stand />
            <Nozel />
            <Machine />
            <Device />
          </>
        ) : activeComponent === "stand" ? (
          <Stand />
        ) : activeComponent === "nozel" ? (
          <Nozel />
        ) : activeComponent === "machine" ? (
          <Machine />
        ) : (
          <Device />
        )}
      </group>

      <OrbitControls ref={controlsRef} enablePan={false} />
      <Environment preset="city" />
    </>
  );
};

export default Scene;
