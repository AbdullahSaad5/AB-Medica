import React from "react";
import useAxios from "../hooks/useAxios";

export type ActiveComponent = "stand" | "nozel" | "machine" | "device" | null;

type ActiveComponentContextType = {
  activeComponent: ActiveComponent;
  handleSetActiveComponent: (component: ActiveComponent) => void;
  zoomLevel: number;
  setZoomLevel: React.Dispatch<React.SetStateAction<number>>;
  scaleFactor: number;
  showComponentDetails: boolean;
  setShowComponentDetails: React.Dispatch<React.SetStateAction<boolean>>;
  componentsData: ComponentsData | null;
  setComponentsData: React.Dispatch<React.SetStateAction<ComponentsData | null>>;
  modelsData: Record<string, unknown> | null;
  setModelsData: React.Dispatch<React.SetStateAction<Record<string, unknown> | null>>;
  technologiesData: Record<string, unknown> | null;
  setTechnologiesData: React.Dispatch<React.SetStateAction<Record<string, unknown> | null>>;
  setupData: Record<string, unknown> | null;
  setSetupData: React.Dispatch<React.SetStateAction<Record<string, unknown> | null>>;
  benefitsData: BenefitsData | null;
  setBenefitsData: React.Dispatch<React.SetStateAction<BenefitsData | null>>;
  loading: Record<string, boolean>;
};

type ComponentsData = {
  mainData: {
    title: string;
    description: string;
  };
  overviewDialogsData: {
    title: string;
    description: string;
  }[];
};

type BenefitsData = {
  videos: { url: string }[];
  reverseVideos: { url: string }[];
  stillImages: { url: string }[];
};

const ActiveComponentContext = React.createContext({} as ActiveComponentContextType);

const ActiveComponentProvider = ({ children }: { children: React.ReactNode }) => {
  const [activeComponent, setActiveComponent] = React.useState<ActiveComponent>(null);
  const [showComponentDetails, setShowComponentDetails] = React.useState(false);
  const [zoomLevel, setZoomLevel] = React.useState(1);
  const scaleFactor = 0.5 / zoomLevel;
  const maxScale = 1.5;
  const [componentsData, setComponentsData] = React.useState<ComponentsData | null>(null);
  const [modelsData, setModelsData] = React.useState<Record<string, unknown> | null>(null);
  const [technologiesData, setTechnologiesData] = React.useState<Record<string, unknown> | null>(null);
  const [setupData, setSetupData] = React.useState<Record<string, unknown> | null>(null);
  const [benefitsData, setBenefitsData] = React.useState<BenefitsData | null>(null);
  const [loading, setLoading] = React.useState<Record<string, boolean>>({
    components: true,
    models: true,
    technologies: true,
    setup: true,
    benefits: true,
  });

  const { getComponentsData, getModelsData, getTechnologiesData, getSetupData, getBenefitsData } = useAxios();

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [componentsResult, modelsResult, technologiesResult, setupResult, benefitsResult] = await Promise.all([
          getComponentsData(),
          getModelsData(),
          getTechnologiesData(),
          getSetupData(),
          getBenefitsData(),
        ]);

        setComponentsData(componentsResult);
        setModelsData(modelsResult);
        setTechnologiesData(technologiesResult);
        setSetupData(setupResult);
        setBenefitsData(benefitsResult);
        setLoading({
          components: false,
          models: false,
          technologies: false,
          setup: false,
          benefits: false,
        });
      } catch (error) {
        console.log(error);
        // Handle AbortError from the useAxios hook
        if (error instanceof Error && error.name === "AbortError") {
          console.log("Data fetching cancelled");
          return;
        }

        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        console.error("Error fetching data:", errorMessage);

        setLoading({
          components: false,
          models: false,
          technologies: false,
          setup: false,
          benefits: false,
        });
      }
    };

    fetchData();
  }, [getComponentsData, getModelsData, getTechnologiesData, getSetupData, getBenefitsData]);

  const handleSetActiveComponent = (component: ActiveComponent) => {
    if (activeComponent === component) {
      setActiveComponent(null);
      setShowComponentDetails(false);
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
        showComponentDetails,
        setShowComponentDetails,
        componentsData,
        setComponentsData,
        modelsData,
        setModelsData,
        technologiesData,
        setTechnologiesData,
        setupData,
        setSetupData,
        benefitsData,
        setBenefitsData,
        loading,
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
