export const dataMode =
  import.meta.env.VITE_DATA_MODE === "http" ? "http" : "mock";

export const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || "").replace(
  /\/$/,
  "",
);

export function assertRuntimeConfig() {
  if (dataMode === "http" && !apiBaseUrl) {
    throw new Error(
      "VITE_API_BASE_URL es obligatoria cuando VITE_DATA_MODE=http",
    );
  }
}
