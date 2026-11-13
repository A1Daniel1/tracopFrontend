import { Leaf, QrCode, Store, Truck } from "lucide-react";
import { useNavegacion } from "@/app/useNavegacion";
import { Button } from "@/shared/ui";

export function RouteScreen() {
  const go = useNavegacion();

  return (
    <>
      <div className="route-map">
        <div className="map-roads" />
        <span className="route-pin start">
          <Leaf />
        </span>
        <span className="route-pin truck">
          <Truck />
        </span>
        <span className="route-pin end">
          <Store />
        </span>
        <div className="eta-pill">
          <b>1 h 24 min</b>
          <span>52 km restantes</span>
        </div>
      </div>
      <div className="route-sheet-card">
        <p>RUTA ACTIVA</p>
        <h2>Filandia → Armenia</h2>
        <div className="timeline">
          <span>
            <i />
            <b>7:00 a. m. · Recoger lote</b>
            <small>Finca El Porvenir, Filandia</small>
          </span>
          <span>
            <i />
            <b>8:30 a. m. · Entregar</b>
            <small>Mercado La 14, Armenia</small>
          </span>
        </div>
        <Button onClick={() => go("qr")} icon={<QrCode />}>
          Escanear QR para recoger
        </Button>
        <button className="link-button" onClick={() => go("tracking")}>
          Ver seguimiento en ruta
        </button>
      </div>
    </>
  );
}
