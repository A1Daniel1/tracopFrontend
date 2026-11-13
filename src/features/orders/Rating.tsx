import { useState } from "react";
import { Check, Star } from "lucide-react";
import { useNavegacion } from "@/app/useNavegacion";
import { perfil } from "@/shared/lib/mock";
import { Button } from "@/shared/ui";

export function Rating() {
  const go = useNavegacion();
  const [rating, setRating] = useState(5);

  return (
    <div className="rating-screen">
      <span className="success-seal">
        <Check />
      </span>
      <h1>¡Pedido entregado!</h1>
      <p>Tu confirmación ayuda a cerrar el trato con confianza.</p>
      <div className="rating-card">
        <span className="avatar">{perfil.iniciales}</span>
        <h2>¿Cómo te fue con {perfil.nombre.split(" ")[0]}?</h2>
        <div className="stars">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              onClick={() => setRating(n)}
              className={n <= rating ? "active" : ""}
              key={n}
            >
              <Star />
            </button>
          ))}
        </div>
        <b>{rating === 5 ? "¡Excelente!" : "Gracias por contarnos"}</b>
        <textarea placeholder="Escribe un comentario (opcional)" />
      </div>
      <Button onClick={() => go("orders")}>Enviar calificación</Button>
      <Button variant="ghost" onClick={() => go("orders")}>
        Ahora no
      </Button>
    </div>
  );
}
