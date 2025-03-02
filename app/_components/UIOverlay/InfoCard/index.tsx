import React from "react";

const InfoCard = () => {
  const buttons = [
    {
      text: "Teaser",
    },
    {
      text: "Brochure",
    },
    {
      text: "Glossario",
    },
    {
      text: "Manuale d'uso",
    },
  ];
  return (
    <div className="mt-[calc(10vh+2rem)] flex w-full justify-end z-10">
      <div className="w-[35vw] bg-white/75  rounded-3xl shadow-lg py-[2vh] px-[2.2vw] space-y-3  pointer-events-auto">
        <p className="text-[36px] text-primary font-semibold">Dolphin</p>
        <p className="text-[2.2vh] text-black">
          Dolphin è un dispositivo medico brevettato per l&apos;interventistica laparoscopica, mini-laparoscopica e
          robotica.{" "}
        </p>
        <div className="flex items-center justify-center flex-wrap gap-4 ">
          {buttons.map((button, index) => (
            <button
              key={index}
              className="bg-secondary text-[1.85vh] text-primary font-semibold px-4 py-1 rounded-[0.75rem] shadow-custom hover:shadow-custom-hovered transition-all"
            >
              {button.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InfoCard;
