import React from "react";

export type ActiveComponent = "stand" | "nozel" | "machine" | "device" | null;

type ActiveComponentContextType = {
  activeComponent: ActiveComponent;
  handleSetActiveComponent: (component: ActiveComponent) => void;
};

const ActiveComponentContext = React.createContext({} as ActiveComponentContextType);

const ActiveComponentProvider = ({ children }: { children: React.ReactNode }) => {
  const [activeComponent, setActiveComponent] = React.useState<ActiveComponent>(null);

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
