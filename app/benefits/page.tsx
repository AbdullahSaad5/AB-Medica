"use client";

import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import { cn } from "../utils/cn";
import { X } from "lucide-react";

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
    if (modalOpen && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    }
    return () => {
      if (videoRef.current) {
        videoRef.current.pause();
      }
    };
  }, [modalOpen]);

  useEffect(() => {
    if (isFullscreenPlaying && fullscreenVideoRef.current) {
      fullscreenVideoRef.current.currentTime = 0;
      fullscreenVideoRef.current.play();
    }
    return () => {
      if (fullscreenVideoRef.current) {
        fullscreenVideoRef.current.pause();
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
          src={"/assets/images/0334.png"}
          alt={`Vista iniziale-1.png`}
          fill
          className="object-cover h-full w-full"
          priority
          quality={100}
        />
      )}

      {/* Fullscreen video background */}
      {isFullscreenPlaying && selectedHotspot && (
        <div className="absolute inset-0 z-10">
          <video
            ref={fullscreenVideoRef}
            className="w-full h-full object-cover"
            autoPlay
            muted
            playsInline
            onEnded={handleVideoEnd}
            src={isPlayingReverse ? selectedHotspot.reverseVideo : selectedHotspot.video}
          ></video>
          {!isPlayingReverse && (
            <button
              onClick={handleCloseFullscreen}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-20"
              aria-label="Close video"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          )}
        </div>
      )}

      {/* Hotspots */}
      {!isFullscreenPlaying &&
        hotspots.map((hotspot, index) => (
          <div
            key={index}
            className={cn(
              "w-[60px] h-[60px] rounded-full border-4 border-white absolute grid place-items-center cursor-pointer",
              hotspot.color === "white"
                ? "border-white hover:bg-primary hover:border-primary"
                : "border-secondary hover:bg-secondary hover:text-primary"
            )}
            style={{
              top: `${hotspot.y}%`,
              left: `${hotspot.x}%`,
            }}
            onClick={() => handleHotspotClick(index)}
          >
            <p className="text-2xl font-bold">{index + 1}</p>
          </div>
        ))}

      {/* Modal for non-fullscreen videos */}
      {modalOpen && selectedHotspot && selectedHotspot.displayMode === "modal" && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="w-4/5 relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute -top-12 right-0 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            <div className="w-full relative">
              <video
                ref={videoRef}
                className="w-full h-auto rounded-lg"
                autoPlay
                muted
                playsInline
                onEnded={handleVideoEnd}
              >
                <source src={selectedHotspot.video} type="video/mp4" />
              </video>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Benefits;
