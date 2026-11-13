import { Box, ChevronRight, Clock3, Mic, Truck } from "lucide-react";
import { useNavegacion } from "@/app/useNavegacion";
import { formatKg, formatPrecio } from "@/shared/lib/format";
import { productoPrincipal } from "@/shared/lib/mock";
import { SectionTitle, SyncChip } from "@/shared/ui";

export function ProducerHome() {
  const go = useNavegacion();

  return (
    <>
      <div className="hero-greeting">
        <p>Tu campo hoy</p>
        <h1>
          Tienes <strong>3 pedidos</strong>
          <br />
          por responder
        </h1>
        <div className="summary-row">
          <div>
            <b>4</b>
            <span>Ofertas activas</span>
          </div>
          <div>
            <b>2</b>
            <span>En camino</span>
          </div>
        </div>
      </div>
      <button className="voice-cta" onClick={() => go("publish")}>
        <span className="mic-orbit">
          <Mic size={31} />
        </span>
        <span>
          <b>Publicar por voz</b>
          <small>Cuéntanos qué cosechaste</small>
        </span>
        <ChevronRight />
      </button>
      <SectionTitle
        title="Pedidos por responder"
        action="Ver todos"
        onClick={() => go("orders")}
      />
      <button className="order-card" onClick={() => go("order-detail")}>
        <div className="order-top">
          <span className="produce-icon">A</span>
          <div>
            <b>{productoPrincipal.nombre}</b>
            <small>Pedido de {productoPrincipal.comprador}</small>
          </div>
          <span className="price">{formatPrecio(productoPrincipal.total)}</span>
        </div>
        <div className="order-meta">
          <span>
            <Box /> {formatKg(productoPrincipal.cantidadKg)}
          </span>
          <span>
            <Clock3 /> Hoy, 4:30 p. m.
          </span>
        </div>
        <SyncChip state="pendiente" />
      </button>
      <SectionTitle title="Saliendo de la finca" />
      <div className="route-mini">
        <div>
          <Truck />
          <i />
        </div>
        <span>
          <b>Tomate chonto · 8 canastillas</b>
          <small>Julián va hacia Armenia · llega 3:20 p. m.</small>
        </span>
      </div>
    </>
  );
}
