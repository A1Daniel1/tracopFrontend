import { useEffect, useRef, useState } from "react";
import { Camera, Mic, Square, Trash2, Upload } from "lucide-react";
import { useNavegacion } from "@/app/useNavegacion";
import { useSearchParams } from "react-router-dom";
import { offersService } from "@/services/offers";
import { Button } from "@/shared/ui";

const MAX_AUDIO_MS = 60_000;
const MAX_AUDIO_BYTES = 8 * 1024 * 1024;

export function Publish() {
  const go = useNavegacion();
  const [searchParams] = useSearchParams();
  const editingId = searchParams.get("id") || undefined;
  const editing = editingId
    ? offersService.listLocal().find((item) => item.id === editingId)
    : undefined;
  const recorder = useRef<MediaRecorder | null>(null);
  const stream = useRef<MediaStream | null>(null);
  const timer = useRef<number | null>(null);
  const audioUrlRef = useRef("");
  const photoUrlRef = useRef("");
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    producto: editing?.producto || "",
    cantidadKg: editing ? String(editing.cantidadKg) : "",
    precioPorKg: editing ? String(editing.precioPorKg) : "",
    municipio: editing?.municipio || "",
    categoria: editing?.categoria || "Fruta",
  });

  const stopMedia = () => {
    if (recorder.current?.state === "recording") recorder.current.stop();
    stream.current?.getTracks().forEach((track) => track.stop());
    stream.current = null;
    if (timer.current) window.clearTimeout(timer.current);
    setRecording(false);
  };

  useEffect(
    () => () => {
      stream.current?.getTracks().forEach((track) => track.stop());
      if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current);
      if (photoUrlRef.current) URL.revokeObjectURL(photoUrlRef.current);
    },
    [],
  );

  const startRecording = async () => {
    setError("");
    if (
      !navigator.mediaDevices?.getUserMedia ||
      typeof MediaRecorder === "undefined"
    )
      return setError("Este navegador no permite grabar audio.");
    try {
      const media = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.current = media;
      const chunks: Blob[] = [];
      const next = new MediaRecorder(media);
      recorder.current = next;
      next.ondataavailable = (event) => {
        if (event.data.size) chunks.push(event.data);
      };
      next.onstop = () => {
        const blob = new Blob(chunks, { type: next.mimeType || "audio/webm" });
        if (blob.size > MAX_AUDIO_BYTES)
          setError("El audio supera 8 MB. Graba un mensaje más corto.");
        else {
          if (audioUrl) URL.revokeObjectURL(audioUrl);
          const nextUrl = URL.createObjectURL(blob);
          audioUrlRef.current = nextUrl;
          setAudioUrl(nextUrl);
        }
        media.getTracks().forEach((track) => track.stop());
      };
      next.start();
      setRecording(true);
      timer.current = window.setTimeout(stopMedia, MAX_AUDIO_MS);
    } catch {
      setError(
        "No fue posible usar el micrófono. Revisa el permiso del navegador.",
      );
    }
  };

  const choosePhoto = (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/"))
      return setError("Selecciona una imagen válida.");
    if (file.size > 6 * 1024 * 1024) return setError("La imagen supera 6 MB.");
    if (photoUrl) URL.revokeObjectURL(photoUrl);
    const nextUrl = URL.createObjectURL(file);
    photoUrlRef.current = nextUrl;
    setPhotoUrl(nextUrl);
  };

  const save = async () => {
    const cantidadKg = Number(form.cantidadKg);
    const precioPorKg = Number(form.precioPorKg);
    if (
      form.producto.trim().length < 2 ||
      !Number.isFinite(cantidadKg) ||
      cantidadKg <= 0 ||
      !Number.isFinite(precioPorKg) ||
      precioPorKg <= 0 ||
      form.municipio.trim().length < 2
    ) {
      setError(
        "Completa producto, cantidad, precio y municipio con valores válidos.",
      );
      return;
    }
    setSaving(true);
    setError("");
    try {
      await offersService.save(
        {
          producto: form.producto.trim(),
          cantidadKg,
          precioPorKg,
          municipio: form.municipio.trim(),
          categoria: form.categoria.toUpperCase(),
          disponible: true,
        },
        editingId,
      );
      go("offers");
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "No se pudo guardar la oferta.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="functional-form">
      <div className="demo-notice">
        {editingId ? "Editando una oferta local." : "Oferta de desarrollo."} Se
        guarda localmente; audio y foto solo se previsualizan y no se almacenan.
      </div>
      <label>
        Producto
        <input
          value={form.producto}
          onChange={(event) =>
            setForm({ ...form, producto: event.target.value })
          }
          placeholder="Ej. Aguacate Hass"
        />
      </label>
      <div className="form-grid">
        <label>
          Cantidad (kg)
          <input
            type="number"
            min="1"
            value={form.cantidadKg}
            onChange={(event) =>
              setForm({ ...form, cantidadKg: event.target.value })
            }
          />
        </label>
        <label>
          Precio por kg
          <input
            type="number"
            min="1"
            value={form.precioPorKg}
            onChange={(event) =>
              setForm({ ...form, precioPorKg: event.target.value })
            }
          />
        </label>
      </div>
      <label>
        Municipio
        <input
          value={form.municipio}
          onChange={(event) =>
            setForm({ ...form, municipio: event.target.value })
          }
          placeholder="Municipio, departamento"
        />
      </label>
      <label>
        Categoría
        <select
          value={form.categoria}
          onChange={(event) =>
            setForm({ ...form, categoria: event.target.value })
          }
        >
          <option>Fruta</option>
          <option>Verdura</option>
          <option>Tubérculo</option>
          <option>Grano</option>
        </select>
      </label>
      <section className="media-panel">
        <b>Nota de voz opcional</b>
        <p>
          Graba hasta 60 segundos para preparar el archivo que enviará el
          adaptador del backend.
        </p>
        <Button
          variant="secondary"
          onClick={recording ? stopMedia : startRecording}
          icon={recording ? <Square /> : <Mic />}
        >
          {recording ? "Detener grabación" : "Grabar audio"}
        </Button>
        {audioUrl && (
          <div className="media-preview">
            <audio src={audioUrl} controls />
            <button
              aria-label="Eliminar audio"
              onClick={() => {
                URL.revokeObjectURL(audioUrl);
                audioUrlRef.current = "";
                setAudioUrl("");
              }}
            >
              <Trash2 />
            </button>
          </div>
        )}
      </section>
      <section className="media-panel">
        <b>Foto opcional</b>
        <div className="media-actions">
          <label className="file-button">
            <Camera /> Tomar foto
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={(event) => choosePhoto(event.target.files?.[0])}
            />
          </label>
          <label className="file-button">
            <Upload /> Galería
            <input
              type="file"
              accept="image/*"
              onChange={(event) => choosePhoto(event.target.files?.[0])}
            />
          </label>
        </div>
        {photoUrl && (
          <img
            className="capture-preview"
            src={photoUrl}
            alt="Vista previa de la cosecha"
          />
        )}
      </section>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <Button onClick={save} disabled={saving}>
        {saving
          ? "Guardando…"
          : editingId
            ? "Guardar cambios locales"
            : "Guardar oferta local"}
      </Button>
    </div>
  );
}
