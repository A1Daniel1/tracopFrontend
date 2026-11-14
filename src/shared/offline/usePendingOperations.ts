import { useEffect, useState } from "react";
import { listPending } from "./queue";

export function usePendingOperations() {
  const [pending, setPending] = useState(listPending);
  useEffect(() => {
    const refresh = () => setPending(listPending());
    window.addEventListener("storage", refresh);
    window.addEventListener("tracop:queue-change", refresh);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("tracop:queue-change", refresh);
    };
  }, []);
  return pending;
}
