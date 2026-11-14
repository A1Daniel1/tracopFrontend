import { useMemo, useState, type ReactNode } from "react";
import type { Rol, Sesion } from "@/shared/types";
import { RoleContext } from "./role";
import { readStorage, removeStorage, writeStorage } from "@/shared/storage";

const SESSION_KEY = "tracop.session.v1";

export function RoleProvider({ children }: { children: ReactNode }) {
  const [sesion, setSesion] = useState<Sesion | null>(() =>
    readStorage<Sesion | null>(SESSION_KEY, null),
  );
  const [rol, setRol] = useState<Rol | null>(() => sesion?.rol ?? null);
  const value = useMemo(
    () => ({
      rol,
      elegirRol: setRol,
      sesion,
      iniciarSesion: (next: Sesion) => {
        writeStorage(SESSION_KEY, next);
        setSesion(next);
        setRol(next.rol);
      },
      cerrarSesion: () => {
        removeStorage(SESSION_KEY);
        setSesion(null);
        setRol(null);
      },
    }),
    [rol, sesion],
  );

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}
