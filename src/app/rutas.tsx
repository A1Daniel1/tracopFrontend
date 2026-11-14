export const titulos: Record<string, string> = {
  notifications: "Notificaciones",
  publish: "Publicar por voz",
  "confirm-offer": "Revisa tu oferta",
  offers: "Mis ofertas",
  orders: "Mis pedidos",
  "order-detail": "Pedido #TR-284",
  freight: "Elegir transporte",
  catalog: "Productos frescos",
  "offer-detail": "Detalle de oferta",
  rating: "Califica tu compra",
  loads: "Cargas disponibles",
  route: "Ruta del día",
  qr: "Escanear lote",
  tracking: "Seguimiento en ruta",
  delivery: "Confirmar entrega",
  voice: "Precios de mi zona",
  menu: "Todas las funciones",
};

const raices = new Set([
  "home",
  "offers",
  "orders",
  "catalog",
  "loads",
  "route",
  "menu",
  "voice",
]);

const pantallaPorPath: Record<string, string> = {
  "/": "roles",
  "/entrar": "login",
  "/registro": "login",
  "/productor": "home",
  "/productor/publicar": "publish",
  "/productor/confirmar": "confirm-offer",
  "/productor/ofertas": "offers",
  "/productor/pedidos": "orders",
  "/productor/pedido": "order-detail",
  "/productor/flete": "freight",
  "/comprador": "catalog",
  "/comprador/oferta": "offer-detail",
  "/comprador/pedidos": "orders",
  "/comprador/pedido": "order-detail",
  "/comprador/precios": "voice",
  "/comprador/calificar": "rating",
  "/transportista": "loads",
  "/transportista/ruta": "route",
  "/transportista/escanear": "qr",
  "/transportista/seguimiento": "tracking",
  "/transportista/entrega": "delivery",
  "/notificaciones": "notifications",
  "/menu": "menu",
};

export type RutaInfo = {
  pantalla: string;
  titulo?: string;
  raiz: boolean;
  shell: boolean;
};

export function infoDeRuta(pathname: string): RutaInfo {
  const pantalla = pantallaPorPath[pathname] ?? "home";
  const shell = pantalla !== "roles" && pantalla !== "login";
  return {
    pantalla,
    titulo: titulos[pantalla],
    raiz: raices.has(pantalla),
    shell,
  };
}
