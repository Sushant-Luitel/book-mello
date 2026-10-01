export function formatNpr(value: number | string) {
  return new Intl.NumberFormat("en-NP", { style: "currency", currency: "NPR", maximumFractionDigits: 2 }).format(Number(value) || 0);
}
