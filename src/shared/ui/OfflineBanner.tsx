import { Wifi, WifiOff } from "lucide-react";
import { useOffline } from "@/shared/offline/useOffline";
import { usePendingOperations } from "@/shared/offline/usePendingOperations";

export function OfflineBanner() {
  const offline = useOffline();
  const pending = usePendingOperations();
  return (
    <div className={`network-banner ${offline ? "" : "online"}`}>
      {offline ? <WifiOff size={17} /> : <Wifi size={17} />}
      <span>
        {offline
          ? `Sin conexión · ${pending.length} operación(es) pendiente(s)`
          : pending.length
            ? `Con conexión · ${pending.length} operación(es) aún sin confirmar`
            : "Con conexión · Sin operaciones pendientes"}
      </span>
    </div>
  );
}
