import { beforeEach, describe, expect, it } from "vitest";
import { enqueue, listPending, removePending } from "./queue";

describe("offline queue", () => {
  beforeEach(() => localStorage.clear());

  it("crea client_op_id y permite retirar una operación", () => {
    const operation = enqueue({
      dominio: "orders",
      accion: "create",
      payload: { id: 1 },
    });
    expect(operation.clientOpId).toBeTruthy();
    expect(listPending()).toHaveLength(1);
    removePending(operation.clientOpId);
    expect(listPending()).toEqual([]);
  });
});
