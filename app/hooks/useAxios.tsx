import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:3000/api",
});

export const useAxios = () => {
  const getComponentsData = async () => {
    const response = await instance.get("/configurations/67d76239afa60bac7a541055");
    // return response.data;
    const responseData = response.data;
    const config = JSON.parse(responseData.config);
    console.log(config);
    const components = config.components;
    const mainData = config.mainData;
    const overviewDialogsData = config.overviewDialogsData;
    return { components, mainData, overviewDialogsData };
  };

  return { getComponentsData };
};

export default useAxios;
