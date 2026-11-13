const formatoMoneda = new Intl.NumberFormat("es-CO");

const formatoDecimal = new Intl.NumberFormat("es-CO", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

export function formatPrecio(valor: number): string {
  return `$${formatoMoneda.format(valor)}`;
}

export function formatKg(kg: number): string {
  return `${kg} kg`;
}

export function formatCalificacion(valor: number): string {
  return formatoDecimal.format(valor);
}
