import { useState } from "react";
import { ChevronRight, Leaf, Mic, SlidersHorizontal } from "lucide-react";
import { useNavegacion } from "@/app/useNavegacion";
import { formatKg, formatPrecio } from "@/shared/lib/format";
import { ofertas } from "@/shared/lib/mock";
import { EstadoVacio, SyncChip } from "@/shared/ui";
import { OfferCard } from "./OfferCard";

type Tab = "activas" | "pausadas" | "vendidas";

export function Offers() {
  const go = useNavegacion();
  const [tab, setTab] = useState<Tab>("activas");
  const tomate = ofertas[1];

  return (
    <>
      <div className="tabs">
        <button
          className={tab === "activas" ? "active" : ""}
          onClick={() => setTab("activas")}
        >
          Activas <i>4</i>
        </button>
        <button
          className={tab === "pausadas" ? "active" : ""}
          onClick={() => setTab("pausadas")}
        >
          Pausadas
        </button>
        <button
          className={tab === "vendidas" ? "active" : ""}
          onClick={() => setTab("vendidas")}
        >
          Vendidas
        </button>
      </div>

      {tab === "activas" ? (
        <>
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
                {formatKg(tomate.cantidadKg)} ·{" "}
                {formatPrecio(tomate.precioPorKg)}/kg
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
      ) : (
        <EstadoVacio
          icono={<Leaf size={26} />}
          titulo={
            tab === "pausadas"
              ? "No tienes ofertas pausadas"
              : "Aún no has vendido"
          }
          descripcion={
            tab === "pausadas"
              ? "Pausa una oferta y aparecerá aquí."
              : "Cuando vendas tu cosecha, la verás aquí."
          }
        />
      )}
    </>
  );
}
