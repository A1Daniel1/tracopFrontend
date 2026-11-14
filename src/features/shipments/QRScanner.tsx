import { useEffect, useRef, useState } from "react";
import { Camera, Check, Keyboard, QrCode } from "lucide-react";
import { useNavegacion } from "@/app/useNavegacion";
import { enqueue } from "@/shared/offline/queue";
import { Button } from "@/shared/ui";

type BarcodeResult = { rawValue: string };
type Detector = { detect(source: CanvasImageSource): Promise<BarcodeResult[]> };
type DetectorConstructor = new (options: { formats: string[] }) => Detector;

export function QRScanner() {
  const go = useNavegacion();
  const video = useRef<HTMLVideoElement>(null);
  const stream = useRef<MediaStream | null>(null);
  const interval = useRef<number | null>(null);
  const [code, setCode] = useState("");
  const [manual, setManual] = useState(false);
  const [active, setActive] = useState(false);
  const [error, setError] = useState("");

  const stopCamera = () => {
    if (interval.current) window.clearInterval(interval.current);
    interval.current = null;
    stream.current?.getTracks().forEach((track) => track.stop());
    stream.current = null;
    setActive(false);
  };

  useEffect(() => stopCamera, []);

  const beginCamera = async () => {
    setError("");
    if (!navigator.mediaDevices?.getUserMedia)
      return setError("Este navegador no ofrece acceso a cámara.");
    try {
      const media = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false,
      });
      stream.current = media;
      if (video.current) {
        video.current.srcObject = media;
        await video.current.play();
      }
      setActive(true);
      const DetectorApi = (
        globalThis as typeof globalThis & {
          BarcodeDetector?: DetectorConstructor;
        }
      ).BarcodeDetector;
      if (!DetectorApi)
        return setError(
          "La cámara está activa, pero el escaneo automático no está disponible. Usa el ingreso manual.",
        );
      const detector = new DetectorApi({ formats: ["qr_code"] });
      interval.current = window.setInterval(async () => {
        if (!video.current || video.current.readyState < 2) return;
        try {
          const result = await detector.detect(video.current);
          if (result[0]?.rawValue) {
            setCode(result[0].rawValue);
            stopCamera();
          }
        } catch {
          /* siguiente cuadro */
        }
      }, 500);
    } catch {
      setError(
        "No se pudo abrir la cámara. Revisa el permiso o ingresa el código manualmente.",
      );
    }
  };

  const confirm = () => {
    if (code.trim().length < 3)
      return setError("Escribe o escanea un código válido.");
    enqueue({
      dominio: "shipments",
      accion: "verify-qr",
      payload: { code: code.trim() },
    });
    go("tracking");
  };

  return (
    <div className="real-scanner">
      <div className="demo-notice">
        Verificación local: el código queda pendiente hasta que shipments
        confirme su validez.
      </div>
      {!code && (
        <div className="camera-real">
          <video
            ref={video}
            muted
            playsInline
            aria-label="Vista previa de cámara"
          />
          {!active && (
            <div className="camera-placeholder">
              <QrCode />
              <span>Cámara detenida</span>
            </div>
          )}
        </div>
      )}
      {code && (
        <div className="scan-result">
          <Check />
          <h2>Código leído</h2>
          <code>{code}</code>
          <p>Aún no confirmado por el servidor.</p>
        </div>
      )}
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      {!code && (
        <div className="stack-actions">
          <Button onClick={active ? stopCamera : beginCamera} icon={<Camera />}>
            {active ? "Detener cámara" : "Abrir cámara"}
          </Button>
          <Button
            variant="secondary"
            onClick={() => setManual(!manual)}
            icon={<Keyboard />}
          >
            Ingresar código
          </Button>
        </div>
      )}
      {manual && !code && (
        <label className="manual-code">
          Código del lote
          <input
            value={code}
            onChange={(event) => setCode(event.target.value)}
            placeholder="Ej. TR-284-AH"
          />
          <Button onClick={confirm}>Verificar localmente</Button>
        </label>
      )}
      {code && (
        <Button onClick={confirm}>Continuar con operación pendiente</Button>
      )}
    </div>
  );
}
