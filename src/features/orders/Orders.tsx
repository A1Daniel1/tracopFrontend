import { useState } from "react";
import { ChevronRight, Clock3 } from "lucide-react";
import { useNavegacion } from "@/app/useNavegacion";
import { formatKg, formatPrecio } from "@/shared/lib/format";
import { estadosDelPedido } from "@/shared/lib/pedido";
import { ordersService } from "@/services/orders";
import { EstadoVacio, StatusStepper, SyncChip } from "@/shared/ui";

export function Orders() {
  const go = useNavegacion();
  const [tab, setTab] = useState<"curso" | "finalizados">("curso");
  const orders = ordersService
    .list()
    .filter((item) =>
      tab === "finalizados"
        ? item.estado === "entregado" || item.estado === "pagado"
        : item.estado !== "entregado" && item.estado !== "pagado",
    );
  return (
    <>
      <div className="tabs two">
        <button
          className={tab === "curso" ? "active" : ""}
          aria-pressed={tab === "curso"}
          onClick={() => setTab("curso")}
        >
          En curso
        </button>
        <button
          className={tab === "finalizados" ? "active" : ""}
          aria-pressed={tab === "finalizados"}
          onClick={() => setTab("finalizados")}
        >
          Finalizados
        </button>
      </div>
      {orders.length === 0 && (
        <EstadoVacio
          icono={<Clock3 />}
          titulo="No hay pedidos aquí"
          descripcion={
            tab === "curso"
              ? "Los pedidos activos aparecerán en esta sección."
              : "Los pedidos entregados y pagados aparecerán aquí."
          }
        />
      )}
      {orders.map((order) => {
        const current = Math.max(
          0,
          estadosDelPedido.findIndex((item) => item.clave === order.estado),
        );
        return (
          <button
            className="order-list-card"
            onClick={() => go("order-detail")}
            key={order.id}
          >
            <div className="order-id">
              <span>Pedido #{order.id}</span>
              <SyncChip state={order.sincronizacion} />
            </div>
            <div className="order-product">
              <span className="produce-icon">{order.producto.charAt(0)}</span>
              <div>
                <b>{order.producto}</b>
                <small>
                  {formatKg(order.cantidadKg)} · {formatPrecio(order.total)}
                </small>
              </div>
              <ChevronRight />
            </div>
            <StatusStepper current={current} />
            {order.fecha && (
              <p className="next-action">
                <Clock3 /> {order.fecha}
              </p>
            )}
          </button>
        );
      })}
    </>
  );
}
