import React from "react";
import InfoCard from "./InfoCard";

const UIOverlay = () => {
  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 p-4 z-10 pointer-events-none">
      <InfoCard />
    </div>
  );
};

export default UIOverlay;
