import type { EstadoPedido } from "@/shared/types";

export const estadosDelPedido: { clave: EstadoPedido; label: string }[] = [
  { clave: "solicitado", label: "Solicitado" },
  { clave: "aceptado", label: "Aceptado" },
  { clave: "en camino", label: "En camino" },
  { clave: "entregado", label: "Entregado" },
  { clave: "pagado", label: "Pagado" },
];
