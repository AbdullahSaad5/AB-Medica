"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import FullScreenVideo from "../_components/FullScreenVideo";
import NumberHotspot from "../_components/Hotspots/NumberHotspot";
import VideoPlayer from "../_components/VideoPlayer";

type Hotspot = {
  x: number;
  y: number;
  color: string;
  video: string;
  reverseVideo?: string;
  displayMode: "modal" | "fullscreen";
};

const Benefits = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);
  const [isFullscreenPlaying, setIsFullscreenPlaying] = useState(false);
  const [isPlayingReverse, setIsPlayingReverse] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fullscreenVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const videoInstance = videoRef.current;
    if (modalOpen && videoInstance) {
      videoInstance.currentTime = 0;
      videoInstance.play();
    }
    return () => {
      if (videoInstance) {
        videoInstance.pause();
      }
    };
  }, [modalOpen]);

  useEffect(() => {
    const fullscreenVideoInstance = fullscreenVideoRef.current;
    if (isFullscreenPlaying && fullscreenVideoInstance) {
      fullscreenVideoInstance.currentTime = 0;
      fullscreenVideoInstance.play();
    }
    return () => {
      if (fullscreenVideoInstance) {
        fullscreenVideoInstance.pause();
      }
    };
  }, [isFullscreenPlaying]);

  const handleVideoEnd = () => {
    if (selectedHotspot?.displayMode === "modal") {
      setModalOpen(false);
      setSelectedHotspot(null);
    } else if (isPlayingReverse) {
      // When reverse video ends, reset everything
      setIsPlayingReverse(false);
      setIsFullscreenPlaying(false);
      setSelectedHotspot(null);
    }
  };

  const hotspots: Hotspot[] = [
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
    },
    {
      x: 83,
      y: 66.75,
      color: "white",
      video: "/assets/videos/benefits/4. manipolo AVA COMPR.mp4",
      reverseVideo: "/assets/videos/benefits/manipolo BACK COMPR.mp4",
      displayMode: "fullscreen",
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
  ];

  const handleHotspotClick = (index: number) => {
    const hotspot = hotspots[index];
    setSelectedHotspot(hotspot);

    if (hotspot.displayMode === "modal") {
      setModalOpen(true);
    } else {
      setIsFullscreenPlaying(true);
    }
  };

  const handleCloseFullscreen = () => {
    if (selectedHotspot?.reverseVideo) {
      setIsPlayingReverse(true);
    } else {
      setIsFullscreenPlaying(false);
      setSelectedHotspot(null);
    }
  };

  return (
    <div className="min-h-screen bg-white relative w-full h-screen">
      {/* Base background image */}
      {(!isFullscreenPlaying || !selectedHotspot) && (
        <Image
          src={"/assets/images/SCHERMATA PRINCIPALE BENEFICI.png"}
          alt={`Vista iniziale-1.png`}
          fill
          className="object-cover h-full w-full"
          priority
          quality={100}
        />
      )}

      {/* Fullscreen video background */}
      {isFullscreenPlaying && selectedHotspot && (
        <FullScreenVideo
          videoRef={fullscreenVideoRef}
          videoSrc={(isPlayingReverse ? selectedHotspot.reverseVideo : selectedHotspot.video) as string}
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
            key={index}
          />
        ))}

      {/* Modal for non-fullscreen videos */}
      {modalOpen && selectedHotspot && selectedHotspot.displayMode === "modal" && (
        <VideoPlayer
          videoRef={videoRef}
          videoSrc={selectedHotspot.video}
          handleCloseModal={() => setModalOpen(false)}
          handleVideoEnd={handleVideoEnd}
        />
      )}
    </div>
  );
};

export default Benefits;
