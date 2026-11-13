import { AlertTriangle, X } from "lucide-react";
import { Button } from "./Button";

export function Confirmar({
  abierto,
  titulo,
  descripcion,
  confirmarLabel = "Confirmar",
  cancelarLabel = "Cancelar",
  onConfirmar,
  onCancelar,
}: {
  abierto: boolean;
  titulo: string;
  descripcion: string;
  confirmarLabel?: string;
  cancelarLabel?: string;
  onConfirmar: () => void;
  onCancelar: () => void;
}) {
  if (!abierto) return null;

  return (
    <div className="confirm-overlay" role="dialog" aria-modal="true">
      <div className="confirm-sheet">
        <button
          className="confirm-close"
          onClick={onCancelar}
          aria-label="Cerrar"
        >
          <X size={20} />
        </button>
        <span className="confirm-icon">
          <AlertTriangle size={24} />
        </span>
        <h2>{titulo}</h2>
        <p>{descripcion}</p>
        <div className="confirm-actions">
          <Button variant="ghost" onClick={onCancelar}>
            {cancelarLabel}
          </Button>
          <Button variant="danger" onClick={onConfirmar}>
            {confirmarLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
