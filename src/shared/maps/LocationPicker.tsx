import { useState } from "react";
import { LocateFixed, MapPin } from "lucide-react";
import { Button } from "@/shared/ui";

export type Coordinates = { latitude: number; longitude: number };

export function LocationPicker({
  value,
  onChange,
}: {
  value?: Coordinates;
  onChange: (value: Coordinates) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const locate = () => {
    if (!navigator.geolocation)
      return setError("Este navegador no ofrece geolocalización.");
    setLoading(true);
    setError("");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        onChange({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLoading(false);
      },
      () => {
        setError(
          "No fue posible obtener la ubicación. Puedes escribir las coordenadas.",
        );
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10_000, maximumAge: 60_000 },
    );
  };
  const mapUrl = value
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${value.longitude - 0.02}%2C${value.latitude - 0.02}%2C${value.longitude + 0.02}%2C${value.latitude + 0.02}&layer=mapnik&marker=${value.latitude}%2C${value.longitude}`
    : "";
  return (
    <section className="location-picker">
      <div className="location-fields">
        <label>
          Latitud
          <input
            type="number"
            step="any"
            value={value?.latitude ?? ""}
            onChange={(event) =>
              onChange({
                latitude: Number(event.target.value),
                longitude: value?.longitude ?? 0,
              })
            }
          />
        </label>
        <label>
          Longitud
          <input
            type="number"
            step="any"
            value={value?.longitude ?? ""}
            onChange={(event) =>
              onChange({
                latitude: value?.latitude ?? 0,
                longitude: Number(event.target.value),
              })
            }
          />
        </label>
      </div>
      <Button
        variant="secondary"
        onClick={locate}
        disabled={loading}
        icon={<LocateFixed />}
      >
        {loading ? "Ubicando…" : "Usar mi ubicación"}
      </Button>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      {value &&
        Number.isFinite(value.latitude) &&
        Number.isFinite(value.longitude) && (
          <iframe
            className="osm-map"
            title="Mapa de ubicación seleccionada"
            src={mapUrl}
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        )}
      <p className="map-credit">
        <MapPin /> Mapa © OpenStreetMap contributors. No calcula rutas ni
        tiempos.
      </p>
    </section>
  );
}
