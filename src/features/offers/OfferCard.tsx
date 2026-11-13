import { MapPin } from "lucide-react";
import { useNavegacion } from "@/app/useNavegacion";
import { formatKg, formatPrecio } from "@/shared/lib/format";
import { fotos, ofertas } from "@/shared/lib/mock";
import { SyncChip } from "@/shared/ui";

export function OfferCard({ synced = false }: { synced?: boolean }) {
  const go = useNavegacion();
  const oferta = ofertas[0];

  return (
    <button className="offer-card" onClick={() => go("offer-detail")}>
      <img src={fotos.producto} alt="Producto fresco" />
      <div className="offer-card-body">
        <div>
          <span className="category">{oferta.categoria}</span>
          <span className="stock">Disponible</span>
        </div>
        <h3>{oferta.producto}</h3>
        <p>
          <MapPin /> {oferta.municipio}
        </p>
        <div className="offer-price">
          <b>
            {formatPrecio(oferta.precioPorKg)} <small>/ kg</small>
          </b>
          <span>{formatKg(oferta.cantidadKg)}</span>
        </div>
        <SyncChip state={synced ? "sincronizado" : "pendiente"} />
      </div>
    </button>
  );
}
