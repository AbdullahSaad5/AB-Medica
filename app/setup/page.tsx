"use client";

import LoadingScreen from "../_components/LoadingScreen";
import { useActiveComponent } from "../providers/ActiveComponentProvider";
import DeviceSetup from "./setup";

const Setup = () => {
  const { loading } = useActiveComponent();

  const anyLoading = Object.values(loading).some((value) => value);

  return anyLoading ? <LoadingScreen /> : <DeviceSetup />;
};

export default Setup;
