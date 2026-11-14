import type { ReactNode } from "react";
import { Navigate, Outlet } from "react-router-dom";
import type { Rol } from "@/shared/types";
import { rutas } from "@/shared/lib/rutas";
import { useRole } from "./role";

export function RequireRole({
  rol,
  children,
}: {
  rol?: Rol;
  children?: ReactNode;
}) {
  const { rol: actual, sesion } = useRole();

  if (!actual) return <Navigate to={rutas.roles} replace />;
  if (!sesion && !children) return <Navigate to={rutas.login} replace />;
  if (rol && actual !== rol) return <Navigate to={`/${actual}`} replace />;

  return <>{children ?? <Outlet />}</>;
}
