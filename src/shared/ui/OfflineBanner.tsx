import { Wifi, WifiOff } from "lucide-react";
import { useOffline } from "@/shared/offline/useOffline";

export function OfflineBanner() {
  const offline = useOffline();
  return (
    <div className={`network-banner ${offline ? "" : "online"}`}>
      {offline ? <WifiOff size={17} /> : <Wifi size={17} />}
      <span>
        {offline
          ? "Sin conexión · Puedes seguir trabajando"
          : "Con conexión · Todo sincronizado"}
      </span>
    </div>
  );
}
