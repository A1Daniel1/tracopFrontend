import {
  Box,
  Home,
  Menu,
  Navigation,
  QrCode,
  Search,
  Store,
  Volume2,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import type { Rol } from "@/shared/types";
import { rutaDePantalla, type Pantalla } from "@/shared/lib/rutas";

const navItems: Record<
  Rol,
  { label: string; icon: typeof Home; pantalla: Pantalla }[]
> = {
  productor: [
    { label: "Inicio", icon: Home, pantalla: "home" },
    { label: "Ofertas", icon: Store, pantalla: "offers" },
    { label: "Pedidos", icon: Box, pantalla: "orders" },
    { label: "Más", icon: Menu, pantalla: "menu" },
  ],
  comprador: [
    { label: "Catálogo", icon: Search, pantalla: "catalog" },
    { label: "Pedidos", icon: Box, pantalla: "orders" },
    { label: "Precios", icon: Volume2, pantalla: "voice" },
    { label: "Más", icon: Menu, pantalla: "menu" },
  ],
  transportista: [
    { label: "Cargas", icon: Box, pantalla: "loads" },
    { label: "Mi ruta", icon: Navigation, pantalla: "route" },
    { label: "Escanear", icon: QrCode, pantalla: "qr" },
    { label: "Más", icon: Menu, pantalla: "menu" },
  ],
};

export function BottomNav({ rol }: { rol: Rol }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <nav className="bottom-nav">
      {navItems[rol].map(({ label, icon: Icon, pantalla }) => {
        const destino = rutaDePantalla(rol, pantalla);
        return (
          <button
            key={label}
            className={pathname === destino ? "active" : ""}
            onClick={() => navigate(destino)}
          >
            <Icon size={22} />
            <span>{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
