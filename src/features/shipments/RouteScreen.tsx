import { useState } from "react";
import { QrCode } from "lucide-react";
import { useNavegacion } from "@/app/useNavegacion";
import { LocationPicker, type Coordinates } from "@/shared/maps/LocationPicker";
import { Button } from "@/shared/ui";

export function RouteScreen() {
  const go = useNavegacion();
  const [location, setLocation] = useState<Coordinates>();
  return (
    <>
      <div className="demo-notice">
        Ruta de desarrollo. Solo muestra la ubicación que autorices; el backend
        debe entregar paradas, trazado y tiempos reales.
      </div>
      <h2 className="screen-title">Ubicación de operación</h2>
      <LocationPicker value={location} onChange={setLocation} />
      <div className="route-sheet-card">
        <p>SIGUIENTE ACCIÓN</p>
        <h2>Verifica el lote asignado</h2>
        <p>La carga y el destino definitivos llegarán desde shipments.</p>
        <Button onClick={() => go("qr")} icon={<QrCode />}>
          Escanear QR del lote
        </Button>
        <button className="link-button" onClick={() => go("tracking")}>
          Ver operaciones pendientes
        </button>
      </div>
    </>
  );
}
