import Image from "next/image";
import React from "react";

const LoadingScreen = () => {
  return (
    <Image
      src={"/assets/images/Copertina.png"}
      alt={`Vista iniziale-1.png`}
      fill
      className="object-cover h-full w-full absolute top-0 left-0 right-0 bottom-0 z-50"
      priority
      quality={100}
    />
  );
};

export default LoadingScreen;
