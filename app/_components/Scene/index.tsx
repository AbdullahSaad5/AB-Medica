import { Environment, OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { useRef } from "react";
import Stand from "../Models/stand";
import Nozel from "../Models/nozel";
import Machine from "../Models/machine";
import Device from "../Models/device";
import { useActiveComponent } from "@/app/providers/ActiveComponentProvider";

const Scene = () => {
  const controlsRef = useRef(null);

  const { activeComponent } = useActiveComponent();

  return (
    <>
      <PerspectiveCamera
        makeDefault
        position={[4, 4, 4]} // Adjusted initial camera position
        fov={50}
      />
      <ambientLight intensity={0.2} />
      <color attach="background" args={["#31a2d6"]} />
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
      {/* <Stand />
      <Nozel />
      <Machine />
      <Device /> */}
      <OrbitControls
        ref={controlsRef}
        minDistance={2}
        maxDistance={10}
        // minPolarAngle={Math.PI / 4} // Limit bottom angle
        // maxPolarAngle={Math.PI / 1.5} // Limit top angle
        enablePan={false} // Optional: disable panning to keep focus
      />
      <Environment preset="city" />
    </>
  );
};

export default Scene;
