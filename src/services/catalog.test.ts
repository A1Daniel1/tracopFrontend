import { describe, expect, it } from "vitest";
import { filterCatalog, type CatalogFilters } from "./catalog";
import type { Oferta } from "@/shared/types";

const items: Oferta[] = [
  {
    id: "1",
    producto: "Aguacate Hass",
    cantidadKg: 20,
    precioPorKg: 7000,
    municipio: "Filandia",
    categoria: "FRUTA",
    sincronizacion: "guardado",
    disponible: true,
    distanciaKm: 20,
  },
  {
    id: "2",
    producto: "Papa criolla",
    cantidadKg: 40,
    precioPorKg: 3000,
    municipio: "Armenia",
    categoria: "TUBÉRCULO",
    sincronizacion: "guardado",
    disponible: true,
    distanciaKm: 8,
  },
];

const defaults: CatalogFilters = {
  query: "",
  category: "Todo",
  availableOnly: true,
  maxDistanceKm: 40,
  sort: "relevance",
};

describe("filterCatalog", () => {
  it("combina búsqueda, distancia y orden", () => {
    expect(
      filterCatalog(items, { ...defaults, query: "papa", maxDistanceKm: 10 }),
    ).toEqual([items[1]]);
    expect(
      filterCatalog(items, { ...defaults, sort: "price-asc" }).map(
        (item) => item.id,
      ),
    ).toEqual(["2", "1"]);
  });

  it("devuelve vacío cuando no hay coincidencias", () => {
    expect(filterCatalog(items, { ...defaults, query: "café" })).toEqual([]);
  });
});
