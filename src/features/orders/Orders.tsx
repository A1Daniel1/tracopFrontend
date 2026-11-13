import { ChevronRight, Clock3 } from "lucide-react";
import { useRole } from "@/app/role";
import { useNavegacion } from "@/app/useNavegacion";
import { formatKg, formatPrecio } from "@/shared/lib/format";
import { pedidos } from "@/shared/lib/mock";
import { StatusStepper, SyncChip } from "@/shared/ui";

export function Orders() {
  const go = useNavegacion();
  const { rol } = useRole();
  const primero = pedidos[0];
  const segundo = pedidos[1];

  return (
    <>
      <div className="tabs two">
        <button className="active">
          En curso <i>3</i>
        </button>
        <button>Finalizados</button>
      </div>
      <button className="order-list-card" onClick={() => go("order-detail")}>
        <div className="order-id">
          <span>Pedido #{primero.id}</span>
          <SyncChip state="sincronizado" />
        </div>
        <div className="order-product">
          <span className="produce-icon">A</span>
          <div>
            <b>{primero.producto}</b>
            <small>
              {formatKg(primero.cantidadKg)} · {formatPrecio(primero.total)}
            </small>
          </div>
          <ChevronRight />
        </div>
        <StatusStepper current={rol === "productor" ? 1 : 2} />
        <p className="next-action">
          <Clock3 />{" "}
          {rol === "productor"
            ? "Recogida mañana, 7:00 a. m."
            : "Llega hoy entre 3:00 y 4:00 p. m."}
        </p>
      </button>
      <button
        className="order-list-card muted-card"
        onClick={() => go("order-detail")}
      >
        <div className="order-id">
          <span>Pedido #{segundo.id}</span>
          <SyncChip state="pendiente" />
        </div>
        <div className="order-product">
          <span className="produce-icon tomato">T</span>
          <div>
            <b>{segundo.producto}</b>
            <small>
              {formatKg(segundo.cantidadKg)} · {formatPrecio(segundo.total)}
            </small>
          </div>
          <ChevronRight />
        </div>
        <StatusStepper current={0} />
      </button>
    </>
  );
}
