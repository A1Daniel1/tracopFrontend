import { dataMode } from "@/shared/config";
import { request } from "@/shared/http/client";
import { readStorage, writeStorage } from "@/shared/storage";
import type { Credenciales, Registro, Sesion } from "@/shared/types";

const USERS_KEY = "tracop.mock-users.v1";

function parseSession(value: unknown): Sesion {
  if (!value || typeof value !== "object") throw new Error("Sesión inválida");
  const item = value as Partial<Sesion>;
  if (!item.userId || !item.nombre || !item.celular || !item.rol) {
    throw new Error("Sesión incompleta");
  }
  return { ...item, modo: "http" } as Sesion;
}

export const authService = {
  async login(input: Credenciales): Promise<Sesion> {
    if (dataMode === "http") {
      return request(
        "/identity/login",
        { method: "POST", body: JSON.stringify(input) },
        parseSession,
      );
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
    const users = readStorage<Registro[]>(USERS_KEY, []);
    const user = users.find(
      (item) => item.celular === input.celular && item.rol === input.rol,
    );
    return {
      userId: user ? `mock-${input.celular}` : "mock-demo",
      nombre: user?.nombre || "Usuario de demostración",
      celular: input.celular,
      rol: input.rol,
      modo: "mock",
    };
  },

  async register(input: Registro): Promise<Sesion> {
    if (dataMode === "http") {
      return request(
        "/identity/register",
        { method: "POST", body: JSON.stringify(input) },
        parseSession,
      );
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
    const users = readStorage<Registro[]>(USERS_KEY, []);
    if (
      users.some(
        (item) => item.celular === input.celular && item.rol === input.rol,
      )
    ) {
      throw new Error("Ya existe una cuenta local con este número y rol.");
    }
    writeStorage(USERS_KEY, [...users, input]);
    return {
      userId: crypto.randomUUID(),
      nombre: input.nombre,
      celular: input.celular,
      rol: input.rol,
      modo: "mock",
    };
  },
};
