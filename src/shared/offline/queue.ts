import type { OperacionPendiente } from "@/shared/types";
import { readStorage, writeStorage } from "@/shared/storage";

const KEY = "tracop.pending-operations.v1";

export function listPending(): OperacionPendiente[] {
  return readStorage<OperacionPendiente[]>(KEY, []);
}

export function enqueue(
  input: Omit<
    OperacionPendiente,
    "clientOpId" | "creadaEn" | "intentos" | "estado"
  >,
): OperacionPendiente {
  const operation: OperacionPendiente = {
    ...input,
    clientOpId: crypto.randomUUID(),
    creadaEn: new Date().toISOString(),
    intentos: 0,
    estado: "pendiente",
  };
  writeStorage(KEY, [...listPending(), operation]);
  window.dispatchEvent(new Event("tracop:queue-change"));
  return operation;
}

export function removePending(clientOpId: string): void {
  writeStorage(
    KEY,
    listPending().filter((item) => item.clientOpId !== clientOpId),
  );
  window.dispatchEvent(new Event("tracop:queue-change"));
}
