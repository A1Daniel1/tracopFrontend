import { useState } from "react";
import {
  Camera,
  Check,
  Leaf,
  MapPin,
  QrCode,
  UserRound,
  Volume2,
} from "lucide-react";
import { useNavegacion } from "@/app/useNavegacion";
import { formatKg } from "@/shared/lib/format";
import { fotos, perfil, productoPrincipal } from "@/shared/lib/mock";
import { Button, SyncChip } from "@/shared/ui";

export function QRScanner() {
  const go = useNavegacion();
  const [scanned, setScanned] = useState(false);

  if (scanned)
    return (
      <div className="scan-confirm">
        <span>
          <Check />
        </span>
        <h1>Lote verificado</h1>
        <p>La información coincide con la carga asignada.</p>
        <div className="lot-card">
          <div>
            <small>LOTE</small>
            <b>{productoPrincipal.lote}</b>
          </div>
          <hr />
          <p>
            <Leaf /> {productoPrincipal.nombre} ·{" "}
            {formatKg(productoPrincipal.cantidadKg)}
          </p>
          <p>
            <UserRound /> {perfil.nombre}
          </p>
          <p>
            <MapPin /> Finca El Porvenir, Filandia
          </p>
          <SyncChip state="guardado" />
        </div>
        <Button onClick={() => go("tracking")}>Confirmar recolección</Button>
      </div>
    );

  return (
    <div className="scanner">
      <div className="camera-view">
        <img src={fotos.cosecha} alt="Vista de cámara en la finca" />
        <div className="scan-shade" />
        <div className="scan-box">
          <i />
          <i />
          <i />
          <i />
          <span />
        </div>
        <p>Ubica el código dentro del recuadro</p>
      </div>
      <div className="scanner-actions">
        <button>
          <Volume2 />
          <span>Instrucciones</span>
        </button>
        <button onClick={() => setScanned(true)}>
          <QrCode />
          <span>Simular escaneo</span>
        </button>
        <button>
          <Camera />
          <span>Linterna</span>
        </button>
      </div>
    </div>
  );
}
