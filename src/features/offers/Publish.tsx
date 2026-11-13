import { useState } from "react";
import { Camera, Mic, Plus, Sparkles, X } from "lucide-react";
import { useNavegacion } from "@/app/useNavegacion";
import { Button, SyncChip } from "@/shared/ui";

export function Publish() {
  const go = useNavegacion();
  const [recording, setRecording] = useState(false);

  return (
    <div className="voice-publish">
      <div className="tip-card">
        <Sparkles />
        <span>
          <b>Habla con tus palabras</b>Di producto, cantidad, precio y dónde
          estás.
        </span>
      </div>
      <div className={`recorder ${recording ? "recording" : ""}`}>
        <span className="pulse-ring">
          <Mic size={38} />
        </span>
        <h2>{recording ? "Te estamos escuchando…" : "Toca para empezar"}</h2>
        <p>
          {recording
            ? "“Tengo 200 kilos de aguacate hass…”"
            : "Ejemplo: “Tengo 10 bultos de papa a 90 mil cada uno”"}
        </p>
        <button onClick={() => setRecording(!recording)}>
          {recording ? (
            <>
              <X /> Detener
            </>
          ) : (
            <>
              <Mic /> Grabar oferta
            </>
          )}
        </button>
      </div>
      <button className="photo-add">
        <Camera />
        <span>
          <b>Agregar foto</b>
          <small>Ayuda a vender más rápido</small>
        </span>
        <Plus />
      </button>
      <SyncChip state="guardado" />
      <Button onClick={() => go("confirm-offer")} icon={<Sparkles size={20} />}>
        Revisar lo que entendimos
      </Button>
    </div>
  );
}
