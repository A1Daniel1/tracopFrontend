import { dataMode } from "@/shared/config";
import { enqueue } from "@/shared/offline/queue";
import { pedidos } from "@/shared/lib/mock";
import { readStorage, writeStorage } from "@/shared/storage";
import type { EstadoPedido, Pedido } from "@/shared/types";

const KEY = "tracop.orders.v1";

export const ordersService = {
  list(): Pedido[] {
    return readStorage<Pedido[]>(KEY, pedidos);
  },

  updateState(id: string, estado: EstadoPedido): Pedido {
    const items = this.list();
    const found = items.find((item) => item.id === id);
    if (!found) throw new Error("Pedido no encontrado");
    const updated = {
      ...found,
      estado,
      sincronizacion: dataMode === "mock" ? "guardado" : "pendiente",
    } as Pedido;
    writeStorage(
      KEY,
      items.map((item) => (item.id === id ? updated : item)),
    );
    if (dataMode === "http")
      enqueue({
        dominio: "orders",
        accion: "transition",
        payload: { id, estado },
      });
    return updated;
  },

  create(input: Omit<Pedido, "id" | "sincronizacion">): Pedido {
    const items = this.list();
    const order: Pedido = {
      ...input,
      id: `LOCAL-${Date.now()}`,
      sincronizacion: dataMode === "mock" ? "guardado" : "pendiente",
    };
    writeStorage(KEY, [order, ...items]);
    if (dataMode === "http")
      enqueue({ dominio: "orders", accion: "create", payload: order });
    return order;
  },

  recordDecision(id: string, decision: "accept" | "reject"): void {
    const decisions = readStorage<Record<string, string>>(
      "tracop.order-decisions.v1",
      {},
    );
    writeStorage("tracop.order-decisions.v1", { ...decisions, [id]: decision });
    if (dataMode === "http")
      enqueue({ dominio: "orders", accion: decision, payload: { id } });
  },

  counterOffer(id: string, value: number): void {
    const proposals = readStorage<Record<string, number>>(
      "tracop.counter-offers.v1",
      {},
    );
    writeStorage("tracop.counter-offers.v1", { ...proposals, [id]: value });
    if (dataMode === "http")
      enqueue({
        dominio: "orders",
        accion: "counter-offer",
        payload: { id, value },
      });
  },
};
