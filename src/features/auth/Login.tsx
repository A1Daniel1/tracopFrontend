import { ArrowLeft, CloudOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useRole } from "@/app/role";
import { nombresDeRol } from "@/shared/lib/roles";
import { AppIcon, Button } from "@/shared/ui";

export function Login() {
  const navigate = useNavigate();
  const { rol } = useRole();

  if (!rol) return null;

  const enter = () => navigate(`/${rol}`);

  return (
    <div className="auth-screen">
      <button
        className="icon-btn auth-back"
        onClick={() => navigate("/")}
        aria-label="Volver"
      >
        <ArrowLeft />
      </button>
      <AppIcon />
      <p className="eyebrow">{nombresDeRol[rol].toUpperCase()}</p>
      <h1>Entra a tu cuenta</h1>
      <p className="muted">Te enviaremos un código. No necesitas contraseña.</p>
      <label className="field-label">Número de celular</label>
      <div className="phone-field">
        <span>+57</span>
        <input defaultValue="310 456 7821" />
      </div>
      <Button onClick={enter}>Continuar</Button>
      <div className="divider">
        <span>o</span>
      </div>
      <Button variant="secondary">Crear una cuenta</Button>
      <div className="offline-promise">
        <CloudOff />
        <span>
          <b>Funciona sin internet</b>Lo que hagas se enviará cuando vuelva la
          señal.
        </span>
      </div>
    </div>
  );
}
