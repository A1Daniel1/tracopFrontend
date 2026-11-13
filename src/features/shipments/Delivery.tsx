import { useState } from "react";
import { PackageCheck } from "lucide-react";
import { useNavegacion } from "@/app/useNavegacion";
import { formatKg } from "@/shared/lib/format";
import { productoPrincipal } from "@/shared/lib/mock";
import { Button, Confirmar, SyncChip } from "@/shared/ui";

export function Delivery() {
  const go = useNavegacion();
  const [confirmando, setConfirmando] = useState(false);

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
      <Button onClick={() => setConfirmando(true)}>Confirmar entrega</Button>
      <Confirmar
        abierto={confirmando}
        titulo="¿Confirmar la entrega?"
        descripcion="El pedido quedará marcado como entregado y se notificará al productor."
        confirmarLabel="Sí, confirmar"
        onCancelar={() => setConfirmando(false)}
        onConfirmar={() => go("route")}
      />
    </div>
  );
}
