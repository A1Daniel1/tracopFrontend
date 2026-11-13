import { useState } from "react";
import { Clock3, Mic, Sparkles, Volume2 } from "lucide-react";

export function VoicePrices() {
  const [listening, setListening] = useState(false);

  return (
    <div className="voice-chat">
      <div className="assistant-intro">
        <span>
          <Sparkles />
        </span>
        <div>
          <b>Asistente TRACOP</b>
          <p>Pregunta por precios de referencia, incluso con poca señal.</p>
        </div>
      </div>
      <div className="chat-date">HOY</div>
      <div className="bubble user">
        ¿A cómo está el aguacate Hass en el Quindío?
      </div>
      <div className="bubble bot">
        <b>Precio de referencia hoy</b>
        <h2>
          $7.100 – $7.800 <small>/ kg</small>
        </h2>
        <p>
          En plazas y ofertas cercanas a Armenia. Tu precio de $7.400 está
          dentro del rango.
        </p>
        <small>
          <Clock3 /> Datos guardados a las 6:00 a. m.
        </small>
        <button>
          <Volume2 /> Escuchar respuesta
        </button>
      </div>
      <div className="suggestions">
        <button>Precio de la papa</button>
        <button>Tomate en Armenia</button>
      </div>
      <div className="chat-input">
        <button
          className={listening ? "active" : ""}
          onClick={() => setListening(!listening)}
        >
          <Mic />
        </button>
        <span>
          {listening ? "Escuchando…" : "Mantén presionado para hablar"}
        </span>
      </div>
    </div>
  );
}
