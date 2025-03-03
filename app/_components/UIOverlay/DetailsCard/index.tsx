"use client";

import { ActiveComponent, useActiveComponent } from "@/app/providers/ActiveComponentProvider";

type Content = {
  title: string;
  description: string;
  part: ActiveComponent;
};

const DetailsCard = () => {
  const content: Content[] = [
    {
      title: "Cartuccia",
      description:
        "Elemento meccanico che, dialogando con l'unità di controllo, permette di attivare l'irrigazione del flusso di fisiologica. E' concepita per garantire il miglior rapporto tra efficienza prestazionale e complessità costruttiva.",
      part: "device",
    },
    {
      title: "Unità di controllo",
      description:
        "Unità di Controllo composta da: una presa di alimentazione per cavo amovibile, per un facile rimessaggio, leva di bloccaggio adattabile a diversi supporti, display LED a colori da 4,3 pollici, tastiera soft in silicone ad elevato feedback tattile, sportello vano pompa a protezione della cartuccia e dei sensori, scheda elettronica di controllo, motore brushless ad alta efficienza e, infine, scocche in materiale antiurto",
      part: "machine",
    },
    {
      title: "Manipolo",
      description:
        "Il manipolo è composto da un'impugnatura ergonomica con grip antiscivolo che consente una presa comoda e stabile, valvole a cassetto per una facile attivazione del device, tasti di azionamento ad elevato feedback tattile e cannule intercambiabili, che sono disponibili in diversi diametri, lunghezze e materiali (monouso e poliuso)",

      part: "nozel",
    },
  ];

  const { activeComponent } = useActiveComponent();

  const selectedContent = content.find((c) => c.part === activeComponent);

  return (
    <div className="mt-[calc(10vh+2rem)] flex w-full justify-start items-stretch z-10">
      <div className="w-[35vw] h-[45%]  bg-white/75  rounded-3xl shadow-lg py-[2vh] px-[2.2vw] space-y-3  pointer-events-auto">
        <p className="text-[36px] text-primary font-semibold">{selectedContent?.title}</p>
        <p className="text-[2.2vh] text-black">{selectedContent?.description}</p>
      </div>
    </div>
  );
};

export default DetailsCard;
