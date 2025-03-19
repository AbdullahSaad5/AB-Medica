import { useGLTF } from "@react-three/drei";
import React from "react";

const MODEL_PATH = "./models/dolphin_stand.glb";

const Stand = ({ isVisible }: { isVisible: boolean }) => {
  const result = useGLTF(MODEL_PATH);

  return isVisible ? <primitive object={result.scene} /> : null;
};

export default Stand;

useGLTF.preload(MODEL_PATH);
