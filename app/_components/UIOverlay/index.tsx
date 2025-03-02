import React from "react";
import InfoCard from "./InfoCard";
import { useActiveComponent } from "@/app/providers/ActiveComponentProvider";
import { ArrowLeft } from "lucide-react";

const UIOverlay = () => {
  const { activeComponent, handleSetActiveComponent } = useActiveComponent();
  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 p-4 z-10 pointer-events-none">
      <InfoCard />

      {activeComponent && (
        <div className="absolute bottom-5 left-5 right-5 p-4 z-10">
          <div className="flex justify-between pointer-events-auto">
            <button
              className="bg-primary text-white font-bold p-2 rounded-2xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-secondary group"
              onClick={() => {
                handleSetActiveComponent(null);
              }}
              aria-label="Close video"
            >
              <ArrowLeft className="w-14 h-14 text-white group-hover:text-primary" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UIOverlay;
