import { ArrowLeft, Bell } from "lucide-react";
import type { Rol } from "@/shared/types";
import { nombresDeRol } from "@/shared/lib/roles";
import { AppIcon } from "@/shared/ui";

export function Header({
  title,
  back,
  onBack,
  onBell,
  role,
}: {
  title?: string;
  back?: boolean;
  onBack: () => void;
  onBell: () => void;
  role: Rol;
}) {
  return (
    <header className="topbar">
      {back ? (
        <button className="icon-btn" onClick={onBack} aria-label="Volver">
          <ArrowLeft />
        </button>
      ) : (
        <div className="mini-brand">
          <AppIcon />
          <div>
            <b>{title || "Hola, María"}</b>
            {!title && <span>{nombresDeRol[role]} · Filandia</span>}
          </div>
        </div>
      )}
      {back && <h1>{title}</h1>}
      <button
        className="icon-btn notification-btn"
        onClick={onBell}
        aria-label="Notificaciones"
      >
        <Bell />
        <i />
      </button>
    </header>
  );
}
