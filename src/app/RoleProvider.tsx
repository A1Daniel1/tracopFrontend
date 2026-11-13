import { useMemo, useState, type ReactNode } from "react";
import type { Rol } from "@/shared/types";
import { RoleContext } from "./role";

export function RoleProvider({ children }: { children: ReactNode }) {
  const [rol, setRol] = useState<Rol | null>(null);
  const value = useMemo(() => ({ rol, elegirRol: setRol }), [rol]);

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}
