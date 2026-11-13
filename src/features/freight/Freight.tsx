import { useState } from "react";
import { Check, Star, Truck } from "lucide-react";
import { useNavegacion } from "@/app/useNavegacion";
import {
  formatCalificacion,
  formatKg,
  formatPrecio,
} from "@/shared/lib/format";
import { fletes, productoPrincipal } from "@/shared/lib/mock";
import { Button, SectionTitle, SyncChip } from "@/shared/ui";

export function Freight() {
  const go = useNavegacion();
  const [chosen, setChosen] = useState<number | null>(null);

  return (
    <>
      <div className="freight-summary">
        <Truck />
        <span>
          <b>Filandia → Armenia</b>
          {formatKg(productoPrincipal.cantidadKg)} · Recogida mañana, 7:00 a. m.
        </span>
      </div>
      <SectionTitle title="2 propuestas recibidas" />
      {fletes.map((f, i) => (
        <button
          className={`driver-card ${chosen === i ? "selected" : ""}`}
          onClick={() => setChosen(i)}
          key={f.id}
        >
          <span className="avatar">
            {f.transportista
              .split(" ")
              .map((x) => x[0])
              .join("")}
          </span>
          <div>
            <b>{f.transportista}</b>
            <small>
              <Star /> {formatCalificacion(f.calificacion)} · {f.vehiculo} · A{" "}
              {f.distanciaKm} km
            </small>
            <SyncChip state={i ? "pendiente" : "sincronizado"} />
          </div>
          <strong>{formatPrecio(f.precio)}</strong>
          {chosen === i && (
            <i>
              <Check />
            </i>
          )}
        </button>
      ))}
      <div className="price-breakdown">
        <span>
          Producto <b>{formatPrecio(productoPrincipal.total)}</b>
        </span>
        <span>
          Flete{" "}
          <b>
            {chosen === 1
              ? formatPrecio(fletes[1].precio)
              : formatPrecio(fletes[0].precio)}
          </b>
        </span>
      </div>
      <Button onClick={() => go("orders")} disabled={chosen === null}>
        Aceptar propuesta
      </Button>
    </>
  );
}
