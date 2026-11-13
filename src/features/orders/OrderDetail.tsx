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
import { Button, StatusStepper } from "@/shared/ui";

export function OrderDetail() {
  const go = useNavegacion();
  const { rol } = useRole();
  const [accepted, setAccepted] = useState(false);

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
            <button>Aceptar</button>
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
          <Button onClick={() => setAccepted(true)} icon={<Check />}>
            {accepted ? "Pedido aceptado" : "Aceptar pedido"}
          </Button>
          <div className="counter-row">
            <Button variant="secondary">Contraofertar precio</Button>
            <Button variant="secondary">Cambiar fecha</Button>
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
    </>
  );
}
