import { Environment, OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { useRef, useEffect, useState, useMemo } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { EffectComposer, Vignette } from "@react-three/postprocessing";
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
  const [isInitialized, setIsInitialized] = useState(false);

  // Define different camera angles/positions
  const defaultCameraView = useMemo(() => {
    return {
      position: new THREE.Vector3(-0.4, 0.1, 0.6),
      target: new THREE.Vector3(0, 0, 0),
    };
  }, []);

  // Set initial camera position (runs once)
  useEffect(() => {
    if (!isInitialized && groupRef.current) {
      const initialView = defaultCameraView; // Change this to your preferred initial view

      const box = new THREE.Box3().setFromObject(groupRef.current);
      const center = new THREE.Vector3();
      box.getCenter(center);

      // Set camera position relative to the center of the object
      camera.position.set(
        center.x + initialView.position.x,
        center.y + initialView.position.y,
        center.z + initialView.position.z
      );

      if (controlsRef.current) {
        // @ts-expect-error target is private
        controlsRef.current.target.set(center.x, center.y, center.z);
        // @ts-expect-error update is private
        controlsRef.current.update();
      }

      setIsInitialized(true);
    }
  }, [camera, isInitialized, defaultCameraView]);

  // This effect runs when activeComponent changes
  useEffect(() => {
    if (groupRef.current) {
      const box = new THREE.Box3().setFromObject(groupRef.current);
      const center = new THREE.Vector3();
      box.getCenter(center);

      if (controlsRef.current) {
        // @ts-expect-error target is private
        controlsRef.current.target.set(center.x, center.y, center.z);
        // @ts-expect-error update is private
        controlsRef.current.update();
      }

      const size = box.getSize(new THREE.Vector3());
      const maxSize = Math.max(size.x, size.y, size.z);

      // Only adjust camera if we've already initialized and component changes
      if (isInitialized) {
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

        if (activeComponent) {
          camera.position.set(
            center.x + maxSize * zoomFactor,
            center.y + maxSize * zoomFactor,
            center.z + maxSize * zoomFactor
          );
          camera.lookAt(center);
        }
      }

      if (controlsRef.current) {
        // @ts-expect-error minDistance is private
        controlsRef.current.minDistance = maxSize * 0.35;
        // @ts-expect-error maxDistance is private
        controlsRef.current.maxDistance = maxSize * 2.5;
      }
    }
  }, [activeComponent, camera, isInitialized]);

  return (
    <>
      <PerspectiveCamera makeDefault fov={50} />
      <ambientLight intensity={1} />
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

      <OrbitControls
        ref={controlsRef}
        enablePan={false}
        dampingFactor={0.1}
        zoomSpeed={1}
        minPolarAngle={0.3}
        maxPolarAngle={Math.PI / 1.1}
      />
      <Environment preset="city" />

      <EffectComposer>
        <Vignette
          offset={0.5} // Distance of the vignette effect from the center
          darkness={0.5} // Intensity of the vignette effect
          eskil={false} // Use Eskil's vignette algorithm
        />
      </EffectComposer>
    </>
  );
};

export default Scene;
