import { beforeEach, describe, expect, it } from "vitest";
import { authService } from "./auth";

describe("authService mock", () => {
  beforeEach(() => localStorage.clear());

  it("registra y permite iniciar sesión local", async () => {
    const registered = await authService.register({
      nombre: "Ana Pérez",
      celular: "3001234567",
      rol: "productor",
      aceptaDatos: true,
    });
    expect(registered.modo).toBe("mock");
    const session = await authService.login({
      celular: "3001234567",
      rol: "productor",
    });
    expect(session.nombre).toBe("Ana Pérez");
  });

  it("rechaza un registro local duplicado", async () => {
    const input = {
      nombre: "Ana Pérez",
      celular: "3001234567",
      rol: "productor" as const,
      aceptaDatos: true,
    };
    await authService.register(input);
    await expect(authService.register(input)).rejects.toThrow("Ya existe");
  });
});
