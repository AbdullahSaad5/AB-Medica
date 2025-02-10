import { Html } from "@react-three/drei";
import React, { useState } from "react";
import { Group } from "three";

type HotspotProps = {
  position: [number, number, number];
  groupRef?: React.RefObject<Group>;
  occlude?: boolean;
  onClick?: () => void;
  label?: string; // New prop for the label text
  show?: boolean;
  positionAdjustments?: [number, number, number];
};

const Label = ({
  position,
  groupRef,
  occlude = false,
  onClick,
  label = "Hotspot",
  show = true,
  positionAdjustments,
}: HotspotProps) => {
  const [isHovered, setIsHovered] = useState(false);

  if (!show) return;

  const finalCalculatedPosition = (
    positionAdjustments
      ? [
          position[0] + positionAdjustments[0],
          position[1] + positionAdjustments[1],
          position[2] + positionAdjustments[2],
        ]
      : position
  ) as [number, number, number];

  return (
    <Html
      position={finalCalculatedPosition}
      center
      distanceFactor={2}
      occlude={groupRef && occlude ? [groupRef] : undefined}
      className="pointer-events-auto"
    >
      <div className="relative">
        {/* Label that appears on hover */}
        {isHovered && (
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap">
            <div className="bg-[#c9ed08] text-[#012e87] px-2 py-1 rounded shadow-lg text-sm">{label}</div>
            {/* Triangle pointer */}
            <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-[#c9ed08]/90 mx-auto" />
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
          className="bg-transparent border-2 border-[#c9ed08] rounded-full p-0.5 hover:border-[#d4f31a] transition-colors duration-200"
        />
      </div>
    </Html>
  );
};

export default Label;
