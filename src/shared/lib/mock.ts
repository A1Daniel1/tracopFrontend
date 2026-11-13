import type { Flete, Oferta, Pedido } from "@/shared/types";

/** Capa mock: datos de ejemplo separados de los componentes. */
export const usarMock = import.meta.env.VITE_USE_MOCK !== "false";

export const fotos = {
  cosecha:
    "https://images.unsplash.com/photo-1545830790-68595959c491?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=900",
  producto:
    "https://images.unsplash.com/photo-1551649001-7a2482d98d05?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=900",
};

export const perfil = {
  nombre: "María González",
  iniciales: "MG",
  ubicacion: "Filandia, Quindío",
  calificacion: 4.9,
  ventas: "38 ventas",
};

export const productoPrincipal = {
  nombre: "Aguacate Hass",
  cantidadKg: 200,
  precioPorKg: 7400,
  total: 1480000,
  categoria: "FRUTA",
  municipio: "Filandia, Quindío",
  comprador: "Mercado La 14",
  lote: "TR-284-AH",
};

export const productoSecundario = {
  nombre: "Tomate chonto",
  cantidadKg: 80,
  precioPorKg: 3200,
  total: 256000,
  categoria: "VERDURA",
  municipio: "Montenegro",
};

export const ofertas: Oferta[] = [
  {
    id: "aguacate",
    producto: "Aguacate Hass",
    cantidadKg: 200,
    precioPorKg: 7400,
    municipio: "Filandia, Quindío",
    categoria: "FRUTA",
    sincronizacion: "pendiente",
  },
  {
    id: "tomate",
    producto: "Tomate chonto",
    cantidadKg: 80,
    precioPorKg: 3200,
    municipio: "Montenegro",
    categoria: "VERDURA",
    sincronizacion: "sincronizado",
  },
];

export const pedidos: Pedido[] = [
  {
    id: "TR-284",
    producto: "Aguacate Hass",
    cantidadKg: 200,
    total: 1480000,
    estado: "en camino",
    contraparte: "Mercado La 14",
    fecha: "Recogida mañana, 7:00 a. m.",
    sincronizacion: "sincronizado",
  },
  {
    id: "TR-269",
    producto: "Tomate chonto",
    cantidadKg: 80,
    total: 256000,
    estado: "solicitado",
    contraparte: "Mercado La 14",
    fecha: "",
    sincronizacion: "pendiente",
  },
];

export const fletes: Flete[] = [
  {
    id: "julian",
    transportista: "Julián Ramírez",
    calificacion: 4.9,
    precio: 180000,
    vehiculo: "Camión 3,5 t",
    distanciaKm: 18,
    sincronizacion: "sincronizado",
  },
  {
    id: "carlos",
    transportista: "Carlos Mena",
    calificacion: 4.7,
    precio: 165000,
    vehiculo: "Camioneta",
    distanciaKm: 24,
    sincronizacion: "pendiente",
  },
];

export const categorias = ["Todo", "Frutas", "Verduras", "Tubérculos"];

export const cargas = [
  {
    id: "carga-1",
    fecha: "MAÑANA",
    hora: "7:00 a. m.",
    origen: "Filandia, Quindío",
    destino: "Armenia, Quindío",
    producto: "Aguacate",
    cantidadKg: 200,
    distanciaKm: 27,
  },
  {
    id: "carga-2",
    fecha: "20 JUN",
    hora: "10:30 a. m.",
    origen: "Montenegro",
    destino: "Pereira",
    producto: "Plátano",
    cantidadKg: 480,
    distanciaKm: undefined,
  },
];

export const notificaciones = [
  {
    id: "n1",
    seccion: "HOY",
    titulo: "Nuevo pedido recibido",
    detalle: "Mercado La 14 quiere 200 kg de Aguacate Hass.",
    tiempo: "Hace 12 min",
    tono: "green",
    noLeida: true,
    pantalla: "order-detail" as const,
  },
  {
    id: "n2",
    seccion: "HOY",
    titulo: "Nueva propuesta de flete",
    detalle: "Julián propone llevar tu pedido por $180.000.",
    tiempo: "Hace 35 min",
    tono: "ochre",
    noLeida: true,
    pantalla: "freight" as const,
  },
  {
    id: "n3",
    seccion: "AYER",
    titulo: "Pedido sincronizado",
    detalle: "Los cambios guardados sin conexión ya están al día.",
    tiempo: "Ayer, 5:20 p. m.",
    tono: "soft",
    noLeida: false,
    pantalla: undefined,
  },
];
