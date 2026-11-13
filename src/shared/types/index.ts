export type Rol = "productor" | "comprador" | "transportista";

export type EstadoPedido =
  "solicitado" | "aceptado" | "en camino" | "entregado" | "pagado";

export type EstadoSincronizacion = "guardado" | "pendiente" | "sincronizado";

export type Oferta = {
  id: string;
  producto: string;
  cantidadKg: number;
  precioPorKg: number;
  municipio: string;
  categoria: string;
  sincronizacion: EstadoSincronizacion;
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

export type Flete = {
  id: string;
  transportista: string;
  calificacion: number;
  precio: number;
  vehiculo: string;
  distanciaKm: number;
  sincronizacion: EstadoSincronizacion;
};
