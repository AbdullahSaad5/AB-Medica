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
    <div className="mt-[calc(10vh+2rem)] flex w-full justify-end">
      <div className="w-[30%] bg-white/75  rounded-3xl shadow-lg p-6 space-y-3">
        <p className="text-3xl text-primary font-bold">Dolphon</p>
        <p className="text-lg text-black">
          Dolphin è un dispositivo medico brevettato per l’interventistica laparoscopica, mini-laparoscopica e robotica.
        </p>
        <div className="flex items-center justify-center flex-wrap gap-4 ">
          {buttons.map((button, index) => (
            <button key={index} className="bg-secondary text-primary font-semibold px-4 py-2 rounded-lg shadow-lg">
              {button.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InfoCard;
