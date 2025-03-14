"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import LoadingScreen from "../_components/LoadingScreen";

const Setup = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showingVideo, setShowingVideo] = useState(false);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  const [isLoading, setIsLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const preloadedImages = useRef<HTMLImageElement[]>([]);
  const preloadedVideos = useRef<HTMLVideoElement[]>([]);
  const router = useRouter();

  const images = [
    "/assets/images/Vista iniziale-1.png",
    "/assets/images/Step 0 FRAME.png",
    "/assets/images/Step 1 FRAME.png",
    "/assets/images/Step 2 FRAME.png",
    "/assets/images/Step 3 FRAME.png",
    "/assets/images/Step 4 FRAME.png",
    "/assets/images/Step 5 FRAME.png",
    "/assets/images/Step 6 FRAME.png",
    "/assets/images/Step 7 FRAME.png",
  ];

  const forwardVideos = [
    "/assets/videos/forwards/s0 avanti compr.mp4",
    "/assets/videos/forwards/s1 avanti compr.mp4",
    "/assets/videos/forwards/s2 avanti compr.mp4",
    "/assets/videos/forwards/s3 avanti compr.mp4",
    "/assets/videos/forwards/s4 avanti compr.mp4",
    "/assets/videos/forwards/s5 avanti compr.mp4",
    "/assets/videos/forwards/s6 avanti compr.mp4",
    "/assets/videos/forwards/s7 avanti compr.mp4",
  ];

  const backwardVideos = [
    "/assets/videos/backwards/s0 back compr.mp4",
    "/assets/videos/backwards/s1 back compr.mp4",
    "/assets/videos/backwards/s2 back compr.mp4",
    "/assets/videos/backwards/s3 back compr.mp4",
    "/assets/videos/backwards/s4 back compr.mp4",
    "/assets/videos/backwards/s5 back compr.mp4",
    "/assets/videos/backwards/s6 back compr.mp4",
    "/assets/videos/backwards/s7 back compr.mp4",
  ];

  useEffect(() => {
    let loadedImages = 0;
    let loadedVideos = 0;
    const totalAssets = images.length + forwardVideos.length + backwardVideos.length;

    images.forEach((src, index) => {
      const img = new window.Image();
      img.src = src;
      img.onload = () => {
        loadedImages++;
        if (loadedImages + loadedVideos === totalAssets) {
          setIsLoading(false);
        }
      };
      preloadedImages.current[index] = img;
    });

    [...forwardVideos, ...backwardVideos].forEach((src, index) => {
      const video = document.createElement("video");
      video.src = src;
      video.oncanplaythrough = () => {
        loadedVideos++;
        if (loadedImages + loadedVideos === totalAssets) {
          setIsLoading(false);
        }
      };
      preloadedVideos.current[index] = video;
    });
  }, []);

  const getCurrentVideo = () => {
    return direction === "forward" ? forwardVideos[currentIndex] : backwardVideos[currentIndex];
  };

  const handleNext = () => {
    if (currentIndex === images.length - 1) {
      router.push("/benefits");
    }
    if (!showingVideo && currentIndex < images.length - 1) {
      setDirection("forward");
      setShowingVideo(true);
    }
  };

  const handlePrevious = () => {
    if (!showingVideo && currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      setDirection("backward");
      setShowingVideo(true);
    }
  };

  const handleVideoEnd = () => {
    setShowingVideo(false);
  };

  return (
    <div className="min-h-screen bg-white relative w-full h-screen">
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <>
          <Image
            src={images[currentIndex]}
            alt={`Step ${currentIndex}`}
            fill
            className="object-cover h-full w-full transition-opacity duration-500"
            priority
            quality={100}
          />

          {showingVideo && (
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover"
              autoPlay
              onPlay={() => {
                if (direction === "forward") {
                  setTimeout(() => {
                    setCurrentIndex((prev) => Math.min(images.length - 1, prev + 1));
                  }, 50);
                }
              }}
              onEnded={handleVideoEnd}
            >
              <source src={getCurrentVideo()} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}

          <div className="absolute bottom-5 left-5 right-5 p-4 z-10">
            <div className="flex justify-between">
              <button
                className="bg-primary text-white font-bold p-2 rounded-2xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-secondary group"
                onClick={handlePrevious}
                disabled={currentIndex === 0 || showingVideo}
              >
                <ArrowLeft className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 text-white group-hover:text-primary" />
              </button>
              <button
                className="bg-primary text-white font-bold p-2 rounded-2xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-secondary group"
                onClick={handleNext}
                disabled={showingVideo}
              >
                <ArrowRight className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 text-white group-hover:text-primary" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Setup;
