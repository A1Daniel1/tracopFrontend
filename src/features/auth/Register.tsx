import { useState } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { authService } from "@/services/auth";
import { useRole } from "@/app/role";
import { nombresDeRol } from "@/shared/lib/roles";
import type { Rol } from "@/shared/types";
import { AppIcon, Button } from "@/shared/ui";

export function Register() {
  const navigate = useNavigate();
  const { iniciarSesion } = useRole();
  const [nombre, setNombre] = useState("");
  const [celular, setCelular] = useState("");
  const [rol, setRol] = useState<Rol>("productor");
  const [acepta, setAcepta] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    const digits = celular.replace(/\D/g, "");
    if (nombre.trim().length < 3)
      return setError("Escribe tu nombre completo.");
    if (digits.length !== 10)
      return setError("Escribe un celular de 10 dígitos.");
    if (!acepta)
      return setError(
        "Debes aceptar el tratamiento local de los datos de demostración.",
      );
    setLoading(true);
    setError("");
    try {
      const session = await authService.register({
        nombre: nombre.trim(),
        celular: digits,
        rol,
        aceptaDatos: acepta,
      });
      iniciarSesion(session);
      navigate(`/${rol}`);
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "No se pudo crear la cuenta local.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="workspace">
      <div className="phone-frame auth-screen standalone-auth">
        <button
          className="icon-btn auth-back"
          onClick={() => navigate("/")}
          aria-label="Volver"
        >
          <ArrowLeft />
        </button>
        <AppIcon />
        <p className="eyebrow">CUENTA LOCAL DE DESARROLLO</p>
        <h1>Crea tu perfil</h1>
        <label className="field-label" htmlFor="register-name">
          Nombre completo
        </label>
        <input
          id="register-name"
          className="text-field"
          value={nombre}
          onChange={(event) => setNombre(event.target.value)}
          autoComplete="name"
        />
        <label className="field-label" htmlFor="register-phone">
          Número de celular
        </label>
        <input
          id="register-phone"
          className="text-field"
          value={celular}
          onChange={(event) => setCelular(event.target.value)}
          inputMode="numeric"
          autoComplete="tel-national"
        />
        <label className="field-label" htmlFor="register-role">
          Rol principal
        </label>
        <select
          id="register-role"
          className="text-field"
          value={rol}
          onChange={(event) => setRol(event.target.value as Rol)}
        >
          {(Object.keys(nombresDeRol) as Rol[]).map((item) => (
            <option value={item} key={item}>
              {nombresDeRol[item]}
            </option>
          ))}
        </select>
        <label className="consent-row">
          <input
            type="checkbox"
            checked={acepta}
            onChange={(event) => setAcepta(event.target.checked)}
          />{" "}
          <span>
            Acepto guardar estos datos de demostración en este navegador.
          </span>
        </label>
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        <Button
          onClick={submit}
          disabled={loading}
          icon={loading ? <Loader2 className="spin" /> : undefined}
        >
          {loading ? "Guardando…" : "Crear perfil local"}
        </Button>
      </div>
    </main>
  );
}
