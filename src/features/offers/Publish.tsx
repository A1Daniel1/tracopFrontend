import { useState } from "react";
import { Camera, Loader2, Mic, Plus, Sparkles, X } from "lucide-react";
import { useNavegacion } from "@/app/useNavegacion";
import { Button, SyncChip } from "@/shared/ui";

type EstadoVoz = "listo" | "grabando" | "procesando";

export function Publish() {
  const go = useNavegacion();
  const [estado, setEstado] = useState<EstadoVoz>("listo");

  const titulo =
    estado === "listo"
      ? "Toca para empezar"
      : estado === "grabando"
        ? "Te estamos escuchando…"
        : "Procesando tu oferta…";

  const detalle =
    estado === "listo"
      ? "Ejemplo: “Tengo 10 bultos de papa a 90 mil cada uno”"
      : estado === "grabando"
        ? "“Tengo 200 kilos de aguacate hass…”"
        : "Estamos organizando producto, cantidad y precio.";

  const siguiente = () => {
    if (estado === "listo") setEstado("grabando");
    else if (estado === "grabando") setEstado("procesando");
  };

  return (
    <div className="voice-publish">
      <div className="tip-card">
        <Sparkles />
        <span>
          <b>Habla con tus palabras</b>Di producto, cantidad, precio y dónde
          estás.
        </span>
      </div>
      <div className={`recorder ${estado === "grabando" ? "recording" : ""}`}>
        <span className="pulse-ring">
          {estado === "procesando" ? (
            <Loader2 className="spin" size={38} />
          ) : (
            <Mic size={38} />
          )}
        </span>
        <h2>{titulo}</h2>
        <p>{detalle}</p>
        {estado !== "procesando" && (
          <button onClick={siguiente}>
            {estado === "grabando" ? (
              <>
                <X /> Detener
              </>
            ) : (
              <>
                <Mic /> Grabar oferta
              </>
            )}
          </button>
        )}
      </div>
      <button className="photo-add">
        <Camera />
        <span>
          <b>Agregar foto</b>
          <small>Ayuda a vender más rápido</small>
        </span>
        <Plus />
      </button>
      <SyncChip state={estado === "procesando" ? "pendiente" : "guardado"} />
      <Button
        onClick={() => go("confirm-offer")}
        icon={<Sparkles size={20} />}
        disabled={estado !== "procesando"}
      >
        Revisar lo que entendimos
      </Button>
    </div>
  );
}
