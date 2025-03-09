import { useGLTF } from "@react-three/drei";
import React from "react";

const Stand = ({ isVisible }: { isVisible: boolean }) => {
  const result = useGLTF("./models/dolphin_stand.glb");

  return isVisible ? <primitive object={result.scene} /> : null;
};

export default Stand;
