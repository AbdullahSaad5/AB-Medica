import { useGLTF } from "@react-three/drei";
import React from "react";


const Device = () => {
  const result = useGLTF("./models/dolphin_cartuccia.glb");

  return <primitive object={result.scene} />;
};

export default Device;
