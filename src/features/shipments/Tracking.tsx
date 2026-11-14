import { useState } from "react";
import {
  AlertTriangle,
  Box,
  ChevronRight,
  MapPin,
  PackageCheck,
  Truck,
  UserRound,
} from "lucide-react";
import { useNavegacion } from "@/app/useNavegacion";
import { formatKg } from "@/shared/lib/format";
import { productoPrincipal } from "@/shared/lib/mock";
import { Button, StatusStepper } from "@/shared/ui";
import { usePendingOperations } from "@/shared/offline/usePendingOperations";

export function Tracking() {
  const go = useNavegacion();
  const [incident, setIncident] = useState(false);
  const pending = usePendingOperations().filter(
    (item) => item.dominio === "shipments",
  );

  return (
    <>
      <div className="tracking-status">
        <span className="moving-truck">
          <Truck />
        </span>
        <div>
          <p>ESTADO LOCAL</p>
          <h2>
            {pending.length
              ? "Pendiente de confirmación"
              : "Sin operación activa confirmada"}
          </h2>
          <span>El servidor de shipments definirá el estado oficial.</span>
        </div>
      </div>
      <StatusStepper current={2} />
      <div className="detail-card">
        <p>
          <Box /> Lote {productoPrincipal.lote} ·{" "}
          {formatKg(productoPrincipal.cantidadKg)}
        </p>
        <p>
          <MapPin /> Destino pendiente de datos del servicio
        </p>
        <p>
          <UserRound /> Receptor pendiente de confirmación
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
