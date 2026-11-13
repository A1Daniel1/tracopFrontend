import { MapPin, Search, SlidersHorizontal } from "lucide-react";
import { useNavegacion } from "@/app/useNavegacion";
import { formatKg, formatPrecio } from "@/shared/lib/format";
import { categorias, fotos, ofertas } from "@/shared/lib/mock";
import { OfferCard } from "@/features/offers/OfferCard";

export function Catalog() {
  const go = useNavegacion();
  const tomate = ofertas[1];

  return (
    <>
      <div className="search-row">
        <div>
          <Search />
          <input placeholder="Buscar papa, café, plátano…" />
        </div>
        <button>
          <SlidersHorizontal />
        </button>
      </div>
      <div className="category-scroll">
        {categorias.map((c, i) => (
          <button className={i === 0 ? "active" : ""} key={c}>
            {c}
          </button>
        ))}
      </div>
      <div className="filter-summary">
        <MapPin /> Cerca de Armenia <button>Cambiar</button>
      </div>
      <div className="catalog-head">
        <span>
          <b>32 ofertas</b> frescas de hoy
        </span>
        <button>Menor precio</button>
      </div>
      <OfferCard synced />
      <button className="offer-card compact" onClick={() => go("offer-detail")}>
        <img src={fotos.cosecha} alt="Productor con canastas" />
        <div className="offer-card-body">
          <span className="category">{tomate.categoria}</span>
          <h3>{tomate.producto}</h3>
          <p>
            <MapPin /> {tomate.municipio} · 18 km
          </p>
          <div className="offer-price">
            <b>
              {formatPrecio(tomate.precioPorKg)} <small>/ kg</small>
            </b>
            <span>{formatKg(tomate.cantidadKg)}</span>
          </div>
        </div>
      </button>
    </>
  );
}
