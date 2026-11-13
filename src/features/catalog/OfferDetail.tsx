import { useState } from "react";
import { Box, ChevronRight, Leaf, MapPin, Star } from "lucide-react";
import { useNavegacion } from "@/app/useNavegacion";
import {
  formatCalificacion,
  formatKg,
  formatPrecio,
} from "@/shared/lib/format";
import { fotos, perfil, productoPrincipal } from "@/shared/lib/mock";
import { Button, Confirmar } from "@/shared/ui";

export function OfferDetail() {
  const go = useNavegacion();
  const [confirmando, setConfirmando] = useState(false);

  return (
    <>
      <div className="detail-photo">
        <img src={fotos.producto} alt="Aguacate Hass fresco" />
        <span>FRUTA · DISPONIBLE</span>
      </div>
      <div className="offer-detail-head">
        <div>
          <h1>{productoPrincipal.nombre}</h1>
          <p>
            <MapPin /> {productoPrincipal.municipio} · A 27 km
          </p>
        </div>
        <button>♡</button>
      </div>
      <div className="big-price">
        <b>{formatPrecio(productoPrincipal.precioPorKg)}</b>
        <span>por kg</span>
        <i>{formatKg(productoPrincipal.cantidadKg)} disponibles</i>
      </div>
      <div className="producer-row">
        <span className="avatar">{perfil.iniciales}</span>
        <div>
          <b>{perfil.nombre}</b>
          <small>
            <Star /> {formatCalificacion(perfil.calificacion)} · {perfil.ventas}{" "}
            · Verificada
          </small>
        </div>
        <ChevronRight />
      </div>
      <div className="quality-grid">
        <div>
          <Leaf />
          <b>Cosecha</b>
          <span>De esta semana</span>
        </div>
        <div>
          <Box />
          <b>Pedido mínimo</b>
          <span>50 kg</span>
        </div>
      </div>
      <label className="quantity-field">
        <span>¿Cuánto necesitas?</span>
        <div>
          <button>−</button>
          <input defaultValue="200 kg" />
          <button>+</button>
        </div>
      </label>
      <div className="sticky-action">
        <div>
          <span>Total estimado</span>
          <b>{formatPrecio(productoPrincipal.total)}</b>
        </div>
        <Button onClick={() => setConfirmando(true)}>Hacer pedido</Button>
      </div>
      <Confirmar
        abierto={confirmando}
        titulo="¿Confirmar tu pedido?"
        descripcion={`Pedirás ${formatKg(productoPrincipal.cantidadKg)} de ${productoPrincipal.nombre} por ${formatPrecio(productoPrincipal.total)}.`}
        confirmarLabel="Confirmar pedido"
        onCancelar={() => setConfirmando(false)}
        onConfirmar={() => go("orders")}
      />
    </>
  );
}
