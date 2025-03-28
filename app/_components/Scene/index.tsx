"use client";

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
  const { activeComponent, setZoomLevel, modelsData, loading } = useActiveComponent();
  const [isInitialized, setIsInitialized] = useState(false);
  const lastDistanceRef = useRef<number | null>(null);
  const lastTargetRef = useRef<THREE.Vector3 | null>(null);
  const forceUpdateRef = useRef(false);

  // Define specific camera views for each component
  const cameraViews = useMemo(
    () => ({
      default: {
        position: new THREE.Vector3(-0.303, 0.168, 0.615),
        target: new THREE.Vector3(0.098, -0.026, 0.007),
        zoomFactor: 1,
        maxDistance: 2.8,
        minDistance: 0.5,
      },
      stand: {
        position: new THREE.Vector3(0.6, -0.2, 0.4), // Bottom-right angle
        target: new THREE.Vector3(0, -0.1, 0),
        zoomFactor: 1.5,
        maxDistance: 1.5,
        minDistance: 0.5,
      },
      nozel: {
        position: new THREE.Vector3(-0.5, 0.3, 0.5), // Top-left angle
        target: new THREE.Vector3(0, 0.1, 0),
        zoomFactor: 1.2,
        maxDistance: 1,
        minDistance: 0.75,
      },
      machine: {
        position: new THREE.Vector3(0.2, 0.5, 0.6), // Top-front angle
        target: new THREE.Vector3(0, 0, 0),
        zoomFactor: 1,
        maxDistance: 1,
        minDistance: 0.5,
      },
      device: {
        position: new THREE.Vector3(-0.3, 0.2, -0.7), // Back angle
        target: new THREE.Vector3(0, 0, 0),
        zoomFactor: 2.5,
        maxDistance: 1.2,
        minDistance: 0.5,
      },
    }),
    []
  );

  // Set initial camera position (runs once)
  useEffect(() => {
    if (!isInitialized && groupRef.current) {
      const initialView = cameraViews.default;
      const box = new THREE.Box3();
      box.setFromObject(groupRef.current);
      const center = new THREE.Vector3();
      box.getCenter(center);

      // Position camera relative to center
      camera.position.set(
        center.x + initialView.position.x,
        center.y + initialView.position.y,
        center.z + initialView.position.z
      );

      if (controlsRef.current) {
        // @ts-expect-error target is private
        controlsRef.current.target.set(
          center.x + initialView.target.x,
          center.y + initialView.target.y,
          center.z + initialView.target.z
        );
        // @ts-expect-error update is private
        controlsRef.current.update();
      }
      setIsInitialized(true);
    }
  }, [camera, isInitialized, cameraViews]);

  // Update camera target when the active component changes
  useEffect(() => {
    if (groupRef.current && isInitialized) {
      // Compute the center of the group
      const box = new THREE.Box3();
      box.setFromObject(groupRef.current);
      const center = new THREE.Vector3();
      box.getCenter(center);

      // Get the view for the active component, defaulting if necessary
      const view = activeComponent ? cameraViews[activeComponent] : cameraViews.default;

      if (controlsRef.current) {
        // Set target as the group's center plus the view's target offset
        // @ts-expect-error target is private
        controlsRef.current.target.set(center.x + view.target.x, center.y + view.target.y, center.z + view.target.z);
        // @ts-expect-error update is private
        controlsRef.current.update();
      }
    }
  }, [activeComponent, isInitialized, cameraViews]);

  // Update zoom level using useFrame
  useFrame(() => {
    const controlsInstance = controlsRef.current;
    if (!controlsInstance || !groupRef.current || !isInitialized) return;

    // @ts-expect-error target is private
    const currentTarget = controlsInstance.target;
    const currentDistance = camera.position.distanceTo(currentTarget);
    const targetChanged = !lastTargetRef.current || !lastTargetRef.current.equals(currentTarget);
    const distanceChanged =
      lastDistanceRef.current === null || Math.abs(lastDistanceRef.current - currentDistance) > 0.001;

    if (distanceChanged || targetChanged || forceUpdateRef.current) {
      const box = new THREE.Box3();
      box.setFromObject(groupRef.current);
      const size = box.getSize(new THREE.Vector3());
      const maxSize = Math.max(size.x, size.y, size.z);

      // @ts-expect-error minDistance and maxDistance are private
      const minDist = controlsInstance.minDistance || maxSize * 0.35;
      // @ts-expect-error minDistance and maxDistance are private
      const maxDist = controlsInstance.maxDistance || maxSize * 2.5;

      const normalizedZoom = 1 - (currentDistance - minDist) / (maxDist - minDist);
      setZoomLevel(Math.max(0, Math.min(1, normalizedZoom)));

      lastDistanceRef.current = currentDistance;
      lastTargetRef.current = currentTarget.clone();

      if (forceUpdateRef.current) {
        forceUpdateRef.current = false;
      }
    }
  });

  // Assume you have a cameraViews object that defines a zoomFactor for each component
  useEffect(() => {
    const view = activeComponent ? cameraViews[activeComponent] : cameraViews.default;
    // Set the camera zoom factor and update its projection matrix
    camera.zoom = view.zoomFactor;
    camera.updateProjectionMatrix();
  }, [activeComponent, camera, cameraViews]);

  const anyLoading = Object.values(loading).some((value) => value);

  if (anyLoading || !modelsData) {
    // return <div>Loading...</div>;
    return <color attach="background" args={["#31a2d6"]} />;
  }

  return (
    <>
      <PerspectiveCamera makeDefault fov={50} />
      <ambientLight intensity={1} />
      <color attach="background" args={["#31a2d6"]} />

      <group ref={groupRef}>
        <Stand isVisible={!activeComponent || activeComponent === "stand"} path={modelsData?.mediaData?.stand?.url} />
        <Nozel isVisible={!activeComponent || activeComponent === "nozel"} path={modelsData?.mediaData?.nozel?.url} />
        <Machine
          isVisible={!activeComponent || activeComponent === "machine"}
          path={modelsData?.mediaData?.machine?.url}
        />
        <Device
          isVisible={!activeComponent || activeComponent === "device"}
          path={modelsData?.mediaData?.device?.url}
        />
      </group>

      <OrbitControls
        ref={controlsRef}
        // enablePan={false}
        enableDamping
        dampingFactor={0.1}
        zoomSpeed={1}
        minPolarAngle={0.3}
        maxPolarAngle={Math.PI / 1.1}
        maxDistance={(activeComponent ? cameraViews[activeComponent] : cameraViews.default).maxDistance}
        minDistance={(activeComponent ? cameraViews[activeComponent] : cameraViews.default).minDistance}
        makeDefault
      />
      <Environment preset="city" />

      <EffectComposer>
        <Vignette offset={0.5} darkness={0.5} eskil={false} />
      </EffectComposer>
    </>
  );
};

export default Scene;
