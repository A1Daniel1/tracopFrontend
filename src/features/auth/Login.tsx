import { useState } from "react";
import { ArrowLeft, CloudOff, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useRole } from "@/app/role";
import { nombresDeRol } from "@/shared/lib/roles";
import { AppIcon, Button } from "@/shared/ui";
import { authService } from "@/services/auth";
import { rutas } from "@/shared/lib/rutas";

export function Login() {
  const navigate = useNavigate();
  const { rol, iniciarSesion } = useRole();
  const [celular, setCelular] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!rol) return null;

  const enter = async () => {
    const digits = celular.replace(/\D/g, "");
    if (digits.length !== 10) {
      setError("Escribe un número colombiano de 10 dígitos.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const session = await authService.login({ celular: digits, rol });
      iniciarSesion(session);
      navigate(`/${rol}`);
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "No fue posible iniciar sesión.",
      );
    } finally {
      setLoading(false);
    }
  };

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
      <p className="muted">
        En modo local puedes entrar sin contraseña. Identity deberá implementar
        OTP para producción.
      </p>
      <label className="field-label">Número de celular</label>
      <div className="phone-field">
        <span>+57</span>
        <input
          value={celular}
          onChange={(event) => setCelular(event.target.value)}
          inputMode="numeric"
          autoComplete="tel-national"
          aria-describedby={error ? "login-error" : undefined}
          placeholder="300 123 4567"
        />
      </div>
      {error && (
        <p id="login-error" className="form-error" role="alert">
          {error}
        </p>
      )}
      <Button
        onClick={enter}
        disabled={loading}
        icon={loading ? <Loader2 className="spin" /> : undefined}
      >
        {loading ? "Validando…" : "Entrar en modo de desarrollo"}
      </Button>
      <div className="divider">
        <span>o</span>
      </div>
      <Button variant="secondary" onClick={() => navigate(rutas.registro)}>
        Crear una cuenta local
      </Button>
      <p className="demo-notice">
        Modo de desarrollo: la sesión se guarda únicamente en este navegador. No
        crea una cuenta en el servidor.
      </p>
      <div className="offline-promise">
        <CloudOff />
        <span>
          <b>Preparado para conectividad intermitente</b>Las operaciones
          compatibles se guardan como pendientes; el servidor deberá
          confirmarlas.
        </span>
      </div>
    </div>
  );
}
