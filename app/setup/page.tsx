"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import LoadingScreen from "../_components/LoadingScreen";

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

const Setup = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [showingVideo, setShowingVideo] = useState(false);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  const videoRef = useRef<HTMLVideoElement>(null);
  const [allLoaded, setAllLoaded] = useState(Array(images.length).fill(false));

  const router = useRouter();

  const handleNext = (): void => {
    if (currentImageIndex === images.length - 1) {
      router.push("/benefits");
      return;
    }

    if (!showingVideo && currentImageIndex < images.length - 1) {
      setDirection("forward");
      setCurrentVideoIndex(currentImageIndex);
      setShowingVideo(true);
    }
  };

  const handlePrevious = (): void => {
    if (!showingVideo && currentImageIndex > 0) {
      setDirection("backward");
      setCurrentVideoIndex(currentImageIndex - 1);
      setShowingVideo(true);
    }
  };

  const currentVideoSrc =
    direction === "forward" ? forwardVideos[currentVideoIndex] : backwardVideos[currentVideoIndex];

  useEffect(() => {
    console.log("useEffect");
    if (videoRef.current && showingVideo) {
      console.log("Video ref found and showingVideo is true");
      videoRef.current.load();
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch((error) => {
        console.error("Error playing video:", error);
      });
    }
  }, [showingVideo, currentVideoSrc]);

  console.log("currentImageIndex", currentImageIndex);
  console.log("currentVideoIndex", currentVideoIndex);
  console.log("allLoaded", allLoaded);
  console.log("showingVideo", showingVideo);
  console.log("direction", direction);
  console.log("currentVideoSrc", currentVideoSrc);

  return (
    <div className="min-h-screen bg-white relative w-full h-screen">
      {allLoaded.some((loaded) => !loaded) && <LoadingScreen />}

      {images.map((image, index) => (
        <Image
          key={image}
          src={image}
          alt={`Step ${index}`}
          fill
          className={`object-cover h-full w-full ${index === currentImageIndex ? "opacity-100" : "opacity-0"}`}
          priority
          quality={100}
          onLoad={() => {
            setAllLoaded((prev) => {
              const newLoaded = [...prev];
              newLoaded[index] = true;
              return newLoaded;
            });
          }}
          onError={() => {
            console.error("Failed to load image:", image);
          }}
        />
      ))}

      <video
        ref={videoRef}
        className={`absolute inset-0 w-full h-full object-cover ${showingVideo ? "visible" : "invisible"}`}
        playsInline
        muted
        onCanPlayThrough={() => {
          if (direction === "forward") {
            setCurrentImageIndex((prevIndex) => prevIndex + 1);
          } else {
            setCurrentImageIndex((prevIndex) => prevIndex - 1);
          }
        }}
        onEnded={() => {
          setShowingVideo(false);
        }}
        onError={(e) => {
          console.error("Video error:", e);
          setShowingVideo(false);
        }}
      >
        <source src={currentVideoSrc} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="absolute bottom-5 left-5 right-5 p-4 z-10">
        <div className="flex justify-between">
          <button
            className="bg-primary text-white font-bold p-2 rounded-2xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-secondary group"
            onClick={handlePrevious}
            disabled={currentImageIndex === 0 || showingVideo}
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
    </div>
  );
};

export default Setup;
