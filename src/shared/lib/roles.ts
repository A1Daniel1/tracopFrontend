import type { Rol } from "@/shared/types";

export const nombresDeRol: Record<Rol, string> = {
  productor: "Productor",
  comprador: "Comprador",
  transportista: "Transportista",
};

export function raizDeRol(rol: Rol): string {
  return `/${rol}`;
}
