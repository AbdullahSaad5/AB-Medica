import { Environment, OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { useRef, useEffect, useState, useMemo } from "react";
import { useThree, useFrame } from "@react-three/fiber";
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
  const { activeComponent, setZoomLevel } = useActiveComponent();
  const [isInitialized, setIsInitialized] = useState(false);
  const lastDistanceRef = useRef<number | null>(null);
  const lastTargetRef = useRef<THREE.Vector3 | null>(null);
  const forceUpdateRef = useRef(false);

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

      const box = new THREE.Box3();
      if (groupRef.current) {
        box.setFromObject(groupRef.current);
      }
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
      const box = new THREE.Box3();
      if (groupRef.current) {
        box.setFromObject(groupRef.current);
      }
      const center = new THREE.Vector3();
      box.getCenter(center);

      if (controlsRef.current) {
        // @ts-expect-error target is private
        controlsRef.current.target.set(center.x, center.y, center.z);
        // @ts-expect-error update is private
        controlsRef.current.update();
      }

      const size = box.getSize(new THREE.Vector3());
      let maxSize;
      if (activeComponent === "device") {
        maxSize = Math.max(size.x, size.y, size.z) * 2.5;
      } else {
        maxSize = Math.max(size.x, size.y, size.z);
      }

      // Only adjust camera if we've already initialized and component changes
      if (isInitialized) {
        const zoomFactor =
          activeComponent === "stand"
            ? 1.5
            : activeComponent === "nozel"
            ? 1.2
            : activeComponent === "machine"
            ? 2
            : activeComponent === "device"
            ? 2.5
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

      // Force zoom recalculation on next frame
      lastDistanceRef.current = null;
      lastTargetRef.current = null;
      forceUpdateRef.current = true;
    }
  }, [activeComponent, camera, isInitialized]);

  // Use useFrame to calculate zoom level only when there's a change
  useFrame(() => {
    const controlsInstance = controlsRef.current;

    if (!controlsInstance || !groupRef.current || !isInitialized) return;

    // Get current target and calculate distance
    // @ts-expect-error target is private
    const currentTarget = controlsInstance.target;
    const currentDistance = camera.position.distanceTo(currentTarget);

    // Check if target or distance has changed or if we need to force update
    const targetChanged = !lastTargetRef.current || !lastTargetRef.current.equals(currentTarget);

    const distanceChanged =
      lastDistanceRef.current === null || Math.abs(lastDistanceRef.current - currentDistance) > 0.001;

    // Calculate zoom level if something has changed or if forced
    if (distanceChanged || targetChanged || forceUpdateRef.current) {
      const box = new THREE.Box3();
      if (groupRef.current) {
        box.setFromObject(groupRef.current);
      }
      const size = box.getSize(new THREE.Vector3());
      const maxSize = Math.max(size.x, size.y, size.z);

      // @ts-expect-error minDistance and maxDistance are private
      const minDist = controlsInstance.minDistance || maxSize * 0.35;
      // @ts-expect-error minDistance and maxDistance are private
      const maxDist = controlsInstance.maxDistance || maxSize * 2.5;

      // Normalize distance to a 0-1 scale (inverted so zoom in = higher value)
      const normalizedZoom = 1 - (currentDistance - minDist) / (maxDist - minDist);

      // Clamp between 0 and 1
      setZoomLevel(Math.max(0, Math.min(1, normalizedZoom)));

      // Update refs
      lastDistanceRef.current = currentDistance;
      lastTargetRef.current = currentTarget.clone();

      // Reset force update flag
      if (forceUpdateRef.current) {
        forceUpdateRef.current = false;
      }
    }
  });

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
