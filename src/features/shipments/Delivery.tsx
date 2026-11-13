import { PackageCheck } from "lucide-react";
import { useNavegacion } from "@/app/useNavegacion";
import { formatKg } from "@/shared/lib/format";
import { productoPrincipal } from "@/shared/lib/mock";
import { Button, SyncChip } from "@/shared/ui";

export function Delivery() {
  const go = useNavegacion();

  return (
    <div className="delivery-screen">
      <span className="success-seal">
        <PackageCheck />
      </span>
      <p className="eyebrow">ÚLTIMO PASO</p>
      <h1>Confirma la entrega</h1>
      <p>Revisa el lote con la persona que recibe.</p>
      <div className="check-list">
        <label>
          <input type="checkbox" defaultChecked />
          <span>
            <b>Producto completo</b>
            {formatKg(productoPrincipal.cantidadKg)} de{" "}
            {productoPrincipal.nombre}
          </span>
        </label>
        <label>
          <input type="checkbox" defaultChecked />
          <span>
            <b>Producto en buen estado</b>Sin daños visibles
          </span>
        </label>
        <label>
          <input type="checkbox" />
          <span>
            <b>Recibió el comprador</b>Sandra López · Mercado La 14
          </span>
        </label>
      </div>
      <SyncChip state="guardado" />
      <Button onClick={() => go("route")}>Confirmar entrega</Button>
    </div>
  );
}
