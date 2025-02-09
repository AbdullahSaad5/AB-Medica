import { Html } from "@react-three/drei";
import { Plus } from "lucide-react";
import React from "react";
import { Group } from "three";

type HotspotProps = {
  position: [number, number, number];
  groupRef?: React.RefObject<Group>;
  occlude?: boolean;
  onClick?: () => void;
};

const Hotspot = ({ position, groupRef, occlude = false, onClick }: HotspotProps) => {
  return (
    <Html
      position={position} // Adjust these values to position the hotspot
      center
      distanceFactor={2} // Adjusts size based on camera distance
      occlude={groupRef && occlude ? [groupRef] : undefined} // Makes the button disappear when model blocks it
      className="pointer-events-auto" // Ensures button is clickable
    >
      <button
        onClick={() => {
          if (onClick) {
            onClick();
            return;
          }
          console.log("Hotspot clicked!");
        }}
        className="p-3 bg-[#c9ed08] text-white rounded-lg
                               hover:bg-blue-600 transition-colors duration-200
                               shadow-lg"
      >
        <Plus size={30} strokeWidth={2} color="#0038a7" />
      </button>
    </Html>
  );
};

export default Hotspot;
