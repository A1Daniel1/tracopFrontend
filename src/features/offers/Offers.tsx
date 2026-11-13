import { ChevronRight, Mic, SlidersHorizontal } from "lucide-react";
import { useNavegacion } from "@/app/useNavegacion";
import { formatKg, formatPrecio } from "@/shared/lib/format";
import { ofertas } from "@/shared/lib/mock";
import { SyncChip } from "@/shared/ui";
import { OfferCard } from "./OfferCard";

export function Offers() {
  const go = useNavegacion();
  const tomate = ofertas[1];

  return (
    <>
      <div className="tabs">
        <button className="active">
          Activas <i>4</i>
        </button>
        <button>Pausadas</button>
        <button>Vendidas</button>
      </div>
      <div className="list-heading">
        <span>4 ofertas</span>
        <button>
          <SlidersHorizontal /> Ordenar
        </button>
      </div>
      <OfferCard />
      <div className="simple-offer">
        <span className="produce-icon">T</span>
        <div>
          <b>{tomate.producto}</b>
          <small>
            {formatKg(tomate.cantidadKg)} · {formatPrecio(tomate.precioPorKg)}
            /kg
          </small>
          <SyncChip state="sincronizado" />
        </div>
        <ChevronRight />
      </div>
      <button className="fab" onClick={() => go("publish")}>
        <Mic />
        <span>Publicar por voz</span>
      </button>
    </>
  );
}
