import { useEffect, useMemo, useState } from "react";
import { MapPin, Search, SlidersHorizontal } from "lucide-react";
import { useNavegacion } from "@/app/useNavegacion";
import {
  catalogService,
  filterCatalog,
  type CatalogFilters,
} from "@/services/catalog";
import { categorias, fotos } from "@/shared/lib/mock";
import { formatKg, formatPrecio } from "@/shared/lib/format";
import type { Oferta } from "@/shared/types";
import { EstadoVacio } from "@/shared/ui";

const initialFilters: CatalogFilters = {
  query: "",
  category: "Todo",
  availableOnly: true,
  maxDistanceKm: 40,
  sort: "relevance",
};

export function Catalog() {
  const go = useNavegacion();
  const [items, setItems] = useState<Oferta[]>([]);
  const [filters, setFilters] = useState(initialFilters);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const visible = useMemo(
    () => filterCatalog(items, filters),
    [items, filters],
  );

  useEffect(() => {
    catalogService
      .list()
      .then(setItems)
      .catch((cause) =>
        setError(
          cause instanceof Error
            ? cause.message
            : "No se pudo cargar el catálogo.",
        ),
      )
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <div className="search-row">
        <label>
          <Search />
          <input
            aria-label="Buscar productos"
            placeholder="Buscar producto o municipio…"
            value={filters.query}
            onChange={(event) =>
              setFilters({ ...filters, query: event.target.value })
            }
          />
        </label>
        <button
          onClick={() => setShowFilters(!showFilters)}
          aria-expanded={showFilters}
          aria-label="Mostrar filtros"
        >
          <SlidersHorizontal />
        </button>
      </div>
      {showFilters && (
        <section className="filter-panel" aria-label="Filtros del catálogo">
          <label>
            Ordenar por
            <select
              value={filters.sort}
              onChange={(event) =>
                setFilters({
                  ...filters,
                  sort: event.target.value as CatalogFilters["sort"],
                })
              }
            >
              <option value="relevance">Relevancia</option>
              <option value="price-asc">Menor precio</option>
              <option value="price-desc">Mayor precio</option>
              <option value="distance">Más cerca</option>
            </select>
          </label>
          <label>
            Distancia máxima: {filters.maxDistanceKm} km
            <input
              type="range"
              min="10"
              max="100"
              step="10"
              value={filters.maxDistanceKm}
              onChange={(event) =>
                setFilters({
                  ...filters,
                  maxDistanceKm: Number(event.target.value),
                })
              }
            />
          </label>
          <label className="check-inline">
            <input
              type="checkbox"
              checked={filters.availableOnly}
              onChange={(event) =>
                setFilters({ ...filters, availableOnly: event.target.checked })
              }
            />{" "}
            Solo disponibles
          </label>
          <button
            className="link-button"
            onClick={() => setFilters(initialFilters)}
          >
            Limpiar filtros
          </button>
        </section>
      )}
      <div className="category-scroll" aria-label="Categorías">
        {categorias.map((category) => (
          <button
            aria-pressed={filters.category === category}
            className={filters.category === category ? "active" : ""}
            key={category}
            onClick={() => setFilters({ ...filters, category })}
          >
            {category}
          </button>
        ))}
      </div>
      <div className="filter-summary">
        <MapPin /> Datos locales de desarrollo · radio {filters.maxDistanceKm}{" "}
        km
      </div>
      {loading && (
        <div className="state-card" role="status">
          Cargando catálogo…
        </div>
      )}
      {error && (
        <div className="state-card error" role="alert">
          <b>No pudimos cargar el catálogo</b>
          <p>{error}</p>
        </div>
      )}
      {!loading && !error && visible.length === 0 && (
        <EstadoVacio
          icono={<Search />}
          titulo="No encontramos productos"
          descripcion="Prueba otra búsqueda o amplía la distancia."
        />
      )}
      {!loading && !error && (
        <div className="catalog-head">
          <span>
            <b>{visible.length} ofertas</b> de desarrollo
          </span>
        </div>
      )}
      {visible.map((item) => (
        <button
          className="offer-card compact"
          onClick={() => go("offer-detail")}
          key={item.id}
        >
          <img
            src={
              item.imagen ||
              (item.categoria === "FRUTA"
                ? fotos.aguacate
                : fotos.productosFrescos)
            }
            alt={`Producto: ${item.producto}`}
            loading="lazy"
          />
          <div className="offer-card-body">
            <span className="category">{item.categoria}</span>
            <h3>{item.producto}</h3>
            <p>
              <MapPin /> {item.municipio} · {item.distanciaKm ?? "—"} km
            </p>
            <div className="offer-price">
              <b>
                {formatPrecio(item.precioPorKg)} <small>/ kg</small>
              </b>
              <span>{formatKg(item.cantidadKg)}</span>
            </div>
          </div>
        </button>
      ))}
    </>
  );
}
