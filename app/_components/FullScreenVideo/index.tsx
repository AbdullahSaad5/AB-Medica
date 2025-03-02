import { X } from "lucide-react";
import React from "react";

const FullScreenVideo = ({
  videoRef,
  videoSrc,
  handleCloseVideo,
  handleVideoEnd,
  showCloseButton,
}: {
  videoRef: React.RefObject<HTMLVideoElement>;
  videoSrc: string;
  handleCloseVideo: () => void;
  handleVideoEnd: () => void;
  showCloseButton: boolean;
}) => {
  return (
    <div className="absolute inset-0 z-10">
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        autoPlay
        muted
        playsInline
        onEnded={handleVideoEnd}
        src={videoSrc}
      ></video>
      {showCloseButton && (
        <button
          onClick={handleCloseVideo}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-20"
          aria-label="Close video"
        >
          <X className="w-6 h-6 text-white" />
        </button>
      )}
    </div>
  );
};

export default FullScreenVideo;
