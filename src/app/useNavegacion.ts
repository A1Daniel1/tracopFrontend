import { useNavigate } from "react-router-dom";
import { useRole } from "./role";
import { rutaDePantalla, rutas, type Pantalla } from "@/shared/lib/rutas";

export function useNavegacion() {
  const navigate = useNavigate();
  const { rol } = useRole();

  return (pantalla: Pantalla) => {
    if (!rol) {
      navigate(rutas.roles);
      return;
    }
    navigate(rutaDePantalla(rol, pantalla));
  };
}
