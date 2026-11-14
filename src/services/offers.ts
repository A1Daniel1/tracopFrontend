import { dataMode } from "@/shared/config";
import { request } from "@/shared/http/client";
import { enqueue } from "@/shared/offline/queue";
import { readStorage, writeStorage } from "@/shared/storage";
import type { BorradorOferta, Oferta } from "@/shared/types";
import { parseOferta } from "./catalog";

const KEY = "tracop.offers.v1";

export const offersService = {
  listLocal(): Oferta[] {
    return readStorage<Oferta[]>(KEY, []);
  },

  async save(input: BorradorOferta, id?: string): Promise<Oferta> {
    if (dataMode === "http" && navigator.onLine) {
      return request(
        id ? `/offers/${id}` : "/offers",
        { method: id ? "PUT" : "POST", body: JSON.stringify(input) },
        parseOferta,
      );
    }
    const current = this.listLocal();
    const offer: Oferta = {
      ...input,
      id: id || crypto.randomUUID(),
      sincronizacion: "guardado",
    };
    writeStorage(KEY, [
      ...current.filter((item) => item.id !== offer.id),
      offer,
    ]);
    if (dataMode === "http") {
      enqueue({
        dominio: "offers",
        accion: id ? "update" : "create",
        payload: offer,
      });
      offer.sincronizacion = "pendiente";
    }
    return offer;
  },
};
