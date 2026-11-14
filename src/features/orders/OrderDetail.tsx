import { useState } from "react";
import {
  Check,
  CircleDollarSign,
  Clock3,
  MapPin,
  MessageCircle,
  PackageCheck,
  Truck,
  UserRound,
} from "lucide-react";
import { useRole } from "@/app/role";
import { useNavegacion } from "@/app/useNavegacion";
import { formatKg, formatPrecio } from "@/shared/lib/format";
import { perfil, productoPrincipal } from "@/shared/lib/mock";
import { Button, Confirmar, StatusStepper } from "@/shared/ui";
import { ordersService } from "@/services/orders";

export function OrderDetail() {
  const go = useNavegacion();
  const { rol } = useRole();
  const [accepted, setAccepted] = useState(false);
  const [confirmando, setConfirmando] = useState(false);
  const [counterValue, setCounterValue] = useState("");
  const [feedback, setFeedback] = useState("");
  const order = ordersService.list()[0];

  return (
    <>
      <div className="status-panel">
        <p>ESTADO DEL PEDIDO</p>
        <h2>
          {accepted
            ? "Pedido aceptado"
            : rol === "comprador"
              ? "En camino"
              : "Esperando tu respuesta"}
        </h2>
        <StatusStepper current={accepted ? 1 : rol === "comprador" ? 2 : 0} />
      </div>
      <div className="detail-card">
        <div className="order-product">
          <span className="produce-icon">A</span>
          <div>
            <b>{productoPrincipal.nombre}</b>
            <small>
              {formatKg(productoPrincipal.cantidadKg)} ·{" "}
              {formatPrecio(productoPrincipal.precioPorKg)}/kg
            </small>
          </div>
          <b>{formatPrecio(productoPrincipal.total)}</b>
        </div>
        <hr />
        <p>
          <UserRound />{" "}
          {rol === "comprador"
            ? `Productora: ${perfil.nombre}`
            : `Comprador: ${productoPrincipal.comprador}`}
        </p>
        <p>
          <MapPin />{" "}
          {rol === "comprador"
            ? "Filandia → Armenia"
            : "Entrega en Armenia, Quindío"}
        </p>
        <p>
          <Clock3 /> Miércoles 19 de junio, 8:00 a. m.
        </p>
      </div>
      {rol === "comprador" && (
        <>
          <div className="counteroffer">
            <MessageCircle />
            <span>
              <b>Contraoferta recibida</b>María propone entregar el jueves por
              la mañana.
            </span>
            <button
              onClick={() => {
                ordersService.updateState(order.id, "aceptado");
                setFeedback("Contraoferta aceptada localmente.");
              }}
            >
              Aceptar
            </button>
          </div>
          <div className="tracking-card">
            <div className="map-pattern">
              <span>Finca El Porvenir</span>
              <i />
              <Truck />
              <b>Armenia</b>
            </div>
            <div>
              <b>Tu pedido está en camino</b>
              <span>Transporta: Julián R. · Placa TQK 218</span>
            </div>
          </div>
          <Button onClick={() => go("rating")} icon={<PackageCheck />}>
            Confirmar entrega
          </Button>
          <Button variant="secondary" icon={<CircleDollarSign />}>
            Confirmar pago de producto y flete
          </Button>
        </>
      )}
      {rol === "productor" && (
        <>
          <div className="action-note">
            <b>Responde antes de las 4:30 p. m.</b>
            <span>
              El comprador recibirá tu respuesta cuando vuelva la señal.
            </span>
          </div>
          <Button onClick={() => setConfirmando(true)} icon={<Check />}>
            {accepted ? "Pedido aceptado" : "Aceptar pedido"}
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              ordersService.recordDecision(order.id, "reject");
              setFeedback(
                "Rechazo guardado localmente; en modo HTTP requiere confirmación del servidor.",
              );
            }}
          >
            Rechazar pedido
          </Button>
          <div className="counter-row">
            <label className="inline-price">
              Contraoferta
              <input
                inputMode="numeric"
                placeholder="Valor COP"
                value={counterValue}
                onChange={(event) => setCounterValue(event.target.value)}
              />
            </label>
            <Button
              variant="secondary"
              onClick={() => {
                const value = Number(counterValue.replace(/\D/g, ""));
                if (value > 0) {
                  ordersService.counterOffer(order.id, value);
                  setFeedback("Contraoferta guardada localmente.");
                } else setFeedback("Escribe un valor válido.");
              }}
            >
              Enviar contraoferta
            </Button>
          </div>
          {accepted && (
            <Button
              variant="secondary"
              onClick={() => go("freight")}
              icon={<Truck />}
            >
              Asignar transportista
            </Button>
          )}
        </>
      )}
      <Confirmar
        abierto={confirmando}
        titulo="¿Aceptar este pedido?"
        descripcion={`Te comprometes a entregar ${formatKg(productoPrincipal.cantidadKg)} de ${productoPrincipal.nombre} a ${productoPrincipal.comprador}.`}
        confirmarLabel="Aceptar pedido"
        onCancelar={() => setConfirmando(false)}
        onConfirmar={() => {
          ordersService.updateState(order.id, "aceptado");
          setAccepted(true);
          setConfirmando(false);
          setFeedback("Pedido aceptado localmente.");
        }}
      />
      {feedback && (
        <p className="operation-feedback" role="status">
          {feedback}
        </p>
      )}
    </>
  );
}
