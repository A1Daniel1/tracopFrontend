import type { Rol } from "@/shared/types";

/** Clave de navegación interna. Se traduce a una ruta por rol. */
export type Pantalla =
  | "home"
  | "publish"
  | "confirm-offer"
  | "offers"
  | "orders"
  | "order-detail"
  | "freight"
  | "catalog"
  | "offer-detail"
  | "rating"
  | "loads"
  | "route"
  | "qr"
  | "tracking"
  | "delivery"
  | "voice"
  | "notifications"
  | "menu";

export const rutas = {
  roles: "/",
  login: "/entrar",
  menu: "/menu",
  notificaciones: "/notificaciones",
} as const;

export function rutaDePantalla(rol: Rol, pantalla: Pantalla): string {
  switch (pantalla) {
    case "home":
    case "catalog":
    case "loads":
      return `/${rol}`;
    case "publish":
      return `/${rol}/publicar`;
    case "confirm-offer":
      return `/${rol}/confirmar`;
    case "offers":
      return `/${rol}/ofertas`;
    case "orders":
      return `/${rol}/pedidos`;
    case "order-detail":
      return `/${rol}/pedido`;
    case "freight":
      return `/${rol}/flete`;
    case "offer-detail":
      return `/${rol}/oferta`;
    case "rating":
      return `/${rol}/calificar`;
    case "route":
      return `/${rol}/ruta`;
    case "qr":
      return `/${rol}/escanear`;
    case "tracking":
      return `/${rol}/seguimiento`;
    case "delivery":
      return `/${rol}/entrega`;
    case "voice":
      return `/${rol}/precios`;
    case "notifications":
      return rutas.notificaciones;
    case "menu":
      return rutas.menu;
  }
}
