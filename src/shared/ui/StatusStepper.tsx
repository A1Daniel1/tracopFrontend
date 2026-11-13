import { Check } from "lucide-react";
import { estadosDelPedido } from "@/shared/lib/pedido";

export function StatusStepper({ current = 2 }: { current?: number }) {
  return (
    <div
      className="stepper"
      aria-label={`Estado: ${estadosDelPedido[current].label}`}
    >
      <div className="step-line" />
      {estadosDelPedido.map((estado, index) => (
        <div
          className={`step ${index <= current ? "done" : ""} ${index === current ? "current" : ""}`}
          key={estado.clave}
        >
          <span>{index < current ? <Check size={12} /> : index + 1}</span>
          <small>{estado.label}</small>
        </div>
      ))}
    </div>
  );
}
