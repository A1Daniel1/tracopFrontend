import { useState } from "react";
import { Box, Check, Leaf, MapPin, SlidersHorizontal } from "lucide-react";
import { formatKg } from "@/shared/lib/format";
import { cargas } from "@/shared/lib/mock";
import { Button } from "@/shared/ui";

export function Loads() {
  const [offer, setOffer] = useState(false);
  const primera = cargas[0];
  const segunda = cargas[1];

  return (
    <>
      <div className="route-filter">
        <MapPin />
        <span>
          <b>Cerca de Armenia</b>Radio de 40 km
        </span>
        <button>Cambiar</button>
      </div>
      <div className="list-heading">
        <span>8 cargas para ti</span>
        <button>
          <SlidersHorizontal /> Filtrar
        </button>
      </div>
      <div className="load-card">
        <div className="load-date">
          <b>{primera.fecha}</b>
          <span>{primera.hora}</span>
        </div>
        <div className="route-line">
          <i />
          <span>
            <small>ORIGEN</small>
            <b>{primera.origen}</b>
          </span>
          <i />
          <span>
            <small>DESTINO</small>
            <b>{primera.destino}</b>
          </span>
        </div>
        <div className="load-stats">
          <span>
            <Box /> {formatKg(primera.cantidadKg)}
          </span>
          <span>
            <Leaf /> {primera.producto}
          </span>
          <span>{primera.distanciaKm} km</span>
        </div>
        {offer ? (
          <div className="offer-sent">
            <Check />
            <span>
              <b>Propuesta enviada: $180.000</b>
              <small>Pendiente de respuesta</small>
            </span>
          </div>
        ) : (
          <>
            <label className="freight-input">
              Tu valor de flete{" "}
              <div>
                <span>$</span>
                <input defaultValue="180.000" />
                <span>COP</span>
              </div>
            </label>
            <Button onClick={() => setOffer(true)}>Proponer valor</Button>
          </>
        )}
      </div>
      <div className="load-card small">
        <div className="load-date">
          <b>{segunda.fecha}</b>
          <span>{segunda.hora}</span>
        </div>
        <div className="route-line">
          <i />
          <span>
            <small>ORIGEN</small>
            <b>{segunda.origen}</b>
          </span>
          <i />
          <span>
            <small>DESTINO</small>
            <b>{segunda.destino}</b>
          </span>
        </div>
        <div className="load-stats">
          <span>
            <Box /> {formatKg(segunda.cantidadKg)}
          </span>
          <span>
            <Leaf /> {segunda.producto}
          </span>
        </div>
      </div>
    </>
  );
}
