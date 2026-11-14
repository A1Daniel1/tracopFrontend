import {
  Bell,
  Box,
  ChevronRight,
  Home,
  Leaf,
  Mic,
  Navigation,
  PackageCheck,
  QrCode,
  Search,
  Star,
  Store,
  Truck,
  UserRound,
  Volume2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Rol } from "@/shared/types";
import { useRole } from "./role";
import { useNavegacion } from "./useNavegacion";
import { nombresDeRol } from "@/shared/lib/roles";
import { perfil } from "@/shared/lib/mock";
import { rutas, type Pantalla } from "@/shared/lib/rutas";

const menus: Record<Rol, [Pantalla, string, typeof Home][]> = {
  productor: [
    ["home", "Inicio", Home],
    ["publish", "Publicar por voz", Mic],
    ["offers", "Mis ofertas", Store],
    ["orders", "Pedidos recibidos", Box],
    ["freight", "Propuestas de flete", Truck],
  ],
  comprador: [
    ["catalog", "Explorar catálogo", Search],
    ["orders", "Mis pedidos", Box],
    ["offer-detail", "Detalle de oferta", Leaf],
    ["voice", "Precios de mi zona", Volume2],
    ["rating", "Calificar productor", Star],
  ],
  transportista: [
    ["loads", "Cargas disponibles", Box],
    ["route", "Ruta del día", Navigation],
    ["qr", "Escanear QR", QrCode],
    ["tracking", "Seguimiento en ruta", Truck],
    ["delivery", "Confirmar entrega", PackageCheck],
  ],
};

export function MenuScreen() {
  const { rol, sesion, cerrarSesion } = useRole();
  const go = useNavegacion();
  const navigate = useNavigate();

  if (!rol) return null;

  return (
    <>
      <div className="profile-card">
        <span className="avatar">{perfil.iniciales}</span>
        <div>
          <b>{sesion?.nombre || perfil.nombre}</b>
          <small>
            {nombresDeRol[rol]} · {perfil.ubicacion}
          </small>
        </div>
        <span className="mode-badge">
          {sesion?.modo === "http" ? "Servidor" : "Datos locales"}
        </span>
      </div>
      <p className="menu-label">
        FUNCIONES DE {nombresDeRol[rol].toUpperCase()}
      </p>
      <div className="menu-list">
        {menus[rol].map(([pantalla, label, Icon]) => (
          <button key={label} onClick={() => go(pantalla)}>
            <i>
              <Icon />
            </i>
            <span>{label}</span>
            <ChevronRight />
          </button>
        ))}
      </div>
      <p className="menu-label">AYUDA Y DEMO</p>
      <div className="menu-list">
        <button onClick={() => go("notifications")}>
          <i>
            <Bell />
          </i>
          <span>Notificaciones</span>
          <ChevronRight />
        </button>
        <button onClick={() => navigate(rutas.roles)}>
          <i>
            <UserRound />
          </i>
          <span>Cambiar de rol</span>
          <ChevronRight />
        </button>
        <button
          onClick={() => {
            cerrarSesion();
            navigate(rutas.roles);
          }}
        >
          <i>
            <UserRound />
          </i>
          <span>Cerrar sesión local</span>
          <ChevronRight />
        </button>
      </div>
    </>
  );
}
