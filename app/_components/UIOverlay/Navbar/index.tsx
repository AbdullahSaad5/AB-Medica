"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useMemo } from "react";

const Navbar = () => {
  const buttons = useMemo(
    () => [
      {
        label: "Tecnologia",
        href: "/",
      },
      {
        label: "Set Up",
        href: "/setup",
      },
      {
        label: "Benefici",
        href: "/benefits",
      },
    ],
    []
  );

  const route = usePathname();

  const activeTab = buttons.find((button) => button.href === route)?.label;

  return (
    <div className="absolute top-4 left-4 right-4 rounded-2xl lg:rounded-3xl px-4 md:px-6 lg:px-8 py-4 bg-white/75 z-10 pointer-events-auto h-[6vh] md:h-[8vh] lg:h-[10vh] backdrop-blur-[.15em] shadow-[.1em_.17em_.17em_#0000004d]">
      <div className="flex justify-between items-stretch h-full">
        <div className="h-full relative w-36 md:w-44 lg:w-56">
          <Link href="/">
            <Image src="/logo-ab-medica.png" alt="Logo" className="h-8 object-contain" fill />
          </Link>
        </div>
        <div className="h-full flex items-center space-x-2 sm:space-x-6 lg:space-x-8 text-lg">
          {buttons.map((button, index) => (
            <Link
              href={button.href}
              key={index}
              // onClick={button.onClick}
              className={`px-2 py-1 sm:px-4 sm:py-1.5 md:px-6 md:py-2 lg:px-[1vw] lg:py-[1vh] rounded-xl text-sm sm:text-base md:text-lg lg:text-[2.25vh] ${
                activeTab === button.label ? "bg-primary text-white" : "bg-transparent text-primary"
              }`}
            >
              {button.label}
            </Link>
          ))}
          {/* <button className="bg-primary px-4 py-2 rounded-xl">Technologia</button> */}
          {/* <button className="bg-primary px-4 py-2 rounded-xl">Set Up</button> */}
          {/* <button className="bg-primary px-4 py-2 rounded-xl">Benefici</button> */}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
