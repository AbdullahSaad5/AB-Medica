import React from "react";

export type ActiveComponent = "stand" | "nozel" | "machine" | "device" | null;

type ActiveComponentContextType = {
  activeComponent: ActiveComponent;
  handleSetActiveComponent: (component: ActiveComponent) => void;
  zoomLevel: number;
  setZoomLevel: React.Dispatch<React.SetStateAction<number>>;
  scaleFactor: number;
};

const ActiveComponentContext = React.createContext({} as ActiveComponentContextType);

const ActiveComponentProvider = ({ children }: { children: React.ReactNode }) => {
  const [activeComponent, setActiveComponent] = React.useState<ActiveComponent>(null);
  const [zoomLevel, setZoomLevel] = React.useState(1);
  const scaleFactor = 0.5 / zoomLevel;
  const maxScale = 1.5;

  const handleSetActiveComponent = (component: ActiveComponent) => {
    if (activeComponent === component) {
      setActiveComponent(null);
    } else {
      setActiveComponent(component);
    }
  };

  return (
    <ActiveComponentContext.Provider
      value={{
        activeComponent,
        handleSetActiveComponent,
        zoomLevel,
        setZoomLevel,
        scaleFactor: scaleFactor > maxScale ? maxScale : scaleFactor,
      }}
    >
      {children}
    </ActiveComponentContext.Provider>
  );
};

export const useActiveComponent = () => {
  const context = React.useContext(ActiveComponentContext);
  if (!context) {
    throw new Error("useActiveComponent must be used within an ActiveComponentProvider");
  }
  return context;
};

export default ActiveComponentProvider;
