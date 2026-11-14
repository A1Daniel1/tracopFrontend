export type Rol = "productor" | "comprador" | "transportista";

export type EstadoPedido =
  "solicitado" | "aceptado" | "en camino" | "entregado" | "pagado";

export type EstadoSincronizacion = "guardado" | "pendiente" | "sincronizado";

export type Sesion = {
  userId: string;
  nombre: string;
  celular: string;
  rol: Rol;
  modo: "mock" | "http";
};

export type Credenciales = { celular: string; rol: Rol };
export type Registro = Credenciales & { nombre: string; aceptaDatos: boolean };

export type Oferta = {
  id: string;
  producto: string;
  cantidadKg: number;
  precioPorKg: number;
  municipio: string;
  categoria: string;
  sincronizacion: EstadoSincronizacion;
  disponible?: boolean;
  distanciaKm?: number;
  imagen?: string;
};

export type Pedido = {
  id: string;
  producto: string;
  cantidadKg: number;
  total: number;
  estado: EstadoPedido;
  contraparte: string;
  fecha: string;
  sincronizacion: EstadoSincronizacion;
};

export type BorradorOferta = Omit<Oferta, "id" | "sincronizacion">;

export type OperacionPendiente = {
  clientOpId: string;
  dominio: "auth" | "offers" | "orders" | "shipments";
  accion: string;
  payload: unknown;
  creadaEn: string;
  intentos: number;
  estado: "pendiente" | "error";
  ultimoError?: string;
};

export type ApiResult<T> = { data: T; source: "mock" | "http" };

export type Flete = {
  id: string;
  transportista: string;
  calificacion: number;
  precio: number;
  vehiculo: string;
  distanciaKm: number;
  sincronizacion: EstadoSincronizacion;
};
