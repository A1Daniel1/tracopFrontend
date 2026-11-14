import { dataMode } from "@/shared/config";
import { asArray, request } from "@/shared/http/client";
import { ofertas } from "@/shared/lib/mock";
import { readStorage } from "@/shared/storage";
import type { Oferta } from "@/shared/types";

export type CatalogFilters = {
  query: string;
  category: string;
  availableOnly: boolean;
  maxDistanceKm?: number;
  sort: "relevance" | "price-asc" | "price-desc" | "distance";
};

export function parseOferta(value: unknown): Oferta {
  if (!value || typeof value !== "object") throw new Error("Oferta inválida");
  const item = value as Partial<Oferta>;
  if (
    !item.id ||
    !item.producto ||
    typeof item.cantidadKg !== "number" ||
    typeof item.precioPorKg !== "number"
  ) {
    throw new Error("Oferta incompleta");
  }
  return item as Oferta;
}

export function filterCatalog(
  items: Oferta[],
  filters: CatalogFilters,
): Oferta[] {
  const query = filters.query.trim().toLocaleLowerCase("es");
  const filtered = items.filter((item) => {
    const matchesQuery =
      !query ||
      `${item.producto} ${item.municipio}`
        .toLocaleLowerCase("es")
        .includes(query);
    const matchesCategory =
      filters.category === "Todo" ||
      item.categoria
        .toLocaleLowerCase("es")
        .startsWith(filters.category.slice(0, -1).toLocaleLowerCase("es"));
    const matchesAvailable =
      !filters.availableOnly || item.disponible !== false;
    const matchesDistance =
      !filters.maxDistanceKm ||
      !item.distanciaKm ||
      item.distanciaKm <= filters.maxDistanceKm;
    return (
      matchesQuery && matchesCategory && matchesAvailable && matchesDistance
    );
  });
  return [...filtered].sort((a, b) => {
    if (filters.sort === "price-asc") return a.precioPorKg - b.precioPorKg;
    if (filters.sort === "price-desc") return b.precioPorKg - a.precioPorKg;
    if (filters.sort === "distance")
      return (a.distanciaKm ?? 999) - (b.distanciaKm ?? 999);
    return 0;
  });
}

export const catalogService = {
  async list(): Promise<Oferta[]> {
    if (dataMode === "http")
      return request("/catalog/offers", {}, asArray(parseOferta));
    const local = readStorage<Oferta[]>("tracop.offers.v1", []);
    return [...local, ...ofertas].map((item, index) => ({
      ...item,
      disponible: item.disponible ?? true,
      distanciaKm: item.distanciaKm ?? 12 + index * 9,
    }));
  },
};
