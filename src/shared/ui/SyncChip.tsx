import { Check, Clock3, CloudOff } from "lucide-react";
import type { EstadoSincronizacion } from "@/shared/types";

const labels: Record<EstadoSincronizacion, string> = {
  guardado: "Guardado localmente",
  pendiente: "Pendiente de sincronizar",
  sincronizado: "Sincronizado",
};

// Clases CSS existentes en index.css (claves en inglés preservadas).
const claseCSS: Record<EstadoSincronizacion, string> = {
  guardado: "sync-saved",
  pendiente: "sync-pending",
  sincronizado: "sync-synced",
};

export function SyncChip({
  state = "guardado",
}: {
  state?: EstadoSincronizacion;
}) {
  const Icon =
    state === "sincronizado"
      ? Check
      : state === "pendiente"
        ? Clock3
        : CloudOff;
  return (
    <span className={`sync-chip ${claseCSS[state]}`}>
      <Icon size={13} /> {labels[state]}
    </span>
  );
}
