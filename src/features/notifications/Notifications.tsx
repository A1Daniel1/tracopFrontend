import { Box, Check, Truck } from "lucide-react";
import { useNavegacion } from "@/app/useNavegacion";
import { notificaciones } from "@/shared/lib/mock";

const iconos: Record<string, typeof Box> = {
  green: Box,
  ochre: Truck,
  soft: Check,
};

const secciones = ["HOY", "AYER"];

export function Notifications() {
  const go = useNavegacion();

  return (
    <>
      {secciones.map((seccion) => {
        const items = notificaciones.filter((n) => n.seccion === seccion);
        if (items.length === 0) return null;

        return (
          <div className="notification-section" key={seccion}>
            <span>{seccion}</span>
            {items.map((n) => {
              const Icon = iconos[n.tono];
              return (
                <button
                  key={n.id}
                  onClick={n.pantalla ? () => go(n.pantalla) : undefined}
                >
                  <i className={`notif-icon ${n.tono}`}>
                    <Icon />
                  </i>
                  <div>
                    <b>{n.titulo}</b>
                    <p>{n.detalle}</p>
                    <small>{n.tiempo}</small>
                  </div>
                  {n.noLeida && <em />}
                </button>
              );
            })}
          </div>
        );
      })}
    </>
  );
}
