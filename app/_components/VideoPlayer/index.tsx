import { X } from "lucide-react";
import React from "react";

const VideoPlayer = ({
  videoRef,
  videoSrc,
  handleCloseModal,
  handleVideoEnd,
}: {
  videoRef: React.RefObject<HTMLVideoElement>;
  videoSrc: string;
  handleCloseModal: () => void;
  handleVideoEnd: () => void;
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center pointer-events-auto z-50">
      <div className="w-4/5 relative">
        <button
          onClick={() => handleCloseModal()}
          className="absolute top-8 right-8 z-10 p-2  rounded-2xl bg-primary hover:bg-secondary transition-colors"
          aria-label="Close modal"
        >
          <X className="w-14 h-14 text-white" />
        </button>

        <div className="w-full relative">
          <video
            ref={videoRef}
            className="w-full h-auto rounded-lg"
            autoPlay
            controls
            playsInline
            onEnded={handleVideoEnd}
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
