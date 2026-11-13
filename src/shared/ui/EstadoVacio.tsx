import type { ReactNode } from "react";

export function EstadoVacio({
  icono,
  titulo,
  descripcion,
  children,
}: {
  icono: ReactNode;
  titulo: string;
  descripcion: string;
  children?: ReactNode;
}) {
  return (
    <div className="estado-vacio">
      <span>{icono}</span>
      <h3>{titulo}</h3>
      <p>{descripcion}</p>
      {children}
    </div>
  );
}
