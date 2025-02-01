import { useGLTF } from "@react-three/drei";
import React from "react";

const Stand = () => {
  const result = useGLTF("./models/dolphin_stand.glb");

  return <primitive object={result.scene} />;
};

export default Stand;
