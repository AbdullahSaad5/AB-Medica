"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showingVideo, setShowingVideo] = useState(false);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  const [isLoading, setIsLoading] = useState(true);
  const [nextImageLoaded, setNextImageLoaded] = useState(false);
  const [nextImageSrc, setNextImageSrc] = useState<string>(images[0]);
  const [currentVideoSrc, setCurrentVideoSrc] = useState<string>("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const preloadedImages = useRef<HTMLImageElement[]>([]);
  const preloadedVideos = useRef<HTMLVideoElement[]>([]);
  const router = useRouter();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Preload all assets on component mount
  useEffect(() => {
    let loadedImages = 0;
    let loadedVideos = 0;
    const totalAssets = images.length + forwardVideos.length + backwardVideos.length;

    const handleAssetLoad = () => {
      if (loadedImages + loadedVideos === totalAssets) {
        setIsLoading(false);
      }
    };

    // Preload images
    images.forEach((src, index) => {
      const img = new window.Image();
      img.onload = () => {
        loadedImages++;
        handleAssetLoad();
      };
      img.onerror = () => {
        loadedImages++;
        handleAssetLoad();
        console.error(`Failed to load image: ${src}`);
      };
      img.src = src;
      preloadedImages.current[index] = img;
    });

    // Preload videos - Safari needs special handling
    const preloadVideo = (src: string, index: number, isForward: boolean) => {
      const video = document.createElement("video");
      video.preload = "auto"; // Explicitly set preload

      // Add event listeners before setting src (important for Safari)
      video.addEventListener(
        "canplaythrough",
        () => {
          loadedVideos++;
          handleAssetLoad();
        },
        { once: true }
      );

      video.addEventListener(
        "error",
        () => {
          loadedVideos++;
          handleAssetLoad();
          console.error(`Failed to load video: ${src}`);
        },
        { once: true }
      );

      // For Safari compatibility, add these attributes
      video.playsInline = true;
      video.muted = true;

      // Set the source
      video.src = src;

      // Store reference
      const arrayIndex = isForward ? index : index + forwardVideos.length;
      preloadedVideos.current[arrayIndex] = video;

      // Force load for Safari
      video.load();
    };

    // Preload forward videos
    forwardVideos.forEach((src, index) => {
      preloadVideo(src, index, true);
    });

    // Preload backward videos
    backwardVideos.forEach((src, index) => {
      preloadVideo(src, index, false);
    });

    return () => {
      // Clear any pending timeouts when component unmounts
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Reset nextImageLoaded when current index changes
  useEffect(() => {
    setNextImageLoaded(false);
  }, [currentIndex]);

  // Update video src when showing video or direction changes
  useEffect(() => {
    if (showingVideo) {
      const videoSrc = direction === "forward" ? forwardVideos[currentIndex] : backwardVideos[currentIndex];

      setCurrentVideoSrc(videoSrc);
      console.log(`Setting video source to: ${videoSrc}`);
    }
  }, [showingVideo, direction, currentIndex]);

  // Handle video playback and cleanup
  useEffect(() => {
    if (showingVideo && videoRef.current) {
      const video = videoRef.current;

      // When the video source changes, we need to load the new source
      if (video.src !== currentVideoSrc && currentVideoSrc) {
        video.src = currentVideoSrc;
        video.load();
      }

      // For Safari: ensure video is ready to play
      const playVideo = () => {
        try {
          const playPromise = video.play();
          if (playPromise !== undefined) {
            playPromise.catch((error) => {
              console.error("Video play error:", error);
              // If autoplay fails, try again with user interaction simulation
              setTimeout(() => {
                video.play().catch((e) => console.error("Retry play failed:", e));
              }, 300);
            });
          }
        } catch (error) {
          console.error("Error playing video:", error);
        }
      };

      // Safari sometimes needs a moment to properly initialize the video
      setTimeout(playVideo, 100);

      // Handle cleanup
      return () => {
        if (video) {
          video.pause();
          video.currentTime = 0;
        }
      };
    }
  }, [showingVideo, currentVideoSrc]);

  const preloadNextImage = (index: number): void => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setNextImageLoaded(false);

    // Use a longer timeout for Safari
    timeoutRef.current = setTimeout(() => {
      if (index >= 0 && index < images.length) {
        setNextImageSrc(images[index]);
        console.log(`Preloading image at index ${index}:`, images[index]);
      }
    }, 200); // Increased from 50ms to 200ms for Safari compatibility
  };

  const handleNext = (): void => {
    if (currentIndex === images.length - 1) {
      router.push("/benefits");
      return;
    }

    if (!showingVideo && currentIndex < images.length - 1) {
      // Preload the next image
      const nextIndex = currentIndex + 1;
      preloadNextImage(nextIndex);

      setDirection("forward");
      setShowingVideo(true);
    }
  };

  const handlePrevious = (): void => {
    if (!showingVideo && currentIndex > 0) {
      const prevIndex = currentIndex - 1;

      // Preload the previous image
      preloadNextImage(prevIndex);

      setDirection("backward");
      setShowingVideo(true);
    }
  };

  const handleVideoEnd = (): void => {
    console.log("Video ended, direction:", direction);

    if (direction === "forward") {
      // Update the current index when video ends for forward direction
      setCurrentIndex((prev) => Math.min(images.length - 1, prev + 1));
    } else {
      // For backward direction, we already set the currentIndex in handlePrevious
      // This ensures consistent behavior
    }

    // If the next image is loaded, hide the video
    if (nextImageLoaded) {
      console.log("Next image is loaded, hiding video");
      setShowingVideo(false);
    } else {
      console.log("Next image not loaded yet, waiting...");
      // Set a fallback timeout in case the image load event doesn't fire
      timeoutRef.current = setTimeout(() => {
        console.log("Fallback timeout triggered, hiding video");
        setShowingVideo(false);
      }, 500);
    }
  };

  const handleImageLoad = (): void => {
    console.log("Image loaded");
    setNextImageLoaded(true);

    // Clear any fallback timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    // Check if video has already ended, we can now hide it
    if (videoRef.current && (videoRef.current.ended || videoRef.current.paused)) {
      console.log("Video has ended, hiding it now that image is loaded");
      setShowingVideo(false);
    }
  };

  return (
    <div className="min-h-screen bg-white relative w-full h-screen">
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <>
          {/* Current image */}
          <Image
            src={nextImageSrc}
            alt={`Step ${currentIndex}`}
            fill
            className="object-cover h-full w-full transition-opacity duration-500"
            priority
            quality={100}
            onLoad={handleImageLoad}
            onError={() => {
              console.error("Failed to load image:", nextImageSrc);
              setNextImageLoaded(true); // Ensure we don't get stuck
            }}
          />

          <video
            ref={videoRef}
            className={`absolute inset-0 w-full h-full object-cover ${showingVideo ? "visible" : "invisible"}`}
            playsInline
            muted
            onEnded={handleVideoEnd}
            onError={(e) => {
              console.error("Video error:", e);
              handleVideoEnd(); // Ensure we don't get stuck
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
