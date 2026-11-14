import { afterEach, describe, expect, it, vi } from "vitest";
import { ApiError, request } from "./client";

describe("HTTP client", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("valida la respuesta con el parser", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ id: "ok" }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
      ),
    );
    const result = await request("/test", {}, (value) => {
      if (!value || typeof value !== "object" || !("id" in value))
        throw new Error();
      return value as { id: string };
    });
    expect(result.id).toBe("ok");
  });

  it("normaliza errores HTTP", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue(
          new Response(JSON.stringify({ message: "no" }), { status: 400 }),
        ),
    );
    await expect(request("/test", {}, () => "ok")).rejects.toBeInstanceOf(
      ApiError,
    );
  });
});
