import { ChevronRight, Leaf, Store, Truck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Rol } from "@/shared/types";
import { useRole } from "@/app/role";
import { nombresDeRol } from "@/shared/lib/roles";
import { fotos } from "@/shared/lib/mock";
import { AppIcon } from "@/shared/ui";

const roles: { rol: Rol; copy: string; icon: typeof Leaf }[] = [
  { rol: "productor", copy: "Publica cosechas y recibe pedidos", icon: Leaf },
  { rol: "comprador", copy: "Encuentra productos de origen", icon: Store },
  { rol: "transportista", copy: "Lleva cosechas por Colombia", icon: Truck },
];

export function RoleSelection() {
  const navigate = useNavigate();
  const { elegirRol } = useRole();

  const choose = (rol: Rol) => {
    elegirRol(rol);
    navigate("/entrar");
  };

  return (
    <div className="splash">
      <div className="splash-art">
        <img src={fotos.cosecha} alt="Productor agrícola con su cosecha" />
        <div className="splash-overlay" />
        <div className="brand-lockup">
          <AppIcon />
          <div>
            <strong>TRACOP</strong>
            <span>Del campo, más cerca.</span>
          </div>
        </div>
      </div>
      <div className="role-sheet">
        <p className="eyebrow">BIENVENIDO</p>
        <h1>¿Cómo quieres usar TRACOP?</h1>
        <p className="muted">Puedes cambiar de perfil después.</p>
        <div className="role-list">
          {roles.map(({ rol, copy, icon: Icon }) => (
            <button key={rol} onClick={() => choose(rol)}>
              <span className={`role-icon ${rol}`}>
                <Icon />
              </span>
              <span>
                <b>{nombresDeRol[rol]}</b>
                <small>{copy}</small>
              </span>
              <ChevronRight />
            </button>
          ))}
        </div>
        <p className="legal">
          Al continuar aceptas el tratamiento de datos de TRACOP.
        </p>
      </div>
    </div>
  );
}
