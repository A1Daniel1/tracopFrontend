import { useEffect, useState } from "react";

/** Detecta el estado real de conexión del dispositivo. */
export function useOffline(): boolean {
  const [offline, setOffline] = useState<boolean>(() => !navigator.onLine);

  useEffect(() => {
    const online = () => setOffline(false);
    const offline = () => setOffline(true);

    window.addEventListener("online", online);
    window.addEventListener("offline", offline);

    return () => {
      window.removeEventListener("online", online);
      window.removeEventListener("offline", offline);
    };
  }, []);

  return offline;
}
