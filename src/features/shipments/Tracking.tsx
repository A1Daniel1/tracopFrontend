import { useState } from "react";
import {
  AlertTriangle,
  Box,
  ChevronRight,
  MapPin,
  PackageCheck,
  Store,
  Truck,
  UserRound,
} from "lucide-react";
import { useNavegacion } from "@/app/useNavegacion";
import { formatKg } from "@/shared/lib/format";
import { productoPrincipal } from "@/shared/lib/mock";
import { Button, StatusStepper } from "@/shared/ui";

export function Tracking() {
  const go = useNavegacion();
  const [incident, setIncident] = useState(false);

  return (
    <>
      <div className="tracking-status">
        <span className="moving-truck">
          <Truck />
        </span>
        <div>
          <p>EN CAMINO</p>
          <h2>Entrega estimada 8:42 a. m.</h2>
          <span>Actualizado hace 2 min</span>
        </div>
      </div>
      <StatusStepper current={2} />
      <div className="route-map short">
        <div className="map-roads" />
        <span className="route-pin truck">
          <Truck />
        </span>
        <span className="route-pin end">
          <Store />
        </span>
      </div>
      <div className="detail-card">
        <p>
          <Box /> Lote {productoPrincipal.lote} ·{" "}
          {formatKg(productoPrincipal.cantidadKg)}
        </p>
        <p>
          <MapPin /> Mercado La 14, Armenia
        </p>
        <p>
          <UserRound /> Recibe: Sandra López · 310 555 0182
        </p>
      </div>
      {incident && (
        <div className="incident-panel">
          <b>¿Qué pasó?</b>
          <button>
            Demora en la ruta <ChevronRight />
          </button>
          <button>
            Producto dañado <ChevronRight />
          </button>
          <button>
            Problema con el vehículo <ChevronRight />
          </button>
        </div>
      )}
      <Button
        variant={incident ? "secondary" : "danger"}
        onClick={() => setIncident(!incident)}
        icon={<AlertTriangle />}
      >
        {incident ? "Cerrar opciones" : "Reportar incidencia"}
      </Button>
      <Button onClick={() => go("delivery")} icon={<PackageCheck />}>
        Llegué al destino
      </Button>
    </>
  );
}
