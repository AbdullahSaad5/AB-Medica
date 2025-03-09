"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import FullScreenVideo from "../_components/FullScreenVideo";
import NumberHotspot from "../_components/Hotspots/NumberHotspot";
import VideoPlayer from "../_components/VideoPlayer";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

type Hotspot = {
  x: number;
  y: number;
  color: string;
  video: string;
  reverseVideo?: string;
  displayMode: "modal" | "fullscreen";
  stillImage?: string;
};

const Benefits = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);
  const [isFullscreenPlaying, setIsFullscreenPlaying] = useState(false);
  const [isPlayingReverse, setIsPlayingReverse] = useState(false);
  const [isDonePlaying, setIsDonePlaying] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const fullscreenVideoRef = useRef<HTMLVideoElement>(null);
  const router = useRouter();

  const DEFAULT_IMAGE = "/assets/images/SCHERMATA PRINCIPALE BENEFICI.png";
  const [currentImage, setCurrentImage] = useState(DEFAULT_IMAGE);

  // Define hotspots as a memoized constant to avoid recreating on each render
  const hotspots = useMemo<Hotspot[]>(
    () => [
      {
        x: 49.65,
        y: 31.5,
        color: "white",
        video: "/assets/videos/benefits/1. cambio asta COMPR.mp4",
        displayMode: "modal",
      },
      {
        x: 44.5,
        y: 20,
        color: "white",
        video: "/assets/videos/benefits/2. No limiti di altezza COMPR.mp4",
        displayMode: "modal",
      },
      {
        x: 62.5,
        y: 55.5,
        color: "white",
        video: "/assets/videos/benefits/3. comandi int AVA COMPR.mp4",
        reverseVideo: "/assets/videos/benefits/comandi int BACK COMPR.mp4",
        displayMode: "fullscreen",
        stillImage: "/assets/images/benefits/comandi still.png",
      },
      {
        x: 83,
        y: 66.75,
        color: "white",
        video: "/assets/videos/benefits/4. manipolo AVA COMPR.mp4",
        reverseVideo: "/assets/videos/benefits/manipolo BACK COMPR.mp4",
        displayMode: "fullscreen",
        stillImage: "/assets/images/benefits/manipolo still.png",
      },
      {
        x: 56.5,
        y: 42.5,
        color: "secondary",
        video: "/assets/videos/benefits/5. Video 5 velocitA velocizzato 27.11.mp4",
        displayMode: "modal",
      },
      {
        x: 37.25,
        y: 60,
        color: "secondary",
        video: "/assets/videos/benefits/6. POMPA REV TESTO 07 (1).mp4",
        displayMode: "modal",
      },
      {
        x: 51,
        y: 69.75,
        color: "secondary",
        video: "/assets/videos/benefits/7. cannule COMPR.mp4",
        displayMode: "modal",
      },
    ],
    []
  );

  // Handle modal video playback
  useEffect(() => {
    const videoInstance = videoRef.current;
    if (!videoInstance) return;

    if (modalOpen) {
      videoInstance.currentTime = 0;
      videoInstance.play().catch((err) => console.error("Error playing modal video:", err));
    } else {
      videoInstance.pause();
    }

    return () => {
      videoInstance.pause();
    };
  }, [modalOpen]);

  // Handle fullscreen video playback
  useEffect(() => {
    const fullscreenVideoInstance = fullscreenVideoRef.current;
    if (!fullscreenVideoInstance) return;

    if (isFullscreenPlaying) {
      fullscreenVideoInstance.currentTime = 0;
      fullscreenVideoInstance.play().catch((err) => console.error("Error playing fullscreen video:", err));
    } else {
      fullscreenVideoInstance.pause();
    }

    return () => {
      fullscreenVideoInstance.pause();
    };
  }, [isFullscreenPlaying]);

  const handleVideoEnd = useCallback(() => {
    if (!selectedHotspot) return;

    if (selectedHotspot.displayMode === "modal") {
      setModalOpen(false);
      setSelectedHotspot(null);
    } else if (isPlayingReverse) {
      // When reverse video ends, reset everything
      setIsPlayingReverse(false);
      setIsFullscreenPlaying(false);
      setSelectedHotspot(null);
      setIsDonePlaying(true);
    }
  }, [selectedHotspot, isPlayingReverse]);

  const handleHotspotClick = useCallback(
    (index: number) => {
      const hotspot = hotspots[index];
      setSelectedHotspot(hotspot);

      if (hotspot.displayMode === "modal") {
        setModalOpen(true);
      } else {
        setIsFullscreenPlaying(true);
        setIsDonePlaying(false);
      }
    },
    [hotspots]
  );

  const handleCloseFullscreen = useCallback(() => {
    if (selectedHotspot?.reverseVideo) {
      setIsPlayingReverse(true);
    } else {
      setIsFullscreenPlaying(false);
      setSelectedHotspot(null);
    }
  }, [selectedHotspot]);

  const handleVideoStart = useCallback(() => {
    setIsDonePlaying(false);

    if (!selectedHotspot?.stillImage) return;

    const newImage = isPlayingReverse ? DEFAULT_IMAGE : selectedHotspot.stillImage;

    // Small delay to ensure timing with video
    setTimeout(() => {
      setCurrentImage(newImage);
    }, 50);
  }, [selectedHotspot, isPlayingReverse, DEFAULT_IMAGE]);

  const handleNavigateBack = useCallback(() => {
    router.push("/setup");
  }, [router]);

  return (
    <div className="min-h-screen bg-white relative w-full h-screen">
      {/* Base background image */}
      <Image
        src={currentImage}
        alt="Vista iniziale"
        fill
        className="object-cover h-full w-full"
        priority
        quality={100}
      />

      {/* Fullscreen video background */}
      {isFullscreenPlaying && selectedHotspot && !isDonePlaying && (
        <FullScreenVideo
          videoRef={fullscreenVideoRef}
          handleVideoStart={handleVideoStart}
          videoSrc={isPlayingReverse ? selectedHotspot.reverseVideo! : selectedHotspot.video}
          handleCloseVideo={handleCloseFullscreen}
          handleVideoEnd={handleVideoEnd}
          showCloseButton={!isPlayingReverse}
        />
      )}

      {/* Hotspots */}
      {!isFullscreenPlaying &&
        hotspots.map((hotspot, index) => (
          <NumberHotspot
            color={hotspot.color}
            number={index + 1}
            onClick={() => handleHotspotClick(index)}
            position={{ x: hotspot.x, y: hotspot.y }}
            key={`hotspot-${index}`}
          />
        ))}

      {/* Modal for non-fullscreen videos */}
      {modalOpen && selectedHotspot?.displayMode === "modal" && (
        <VideoPlayer
          videoRef={videoRef}
          videoSrc={selectedHotspot.video}
          handleCloseModal={() => setModalOpen(false)}
          handleVideoEnd={handleVideoEnd}
        />
      )}

      {/* Back button */}
      {!isFullscreenPlaying && (
        <div className="absolute bottom-5 left-5 right-5 p-4 z-10">
          <div className="flex justify-between">
            <button
              className="bg-primary text-white font-bold p-2 rounded-2xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-secondary group"
              onClick={handleNavigateBack}
              aria-label="Back to setup"
            >
              <ArrowLeft className="w-14 h-14 text-white group-hover:text-primary" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Benefits;
