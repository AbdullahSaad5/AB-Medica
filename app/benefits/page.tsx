"use client";

import Image from "next/image";
import React from "react";
import { cn } from "../utils/cn";

const Benefits = () => {
  const hotspots = [
    {
      x: 49.65,
      y: 31.5,
      onClick: () => console.log("Clicked on hotspot 1"),
      color: "white",
    },
    {
      x: 44.5,
      y: 20,
      onClick: () => console.log("Clicked on hotspot 2"),
      color: "white",
    },
    {
      x: 62.5,
      y: 55.5,
      onClick: () => console.log("Clicked on hotspot 3"),
      color: "white",
    },
    {
      x: 83,
      y: 66.75,
      onClick: () => console.log("Clicked on hotspot 4"),

      color: "white",
    },
    {
      x: 56.5,
      y: 42.5,
      onClick: () => console.log("Clicked on hotspot 5"),
      color: "secondary",
    },
    {
      x: 37.25,
      y: 60,
      onClick: () => console.log("Clicked on hotspot 6"),
      color: "secondary",
    },
    {
      x: 51,
      y: 69.75,
      onClick: () => console.log("Clicked on hotspot 7"),
      color: "secondary",
    },
  ];

  return (
    <div className="min-h-screen bg-white relative w-full h-screen">
      <Image
        src={"/assets/images/0334.png"}
        alt={`Vista iniziale-1.png`}
        fill
        className="object-cover h-full w-full"
        priority
        quality={100}
      />
      {hotspots.map((hotspot, index) => (
        <div
          key={index}
          className={cn(
            "w-[60px] h-[60px] rounded-full border-4 border-white absolute grid place-items-center",
            hotspot.color === "white"
              ? "border-white hover:bg-primary hover:border-primary"
              : "border-secondary hover:bg-secondary hover:text-primary"
          )}
          style={{
            top: `${hotspot.y}%`,
            left: `${hotspot.x}%`,
          }}
          onClick={hotspot.onClick}
        >
          <p className="text-2xl font-bold">{index + 1}</p>
        </div>
      ))}
      {/* <div className="w-[60px] h-[60px] rounded-full bg-red-400 absolute top-[31.5%] left-[49.65%] mx-2"></div>
      <div className="w-[60px] h-[60px] rounded-full bg-red-400 absolute top-[20%] left-[44.5%] mx-2"></div>
      <div className="w-[60px] h-[60px] rounded-full bg-red-400 absolute top-[55.5%] left-[62.5%] mx-2"></div>
      <div className="w-[60px] h-[60px] rounded-full bg-red-400 absolute top-[66.75%] left-[83%] mx-2"></div>
      <div className="w-[60px] h-[60px] rounded-full bg-red-400 absolute top-[42.5%] left-[56.5%] mx-2"></div>
      <div className="w-[60px] h-[60px] rounded-full bg-red-400 absolute top-[60%] left-[37.25%] mx-2"></div>
      <div className="w-[60px] h-[60px] rounded-full bg-red-400 absolute top-[69.75%] left-[51%] mx-2"></div> */}
    </div>
  );
};

export default Benefits;
