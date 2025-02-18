"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useMemo } from "react";

const Navbar = () => {
  const buttons = useMemo(
    () => [
      {
        label: "Technologia",
        href: "/",
      },
      {
        label: "Set Up",
        href: "/setup",
      },
      {
        label: "Benefici",
        href: "/benefici",
      },
    ],
    []
  );

  const route = usePathname();

  console.log(route);

  const activeTab = buttons.find((button) => button.href === route)?.label;

  return (
    <div className="absolute top-4 left-4 right-4 rounded-3xl px-8 py-4 bg-white/75 z-10 pointer-events-auto h-[10vh] backdrop-blur-[2px] shadow-lg">
      <div className="flex justify-between items-stretch h-full">
        <div className="h-full relative w-56">
          <Image src="/logo-ab-medica.png" alt="Logo" className="h-8 object-contain" fill />
        </div>
        <div className="h-full flex items-center space-x-8 text-lg">
          {buttons.map((button, index) => (
            <Link
              href={button.href}
              key={index}
              // onClick={button.onClick}
              className={`px-4 py-2 rounded-xl ${
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
