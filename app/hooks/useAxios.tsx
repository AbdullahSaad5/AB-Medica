import axios from "axios";
import { useCallback, useRef, useEffect } from "react";

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export const useAxios = () => {
  const abortControllersRef = useRef<Record<string, AbortController>>({});

  // Cleanup function to abort all pending requests
  useEffect(() => {
    return () => {
      Object.values(abortControllersRef.current).forEach((controller) => {
        controller.abort();
      });
    };
  }, []);

  const createAbortController = (requestId: string) => {
    // Abort any existing request with the same ID
    if (abortControllersRef.current[requestId]) {
      abortControllersRef.current[requestId].abort();
    }

    const controller = new AbortController();
    abortControllersRef.current[requestId] = controller;
    return controller;
  };

  const getComponentsData = useCallback(async () => {
    const controller = createAbortController("getComponentsData");
    try {
      const response = await instance.get("/configurations/67d76239afa60bac7a541055", {
        signal: controller.signal,
      });
      const responseData = response.data;
      const config = JSON.parse(responseData.config);

      const components = config.components;
      const mainData = config.mainData;
      const overviewDialogsData = config.overviewDialogsData;
      return { components, mainData, overviewDialogsData };
    } finally {
      delete abortControllersRef.current["getComponentsData"];
    }
  }, []);

  const getModelsData = useCallback(async () => {
    const controller = createAbortController("getModelsData");
    try {
      const response = await instance.get("/configurations/67d75abfd092fb3c40304382", {
        signal: controller.signal,
      });
      const responseData = response.data;
      const config = JSON.parse(responseData.config);
      const productConfigIds = config.productConfigIds;

      // Create a new controller for media requests
      const mediaController = createAbortController("getModelsMediaData");

      // Fetch media data for each product config ID
      const mediaPromises = Object.entries(productConfigIds).map(async ([configName, configId]) => {
        const mediaResponse = await instance.get(`/media/${configId}`, {
          signal: mediaController.signal,
        });

        return {
          configName,
          media: mediaResponse.data,
        };
      });

      const mediaResults = await Promise.all(mediaPromises);

      // Create a map of configId to media data
      const mediaMap = mediaResults.reduce((acc: Record<string, unknown>, curr) => {
        acc[curr.configName] = curr.media;
        return acc;
      }, {});

      return {
        productConfigIds,
        mediaData: mediaMap,
      };
    } finally {
      delete abortControllersRef.current["getModelsData"];
      delete abortControllersRef.current["getModelsMediaData"];
    }
  }, []);

  const getTechnologiesData = useCallback(async () => {
    const controller = createAbortController("getTechnologiesData");
    try {
      const response = await instance.get("/configurations/67d75bb8d092fb3c40304406", {
        signal: controller.signal,
      });
      const responseData = response.data;

      const config = JSON.parse(responseData.config);

      const assetsIds = config.assetsIds;

      const mediaController = createAbortController("getTechnologiesMediaData");
      const assetPromises = Object.entries(assetsIds).map(async ([assetName, assetId]) => {
        const response = await instance.get(`/media/${assetId}`, {
          signal: mediaController.signal,
        });
        return {
          assetName,
          media: response.data,
        };
      });

      const assetResults = await Promise.all(assetPromises);

      const assetMap = assetResults.reduce((acc: Record<string, unknown>, curr) => {
        acc[curr.assetName] = curr.media;
        return acc;
      }, {});

      console.log(assetMap);

      return assetMap;
    } finally {
      delete abortControllersRef.current["getTechnologiesData"];
      delete abortControllersRef.current["getTechnologiesMediaData"];
    }
  }, []);

  const getSetupData = useCallback(async () => {
    const controller = createAbortController("getSetupData");
    try {
      const response = await instance.get("/configurations/67e0c704e5b2d4c45a53f04d", {
        signal: controller.signal,
      });

      const responseData = response.data;
      const config = JSON.parse(responseData.config);

      const images = config.images;
      const forwardVideos = config.forwardVideos;
      const backwardVideos = config.backwardVideos;

      const mediaController = createAbortController("getSetupMediaData");
      const imagePromises = images.map(async (image: string) => {
        const response = await instance.get(`/media/${image}`, {
          signal: mediaController.signal,
        });
        return response.data;
      });

      const forwardVideoPromises = forwardVideos.map(async (video: string) => {
        const response = await instance.get(`/media/${video}`, {
          signal: mediaController.signal,
        });
        return response.data;
      });

      const backwardVideoPromises = backwardVideos.map(async (video: string) => {
        const response = await instance.get(`/media/${video}`, {
          signal: mediaController.signal,
        });
        return response.data;
      });

      const imageResults = await Promise.all(imagePromises);
      const forwardVideoResults = await Promise.all(forwardVideoPromises);
      const backwardVideoResults = await Promise.all(backwardVideoPromises);

      return { images: imageResults, forwardVideos: forwardVideoResults, backwardVideos: backwardVideoResults };
    } finally {
      delete abortControllersRef.current["getSetupData"];
      delete abortControllersRef.current["getSetupMediaData"];
    }
  }, []);

  const getBenefitsData = useCallback(async () => {
    const controller = createAbortController("getBenefitsData");
    try {
      const response = await instance.get("/configurations/67e0cee7e5b2d4c45a53f5ae", {
        signal: controller.signal,
      });
      const responseData = response.data;
      const config = JSON.parse(responseData.config);

      const videos = config.videos;
      const reverseVideos = config.reverseVideos;
      const stillImages = config.stillImages;

      const mediaController = createAbortController("getBenefitsMediaData");

      const videoPromises = videos.map(async (video: string) => {
        const response = await instance.get(`/media/${video}`, {
          signal: mediaController.signal,
        });
        return response.data;
      });

      const reverseVideoPromises = reverseVideos.map(async (video: string) => {
        const response = await instance.get(`/media/${video}`, {
          signal: mediaController.signal,
        });
        return response.data;
      });

      const stillImagePromises = stillImages.map(async (image: string) => {
        const response = await instance.get(`/media/${image}`, {
          signal: mediaController.signal,
        });
        return response.data;
      });

      const videoResults = await Promise.all(videoPromises);
      const reverseVideoResults = await Promise.all(reverseVideoPromises);
      const stillImageResults = await Promise.all(stillImagePromises);

      return { videos: videoResults, reverseVideos: reverseVideoResults, stillImages: stillImageResults };
    } finally {
      delete abortControllersRef.current["getBenefitsData"];
      delete abortControllersRef.current["getBenefitsMediaData"];
    }
  }, []);

  const getAllMedias = useCallback(async () => {
    const controller = createAbortController("getAllMedias");
    try {
      const response = await instance.get("/media", {
        signal: controller.signal,
      });
      return response.data;
    } finally {
      delete abortControllersRef.current["getAllMedias"];
    }
  }, []);

  return { getComponentsData, getModelsData, getAllMedias, getTechnologiesData, getSetupData, getBenefitsData };
};

export default useAxios;
