// src/lib/utils.ts

/** IVA Ecuador — 15% */
export const IVA_PORCENTAJE = 0.15;

export function formatPrice(price: number | string): string {
  return new Intl.NumberFormat("es-EC", {
    style: "currency",
    currency: "USD",
  }).format(Number(price));
}

/** Calcula el valor del IVA sobre un subtotal */
export function calcularIVA(subtotal: number): number {
  return subtotal * IVA_PORCENTAJE;
}

/** Calcula el total final incluyendo IVA */
export function totalConIVA(subtotal: number): number {
  return subtotal * (1 + IVA_PORCENTAJE);
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}
