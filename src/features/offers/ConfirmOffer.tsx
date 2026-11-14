import { Check, Sparkles } from "lucide-react";
import { useNavegacion } from "@/app/useNavegacion";
import { formatKg, formatPrecio } from "@/shared/lib/format";
import { fotos, productoPrincipal } from "@/shared/lib/mock";
import { Button, SyncChip } from "@/shared/ui";

export function ConfirmOffer() {
  const go = useNavegacion();
  const fields = [
    ["Producto", productoPrincipal.nombre],
    ["Cantidad", formatKg(productoPrincipal.cantidadKg)],
    ["Precio", `${formatPrecio(productoPrincipal.precioPorKg)} por kg`],
    ["Municipio", productoPrincipal.municipio],
    ["Disponible desde", "18 de junio"],
  ];

  return (
    <>
      <div className="ai-banner">
        <Sparkles />
        <span>
          <b>La IA organizó tu oferta</b>Revisa que todo esté bien antes de
          publicar.
        </span>
      </div>
      <div className="offer-preview">
        <img src={fotos.aguacate} alt="Aguacates Hass organizados en cajas" />
        <div className="offer-fields">
          {fields.map(([label, value]) => (
            <label key={label}>
              <span>{label}</span>
              <input defaultValue={value} />
            </label>
          ))}
        </div>
      </div>
      <SyncChip state="guardado" />
      <div className="stack-actions">
        <Button onClick={() => go("offers")} icon={<Check />}>
          Publicar oferta
        </Button>
        <Button variant="ghost" onClick={() => go("publish")}>
          Volver a grabar
        </Button>
      </div>
    </>
  );
}
