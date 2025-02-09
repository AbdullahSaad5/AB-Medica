import { Html } from "@react-three/drei";
import React, { useState } from "react";
import { Group } from "three";

type HotspotProps = {
  position: [number, number, number];
  groupRef?: React.RefObject<Group>;
  occlude?: boolean;
  onClick?: () => void;
  label?: string; // New prop for the label text
};

const Label = ({ position, groupRef, occlude = false, onClick, label = "Hotspot" }: HotspotProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Html
      position={position}
      center
      distanceFactor={2}
      occlude={groupRef && occlude ? [groupRef] : undefined}
      className="pointer-events-auto"
    >
      <div className="relative">
        {/* Label that appears on hover */}
        {isHovered && (
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap">
            <div className="bg-white/90 text-black px-2 py-1 rounded shadow-lg text-sm">{label}</div>
            {/* Triangle pointer */}
            <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-white/90 mx-auto" />
          </div>
        )}

        {/* Hotspot button */}
        <button
          onClick={() => {
            if (onClick) {
              onClick();
              return;
            }
            console.log("Hotspot clicked!");
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="bg-transparent border-[6px] border-[#c9ed08] rounded-full p-2 hover:border-[#d4f31a] transition-colors duration-200"
        />
      </div>
    </Html>
  );
};

export default Label;
