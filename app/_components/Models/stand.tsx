import { useGLTF } from "@react-three/drei";
import React from "react";

// const MODEL_PATH = "./models/dolphin_stand.glb";

const Stand = ({ isVisible, path }: { isVisible: boolean; path: string }) => {
  const result = useGLTF(path); // Provide empty string as fallback

  return isVisible ? <primitive object={result.scene} /> : null;
};

export default Stand;
