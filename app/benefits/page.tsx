"use client";

import LoadingScreen from "../_components/LoadingScreen";
import { useActiveComponent } from "../providers/ActiveComponentProvider";
import Benefits from "./benefits";

const BenefitsPage = () => {
  const { loading } = useActiveComponent();

  const anyLoading = Object.values(loading).some((value) => value);

  console.log("loading", anyLoading);

  return anyLoading ? <LoadingScreen /> : <Benefits />;
};

export default BenefitsPage;
