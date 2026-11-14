import { apiBaseUrl } from "@/shared/config";

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly details?: unknown,
  ) {
    super(message);
  }
}

type Parser<T> = (value: unknown) => T;

export async function request<T>(
  path: string,
  options: RequestInit = {},
  parse: Parser<T>,
): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...options.headers },
  });
  const body: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    throw new ApiError(
      "La solicitud no pudo completarse",
      response.status,
      body,
    );
  }
  try {
    return parse(body);
  } catch {
    throw new ApiError("Respuesta del servidor no válida", 502, body);
  }
}

export function asArray<T>(parseItem: Parser<T>): Parser<T[]> {
  return (value) => {
    if (!Array.isArray(value)) throw new Error("Se esperaba una lista");
    return value.map(parseItem);
  };
}
