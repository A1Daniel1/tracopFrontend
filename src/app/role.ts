import { createContext, useContext } from "react";
import type { Rol, Sesion } from "@/shared/types";

export type RoleContextValue = {
  rol: Rol | null;
  elegirRol: (rol: Rol) => void;
  sesion: Sesion | null;
  iniciarSesion: (sesion: Sesion) => void;
  cerrarSesion: () => void;
};

export const RoleContext = createContext<RoleContextValue | null>(null);

export function useRole(): RoleContextValue {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error("useRole debe usarse dentro de <RoleProvider>");
  return ctx;
}
