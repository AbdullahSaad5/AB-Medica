"use client";

import React, { useRef, useState } from "react";
import VideoPlayer from "../../VideoPlayer";
const PDFViewer = dynamic(() => import("../../PDFViewer"), { ssr: false });
import { useActiveComponent } from "@/app/providers/ActiveComponentProvider";
import dynamic from "next/dynamic";

type ComponentsData = {
  mainData: {
    title: string;
    description: string;
  };
  overviewDialogsData: {
    title: string;
    description: string;
  }[];
};

type TechnologiesData = {
  trailer?: {
    url: string;
  };
  brochure?: {
    url: string;
  };
  presentation?: {
    url: string;
  };
  manual?: {
    url: string;
  };
};

type Button = {
  text: string;
  resourceType: "video" | "pdf";
  src: string;
};

const InfoCard = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedButton, setSelectedButton] = useState<Button | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { componentsData, technologiesData } = useActiveComponent() as {
    componentsData: ComponentsData | null;
    technologiesData: TechnologiesData;
  };

  const handleVideoEnd = () => {
    if (selectedButton?.resourceType === "video") {
      setModalOpen(false);
      setSelectedButton(null);
    }
  };

  const buttons: Button[] = [
    {
      text: "Teaser",
      resourceType: "video",
      src: technologiesData?.trailer?.url || "",
    },
    {
      text: "Brochure",
      resourceType: "pdf",
      src: technologiesData?.brochure?.url || "",
      // src: "/assets/pdfs/Brochure Dolphin ITA (1)_compressed.pdf",
    },
    {
      text: "Glossario",
      resourceType: "pdf",
      src: technologiesData?.presentation?.url || "",
      // src: "/assets/pdfs/AB Medica Mockup brochure_compressed.pdf",
    },
    {
      text: "Manuale d'uso",
      resourceType: "pdf",
      src: technologiesData?.manual?.url || "",
      // src: "/assets/pdfs/MU 1 03 01 01 REV.01.pdf",
    },
  ];
  return (
    <div className="mt-[calc(10vh+2rem)] flex w-full justify-end z-10">
      <div className="w-[50vw] lg:w-[35vw] bg-white/75  rounded-3xl shadow-lg py-[3vh] px-[2.2vw] space-y-1  lg:space-y-3  pointer-events-auto">
        <p className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl text-primary font-semibold">
          {componentsData?.mainData.title || "Dolphin"}
        </p>
        <p className="text-md sm:text-lg  lg:text-[2.2vh] text-black">
          {componentsData?.mainData.description ||
            "Dolphin è un dispositivo medico brevettato per l'interventistica laparoscopica, mini-laparoscopica e robotica."}
        </p>
        <div className="flex items-center justify-center flex-wrap gap-2 lg:gap-4 ">
          {buttons.map((button, index) => (
            <button
              key={index}
              onClick={() => {
                setSelectedButton(button);
                setModalOpen(true);
              }}
              className="bg-secondary text-sm lg:text-[1.85vh] text-primary font-semibold px-4 py-1 lg:py-1.5 rounded-[0.5rem] lg:rounded-[0.75rem] shadow-custom hover:shadow-custom-hovered transition-all"
            >
              {button.text}
            </button>
          ))}
        </div>
      </div>
      {modalOpen && selectedButton && selectedButton.resourceType === "video" && (
        <VideoPlayer
          videoRef={videoRef}
          videoSrc={selectedButton?.src as string}
          handleCloseModal={() => setModalOpen(false)}
          handleVideoEnd={handleVideoEnd}
        />
      )}
      {modalOpen && selectedButton && selectedButton.resourceType === "pdf" && (
        <PDFViewer
          // pdfUrl={"https://cdn.filestackcontent.com/wcrjf9qPTCKXV3hMXDwK"}
          pdfUrl={selectedButton?.src as string}
          handleCloseModal={() => setModalOpen(false)}
        />
      )}
    </div>
  );
};

export default InfoCard;
